import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  AlignItems,
  iconSearchMessage,
  ProfileText1,
  ProfileText2,
  imageProfileBox,
  // searchBox
} from "../../Styles/Navbar/navbar";
import Image from "../../Assets/loadingscreen/srm-logo-cmpny.png";
// import Message from "../../Assets/CompanyLogo/Message.svg";
import Notification from "../../Assets/CompanyLogo/notification.svg";
import profileImage from "../../Assets/placeHolder/profilePlaceHolder.png";
import SearchIcon from "@mui/icons-material/Search";
import { HiMenuAlt2 } from "react-icons/hi";
import { Typography } from "@mui/material";
import { useGlobalStateContext } from "../../states/GlobalState";
import Alert from "./Notification/Alert";
import axiosInstance from "../../interceptor/axiosInstance";
import "../../Styles/Navbar/Navbar.css"
import { useNavigate } from "react-router-dom";
import Contact from "../Contact/Contact";
import companyLogo from '../../Assets/loadingscreen/srm-logo-cmpny.png'
import mainLogoo from "../../Assets/mainogo.jpg";

const Navbar = () => {
const { alert, setAlert, setSearchInput, courseSearch, userSearch, workerSearch } = useGlobalStateContext()
const [searchText, setSearchText] = useState()
const [showAlert, setShowAlert ] = useState(false)
const [user, setUser ] = useState()
const [profilePicture, setProfilePicture] = useState();
// const user_id = sessionStorage.getItem('user_id');
// console.log(`User ${user_id}`)
const navigate = useNavigate()

// const companyLogo = localStorage.getItem("org_logo")

  useEffect(() => {
    let timer;
    if (alert) {
        setShowAlert(true);
        timer = setTimeout(() => {
            setShowAlert(false);
            setAlert(null)
        }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert, setAlert]);

  useEffect(() => {
    axiosInstance
      .get(`accounts/current_user/`)
      .then((res) => {
        setUser(res.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    // if(user.profile_picture) {
    //   setProfilePicture(user.profile_picture)
    // } else {
      
    // }
    setProfilePicture(profileImage)
  }, [user])


  const handleSearchInput = (e) => {
    setSearchInput(e.target.value)
    setSearchText(e.target.value)
  }
  

  const handleLogout =  () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/"); // Redirect to the home page or login page
  }

  return (
    <>
      <div className="navbar-main-div">

        {(courseSearch || userSearch || courseSearch) && 
        searchText && 
          <div className="search-dropdown">
            {courseSearch && courseSearch.map((item) => (
              <div className="search-row">
                <p className="text course">
                  <span>Course:</span> {item.name}
                  </p>
                <p className="view-btn">View</p>
              </div>
            ))}
            {userSearch && userSearch.map((item) => (
              <div className="search-row">
                <p className="text user">
                  <span>User:</span> {item.name}
                  </p>
                <p className="view-btn">View</p>
              </div>
            ))}
            {workerSearch && workerSearch.map((item) => (
              <div className="search-row">
                <p className="text worker">
                  <span>Worker:</span> {item.name}
                </p>
                <p className="view-btn">View</p>
              </div>
            ))}
          </div>
        }

        <div className="logo-section">
          <Box component={"span"} height={"100%"} sx={AlignItems}>
            {" "}
            <img 
    src={companyLogo} 
    alt="Company Logo" 
    style={{    width: "25rem",
      height: "6rem" }} 
/>

<img 
    src={mainLogoo} 
    alt="Company Logo" 
    style={{    width: "25rem",
      height: "6rem" }} 
/>

          </Box>
          <Box component={"span"} align="center" display="flex">
            {" "}
            <HiMenuAlt2
              color="white"
              style={{ width: "40px", height: "40px" }}
            />
          </Box>
        </div>

        {/* <div className="search-container"> 
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search"
            onChange={(e) => handleSearchInput(e)}
          />

          <SearchIcon
            className="search-icon"
          />
        </div> */}

        <Box sx={iconSearchMessage}>
         
        <div className="navbar-btn-cho">
 {/* <Contact /> */}
  <button onClick={handleLogout}>Log Out</button>
</div>
          
          {user &&
          <Box sx={iconSearchMessage}>

            <Typography color={"white"} sx={imageProfileBox}>    
              <img src={profilePicture} style={{ width: "50px",cursor:"pointer" }} alt="logo" />
            </Typography>
            <Box color={"white"} sx={{ marginLeft: 2 }}>
              <Typography sx={ProfileText1}>{user.first_name} {user.last_name}</Typography>
              <Typography sx={ProfileText2} align="left">{user.role}</Typography>
            </Box>
          
          </Box>}
        </Box>


        {showAlert && 
        <Alert message={alert} />}

      </div>
    </>
  );
};

export default Navbar;
