import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  AssignBoxContainers,
  imageBox,
  imageBoxText,
  formRow,
  formColumn,
  contentText,
  // formChild,
  } from "../../../Styles/Assign/AssignBoxStyle";
import axiosInstance from "../../../interceptor/axiosInstance";
import RedButton from "../../../globalComponents/redButton/RedButton"
// import Image from "../../../Assets/assign/bg.png";
import "../../../Styles/Assign/AssignBox.css"
import Swal from 'sweetalert2';

const AssignBox = ({ 
  courseImage,
  coursedescription,
  data, 
  options, 
  handleOptionChange, 
  assignId,
  courseId,
  newId,
  index,
  fetchAssign,
  courseName, 
  trainingValue, 
  userId,
  assignList,
  assessmentValue, 
  checklistValue, 
  guidebookValue, 
  handleDaysSelection  }) => {
    const [ loader, setLoader ] = useState(false)
  // const [ selectedOptions, setSelectedOptions] = useState({
  //   training: (currentCardData? (currentCardData.training) : null),
  //   assignment: (currentCardData? (currentCardData.assignment) : null),
  //   guidebook: (currentCardData? (currentCardData.guidebook) : null),
  //   checklist: (currentCardData? (currentCardData.checklist) : null),
  //   user: 2,
  //   course: courseId
  // });

  // useEffect(() => {
  //   console.log(data.assignment)
  // }, [assignCardData])

  // useEffect(() => {
  //   if(currentCardData) {
  //     handleOptionChange('training', currentCardData.training)
  //     handleOptionChange('assignment', currentCardData.assignment)
  //     handleOptionChange('guidebook', currentCardData.guidebook)
  //     handleOptionChange('checklist', currentCardData.checklist)
  //   }
  // }, [currentCardData])

  // const postData = () => {
  //   setLoader(true)
  //   const sendData = {
  //     // assignment: data.assignment,
  //     // training: data.training,
  //     // checklist: data.checklist,
  //     // guidebook: data.guidebook,
  //     // refresher_days: data.refresher_days,
  //     user: data.user,
  //     series: data.course,
  //   }

  //   console.log(sendData)

  //   if(!data) {
  //     console.log("1")
  //     // axiosInstance
  //     //   .post("assign/user-assign/", sendData)
  //     //   .then(res => {
  //     //     console.log(res)
  //     //   })
  //     //   .catch(error => {
  //     //     console.error(error)
  //     //   })
  //   } else if (data && !data.newId) {
  //     console.log("2")
  //     axiosInstance
  //       .patch(`assign/user-assign/${data.id}/`, sendData)
  //       .then(res => {
  //         console.log(res)
  //       })
  //       .catch(error => {
  //         console.error(error)
  //       })
  //       .finally(() => {
  //         setLoader(false)
  //       })
  //   } else if (data && data.newId) {
  //     console.log("3")
  //     const postData =  {
  //       assignment: data.assignment,
  //       training: data.training,
  //       checklist: data.checklist,
  //       guidebook: data.guidebook,
  //       refresher_days: data.refresher_days,
  //       user: data.user,
  //       course: data.course,
  //     }

  //     console.log(postData)

  //     axiosInstance
  //       .post("assign/user-assign/", postData)
  //       .then(res => {
  //         console.log(res)
  //         fetchAssign()
  //       })
  //       .catch(error => {
  //         console.error(error)
  //       })
  //       .finally(() => {
  //         setLoader(false)
  //       })
  //   }
  // }

const postData = () => {
  setLoader(true)
  const sendData = {
    user: userId,
    series: assignList[index],
  } 
  axiosInstance
    .post("assign/series/", sendData)
    .then(res => {
      // Check if the response indicates success
      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User has been assigned the series.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User already has been assigned this series.',
        });
      }
    })
    .catch(error => {
      console.error(error)
      // Show error popup
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your request.',
      });
    })
    .finally(() => {
      setLoader(false)
    });
}


  return (
    <>
      <Box sx={AssignBoxContainers}>
        <Box sx={{ ...imageBox, backgroundImage: `url(${courseImage})` }}>
        </Box>
      
        {/* Training Module */}
        <Typography sx={imageBoxText}>{courseName}</Typography>
        <Typography style={{color: "#fff"}}>{coursedescription}</Typography>
        <Box sx={{ ...formRow }} marginTop="1rem">

          <Box sx={contentText} width="30%" align="right">
          Assign
          </Box>
          <Box sx={formRow} width="70%">
            {options.map((option) => (
              <Box key={option} sx={formColumn}>
                <div 
                  className="checkbox-outer" 
                  onClick={() => handleOptionChange(index, courseId)}
                >
                  {assignList[index] &&
                  <div className="checkbox-inner"></div>}
                </div>
                {/* <label
                  onClick={() => handleOptionChange('training', option, assignId, courseId, newId)}
                  style={{ ...formChild, marginTop: "0.4rem", textTransform: "capitalize" }}
                >
                  {option}
                </label> */}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Assessment */}
        {/* <Box sx={{ ...formRow }} marginTop="1rem">
          <Box sx={contentText} width="30%" align="right">
            Assessment:
          </Box>
          <Box sx={formRow} width="70%">
            {options.map((option) => (
              <Box key={option} sx={formColumn}>
                <div 
                  className="checkbox-outer" 
                  onClick={() => handleOptionChange('assignment', option, assignId, courseId, newId)}
                >
                  {option === assessmentValue &&
                  <div className="checkbox-inner"></div>}
                </div>
                <label
                  onClick={() => handleOptionChange('assignment', option, assignId, courseId, newId)}
                  style={{ ...formChild, marginTop: "0.4rem", textTransform: "capitalize" }}
                >
                  {option}
                </label>
              </Box>
            ))}
          </Box>
        </Box> */}

        {/* Guidebook */}
        {/* <Box sx={{ ...formRow }} marginTop="1rem">
          <Box sx={contentText} width="30%" align="right">
            Guidebook:
          </Box>
          <Box sx={formRow} width="70%">
            {options.map((option) => (
              <Box key={option} sx={formColumn}>
                <div 
                  className="checkbox-outer" 
                  onClick={() => handleOptionChange('guidebook', option, assignId, courseId, newId)}
                >
                  {option === guidebookValue &&
                  <div className="checkbox-inner"></div>}
                </div>
                <label
                  onClick={() => handleOptionChange('guidebook', option, assignId, courseId, newId)}
                  style={{ ...formChild, marginTop: "0.4rem", textTransform: "capitalize" }}
                >
                  {option}
                </label>
              </Box>
            ))}
          </Box>
        </Box> */}

        {/* Checklist */}
        {/* <Box sx={{ ...formRow }} marginTop="1rem">
          <Box sx={contentText} width="30%" align="right">
            Checklist:
          </Box>
          <Box sx={formRow} width="70%">
          {options.map((option) => (
              <Box key={option} sx={formColumn}>
                <div 
                  className="checkbox-outer" 
                  onClick={() => handleOptionChange('checklist', option, assignId, courseId, newId)}
                >
                  {option === checklistValue &&
                  <div className="checkbox-inner"></div>}
                </div>
                <label
                  onClick={() => handleOptionChange('checklist', option, assignId, courseId, newId)}
                  style={{ ...formChild, marginTop: "0.4rem", textTransform: "capitalize" }}
                >
                  {option}
                </label>
              </Box>
            ))}
          </Box>
        </Box> */}

        {/* <Box marginTop={"1rem"}>
          <select
            className="month-selector-custom" 
            // style={{ ...selectStyles }}
            onChange={(e) => handleDaysSelection(e.target.value*30, assignId, courseId, newId)} 
          >
            <option 
            value="" 
            // style={{ ...optionBg }}
            >{data && data.refresher_date? data.refresher_date : "Refresher Date"}</option>
            {[...Array(12).keys()].map((_, id) => (
              <option
                value={id + 1}
                key={id}
              >
                {id + 1} Month{(id + 1 > 1) && "'s"}
              </option>
            ))}
          </select>
        </Box> */}

        <Box sx={{ 
            width: "100%", 
            height: "4rem", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "flex-end" 
            }}
        >
          <RedButton loading={loader} text="Save" onClickHandler={postData}/>
        </Box>
      </Box>
    </>
  );
};

export default AssignBox;


// const filterred = array.filter(item => item.role.toLowerCase() === "admin")
// setArray(filterred)