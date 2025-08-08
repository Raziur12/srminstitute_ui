import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../Styles/globalComponent/SinglePersonForm.css";
import axiosInstance from '../../interceptor/axiosInstance';

const SinglePersonForm = () => {
  const [userList, setUserList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to fetch user data from the API
  const fetchUserData = async (url = 'individual_analytics/users/') => {
    setLoading(true); // Show loader while fetching
    try {
      const response = await axiosInstance.get(url);
      setUserList(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setTotalPages(Math.ceil(response.data.count / 6)); // Assuming 6 items per page
      setLoading(false); // Hide loader once data is fetched
    } catch (error) {
      setLoading(false); // Hide loader in case of error
      console.error("Error fetching user data:", error);
    }
  };

  // Call fetchUserData when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Prepare the user list for the table
  const dropdownList = Array.isArray(userList) ? userList.map(user => user.account_data).filter(Boolean) : [];

  // Handle "Next" button click
  const handleNextPage = () => {
    if (nextUrl) {
      fetchUserData(nextUrl);
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle "Previous" button click
  const handlePrevPage = () => {
    if (prevUrl) {
      fetchUserData(prevUrl);
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle selection and submission combined
  const handleSeeDetailsAndSubmit = async (email, fullName) => {
    const isValid = dropdownList.find((item) => item.email === email);
    
    // Perform API calls if user is valid
    if (isValid && fullName) {
      try {
        const response = await axiosInstance.get(`individual_analytics/users/${email}/`);
        if (response.status === 200) {
          // Navigate with the response data if successful
          navigate('/dashboard', { state: { data: response.data } });
        } else {
          // Handle non-200 status codes
          alert("Failed to fetch user details. Please try again later.");
        }
      } catch (error) {
        // Handle API errors
        console.error("Error fetching user details:", error);
        alert("An error occurred while fetching user details. Please try again.");
      }
    } else {
      alert(fullName ? "User does not exist" : "Please enter your name");
    }
  };

  return (
    <div className='single-person-form-main-div'>
      <p className='input-label'>
        Individual Progress
      </p>

      <div className='user-tit-top'>
        <h2>You can track the progress of each individual through this section.</h2>
        <h2>Click on the "See Details" button next to each user to see his/her progress.</h2>
      </div>

      {loading ? (
        <div className="loader">Loading...</div> // Show loader when loading
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dropdownList.length > 0 ? dropdownList.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className='see-details-btn'
                      onClick={() => handleSeeDetailsAndSubmit(user.email, `${user.first_name} ${user.last_name}`)}
                    >
                      See Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button 
              onClick={handlePrevPage} 
              disabled={!prevUrl} // Disable if prevUrl is null
              className={!prevUrl ? 'disabled' : ''}
            >
              Previous
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button 
              onClick={handleNextPage} 
              disabled={!nextUrl} // Disable if nextUrl is null
              className={!nextUrl ? 'disabled' : ''}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SinglePersonForm;
