import React from 'react'
import { iconSearchMessage, ProfileText1,ProfileText2,imageProfileBox} from '../../../Styles/AdminManagement/AdminStyle'
import placeholder from "../../../Assets/placeHolder/profilePlaceHolder.png"
import { Box,Typography } from '@mui/material';

const AdminProfiles = ({ name, role, profileImage, email}) => {
  const image = profileImage || placeholder

  return (
    <>
    <Box sx={iconSearchMessage}>
    <Typography color={"white"} sx={imageProfileBox}>
      <img 
        src={image} 
        style={{ width: "50px",cursor:"pointer" }} 
        alt="logo" 
      />
    </Typography>
    <Box color={"white"} marginLeft={2}>

      <Typography sx={ProfileText1}>
        {name}
      </Typography> 

      <Typography sx={ProfileText2} align="left">
        {role}
      </Typography>

      <Typography sx={ProfileText2} align="left">
        {email}
      </Typography>

    </Box>
    
    </Box>
    </>
  )
}

export default AdminProfiles