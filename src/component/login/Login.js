import React from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import avatarIcon from "../../Assets/login/personIcon.png"
import lockicon from "../../Assets/login/lock.png"

import RedButton from "../../globalComponents/redButton/RedButton"
import ForgotPassword from './component/ForgotPassword';
import "../../Styles/login/NewLogin.css"
import { Link, useNavigate } from 'react-router-dom';

import companyLogo from "../../Assets/loadingscreen/srm-logo-cmpny.png";
import leftWallPaper from "../../Assets/wallpaper.jpg";

const Login = ({ 
    heading,
    heroText,
    forgotText,
    showPopUp,
    // setShowPopUp,
    alertText, 
    userEmail, 
    setUserEmail, 
    password, 
    setPassword, 
    showPassword, 
    setShowPassword, 
    handleSubmit, 
    handleSignup,
    submitLoader 
    }) => {
const navigate = useNavigate()
        const handleForgot = () => {
            navigate(`/forgot`)
        }
    
    return (
       <div
       className='login-new-main-container'>
<div className='login-new-left-side-image'>
<img src={leftWallPaper} className='login-new-left-side-wallpaper'  alt='wallpaper'/>
</div>

<div className='login-new-right-side-container'>
<div className='login-new-right-side-data'>
    <div className='login-new-top-right-side-logg'>
<img src={companyLogo} className='login-new-right-top-image'  alt='wallpaper'/>
    </div>
    <div className='login-new-form-css'>
    <div className='form-container-new'>
            <div className='input-div'>
                {/* <label htmlFor="userEmail">Email</label> */}

                <div className='input-main'>
                    {/* <img src={avatarIcon} className='icoon' alt='avatar' /> */}
                    <input 
                        id="userEmail-New" 
                        type="email" 
                        placeholder='Email'
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                    />
                </div>
            </div>

            <div className='input-div'>
                {/* <label htmlFor="password">Password</label> */}

                <div className="input-main">
                    {/* <img src={lockicon} className='icoon' alt='lock' /> */}
                    <input 
                        id="password-New" 
                        placeholder='Password'
                        type={!!(showPassword)? "text" : "password"}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <div 
                        className='show-pass-icon'
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword? <IoMdEyeOff /> : <IoMdEye />}
                    </div>
                </div>
            </div>

            <p className='forgot-text'>
                {forgotText}
                <span className="forget-span" onClick={handleForgot}>
                    Click here
                </span>
            </p>
            
            <div className='submit-btn'>
                <RedButton 
                    onClickHandler={handleSubmit} 
                    text={"Login"} 
                    loading={submitLoader}
                />
            </div>

        </div>

    </div>
</div>
</div>

       </div>
    );
};

export default Login;
