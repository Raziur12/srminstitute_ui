import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import "../../../Styles/Organization/Organization.css";
import { useNavigate } from 'react-router-dom';

const SubOrganization = () => {
  const [subOrgs, setSubOrgs] = useState([]);
  const [updatedNames, setUpdatedNames] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newSubOrg, setNewSubOrg] = useState({ name: '', org: '' });
  const [orgOptions, setOrgOptions] = useState([]);
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const [page, setPage] = useState(1); // Track the current page number
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubOrgs('orgss/suborgs/'); // Initial fetch when component loads
    axiosInstance.get('/orgss/view/')
      .then(response => {
        setOrgOptions(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching org options', error);
      });
  }, []);

  // Function to fetch sub-organizations with pagination
  const fetchSubOrgs = (url) => {
    setLoading(true); // Show loader when data is being fetched
    axiosInstance.get(url)
      .then(response => {
        setSubOrgs(response.data.results);
        setPagination({
          next: response.data.next,
          previous: response.data.previous
        });
        setLoading(false); // Hide loader once data is fetched
      })
      .catch(error => {
        console.error('Error fetching sub-organizations', error);
        setLoading(false); // Hide loader in case of error
      });
  };

  const handleNameChange = (id, value) => {
    setUpdatedNames({ ...updatedNames, [id]: value });
  };

  const handleSave = (id, org_id) => {
    axiosInstance.get(`org_analytics/analytics/org/${org_id}/suborg/${id}/`)
      .then(response => {
        navigate('/Insight', { state: { data: response.data } });
      })
      .catch(error => {
        console.error('Error fetching details:', error);
      });
  };

  const handleNewInputChange = (e) => {
    setNewSubOrg({ ...newSubOrg, [e.target.name]: e.target.value });
  };

  const handleAddSubOrg = () => {
    axiosInstance.post('orgss/suborgs/', newSubOrg)
      .then(response => {
        setSubOrgs([...subOrgs, response.data]);
        setIsAdding(false); // Close the add form
        setNewSubOrg({ name: '', org: '' }); // Reset form
      })
      .catch(error => {
        console.error('Error adding sub-organization', error);
      });
  };

  const handlePageChange = (url, newPage) => {
    fetchSubOrgs(url);
    setPage(newPage); // Update the current page number
  };

  return (
    <div className="sub-org-container">
      <button className="add-btn" onClick={() => setIsAdding(true)}>
        Add Sub Organization
      </button>

      {/* Add Sub Organization Form Popup */}
      {isAdding && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setIsAdding(false)}>
              &times;
            </span>
            <h3>Add Sub Organization</h3>
            <div className="card-field">
              <label htmlFor="name">Name: </label>
              <input
                id="name"
                type="text"
                name="name"
                value={newSubOrg.name}
                onChange={handleNewInputChange}
              />
            </div>
            <div className="card-field">
              <label htmlFor="org">Org: </label>
              <select
                id="org"
                name="org"
                value={newSubOrg.org}
                onChange={handleNewInputChange}
              >
                <option value="">Select Organization</option>
                {orgOptions.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
            </div>
            <div className="popup-buttons">
              <button className="submit-btn" onClick={handleAddSubOrg}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <div className="loader">Loading...</div>}

      {/* Existing Sub Organizations */}
      {!loading && (
        <div className="cards-container">
          {subOrgs.map(org => (
            <div key={org.id} className="card">
              <div className="card-field">
                <label htmlFor={`name-${org.id}`}>Name: </label>
                <input
                  id={`name-${org.id}`}
                  type="text"
                  value={updatedNames[org.id] || org.name}
                  onChange={(e) => handleNameChange(org.id, e.target.value)}
                />
              </div>
              <div className="card-field">
                <label>Org: </label>
                <input type="text" value={org.org} readOnly />
              </div>

              <button className="save-btn" onClick={() => handleSave(org.id, org.org_id)}>
                See Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(pagination.previous, page - 1)}
          disabled={!pagination.previous}
        >
          Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(pagination.next, page + 1)}
          disabled={!pagination.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubOrganization;
