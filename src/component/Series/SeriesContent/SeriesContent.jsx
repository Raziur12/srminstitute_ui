import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import "../../../Styles/Series/Series.css";

const SeriesContent = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    thumbnail: null,
    sub_org: ''
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newSeries, setNewSeries] = useState({
    name: '',
    sub_org: ''
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 0 // Added totalPages
  });
  const [subOrgs, setSubOrgs] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state


  const fetchSeriesData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axiosInstance.get(`/series/series/?page=${pagination.currentPage}`);
      setSeriesData(response.data.results || []); // Safeguard with default empty array
      setPagination(prev => ({
        ...prev,
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        totalPages: Math.ceil((response.data.count || 0) / 10), // Default to 0 if count is missing
      }));
      if (response.data.results && response.data.results.length > 0) {
        setSelectedOrg(response.data.results[0].sub_org || ''); // Default to an empty string
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleOrgChange = (e) => {
    setSelectedOrg(e.target.value);
  };

  const handleEdit = (series) => {
    setEditingId(series.id);
    setEditData({
      name: series.name || '',
      description: series.description || '',
      thumbnail: null,
      sub_org: series.sub_org || ''
    });
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('description', editData.description);
    formData.append('sub_org', editData.sub_org);
    if (editData.thumbnail) {
      formData.append('thumbnail', editData.thumbnail);
    }

    try {
      await axiosInstance.put(`/series/series/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Update local state after successful save
      setSeriesData(seriesData.map(series => 
        series.id === id ? { ...series, ...editData } : series
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleFileChange = (e) => {
    setEditData({ ...editData, thumbnail: e.target.files[0] });
  };

  const handleNewSeriesChange = (e) => {
    setNewSeries({ ...newSeries, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await axiosInstance.post('/series/series/', newSeries);
      // Fetch updated series data
      fetchSeriesData();
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error creating series:', error);
    }
  };

  // Get unique organizations
  const uniqueOrgs = [...new Set(seriesData.map(series => series.sub_org))].filter(Boolean);

  const handleNextPage = () => {
    if (pagination.next) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

    // Fetch sub organizations from the provided API
    const fetchSubOrgs = async () => {
      try {
        const response = await axiosInstance.get('/orgss/suborgs/');
        setSubOrgs(response.data.results || []); // Default to an empty array
      } catch (error) {
        console.error('Error fetching sub organizations:', error);
      }
    };

    useEffect(() => {
      fetchSubOrgs();  // Fetch sub organizations when the component mounts
      fetchSeriesData();
    }, [pagination.currentPage]); // Fetch data when the current page changes
    

    return (
      <div>
        <div className='btn'>
          <button 
            onClick={() => setIsPopupOpen(true)} 
            className="button"
          >
            Add New Series
          </button>
        </div>
        <div className="series-content-container">
          <div className="series-card-container">
            {loading ? ( // Show loading indicator while fetching data
              <div>Loading...</div>
            ) : (
              seriesData.length > 0 ? (
                seriesData.map(series => ( // Remove filtering by selectedOrg
                  <div key={series.id} className="series-card">
                    {editingId === series.id ? (
                      <>
                        <div className='suborg-name'>
                          <h3>Name: </h3>
                          <input 
                            type="text" 
                            value={editData.name} 
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            placeholder="Series Name"
                            className="series-input"
                          />
                        </div>
                        <div className='suborg-name'>
                          <label>Select Organization:</label>
                          <select 
                            id="subOrg" 
                            value={editData.sub_org} 
                            onChange={(e) => setEditData({ ...editData, sub_org: e.target.value })}
                            className="series-select"
                          >
                            {uniqueOrgs.map(org => (
                              <option key={org} value={org}>
                                {org}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='suborg-name'>
                          <h3>Description: </h3>
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Description"
                            className="series-textarea"
                          />
                        </div>
                        <div className='suborg-name'>
                          <h3>Add Image: </h3>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="series-file-input"
                          />
                        </div>
    
                        <button onClick={() => handleSave(series.id)} className="series-save-button">
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          {series.thumbnail && (
                            <img 
                              src={series.thumbnail} 
                              alt={series.name} 
                              className="series-card-thumbnail"
                            />
                          )}
                        </div>
                        <div className='suborg-name'>
                          <h3>Name: </h3>
                          <h2 className="series-card-title">{series.name}</h2>
                        </div>
    
                        <div className='suborg-name'>
                          <h3>Organization: </h3>
                          <p>{series.sub_org}</p>
                        </div>
                        
                        <div className='suborg-name'>
                          <h3>Description: </h3>
                          <p className="series-card-description">
                            {series.description || 'No description available'}
                          </p>
                        </div>
    
                        <button onClick={() => handleEdit(series)} className="series-edit-button">
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div>No series available.</div> // Show a message when no data is available
              )
            )}
          </div>
    
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              onClick={handlePreviousPage} 
              disabled={!pagination.previous}
              className="pagination-button"
            >
              Previous
            </button>
            <button 
              onClick={handleNextPage} 
              disabled={!pagination.next}
              className="pagination-button"
            >
              Next
            </button>
          </div>
    
          {/* Page Number Display */}
          <div className="page-number-display">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
    
          {/* Popup for adding new series */}
          {isPopupOpen && (
            <div className="popup-overlay">
              <div className="popup-content">
                <span className="close-icon" onClick={() => setIsPopupOpen(false)}>
                  &times;
                </span>
                <h2>Add New Series</h2>
                <input
                  type="text"
                  name="name"
                  value={newSeries.name}
                  onChange={handleNewSeriesChange}
                  placeholder="Series Name"
                  className="series-input"
                />
                <label>Select Sub Organization:</label>
                <select
  name="sub_org"
  value={newSeries.sub_org}
  onChange={handleNewSeriesChange}
  className="series-select"
>
  <option value="">Select the Sub Org</option> {/* Static default option */}
  {subOrgs.map(org => (
    <option key={org.id} value={org.name}>
      {org.name}
    </option>
  ))}
</select>

                <button onClick={handleCreate} className="series-create-button">
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
    
};

export default SeriesContent;
