import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import HeadingContent from "../smallComponent/HeadingContent";
import axiosInstance from "../../interceptor/axiosInstance";
import StarIcon from "@mui/icons-material/Star";
import {
  starContent,
  starBox,
  starMargin,
  inputFeedback,
  inputBox,
  feedbox,
  textAreaBox,
  buttonBox,
  textAreafield
} from "../../Styles/Feedback/FeedbackStyle.js";
import RedButton from "../../globalComponents/redButton/RedButton";
import { useGlobalStateContext } from "../../states/GlobalState";

const Feedback = () => {
  const { setAlert } = useGlobalStateContext()
  const DataFeedback = {
    text: "Feedback",
    textsmall: "Any other feedback you would like to share with us",
  };

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [contentQualityStars, setContentQualityStars] = useState(0);
  const [easeOfUseStars, setEaseOfUseStars] = useState(0);
  const [overallExperienceStars, setOverallExperienceStars] = useState(0);
  const [message, setMessage] = useState("");
  const [feedBackData, setFeedBackData] = useState();

  const handleStarClick = (index, category) => {
    // Set the number of selected stars based on the category
    switch (category) {
      case "contentQuality":
        setContentQualityStars(index + 1);
        break;
      case "easeOfUse":
        setEaseOfUseStars(index + 1);
        break;
      case "overallExperience":
        setOverallExperienceStars(index + 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
  }, [feedBackData]) 

  useEffect(() => {
    setFeedBackData({
      full_name: userName,
      email: userEmail,
      content_quality_rating: contentQualityStars,
      ease_of_use_rating: easeOfUseStars,
      overall_experience_rating: overallExperienceStars,
      feedback_description: message,
    });
  }, [
    userName,
    userEmail,
    contentQualityStars,
    easeOfUseStars,
    overallExperienceStars,
    message,
  ]);

  const handleSubmit = () => {
    if (!userName || !userEmail || contentQualityStars === 0 || easeOfUseStars === 0 || overallExperienceStars === 0 || !message) {
      setAlert("Please fill out all fields and provide ratings for all categories.");
      return;
    }

      axiosInstance
        .post("contactus/feedback/", feedBackData)
        .then((res) => {
          res.status === 200 && setAlert("Thanks for your feedback")
        })
        .catch((error) => {
          console.log(error)
        });
  }


  return (
    <>
      <Box sx={feedbox}>
        <HeadingContent data={DataFeedback} />

        <Box sx={inputBox}>
          {" "}
          <input
            style={{ ...inputFeedback }}
            type="text"
            value={userName}
            placeholder="Full Name"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            style={{ ...inputFeedback }}
            type="text"
            value={userEmail}
            placeholder="Email Address"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </Box>

        <Box sx={starBox}>
          <Box sx={starMargin}>
            <Typography sx={starContent}>Content Quality</Typography>
            <Typography align="left">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index, "contentQuality")}
                  style={{
                    cursor: "pointer",
                    marginRight: "4px", // Adjust the spacing between stars
                  }}
                >
                  {index < contentQualityStars ? (
                    <StarIcon style={{ fontSize: "35px", color: "orange" }} />
                  ) : (
                    <StarIcon
                      style={{ fontSize: "35px", color: "#414141" }}
                    />
                  )}
                </span>
              ))}
            </Typography>
          </Box>

          <Box sx={starMargin}>
            <Typography sx={starContent}>Ease of Use</Typography>
            <Typography align="left">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index, "easeOfUse")}
                  style={{
                    cursor: "pointer",
                    marginRight: "4px", // Adjust the spacing between stars
                  }}
                >
                  {index < easeOfUseStars ? (
                    <StarIcon style={{ fontSize: "35px", color: "orange" }} />
                  ) : (
                    <StarIcon
                      style={{ fontSize: "35px", color: "#414141" }}
                    />
                  )}
                </span>
              ))}
            </Typography>
          </Box>

          <Box sx={starMargin}>
            <Typography sx={starContent}> Overall Experience</Typography>
            <Typography align="left">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index, "overallExperience")}
                  style={{
                    cursor: "pointer",
                    marginRight: "4px", // Adjust the spacing between stars
                  }}
                >
                  {index < overallExperienceStars ? (
                    <StarIcon style={{ fontSize: "35px", color: "orange" }} />
                  ) : (
                    <StarIcon
                      style={{ fontSize: "35px", color: "#414141" }}
                    />
                  )}
                </span>
              ))}
            </Typography>
          </Box>
        </Box>
        <Typography sx={textAreafield}>
          Any other feedback you would like to share with us
        </Typography>

        <Box sx={textAreaBox}>
          {" "}
          <textarea
            placeholder="Please write here..."
            rows={5}
            style={{ ...inputFeedback, width: "609px" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        <Box sx={buttonBox}>
          <RedButton onClickHandler={handleSubmit} text={"Submit"} />
        </Box>
      </Box>
    </>
  );
};

export default Feedback;
