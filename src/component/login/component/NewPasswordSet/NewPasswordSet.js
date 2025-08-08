import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../Styles/login/NewForgotPassword.css";
import axiosInstance from "../../../../interceptor/axiosInstance";

function ForgotNewPassword() {
  const [formData, setFormData] = useState({
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { param1, token } = useParams();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(formData.new_password)) {
      Swal.fire(
        "Invalid Password",
        "A strong password should contain at least one capital letter, one number, and one special character.",
        "error"
      );
      return;
    }

    try {
      // Send only new_password to the backend
      const response = await axiosInstance.post(`/accounts/password-reset-confirm/${param1}/${token}/`, {
        new_password: formData.new_password,
      });

      Swal.fire("Password changed!", "Your password has been updated.", "success");
      navigate("/"); // Redirect to home after successful password change
    } catch (error) {
      console.error("API Error:", error);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "An error occurred while changing the password.";
        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Error", "An error occurred while changing the password.", "error");
      }
    }
  };

  return (
    <div className='newpass-main-div'>
      <div className="NewPassword-container">
        <h2>Reset Password</h2>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="input-box-password">
            <h4 style={{ color: "red", fontWeight: "100" }}>
              A strong 8-character password should contain letters, numbers, and special characters
            </h4>
            <label htmlFor="new_password">New Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={handleInputChange}
                required
              />
              <span className="password-toggle-icon" onClick={handlePasswordToggle}>
                {showPassword ? (
                  <span role="img" aria-label="Hide Password">
                    🙈
                  </span>
                ) : (
                  <span role="img" aria-label="Show Password">
                    👁️
                  </span>
                )}
              </span>
            </div>
          </div>
          <button type="submit" className="button-forgetpassword">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotNewPassword;
