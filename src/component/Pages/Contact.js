import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { contactBox, textWhite, textRed } from "../../Styles/Contact/contactStyle";
import { headingBox, nameBox, textHeader, texthead } from '../../Styles/HeadingStyle/HeadingStyle'
import LineImage from "../../Assets/Line.svg"
import { inputFeedback, inputBox, textAreaBox, inputFocused, submitBtn } from "../../Styles/Feedback/FeedbackStyle";
import axiosInstance from "../../interceptor/axiosInstance";
import RedButton from "../../globalComponents/redButton/RedButton";
import "../../Styles/Pages/contact.css";
import { useGlobalStateContext } from "../../states/GlobalState";

export default function Contact() {
  const { setAlert } = useGlobalStateContext()
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comments, setComments] = useState("");

  const [contactData, setContactData] = useState({})

  useEffect(() => {

    setContactData({
      name: fullName,
      email: email,
      number: phoneNumber,
      message: comments,
    })

  }, [fullName, email, phoneNumber, comments]);

  const handleSend = () => {
    if(!(fullName || email || phoneNumber || comments)) {
      setAlert("Please fill the details")
      return
    }

    axiosInstance
      .post("contactus/" , contactData)
      .then((res) => {
        setAlert("Your request has been submitted")
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <>
      <Box sx={contactBox}>
        <Box sx={headingBox}>
          <Box sx={nameBox}>
            <Typography sx={textHeader}>Contact</Typography>
            <Typography><img src={LineImage} alt='LineImage' /></Typography>
          </Box>
          <Typography sx={texthead}>You can contact us at <Typography component={"span"} sx={textWhite}>aiCansell@gmail.com</Typography>{" "}or <Typography component={"span"} sx={textWhite}>+91 1234567890. <Typography component={"span"} sx={textRed}> Request a Call Back</Typography> </Typography> </Typography>
        </Box>

        <Box sx={inputBox}>
          {" "}
          <input
            style={{
              ...inputFeedback,
              ...inputFocused,
              width: "28%",
            }}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            style={{
              ...inputFeedback,
              ...inputFocused,
              width: "28%",
            }}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={{
              ...inputFeedback,
              ...inputFocused,
              width: "28%",
            }}
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>

        <Box sx={textAreaBox}>
          {" "}
          <textarea
            placeholder='Please enter your comments...'
            rows={5}
            style={{
              ...inputFeedback,
              ...inputFocused,
              width: "90%",
            }}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Box>

        <Box sx={submitBtn}>
          <RedButton onClickHandler={handleSend} text={"Submit"} />
        </Box>

      </Box>
    </>
  );
};
