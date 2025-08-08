import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/login/newpassword.css';

const NewPassword = () => {
    const [searchParams] = useSearchParams(); // Access query parameters
    const token = searchParams.get('token'); // Get the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Log the token to the console
    useEffect(() => {
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation: Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Call POST API to reset password
            const response = await axios.post('https://bpskillcrest.srmup.in/resetpasswordconfirm/', {
                token,
                password,
            });

            // Handle success response
            setSuccess('Password reset successfully!');
            setError('');
        } catch (err) {
            // Handle API error
            setError('Failed to reset password. Please try again.');
            console.error('API Error:', err);
        }
    };

    return (
        <div className="new-password-container">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit" className="submit-button">
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default NewPassword;