import React, { useState } from 'react';
import "../../Styles/Contact/Contact.css";
import axiosInstance from '../../interceptor/axiosInstance';

const Contact = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      email,
      contact_number: contactNumber,
      description
    };

    try {
      const response = await axiosInstance.post('/api/feedback/submit/', feedbackData);
      if (response.status === 201) {
        alert('Feedback submitted successfully!');
        setShowPopup(false);
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="contact-container">
      <button  onClick={() => setShowPopup(true)}>Contact</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setShowPopup(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Feedback</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
