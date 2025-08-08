import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import "../../../Styles/Organization/Organization.css";

const Roles = ({ orgs }) => {
  const [data, setData] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]); // Fetch role choices
  const [subOrgs, setSubOrgs] = useState([]);
  const [selectedRoleType, setSelectedRoleType] = useState('');
  const [selectedSubOrg, setSelectedSubOrg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubOrg, setNewSubOrg] = useState({ role_type: '', suborg: '' });

  // Pagination state
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRoles(`/orgss/roles/`); // Initial fetch for roles
    fetchSubOrgs(); // Fetch sub organizations data
    fetchRoleChoices(); // Fetch role choices for the dropdown
  }, []);

  // Fetch roles data with pagination
  const fetchRoles = (url) => {
    axiosInstance.get(url)
      .then(response => {
        const rolesData = response.data.results;
        setData(rolesData);

        // Set pagination state
        setPagination({
          next: response.data.next,
          previous: response.data.previous
        });
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  };

  // Fetch sub organizations from the provided API
  const fetchSubOrgs = () => {
    axiosInstance.get('/orgss/suborgs/')
      .then(response => {
        setSubOrgs(response.data.results); // Assuming the response has the suborg data array
      })
      .catch(error => {
        console.error('Error fetching sub organizations:', error);
      });
  };

  // Fetch role choices for the role dropdown
  const fetchRoleChoices = () => {
    axiosInstance.get('/orgss/role-choices/')
      .then(response => {
        setRoleTypes(response.data); // Assuming the response contains the role choices array
      })
      .catch(error => {
        console.error('Error fetching role choices:', error);
      });
  };

  // Save the selected role and sub-org
  const handleSave = () => {
    axiosInstance
      .post('orgss/roles/', { role_type: selectedRoleType, suborg: selectedSubOrg })
      .then((response) => {
        alert('Role saved successfully!');
        fetchRoles(`/orgss/roles/`); // Refresh roles after saving
      })
      .catch((error) => {
        alert('Failed to save role. Please try again.');
      });
  };
  
  // Open the modal to add a new role
  const handleAddRole = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSubOrg({ role_type: '', suborg: '' });
  };

  // Handle input change in modal
  const handleNewInputChange = (e) => {
    setNewSubOrg({ ...newSubOrg, [e.target.name]: e.target.value });
  };

  // Save role inside the modal
  const handleSaveRole = () => {
    axiosInstance.post('/orgss/roles/', newSubOrg)
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          alert('Role added successfully');
          handleModalClose(); // Close the modal if the request is successful
          fetchRoles(`/orgss/roles/`); // Refresh the data
        } else {
          alert('Something went wrong, please try again.');
        }
      })
      .catch(error => {
        if (error.response) {
          alert(`Error adding role: ${error.response.data.message || 'Server error, please try again later.'}`);
        } else if (error.request) {
          alert('No response from server. Please check your connection.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      });
  };

  // Pagination control functions
  const handlePreviousPage = () => {
    if (pagination.previous) {
      fetchRoles(pagination.previous);
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      fetchRoles(pagination.next);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="roles-container">
      <div className="header">
        <h2>Roles</h2>
        <button className="add-button" onClick={handleAddRole}>Add Roles</button>
      </div>

      <div className="roles-card">
        <div className="dropdowns">
          <div className="dropdown">
            <label htmlFor="roleType">Role Type:</label>
            <select
              id="roleType"
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value)}
            >
              <option value="">Select Role Type</option>
              {roleTypes.map(role => (
                <option key={role.value} value={role.value}>{role.display}</option>
              ))}
            </select>
          </div>
          <div className="dropdown">
            <label htmlFor="subOrg">Sub Organization:</label>
            <select
              id="subOrg"
              value={selectedSubOrg}
              onChange={(e) => setSelectedSubOrg(e.target.value)}
            >
              <option value="">Select Sub Organization</option>
              {subOrgs.map(suborg => (
                <option key={suborg.id} value={suborg.name}>{suborg.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={handlePreviousPage}
          disabled={!pagination.previous}
        >
          Previous
        </button>
        <span className="page-number">Page {currentPage}</span>
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={!pagination.next}
        >
          Next
        </button>
      </div>

      {/* Modal for adding roles */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-icon" onClick={handleModalClose}>
              &times;
            </span>
            <h3>Add New Role</h3>
            <div className="card-field">
              <label htmlFor="newRole">Role:</label>
              <select
                id="roleType"
                name="role_type"
                value={newSubOrg.role_type}
                onChange={handleNewInputChange}
              >
                <option value="">Select Role Type</option>
                {roleTypes.map(role => (
                  <option key={role.value} value={role.value}>{role.display}</option>
                ))}
              </select>
            </div>
            <div className="card-field">
              <label htmlFor="org">Sub Org: </label>
              <select
                id="suborg"
                name="suborg"
                value={newSubOrg.suborg}
                onChange={handleNewInputChange}
              >
                <option value="">Select Organization</option>
                {subOrgs.map(suborg => (
                  <option key={suborg.id} value={suborg.name}>{suborg.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button className="modal-save-button" onClick={handleSaveRole}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
