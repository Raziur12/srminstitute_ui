import React, { useEffect, useState } from 'react';
import '../../../../../Styles/MCQAssessments/MCQAssessment.css';
import axiosInstance from '../../../../../interceptor/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AssessmentEditbrn from './AssessmentEditbrn';
import CloneButton from './CloneButton';
import GenerateLinkButton from './GenerateLinkButton';

const Assessments = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10)

  const [loading, setLoading] = useState(false); 
  const [downloading, setDownloading] = useState(null); // Track downloading test ID
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data; // If no sorting, return original data
  
    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
  
      if (typeof valueA === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
  
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [data, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  useEffect(() => {
    fetchAssessments();
  }, [pageNumber, searchQuery, pageSize]); 

  const fetchAssessments = async () => {
    try {
      const response = await axiosInstance.get(`/assessments/tests/`, {
        params: { 
          page: pageNumber,
          name: searchQuery, // Include search parameter
          page_size: pageSize
        },
      });
  
      if (response.data && response.data?.data?.results) {
        setData(response.data.data?.results);
        setCount(response.data.data?.pagination.count);
        setNextPage(response.data.data?.pagination.next);
        setPrevPage(response.data.data?.pagination.previous);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const downloadTestFile = async (testId, testName) => {
    try {
      setDownloading(testId); // Show loader for this test
  
      const response = await axiosInstance.post(
        '/utils/download-test-file/',
        { test_id: testId },
        { responseType: 'blob' } // Ensure binary data is received
      );
  
      // Create a Blob from the response with XLSX MIME type
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
  
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `test_${testName}.xlsx`; // Use .xlsx extension
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading test file', error);
    } finally {
      setDownloading(null); // Reset loader after download
    }
  };
  

  
  const handleEditClick = (test) => {
    setSelectedTest(test);
    setStartDate(test.start_date_time);
    setEndDate(test.end_date_time);
    setIsRandomized(test.is_randomized);
    setIsCheck(test.is_active);
    setDuration(test.duration)
    setShowPopup(true);
  };

  const handleUpdateTest = async () => {
    try {
      const response = await axiosInstance.put(`/assessments/tests/${selectedTest.id}/`, {
        start_date_time: startDate,
        end_date_time: endDate,
        duration: duration,
        is_check: isCheck,
        is_randomized: isRandomized,
      });

      if (response.status === 200) {
        alert('Test updated successfully!');
        fetchAssessments();
        setShowPopup(false);
      }
    } catch (error) {
      console.error('Error updating test', error);
      alert('Failed to update the test. Please try again.');
    }
  };

  const formatDateTime = (dateTime) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateTime).toLocaleString('en-US', options);
  };

  
  const handleButtonClick = (assessment) => {
    // Directly navigate to the question table with assessment ID
    navigate(`/questiontable`, { state: { questions: assessment } });
  };
  

  const handlePreviewClick = (assessment) => {
    // Navigate to the preview page with only the assessment ID
    navigate(`/preview-segment`, { state: { testData: assessment } });
  };
  
  
  const handleChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="assessments-container">
      <div className='drop-search-assement'>
 <input
  type="text"
  placeholder="Search by name..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)} // Automatically updates API
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

        <table className="assessments-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            Name {getSortArrow('name')}
          </th>
          <th onClick={() => handleSort('start_date_time')}>
            Start Time {getSortArrow('start_date_time')}
          </th>
          <th onClick={() => handleSort('end_date_time')}>
            End Time {getSortArrow('end_date_time')}
          </th>
          <th onClick={() => handleSort('created_at')}>
            Created {getSortArrow('created_at')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center">Loading...</td>
          </tr>
        ) : sortedData.length > 0 ? (
          sortedData.map((assessment) => (
            <tr
              key={assessment.id}
              className={assessment.is_active ? '' : 'red-row'}
            >
              <td>{assessment.name}</td>
              <td>{formatDateTime(assessment.start_date_time)}</td>
              <td>{formatDateTime(assessment.end_date_time)}</td>
              <td>{formatDateTime(assessment.created_at)}</td>
              <td className="button-group-assess">
                <div className="button-grid">
                <button
  className="assessments-button"
  onClick={() => downloadTestFile(assessment.id, assessment.name)}
  disabled={!assessment.test_file || downloading === assessment.id}
>
  {downloading === assessment.id ? 'Downloading...' : assessment.test_file ? 'Download' : 'No download available'}
</button>


                  <button
                    className="assessments-button"
                    onClick={() => handleEditClick(assessment)}
                  >
                    Edit
                  </button>
                  <CloneButton  
                  test_id={assessment.id}
                  test_name = {assessment.name}
                  />
                 <GenerateLinkButton 
                  test_id={assessment.id}
                 />
                  <button
                    className="assessments-button"
                    onClick={() => handleButtonClick(assessment.id)}
                  >
                    Questions
                  </button>
                  <button
                   className="assessments-button"
                   onClick={() => handlePreviewClick(assessment.id)}
                  >
                    Preview 
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No assessments found</td>
          </tr>
        )}
      </tbody>
    </table>

      <div className="assessments-pagination">
        <button
          className="pagination-button"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={!prevPage}
        >
          Prev
        </button>
        <span className="pagination-page">Page {pageNumber}</span>
        <button
          className="pagination-button"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={!nextPage}
        >
          Next
        </button>
      </div>

      {showPopup && (
  <div className="popup-overlay">
    <div className="popup-content">
     <AssessmentEditbrn 
     fetchAssessments={fetchAssessments}
     selectedTest={selectedTest}
     setShowPopup={setShowPopup}
     />
    </div>
  </div>
)}
    </div>
  );
};

export default Assessments;
