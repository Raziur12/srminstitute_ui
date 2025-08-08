import React, { useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import swal from 'sweetalert';
import FaclityExtraFrom from "./UserExtraPopUp/FaclityExtraFrom";
import StudentExtraForm from './UserExtraPopUp/StudentExtraForm';

const AddSingleUser = () => {
  const initialFormState = {
    email: '',
    first_name: '',
    last_name: '',
    mobile_number: '',
    username: '',
    type: 'student',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [userResponse, setUserResponse] = useState(null); 
  const [showPopup, setShowPopup] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile_number') {
      setMobileError('');
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      setMobileError('Mobile number must be exactly 10 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('accounts/users/', formData);
      const userData = response.data?.data;
      setUserResponse(userData);

      swal('Success', 'User added successfully!', 'success').then(() => {
        setShowPopup(true); // Open popup after alert closes
      });

      setFormData(initialFormState);
    } catch (err) {
      const backendData = err.response?.data || {};
      const message = backendData.message || 'Failed to add user. Please try again.';
  
      let errorText = message;
  
      if (backendData.errors) {
        for (const [field, messages] of Object.entries(backendData.errors)) {
          if (Array.isArray(messages)) {
            errorText += `\n${field}: ${messages.join(', ')}`;
          }
        }
      }

      swal('Error', errorText, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStudentType = (type) => type === 'student';

  return (
    <div className="add-users-container">
      <h2>Add Single User</h2>
      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-row">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number:</label>
            <input
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
            {mobileError && <p className="error-message">{mobileError}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registration ID/ Employee ID:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>User Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="prospective_faculty">Prospective Faculty</option>
              <option value="hod">HOD (Head of Department)</option>
              <option value="time_table_coordinator">Time Table Coordinator</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {showPopup && userResponse?.id && (
        <div className="popup">
          <div className="popup-content">
            {isStudentType(userResponse.user_type) ? (
              <StudentExtraForm id={userResponse.id} onClose={() => setShowPopup(false)} />
            ) : (
              <FaclityExtraFrom id={userResponse.id} onClose={() => setShowPopup(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSingleUser;
