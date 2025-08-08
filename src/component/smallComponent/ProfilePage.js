import React from 'react'

import profilePlaceHolder from "../../Assets/placeHolder/profilePlaceHolder.png";
import roundRedAnimation from "../../Assets/LearningPath/round-animation.svg";
import linePng from "../../Assets/LearningPath/line.png"
import { Typography } from '@mui/material';
import "../../Styles/LearningPath/LearningPathMain.css";

 const ProfilePage = ({ name, role, department, location }) => {

  const textStyles = {
    textTransform: "capitalize",
  }

  return (
    <>
    <div className="learning-path-main-div">
          <div className="user-info">
                <div className="image-container">
                  <img
                    src={profilePlaceHolder}
                    className="profile-pic"
                    alt={"userName"}
                  />
                  <img
                    src={roundRedAnimation}
                    className="animated-circle"
                    alt="animation"
                  />
                </div>
              <div
                className="tag-div"
              >
                <Typography sx={textStyles} className="label">
                  Name
                </Typography>

                <Typography sx={textStyles} className="value-text">
                  {name}
                </Typography>
              </div>

              <img src={linePng} className='line-png' alt='line' />

              {role && 
              <div className="tag-div">
                <Typography sx={textStyles} className="label" paddingLeft={1}>
                  Role 
                </Typography>
                <Typography sx={textStyles} className="value-text">
                  {role}
                </Typography>
              </div>}

              {department && 
              <div className="tag-div" style={{ width: "220px" }}>
                <Typography sx={textStyles} className="label" paddingLeft={1}>
                  Department
                </Typography>

                <Typography sx={textStyles} className="value-text">
                  {department}
                </Typography>
              </div>}

              {location &&
              <div className="tag-div" style={{ width: "180px" }}>
                <Typography sx={textStyles} className="label" paddingLeft={1}>
                  Location
                </Typography>
                <Typography sx={textStyles} className="value-text">
                  {location}
                </Typography>
              </div>}
            </div>
        </div>
    </>
  )
}
export default ProfilePage