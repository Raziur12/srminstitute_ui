import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import axios from 'axios';
import Login from './Login';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
// import { useGlobalStateContext } from '../../states/GlobalState';
// import Cookies from 'js-cookie';

const LoginPage = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginInfo, setLoginInfo] = useState({});
    const [validationError, setValidationError] = useState(null);
    const [alertText, setAlertText] = useState()
    const [submitLoader, setSubmitLoader] = useState(false)
    const [showPopUp, setShowPopUp] = useState(false)

    const heading = "Welcome"
    const heroText = "Enhance your skills and ensure safety for yourself and your co-workers";
    const forgotText = "Forgot Password? "

    useEffect(() => {
        if (validationError) {
            setAlertText(`Invalid ${validationError[0].path[0]}`)
        }
    }, [validationError])

    useEffect(() => {
        let timer;
        if (alertText) {
            timer = setTimeout(() => {
                setAlertText(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [alertText]);

    useEffect(() => {
        setLoginInfo({
            email: userEmail,
            password: password,
        });
    }, [userEmail, password]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    const handleSubmit = async () => {
        setSubmitLoader(true);
        try {
            const response = await axiosInstance.post('login', loginInfo);

            setSubmitLoader(false);
            if (response.status === 200) {
                const { data } = response;
                const { first_name, last_name, username, user_type, email, user_id, mobile_number, role } = data.data.user;
                // ❌ If the user has restricted access, show alert and prevent login
                if (
                    (user_type === "student") ||
                    (user_type === "student" && username === "staff") ||
                    (user_type === "student" && username === "Admin") ||
                    (user_type === "student" && username === "super Admin")
                    // (user_type === "faculty" && username === "staff")
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Access Denied",
                        text: "You are not allowed to view this resource",
                    });
                    return; // Stop execution
                }

                localStorage.setItem('access', data.data.access);

                const validFacultyAccess = (
                    (role === 'super_admin' && user_type === 'faculty') ||
                    (role === 'admin' && user_type === 'faculty') ||
                    (role === 'staff' && user_type === 'faculty') ||
                    (role === 'admin' && user_type === 'hod') ||
                    (role === 'staff' && user_type === 'prospective_faculty') ||
                    (role === 'staff' && user_type === 'time_table_coordinator')
                );

                if (validFacultyAccess) {
                    // ✅ Store all user info
                    localStorage.setItem('first_name', first_name);
                    localStorage.setItem('last_name', last_name);
                    localStorage.setItem('user_email', email);
                    localStorage.setItem('user_type', user_type);
                    localStorage.setItem('username', username);
                    localStorage.setItem('user_id', data.data.user.id);
                    localStorage.setItem('mobile_number', mobile_number);
                    localStorage.setItem('role', role);

                    // ✅ Navigate based on role
                    if (role === 'super_admin') {
                        navigate('/library/mcq');
                    } else {
                        navigate('/faculty');
                    }

                } else {
                    setAlertText("Please go to the User Panel to log in.");
                }
            }
        } catch (error) {
            setSubmitLoader(false); // Stop loading

            if (error.name === 'ZodError') {
                scrollToTop(); // Scroll to the top to show validation error
                setValidationError(error.errors);
            } else if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 401) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Login Failed',
                            text: 'Invalid User ID or Password',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: `Error ${data.status}`,
                            text: data.message || 'Unknown error',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Network Error',
                        text: 'Please try again later.',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'An unexpected error occurred. Please try again later.',
                });
            }
        }
    };

    useEffect(() => {
        const handleUnload = () => {
            localStorage.clear();
            sessionStorage.clear();
        };

        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, []);



    const handleSignup = () => {
        navigate("/signup")
    }

    return (
        <>
            <Login
                heading={heading}
                heroText={heroText}
                forgotText={forgotText}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleSubmit={handleSubmit}
                handleSignup={handleSignup}
                validationError={validationError}
                submitLoader={submitLoader}
                alertText={alertText}
                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
            />
        </>
    );
};

export default LoginPage;