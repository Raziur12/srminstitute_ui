import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import "../../../Styles/Insights/ContentBox.css";
import {
  cellBoderStyle,
  ORBOx,
  cellStyle,
  tableStyle,
  headerText,
  // ButtonBox,
  // buttonStyle,
  lineSpan,
  lineSpantext,
  // searchText,
  // toText,
} from "../../../Styles/Insights/ContentBoxStyle";


const ComptancyTable = ({rowData = [], color, reference}) => {

    const [selectedValue, setSelectedValue] = useState('');

    const boxStyles = {
        width: "40%",
        height: "30rem",
        overflow: "scroll", 
        flexShrink: 0,
        borderRadius: "62.564px",
        borderLeft: "1px solid white",    
        borderRight: "1px solid white",  
        borderBottom: "1px solid white",
        borderTop:   color,
        boxShadow: "0px 6.417px 19.25px 0px rgba(0, 0, 0, 0.25)",
        paddingBottom: "2rem",
        paddingTop: "2rem",
        marginTop: "2rem",
        transition: "overflow-y 0.3s",

        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none" // For Internet Explorer and Edge
      };

      const handleUserChange = (event) => {
        setSelectedValue(event.target.value);
      };
      
  return (
    <>
        <Box sx={boxStyles}>
        <Typography sx={headerText}>{reference}</Typography>

       {/* Dropdown to select filtter competency*/}
       {/* <select className="contentbox-user-dropdown" onChange={handleUserChange} value={selectedValue}>
     <option value="">Select an option</option>
     <option value="secanrio">Secanrio</option>
     <option value="role">Role Play</option>
     <option value="case">Case Study</option>
     <option value="games">Games</option>
       </select> */}

       {/* <Box sx={ORBOx}>
          <span style={{ ...lineSpan }}></span>
          <span style={{ ...lineSpantext }}>or</span>
          <span style={{ ...lineSpan }}></span>
        </Box>{" "} */}

        <Box>
        <table style={{ ...tableStyle, borderBottom: "1px Dotted white" }}>
        <thead>
          <tr>
            {/* <th style={cellStyle}>ID</th> */}
            <th style={cellStyle}>Competancy Name</th>
            {/* <th style={cellStyle}>Assessment</th>
            <th style={cellStyle}>Checklist</th>
            <th style={cellStyle}>GuideBook</th>
            <th style={cellStyle}>Case Study</th> */}
            <th style={{ ...cellStyle, borderRight: "none" }}>Number of Attempts</th>
          </tr>
        </thead>
        <tbody>
          {/* Filter rowData based on selected user */}
          {rowData
              .map((row, index) => (
                <tr key={index}>
                  {/* <td style={cellBoderStyle}>{row.id}</td> */}
                  <td style={cellBoderStyle}>{row.competency_name}
                  </td>
                  {/* <td style={cellBoderStyle}>{row.assessment}</td>
                  <td style={cellBoderStyle}>{row.checklist}</td>
                  <td style={cellBoderStyle}>{row.guideBook}</td>
                  <td style={cellBoderStyle}>{row.caseStudy}</td> */}
                  <td style={{ ...cellBoderStyle, borderRight: "none" }}>{row.sopDocument}</td>
                </tr>
              ))}
        </tbody>
      </table>
      </Box>
      {/* <Typography className="download-text" onClick={handleDownload}>
        <img src={DownloadIcon} alt="Download" />
        Download Report
      </Typography> */}
    </Box>
    </>
  )
}

export default ComptancyTable
