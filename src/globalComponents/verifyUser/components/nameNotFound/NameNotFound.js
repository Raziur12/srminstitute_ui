import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import RenderNameNotFound from './components/RenderNameNotFound';
import axiosInstance from '../../../../interceptor/axiosInstance';
import { z } from 'zod';
import ThankPopUp from './components/ThankPopUp';

const requestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  number: z.number().min(10),
  newName: z.string(),
  message: z.string(),
});

const NameNotFound = ({ setPopUpFormVisible }) => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('notProvided@email.com');
  const [userPhNumber, setUserPhNumber] = useState("");
  const [newName, setNewName] = useState('')
  const [commentText, setCommentText] = useState('');
  const [contactData, setContactData] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [alertText, setAlertText ] = useState()
  const [submitLoader, setSubmitLoader] = useState(false)
  const [ showPopUp, setShowPopUp ] = useState(false)

  useEffect(() => {
    if (validationError) {
      setAlertText(`Invalid ${validationError[0].path[0]}`)
    }
  }, [validationError])

  useEffect(() => {
    setContactData({
      name: userName,
      email: userEmail,
      number: parseInt(userPhNumber),
      newName: newName,
      message: commentText,
    });
  }, [userName, userEmail, userPhNumber, commentText, newName])

  const handleSubmit = () => {
    setSubmitLoader(true)
    try {
      requestSchema.parse(contactData);
      setValidationError(null); // Clear any previous validation errors
      axiosInstance
        .post("contactus/", contactData)
        .then((res) => {
          setSubmitLoader(false)
          res.status === 201 && setAlertText("Sent Successfully")
          // res.status === 201 && navigate("/home/course-page")
          setShowPopUp(true)
          // setPopUpFormVisible(false)
        })
        .catch((error) => {
          setSubmitLoader(false)
          console.log(error)
        });
    } catch (error) {
      setSubmitLoader(false)
      setValidationError(error.errors);
    }
  }

  const handlePopUp = () => {
    navigate("/home/course-page")
  }

  return (
    <>
      {showPopUp && 
        <ThankPopUp
          text={"Thanks for your Input!"}
          btnFunction={handlePopUp}
        />}
      <RenderNameNotFound
        userName={userName}
        setUserName={setUserName}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        userPhNumber={userPhNumber}
        setUserPhNumber={setUserPhNumber}
        newName={newName}
        setNewName={setNewName}
        commentText={commentText}
        setCommentText={setCommentText}
        contactData={contactData}
        setContactData={setContactData}
        handleSubmit={handleSubmit}
        validationError={validationError}
        setPopUpFormVisible={setPopUpFormVisible}
        alertText={alertText}
        setAlertText={setAlertText}
        submitLoader={submitLoader}
      />
    </>
  );
};

export default NameNotFound;