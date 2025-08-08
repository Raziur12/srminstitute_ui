import React, { useState } from 'react';
import axios from 'axios';
import '../../Styles/login/emailverify.css'; // Import the CSS file

const EmailVerify = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendResetLink = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setMessage('');

    try {
      const response = await axios.post('https://bpskillcrest.srmup.in/resetpassword', { email });
      setMessage(response.data.message || 'Reset link sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while sending the reset link.');
    }
  };

  return (
    <div className="verify-container">
      <h2 className="verify-title">Email Verification</h2>
      <div className="verify-input-group">
        <label htmlFor="email" className="verify-label">Type your registered email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="verify-input"
        />
      </div>
      {error && <div className="verify-error">{error}</div>}
      {message && <div className="verify-message">{message}</div>}
      <button onClick={handleSendResetLink} className="verify-button">Send Reset Link</button>
    </div>
  );
};

export default EmailVerify;