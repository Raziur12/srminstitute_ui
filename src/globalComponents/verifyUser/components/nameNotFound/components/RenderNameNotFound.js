import React, { useState, useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import RedButton from '../../../../redButton/RedButton';
// import DividerOr from '../../../../globalComponents/DividerOr/DividerOr';
import "../../../../../Styles/login/ForgotPassword.css"

const RenderNameNotFound = ({
    userName,
    setUserName,
    // userEmail,
    setUserEmail,
    newName,
    setNewName,
    commentText,
    setCommentText,
    userPhNumber,
    setUserPhNumber,
    handleSubmit,
    setPopUpFormVisible,
    alertText,
    setAlertText,
    submitLoader
  }) => {
      const email = "dsslearningtrail@gmail.com"
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
      
      const handleNameChange = (value) => {
      setUserName(value);
      };
  
      const handleEmailChange = (value) => {
      setUserEmail(value);
      };
  
      const handlePhNumberChange = (value) => {
      setUserPhNumber(value);
      };
  
      const handleCommentChange = (value) => {
      setCommentText(value);
      };

      const handleNewNameChange = (value) => {
        setNewName(value);
    };
  
      return (
        <div className='name-not-found-main-div'>
            
            {showAlert && 
            <div className='alert-box'>
                <p className='alert-text'>{alertText}</p>
            </div>}

            <div 
                onClick={() => setPopUpFormVisible(false)}
                className='cross-icon'>
                <RxCross2 />
            </div>

            <div className='scroll-div'>
  
            <p className='page-title'>Name not Found?</p>
    
            <div className='note'>
                You can contact us at <br/>
                <span>{email}</span>
                {" "}or{" "}
                <span>{phoneNumber}</span>
            </div>

            {/* <DividerOr /> */}
    
            <p className='request-call'>
                Request a Call back
            </p>
    
            <div className='input-row-container'>
                <input
                    className='name-not-found-input'
                    placeholder='Your Full Name'
                    value={userName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                />
        
                <input
                    className='name-not-found-input'
                    type='email'
                    placeholder='Email Address'
                    // value={userEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                />  
            </div>
    
            <div className='input-row-container'>
                <input
                    className='name-not-found-input'
                    placeholder='Phone Number'
                    type='number'
                    value={userPhNumber}
                    onChange={(e) => handlePhNumberChange(e.target.value)}
                    required
                />

                <input
                    className='name-not-found-input'
                    placeholder='Name you are trying to find'
                    value={newName}
                    onChange={(e) => handleNewNameChange(e.target.value)}
                    required
                />
            </div>
    
            <textarea
                placeholder="Please enter your comments..."
                rows={5}
                maxLength={500}
                className='textarea'
                value={commentText}
                onChange={(e) => handleCommentChange(e.target.value)}
                required
            />
    
            <RedButton text={"Submit"} onClickHandler={handleSubmit} loading={submitLoader} />
  
            </div>
        </div>
      );
}

export default RenderNameNotFound