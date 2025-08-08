import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../interceptor/axiosInstance';

const ReleaseResult = ({ user, onClose }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const userDropDown = user?.users || [];

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleOkClick = async () => {
    if (!selectedUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please select a user.',
      });
      return;
    }

    try {
      setLoading(true); // Start loading
      // Find the user object that corresponds to the selected user_id
      const selectedUser = userDropDown.find((u) => u.test_submitted_id === parseInt(selectedUserId));

      if (!selectedUser) {
        throw new Error('User not found.');
      }

      const response = await axiosInstance.put(
        `userprogress/user-test-submission/${selectedUser.test_submitted_id}/`,
        { result_released: true }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Result released successfully!',
      });

      onClose();
    } catch (error) {
      console.error('Error releasing result:', error);

      // Check if there's a specific 'detail' message in the response error
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || 'Failed to release result. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="release-result-container">
      <h2 className="release-result-header">Release Result</h2>
      <p className='release-title'>Select User for release result:</p>
      <select
        className="release-result-dropdown"
        value={selectedUserId}
        onChange={handleUserChange}
      >
        <option value="">Select a user</option>
        {userDropDown.map((u) => (
          <option key={u.user_id} value={u.test_submitted_id}>
            {u.name}
          </option>
        ))}
      </select>
      <button
        className="release-result-button"
        onClick={handleOkClick}
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Loading...' : 'OK'} {/* Show loading text */}
      </button>
    </div>
  );
};

export default ReleaseResult;
