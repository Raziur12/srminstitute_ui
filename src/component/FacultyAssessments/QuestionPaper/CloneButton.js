import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../interceptor/axiosInstance';

const CloneButton = ({ test_id, test_name }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newTestName, setNewTestName] = useState(test_name);
  const [loading, setLoading] = useState(false);

  const handleCloneClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/assessments/clone/', { test_id, test_name: newTestName });

      Swal.fire({
        title: 'Success!',
        text: 'Test has been cloned successfully. If you do not see the test, please refresh the page.',
        icon: 'success',
      });

      setShowPopup(false); // Close popup after successful cloning
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="assessments-button" onClick={handleCloneClick}>
        Clone
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Clone Assessment</h2>
            <label>New Test Name:</label>
            <input
              type="text"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              className="popup-input"
            />
            <div className="button-group">
              <button className="confirm-button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Cloning...' : 'Clone'}
              </button>
              <button className="cancel-button" onClick={handleClosePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloneButton;
