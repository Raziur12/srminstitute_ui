import React from 'react'
import { SmallCards,text1,text2,text3,text4 } from '../../../Styles/Insights/smallCard'
import { Box, Typography, } from '@mui/material'


const SmallCard = ({data}) => {
  const handleDownload = (certificateUrl, certificateTitle) => {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `${certificateTitle}_Certificate.pdf`;
    link.click();
  };
  return (
<>
<Box sx={{ ...SmallCards, background: data.color }}>
   <Typography sx={text1}>{data?.text1}</Typography>
   <Typography sx={text2}>{data?.text2}</Typography>
   {data?.text3 ?   <Typography sx={text3}><img src={data?.text3Icon} alt="Eye Icon" style={{width:"20px"}}/>{data?.text3}</Typography>:" "}
   <Typography sx={{...text4,cursor:"pointer"}} onClick={handleDownload}> <img src={data?.text4Icon} alt="Eye Icon" style={{width:"20px"}} />{data?.text4}</Typography>
</Box>
</>
  )
}

export default SmallCard