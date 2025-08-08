import axios from 'axios';
import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import avatarIcon from "../../Assets/login/personIcon.png";
import lockicon from "../../Assets/login/lock.png";
import "../../Styles/Signup/signup.css";
import RedButton from '../../globalComponents/redButton/RedButton';
import axiosInstance from '../../interceptor/axiosInstance';

const heading = "Sign Up";

function Signup() {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        username: "",
        contact_number: "",
        org: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [submitLoader, setSubmitLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSignup = async () => {
        const { firstName, lastName, username, email, contact_number, org, password, confirmPassword } = formValues;
        
        const fields = [
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'username', label: 'Username' },
            { key: 'email', label: 'Email' },
            { key: 'password', label: 'Password' },
            { key: 'confirmPassword', label: 'Confirm Password' }
        ];

        for (const { key, label } of fields) {
            if (!formValues[key]) {
                Swal.fire("Error!", `Please fill the ${label} field.`, "error");
                return;
            }
        }

        if (password !== confirmPassword) {
            Swal.fire("Error!", "Passwords do not match.", "error");
            return;
        }

        setSubmitLoader(true);

        const signupInfo = {
            first_name: firstName,
            last_name: lastName,
            username: username,
            contact_number: contact_number,
            org: org,
            email: email,
            password: password,
        };

        try {
            const response = await axios.post('https://bodhiguruplat.com/accounts/register/', signupInfo);
            if (response.status === 201) {
                Swal.fire("Success!", "Registration successful.", "success").then(() => {
                    navigate("/");
                });
            } else {
                Swal.fire("Error!", response.data || "An unexpected error occurred.", "error");
            }
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.error || "An unexpected error occurred.", "error");
        } finally {
            setSubmitLoader(false);
        }
    };

    return (
        <div className='login-main-signup-div'>
            <div className="background"></div>

            <div className="hero-container">
                {/* <h2 className="company-name">Aicansell</h2> */}
                <h2 className="login-title"> Create New Account? </h2>
                <h3 className='signup-subhead'>Start Your 30 day Free Trial (No Payment Details required.)</h3>
                <h3 className="login-sub-title">
                    Already Registered? <Link className="login-linking" to={"/"}>Login</Link>
                </h3>
                <div className="divider"></div>
                {/* <h3 className="login-sell-line">AIcansell: Unlock the best version of yourself</h3> */}
                {/* <div className="login-read">
                    <RedButton text={"Learn More"} />
                </div> */}
            </div>

            <div className='right-signup-div'>
                <div className='form-container'>
                    <p className='heading'>{heading}</p>

                    <div className='main-fs-ls'>
                        <div className='input-div'>
                            <label htmlFor="firstName">First Name</label>
                            <div className='input-main'>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='input-div'>
                            <label htmlFor="lastName">Last Name</label>
                            <div className='input-main'>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='input-div'>
                        <label htmlFor="username">Username</label>
                        <div className='input-main'>
                            <input
                                type="text"
                                name="username"
                                value={formValues.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='main-fs-ls'>
                        <div className='input-div'>
                            <label htmlFor="contact_number">Contact Number</label>
                            <div className='input-main'>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formValues.contact_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='input-div'>
                            <label htmlFor="org">Org Name</label>
                            <div className='input-main'>
                                <input
                                    type="text"
                                    name="org"
                                    value={formValues.org}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='input-div'>
                        <label htmlFor="email">Email</label>
                        <div className='input-main'>
                            <img src={avatarIcon} className='icoon' alt='avatar' />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='input-div'>
                        <label htmlFor="password">Password</label>
                        <div className="input-main">
                            <img src={lockicon} className='icoon' alt='lock' />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                            <div className='show-pass-icon' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </div>
                        </div>
                    </div>

                    <div className='input-div'>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-main">
                            <img src={lockicon} className='icoon' alt='lock' />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                            />
                            <div className='show-pass-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </div>
                        </div>
                    </div>

                    <button className='red-btn-global' onClick={handleSignup} disabled={submitLoader}>
                        {submitLoader ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
