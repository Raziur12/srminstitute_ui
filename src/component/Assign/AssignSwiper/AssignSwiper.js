import React from 'react';
import {
  contentBoxSwiper,
  assignPersonText,
  assignPersonTextHover
} from "../../../Styles/Assign/AssignStyle";
import Person from "../../../Assets/assign/person.svg";
import { Box, Typography } from '@mui/material';

const AssignSwiper = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "transparent",
          boxSizing: "border-box",
          padding: "30px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          // For Firefox
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              ...contentBoxSwiper,
         
             
            }}
          >
            <img src={Person} alt="person" />
            <Typography sx={assignPersonText}>Director Hot Works Department</Typography>
          </Box>
        ))}
      </div>
    </>
  );
}

export default AssignSwiper;
