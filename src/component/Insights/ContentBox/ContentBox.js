import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import DownloadIcon from "../../../Assets/Insight/downloadIcon.svg";
import "../../../Styles/Insights/ContentBox.css";
import {
  cellBoderStyle,
  cellStyle,
  tableStyle,
  headerText,
} from "../../../Styles/Insights/ContentBoxStyle";
import axiosInstance from "../../../interceptor/axiosInstance";

const ContentBox = ({ rowData = [], color, reference }) => { // Add default value for rowData

  const boxStyles = {
    width: "40%",
    height: "auto",
    flexShrink: 0,
    borderRadius: "62.564px",
    borderLeft: "1px solid white",    
    borderRight: "1px solid white",  
    borderBottom: "1px solid white",
    borderTop: color,
    boxShadow: "0px 6.417px 19.25px 0px rgba(0, 0, 0, 0.25)",
    paddingBottom: "2rem",
    paddingTop: "2rem",
    marginTop: "2rem",
  };

  const [selectedUser, setSelectedUser] = useState(""); // State to track selected user
  const [competencyTableData, setCompetencyTableData] = useState([]);
  const [subOrgList, setSubOrgList] = useState([]);
  const [selectedSubOrg, setSelectedSubOrg] = useState("");

  useEffect(() => {
    axiosInstance.get('orgss/suborg/')
      .then((res) => {
        const response = res.data;
        setSubOrgList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubOrgChange = (event) => {
    const selectedSuborg = event.target.value;
    setSelectedSubOrg(selectedSuborg);
    setSelectedUser("");
    setCompetencyTableData([]); // Clear competency data when sub-org changes
  };

  const handleUserChange = (event) => {
    const selectedCompetencyId = event.target.value;
    setSelectedUser(selectedCompetencyId);

    if (selectedCompetencyId && selectedSubOrg) {
      axiosInstance
        .get(`sean/leaderboard/?competency_id=${selectedCompetencyId}&suborg_id=${selectedSubOrg}`)
        .then((res) => {
          const response = res.data;
          setCompetencyTableData(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      <Box sx={boxStyles}>
        <Typography sx={headerText}>{reference}</Typography>

        {/* Dropdown to select sub-org */}
        <select className="contentbox-user-dropdown" onChange={handleSubOrgChange} value={selectedSubOrg}>
          <option value="">Select a Suborg</option>
          {subOrgList.map((subOrg, index) => (
            <option key={index} value={subOrg.id}>
              {subOrg.name}
            </option>
          ))}
        </select>

        {/* Dropdown to select competency */}
        <select className="contentbox-user-dropdown" onChange={handleUserChange} value={selectedUser} disabled={!selectedSubOrg}>
          <option value="">Select an Option</option>
          {rowData.map((row, index) => (
            <option key={index} value={row.id}>
              {row.competency_name}
            </option>
          ))}
        </select>

        <Box>
          <table style={{ ...tableStyle, borderBottom: "1px dotted white" }}>
            <thead>
              <tr>
                <th style={cellStyle}>Name</th>
                <th style={cellStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              {competencyTableData && competencyTableData.length > 0 ? (
                competencyTableData.map((row, index) => (
                  <tr key={index}>
                    <td style={cellBoderStyle}>{row.name}</td>
                    <td style={cellBoderStyle}>{row.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={cellBoderStyle}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Box>
    </>
  );
};

export default ContentBox;
