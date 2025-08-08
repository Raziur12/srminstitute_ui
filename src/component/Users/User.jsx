import React, { useState, useEffect } from 'react';
import '../../Styles/User/User.css'; // External CSS for styling
import axiosInstance from '../../interceptor/axiosInstance';
import AddUsers from './AddUsers';
import DownloadUser from './DownloadUser';
import EditUserPopup from './UserEdit.jsx';
import Swal from 'sweetalert2';
import AddSingleUser from './AddSingleUser.jsx';
import UpdateUserProgram from './UpdateUserProgram.js';

const User = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserType, setAddUserType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dropdownType, setDropdownType] = useState("");

  const [passwordLoad, setPasswordLoad] = useState(null);
  const [pageSize, setPageSize] = useState(10)


  const fetchUsers = (page = 1, type = '', username = '') => {
    setLoading(true);
  
    axiosInstance
      .get(`accounts/users/?page=${page}&type=${type}&username=${username}&page_size=${pageSize}`)
      .then((response) => {
        const { pagination, results } = response.data.data;
  
        setUsers(results);
        setFilteredUsers(results);
        setNextPage(pagination.next);
        setPreviousPage(pagination.previous);
        setCount(pagination.count);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, dropdownType, searchTerm);
    }, 500); // Debounce time: 500ms
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dropdownType, pageSize]);
  

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage((prev) => prev + 1);
      fetchUsers(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage((prev) => prev - 1);
      fetchUsers(currentPage - 1);
    }
  };
  
  // Handle Edit button click
  const handleEditClick = (user) => {
    setEditUser(user); // Set the user being edited
    setIsEditPopupOpen(true); // Open the edit popup
  };

  // Handle Save button in edit popup
  const handleSaveEdit = () => {
    axiosInstance
      .put(`accounts/org-users/${editUser.id}/`, editUser)
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === editUser.id ? response.data : u))
        );
        setIsEditPopupOpen(false);
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  };

  const handleGeneratePasswordClick = (user) => {
    setPasswordLoad(null); // Set loading state to true
    
    // API call to generate password
    axiosInstance
      .post('setpassword', { user_id: user.id })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Password Generated',
          text: `New Password: ${response.data.data?.password}`,
        });
        setPasswordLoad(null); // Reset loading state
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Something went wrong!',
        });
        setPasswordLoad(null); // Reset loading state
      });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAddUserType = (type) => {
    setAddUserType(type);
    setIsDropdownOpen(false); // Close the dropdown
    setIsAddUserPopupOpen(true); // Open popup
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };


  

  const handleDropdownChange = (e) => {
    const selectedType = e.target.value;
    setDropdownType(selectedType);
    fetchUsers(1, selectedType, searchTerm); // Fetch new data based on role
  };


  // API call to fetch filtered users
  const fetchFilteredUsers = (type, username) => {
    setLoading(true);

    const filterType = type === "" ? undefined : type;
    axiosInstance
      .get(`accounts/users/?type=${filterType}&username=${username}`)
      .then((response) => {
        const { pagination, results } = response.data.data;
        setFilteredUsers(results);
        setLoading(false);
        setNextPage(pagination.next);
        setPreviousPage(pagination.previous);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  // useEffect to fetch filtered users based on search term or dropdown type
  // useEffect(() => {
  //   if (searchTerm !== '' || dropdownType !== '') {
  //     fetchFilteredUsers(dropdownType, searchTerm);
  //   } else {
  //     fetchUsers(currentPage);
  //   }
  // }, [dropdownType, searchTerm, currentPage]);
  useEffect(() => {
    fetchUsers(currentPage, dropdownType, searchTerm);
  }, [currentPage, pageSize]);
  
  const handleRefresh = () => {
    fetchUsers(currentPage);
  };

  return (
    <div className="user-container">
      <div className="user-tit-top">
        <h2>To add more Users, click on Download CSV, fill in the details. Click on Add User to upload the CSV. Users will be added.</h2>
        <h2>To Activate Users, click on the Inactive button. </h2>
        <h2>The total number of active users can’t exceed the number of logins allowed as per your package. If you want to allow more users, upgrade your package from the Upgrade section.</h2>
      </div>

      <div className="top-user-btn">
      <UpdateUserProgram />
        <div className="add-user-container">
          <button className="add-user-btn" onClick={toggleDropdown}>
            Add User <span className="dropdown-icon">▼</span>
          </button>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="dropdown-options">
              <div className="dropdown-option" onClick={() => handleAddUserType('single')}>
                Add Single User
              </div>
              <div className="dropdown-option" onClick={() => handleAddUserType('bulk')}>
                Add Bulk User
              </div>
            </div>
          )}
        </div>
        <DownloadUser />
        <button className="refresh-btn" onClick={handleRefresh}>Refresh</button>
      </div>

     

      <div className="drop-search-assement">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Name, Email, Registration Number  or Employee Id "
        />

<div className="flex items-center space-x-2">
  <select
    id="pageSize"
    value={pageSize}
    onChange={(e) => {
      const newPageSize = Number(e.target.value);
      setPageSize(newPageSize); // Update state for page size
      fetchUsers(1, dropdownType, searchTerm, newPageSize); // Trigger API call with new page size
    }}
    className="border border-gray-300 rounded-lg p-1"
  >
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={30}>30</option>
  </select>
</div>


      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {(searchTerm === "" ? users : filteredUsers).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Registration Number</th>
                  <th>Employee Id</th>
                  <th className="user-admin-panel">
                    Role
                    <select onChange={handleDropdownChange}>
                    <option>Select an Option</option>
                      {/* <option value=''>All</option> */}
                      <option value="faculty">Faculty</option>
                      <option value="student">Students</option>
                      {/* Add more options as needed */}
                    </select>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
  {users.length > 0 ? (
    users.map((user) => {
      const role = Array.isArray(user.user_type)
        ? user.user_type[0].toLowerCase()
        : String(user.user_type).replace(/['(),]/g, '').toLowerCase();

      return (
        <tr key={user.id} className={user.is_active === false ? 'highlight-red' : ''}>
          <td>{user.first_name}</td>
          <td>{user.last_name}</td>
          <td>{user.email}</td>
          <td>{role === 'student' ? user.username : ''}</td> {/* Registration Number */}
          <td>{role === 'faculty' ? user.username : ''}</td> {/* Employee ID */}
          <td>{role}</td> {/* Role */}
          <td className='edit-password'>
            <button className="edit-btn" onClick={() => handleEditClick(user)}>
              Edit
            </button>
            <button
              className={`edit-btn ${user.is_active === false ? 'disabled' : ''}`}
              onClick={() => handleGeneratePasswordClick(user)}
              disabled={user.is_active === false }
            >
              {passwordLoad ? 'Generating...' : 'Generate Password'}
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="7">No users found.</td>
    </tr>
  )}
</tbody>

            </table>
          ) : (
            <div>No users found matching "{searchTerm}".</div> // Message when no users match
          )}

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={handlePreviousPage}
              disabled={!previousPage}
              className="pagination-btn"
            >
              Previous
            </button>
            {/* <span>
          Showing {filteredUsers.length} of {count} users (Page {currentPage})
        </span> */}
            <button
              onClick={handleNextPage}
              disabled={!nextPage}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}

      {isEditPopupOpen && (
        <EditUserPopup
          user={editUser}
          roles={roles}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Popup for adding user */}
      {isAddUserPopupOpen && addUserType === 'single' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setIsAddUserPopupOpen(false)}>
              &times;
            </span>
            <AddSingleUser
              onClose={() => setIsAddUserPopupOpen(false)}
              onUserAdded={fetchUsers} // Refresh the user list after adding
            />
          </div>
        </div>
      )}

      {isAddUserPopupOpen && addUserType === 'bulk' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setIsAddUserPopupOpen(false)}>
              &times;
            </span>
            <AddUsers
              onClose={() => setIsAddUserPopupOpen(false)}
              onUserAdded={fetchUsers} // Refresh the user list after adding
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
