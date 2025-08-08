import React, {  useState } from 'react';
import "../../../Styles/Organization/Organization.css";
import axiosInstance from '../../../interceptor/axiosInstance';
import { useNavigate } from 'react-router-dom';

const OrgMain = ({ orgs, setOrgs, orgBtn, setOrgBtn }) => {
  const [loading, setLoading] = useState(false); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
   const navigate = useNavigate()
  // Function to fetch organizations based on the provided URL (next or previous page)
  const fetchOrgs = async (url) => {
    setLoading(true); // Set loading state when fetching
    try {
      const response = await axiosInstance.get(url);
      setOrgs(response.data.results); // Update the organizations list
      setOrgBtn(response.data); // Update pagination data (next, previous, etc.)
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Function to handle input change (updating organization logo)
  const handleInputChange = (e, id) => {
    const { name, files } = e.target;
    const updatedOrgs = orgs.map(org => {
      if (org.id === id && name === 'logo') {
        return { ...org, [name]: files[0] }; // Update logo file
      }
      return org;
    });
    setOrgs(updatedOrgs);
  };

  // Function to save the updated organization
  const handleSave = async (id) => {
    const orgToSave = orgs.find(org => org.id === id);

    // Prepare form data to send (including the image)
    const formData = new FormData();
    formData.append('name', orgToSave.name);
    if (orgToSave.logo) {
      formData.append('logo', orgToSave.logo); // Append the logo file if changed
    }

    try {
      await axiosInstance.put(`/orgss/orgs/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Organization updated successfully!');
    } catch (error) {
      console.error("Error updating organization", error);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (orgBtn.next) {
      fetchOrgs(orgBtn.next); // Fetch the next page
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (orgBtn.previous) {
      fetchOrgs(orgBtn.previous); // Fetch the previous page
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNavigateUpgrade = () => {
    navigate('/upgrade');
  }

  return (
    <div className="org-main">
      <h1 className='title-name'>Organization List</h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="org-cards-container">
            {orgs.map((org) => (
              <div key={org.id} className="org-card">
                {/* Logo Input */}
                <div className='show-logo'>
                  <div className='logo-choose'>
                    <label htmlFor={`logo-${org.id}`}>Change Logo:</label>
                    <input
                      type="file"
                      id={`logo-${org.id}`}
                      name="logo"
                      accept="image/*"
                      onChange={(e) => handleInputChange(e, org.id)}
                      className="input-field"
                    />
                  </div>
                  {org.logo && typeof org.logo === 'string' && (
                    <div className="org-logo">
                      <img src={org.logo} alt={`${org.name} logo`} />
                    </div>
                  )}
                </div>

                {/* Organization Name */}
                <div className='org-name'>
                  <label htmlFor={`name-${org.id}`}>Name:</label>
                  <p id={`name-${org.id}`} className="name-display" style={{color: '#fff'}} >{org.name}</p>
                </div>

                {/* Validity and Number of Logins */}
                <div className="org-info">
                  <p>Validity: {org.validity} days</p>
                  <p>Number of Logins: {org.number_of_logins}</p>
                  <p>Package purchased: {org.package_purchased}</p>
                </div>

                {/* Save Button */}
                <div className='org-to-btn'>
                <button className="save-button-org" onClick={() => handleSave(org.id)}>
                  Save
                </button>
                <button className='save-button-org'
                onClick={handleNavigateUpgrade}
                >
               Upgrade
                </button>
              </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              className="prev-button"
              onClick={handlePreviousPage}
              disabled={!orgBtn.previous} // Disable if no previous page
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage}
            </span>
            <button
              className="next-button"
              onClick={handleNextPage}
              disabled={!orgBtn.next} // Disable if no next page
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrgMain;
