import React, { useEffect, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import "../../Styles/Organization/Organization.css";
import { useNavigate } from 'react-router-dom';
import Insights from './Insights';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const InsightsMain = () => {
  const [subOrgs, setSubOrgs] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ next: null, previous: null, count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10)

  const [testStatuses, setTestStatuses] = useState({});  // Track `is_active` per test
     const [releaseLoaders, setReleaseLoaders] = useState({});  // Track loading per test ID

  const navigate = useNavigate();

  // Fetch data from API with pagination
  const fetchSubOrgs = (page = 1, search = '') => {
    setLoading(true);
    axiosInstance
      .get('reports/test_details/', {
        params: { page, page_size: pageSize, name: search }, // Send search query in request
      })
      .then(response => {
        const fetchedData = response.data?.data?.results || [];
        setSubOrgs(fetchedData);
  
        // Initialize testStatuses based on fetched data
        const initialStatuses = {};
        fetchedData.forEach((org) => {
          initialStatuses[org.id] = { is_released: org.is_released };
        });
        setTestStatuses(initialStatuses);
  
        setPagination({
          next: response.data?.data?.pagination?.next,
          previous: response.data?.data?.pagination?.previous,
          count: response.data?.data?.pagination?.count,
        });
  
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data', error);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchSubOrgs(currentPage, searchQuery, pageSize);
  }, [currentPage, searchQuery, pageSize]); // Refetch when page or search query changes
  
  const handleSave = (id) => {
    setLoading(true);
    navigate('/report', { state: { testId: id } });
  };

  // Handle pagination
  const handleNext = () => {
    if (pagination.next) setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevious = () => {
    if (pagination.previous) setCurrentPage(prevPage => prevPage - 1);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return subOrgs; // If no sorting, return unsorted data
  
    return [...subOrgs].sort((a, b) => {
      let valA = a[sortConfig.key] ?? ""; // Handle undefined values
      let valB = b[sortConfig.key] ?? "";
  
      // Convert date fields to timestamps for proper sorting
      if (['created_at', 'start_date_time', 'end_date_time'].includes(sortConfig.key)) {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
  
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [subOrgs, sortConfig]); // Ensure dependencies are correct
  

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  const handleReleaseClick = async (testId) => {
    setReleaseLoaders(prev => ({ ...prev, [testId]: true })); // Set loading only for clicked button
  
    try {
      const currentStatus = testStatuses[testId]?.is_released ?? false;
      const newReleaseStatus = !currentStatus;
  
      // Update the local state for immediate UI change
      setTestStatuses(prev => ({
        ...prev,
        [testId]: { is_released: newReleaseStatus },  // Toggle the `is_released` value
      }));
  
      // Send the request to toggle `is_released` in the backend
      const response = await axiosInstance.put(`/assessments/tests/${testId}/`, {
        is_released: newReleaseStatus,  // Send the new release status
      });
  
      if (response.status === 200) {
        Swal.fire('Success', 'Test updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating test', error);
  
      const errorMessage = error.response?.data?.message || 'Failed to update the test.';
      const validationErrors = error.response?.data?.errors;
  
      const formattedErrors = validationErrors
        ? Object.entries(validationErrors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n')
        : '';
  
      Swal.fire({
        title: 'Error',
        text: `${errorMessage}\n\n${formattedErrors}`,
        icon: 'error',
      });
    } finally {
      setReleaseLoaders(prev => ({ ...prev, [testId]: false })); // Reset loading for clicked button
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="sub-org-container">
      <div className='text-ontop'>
        <p className='sub-org-info'>Organisational Insights will give you a helicopter view of your various Sub Organisations.</p>
        <p className='sub-org-info'>Click on the Sub Organisation tab and see details of the Number of Assessments taken, percentile score of each user, and other details.</p>
      </div>
      <div className='drop-search-assement'>
      <input
        type="text"
        placeholder="Search by Name..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

<div className="flex items-center space-x-2">
      <select
        id="pageSize"
        value={pageSize}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-1"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
    </div>
</div>


      {loading && <div className="loader"></div>}
      {!loading && showInsights ? (
        <Insights data={analyticsData} />
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name {getSortArrow('name')}</th>
                <th onClick={() => handleSort('duration')}>Duration {getSortArrow('duration')}</th>
                <th onClick={() => handleSort('created_at')}>Created {getSortArrow('created_at')}</th>
                <th onClick={() => handleSort('start_date_time')}>Started {getSortArrow('start_date_time')}</th>
                <th onClick={() => handleSort('end_date_time')}>End Date {getSortArrow('end_date_time')}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {sortedData.map(org => (
                <tr key={org.id} className={org.first_time === false ? 'highlight-red' : ''}>
                  <td>{org.name}</td>
                  <td>{org.duration}</td>
                  <td>{format(new Date(org.created_at), 'dd-MM-yyyy HH:mm')}</td>
                  <td>{format(new Date(org.start_date_time), 'dd-MM-yyyy HH:mm')}</td>
                  <td>{format(new Date(org.end_date_time), 'dd-MM-yyyy HH:mm')}</td>
                  <td className='edit-password'>
                    <button className="edit-btn" onClick={() => handleSave(org.id)}>
                      See Details
                    </button>

                    <button 
  className="edit-btn" 
  onClick={() => handleReleaseClick(org.id)} 
  disabled={releaseLoaders[org.id]}
>
  {releaseLoaders[org.id] 
    ? 'Releasing...' 
    : testStatuses[org.id]?.is_released === true 
      ? 'Released' 
      : 'Release'}
</button>

                </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button className={`pagination-btn ${!pagination.previous ? 'disabled' : ''}`} onClick={handlePrevious} disabled={!pagination.previous}>
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {Math.ceil(pagination.count / 10)}
            </span>
            <button className={`pagination-btn ${!pagination.next ? 'disabled' : ''}`} onClick={handleNext} disabled={!pagination.next}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsMain;
