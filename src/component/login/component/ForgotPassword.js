import React, { useState, useEffect } from "react";
import { z } from 'zod';
import { RxCross2 } from "react-icons/rx";
import RedButton from "../../../globalComponents/redButton/RedButton";
import "../../../Styles/login/ForgotPassword.css"
import axios from "axios";
import axiosInstance from "../../../interceptor/axiosInstance";

const requestSchema = z.object({
    // name: z.string(),
    email: z.string().email(),
    // number: z.number().min(10),
  });
  
const ForgotPassword = ({ setPopUpFormVisible }) => {
    // const [ userName, setUserName] = useState('');
    const [ userEmail, setUserEmail] = useState('');
    // const [ userPhNumber, setUserPhNumber] = useState("");
    const [ contactData, setContactData] = useState({});
    const [ validationError, setValidationError] = useState(null);
    const [ alertText, setAlertText ] = useState()
    const [ submitLoader, setSubmitLoader] = useState(false)
  
    useEffect(() => {
      if (validationError) {
        setAlertText(`Invalid ${validationError[0].path[0]}`)
      }
    }, [validationError])
  
    useEffect(() => {
      setContactData({
        // name: userName,
        email: userEmail,
        // number: parseInt(userPhNumber),
        message: "Forgot Password",
      });
    }, [ userEmail ])
  
    const handleSubmit = () => {
      setSubmitLoader(true)
      try {
        requestSchema.parse(contactData);
        setValidationError(null); // Clear any previous validation errors
        axiosInstance
          .post("accounts/password-reset/", contactData)
          .then((res) => {
            setSubmitLoader(false)
            res.status === 200 && setAlertText("Sent Successfully")
          //   setPopUpFormVisible(false)
          })
          .catch((error) => {
            setSubmitLoader(false)
          });
      } catch (error) {
        setSubmitLoader(false)
        setValidationError(error.errors);
      }
    }
  
      const email = ""
        const phoneNumber = "+91 1234567890"
  
        const [ showAlert, setShowAlert ] = useState(false)
  
          useEffect(() => {
              let timer;
              if (alertText) {
                  setShowAlert(true);
                  timer = setTimeout(() => {
                      setShowAlert(false);
                      setAlertText(null)
                  }, 3000);
              }
              return () => clearTimeout(timer);
          }, [alertText, setAlertText]);
    
        const handleEmailChange = (value) => {
        setUserEmail(value);
        };
  
    return (
      <div className='name-not-found-main-div'>
              
      {showAlert && 
      <div className='alert-box'>
          <p className='alert-text'>{alertText}</p>
      </div>}
  
      <p className='page-title'>Forgot Password?</p>
      <p className='grey-text'>
          Submit your details to the concerned department
      </p>
  
      <input
          className='name-not-found-input'
          type='passwod'
          placeholder='New Password'
          onChange={(e) => handleEmailChange(e.target.value)}
          required
      />
  
      <RedButton text={"Submit"} onClickHandler={handleSubmit} loading={submitLoader} />
  
  </div>
    );
  };
  
  export default ForgotPassword;