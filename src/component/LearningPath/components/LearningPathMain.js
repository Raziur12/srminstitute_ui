import React, { useState, useEffect } from 'react';
import HeadingContent from "../../smallComponent/HeadingContent";
// import profilePlaceHolder from "../../../Assets/placeHolder/profilePlaceHolder.png";
import roundRedAnimation from "../../../Assets/LearningPath/round-animation.svg";
import linePng from "../../../Assets/LearningPath/line.png";
import "../../../Styles/LearningPath/LearningPathMain.css";
import UserMainDashboard from '../../UserDashboard/MainuserDashboard/MainUserDashboard';
import { useNavigate } from 'react-router-dom';

const LearningPathMain = () => {
  const [userData, setUserData] = useState({});
  const [dataFeedback, setDataFeedback] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('/individual_analytics/users/');
        const result = await response.json();
        setUserData(result.userData); // Adjust according to your API response
        setDataFeedback(result.dataFeedback); // Adjust according to your API response
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

//   const profileImage = userData.profile_picture || profilePlaceHolder;

  return (
    <>
      <div className="learning-path-main-div">
        <HeadingContent data={dataFeedback} />
        <div className="user-info">
          {/* <div className="image-container">
            <img
              src={profileImage}
              className="profile-pic"
              alt={"userName"}
            />
            <img
              src={roundRedAnimation}
              className="animated-circle"
              alt="animation"
            />
          </div> */}
          <div className="tag-div">
            <p className="label">Name</p>
            <p className="value-text">
              {userData.account_data?.first_name + " " + userData.account_data?.last_name}
            </p>
          </div>

          <img src={linePng} className='line-png' alt='line' />

          <div className="tag-div">
            <p className="label">Designation</p>
            <p className="value-text">{userData.account_data?.role}</p>
          </div>
          <div className="tag-div" style={{ width: "220px" }}>
            <p className="label">Department</p>
            <p className="value-text">{userData.account_data?.org}</p>
          </div>
        </div>
      </div>

      {/* <UserMainDashboard userData={userData} /> */}

      {/* Example navigation button */}
      <button onClick={() => navigate('/some-path')}>Go to some path</button>
    </>
  );
}

export default LearningPathMain;
