import React, { useEffect, useState }  from 'react'
import {
    CreateAdminContainerBox,
    adminText,
    lineSpan,
    textAdminBox,
    buttonbg,
  } from "../../../Styles/AdminManagement/CreateAdminStyle";
import { useLocation } from "react-router-dom"
import { Box, Typography } from "@mui/material";
// import { useGlobalStateContext } from '../../../states/GlobalState';
import { Link } from 'react-router-dom';
import HeadingContent from "../../smallComponent/HeadingContent";
import Arrow from "../../../Assets/icons/Arrow.svg";
import Accessibility from './Accessibility';
import ProfilePage from '../../smallComponent/ProfilePage';
import axiosInstance from '../../../interceptor/axiosInstance';
// import RedButton from '../../../globalComponents/redButton/RedButton';

 const AdminCreated = () => {
  const location = useLocation();
  const responseData = location.state?.response;
  // const { plantList, rightsList } = useGlobalStateContext()
  const [rightsList, setRightsList] = useState([])
  const [ userData, setUserData ] = useState()
  const [ selectedRights, setSelectedRights ] = useState([])
  const [accessibility , setAccessibility] = useState([]);
  // const [ plantAccess, setPlantAccess ] = useState([])

  const DataFeedback = { text: " Create an Admin " }

console.log(rightsList)

  useEffect(() => {
    axiosInstance
      .get(`users/user/${responseData}/`)
      .then((res) => {
        const response = res.data.data
        setUserData(response)
        setSelectedRights(response.access)
        setRightsList(response.access)
        // setPlantAccess(response.plant_access)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [responseData])

  // const handleClick = () => {
  //   // const data = {
  //   //   right:  rightsList,
  //   //   user: userData.id,
  //   // }
  //   // console.log(data)
  //   // axiosInstance
  //   //   .post(`users/userightsmapping/`, data)
  //   //   .catch((error) => {
  //   //     console.error(error)
  //   //   })
  //   console.log("Bhai tu apna kaam krna ye kaam ho chuka hai refresh kar le page ko")
  // }


  useEffect(() => {
    // Replace axios with your configured axiosInstance if you have one
    axiosInstance.get(`users/userrights/`)
      .then(response => {
        // Process the response data here
        setAccessibility(response.data.data); 
      })
      .catch(error => {
        // Handle any errors here
        console.error("Error fetching user rights:", error);
      });
  }, []); 

  return (
    <>
   {userData &&
   <Box sx={CreateAdminContainerBox}> 
      <HeadingContent data={DataFeedback} />
        <Box sx={textAdminBox}>
          {" "}
          <Typography component={"span"} sx={adminText}>
            Admin Details
          </Typography>
          <Typography component={"span"} sx={lineSpan}></Typography>
        </Box>
        
        <Box>
          <ProfilePage 
            name={userData.first_name + ' ' + userData.last_name}
            department={userData.department}
            role={userData.user_role}
            location={userData.location}
          />
        </Box>

        <Box sx={textAdminBox}>
          {" "}
          <Typography component={"span"} sx={adminText}>
            Accessibility
          </Typography>
          <Typography
            component={"span"}
            sx={{ ...lineSpan, marginLeft: "10px" }}
          >

          </Typography>
        </Box>

      <Box>
        <Accessibility 
          userData={userData} 
          // plantList={plantList}
          rightsList={rightsList}
          setRightsList={setRightsList}
          setSelectedRights={setSelectedRights}
          selectedRights={selectedRights}
          accessibility={accessibility}
          // plantAccess={plantAccess}
          // setPlantAccess={setPlantAccess}
        />
      </Box>

      <Box align="left" marginTop="1rem" marginLeft="3rem" marginBottom="1rem">
        {/* <RedButton
          text="Submit"
          onClickHandler={handleClick}
        />   */}
      </Box>

      <Box align="left" marginLeft={"3rem"}>
        <Link to={"/AdminManagement"} style={{ textDecoration: 'none', color: 'inherit' }}>

        <button style={{ ...buttonbg }}>
          <span style={{ color: "#DA2128", paddingRight: "4px" }}>
            <img src={Arrow} alt="nothing" />
          </span>
          Go Back{" "}
        </button>
        </Link>
      </Box>
   </Box>}

   </>
  )
}
export default AdminCreated