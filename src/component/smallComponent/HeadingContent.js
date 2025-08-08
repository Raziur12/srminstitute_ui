import { Box, Typography } from '@mui/material'
import React from 'react'
import { headingBox,nameBox,textHeader,texthead } from '../../Styles/HeadingStyle/HeadingStyle'
import LineImage from "../../Assets/Line.svg"

function HeadingContent({data}) {
  return (
   <Box sx={headingBox}> 
    <Box sx={nameBox}>

      <Typography sx={textHeader}>
        {data.text}
      </Typography>

      <Typography>
        <img src={LineImage} alt='LineImage' />
      </Typography>

   </Box>
    <Typography sx={texthead}>
      {data.textsmall}
    </Typography>
   </Box>
  )
}

export default HeadingContent