import React, { useState,useEffect } from "react";
import "../../Styles/AdminManagement/adminmanagement.css";
import { useNavigate } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material";
import {
  AdminContainerBox,
  modifyText,
  AdminButtonBox,
  SelectGroup,
  buttonbg,
  cellBody,
  tableBox,
  tableStyle,
  bodyBox,
  bodyCell,
  tableData,
  modifyDisplay,
  belowTableTBox,
} from "../../Styles/AdminManagement/AdminStyle";
import HeadingContent from "../smallComponent/HeadingContent";
// import InputSelect from "../smallComponent/InputSelect";
import MainButton from "../smallComponent/MainButton";
import AdminProfiles from "./AdminProfile/AdminProfile";
import ButtonAdmin from "./AdminProfile/ButtonAdmin";
import Image from "../../Assets/icons/Setting.svg";
import { Link } from "react-router-dom";
import axiosInstance from "../../interceptor/axiosInstance";
import Swal from "sweetalert2";


export default function AdminManagement() {
  const navigate = useNavigate()
  const DataFeedback = {
    text: "Admin Management",
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [ newUserList, setNewUserList ] = useState()
  const [ totalItems, setTotalItems ] = useState()
  const [ totalPages, setTotalPages ] = useState()
  const [ currentData, setCurrentData ] = useState()
  const [accessUserId, setAccessUserId] = useState()


  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    if (newUserList && newUserList.length > 0) {
      setTotalItems(newUserList.length);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      setCurrentData(newUserList.slice(startIndex, endIndex));
    }
  }, [newUserList, totalItems, itemsPerPage, startIndex, endIndex]);

  // const addAccessNum = () => {
  //   if (userList && userList.length > 0) {
  //     const list = userList.map((item) => {
  //       const rights = item.rights.length
        
  //       const total = rights + (item.plant_access && 1)
  //       return {accesNum: total, ...item}
  //     })

  //     setNewUserList(list)
  //   }
  // }

  // const sortByAccess = (value) => {
  //   console.log(value)
  //   if (value === "ascending") {
  //     const sorted = newUserList.sort((a, b) => a.accesNum - b.accesNum);
  //     setUserList(sorted)
  //     return
  //   }

  //   if (value === "descending") {
  //     const sorted = newUserList.sort((a, b) => b.accesNum - a.accesNum);
  //     setUserList(sorted)
  //     return
  //   }

  //   addAccessNum()
  // };
 
  // useEffect(() => {
  //   addAccessNum()
  // }, [userList]);

  useEffect(() => {
    axiosInstance
      .get("users/user/")
      .then((res) => {
        const response = res.data.data
      //   const sortedList = response.sort((a, b) => {

      //     const nameA = a.full_name.toLowerCase();
      //     const nameB = b.full_name.toLowerCase();
      
      //     if (nameA < nameB) {
      //         return -1;
      //     }
      //     if (nameA > nameB) {
      //         return 1;
      //     }
      //     return 0;
      // })
        setCurrentData(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const generatePageNumbers = () => {
    const numberOfRows = 10
    const pages = [];

    if (newUserList  && newUserList.length > 0) {
    let pagesToShow = Math.ceil((newUserList.length)/numberOfRows);
    // const pagesToShow = 5; // Show 5 page numbers at a time

    // Calculate start and end page numbers based on the current page
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    // Adjust startPage and endPage to show 5 pages if close to the beginning or end
    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    }

    return pages;
  };




  // const selectData = {
  //   Country: ["India", "America", "Australia", "Africa"],
  //   State: ["India", "America", "Australia", "Africa"],
  //   Plant: ["India", "America", "Australia", "Africa"],
  //   Week: ["India", "America", "Australia", "Africa"],
  //   Time: ["Jan 2019 - Dec 2019", "Another Time Range"], // Example: Modify this according to your needs
  // };

  // const [selectedValues, setSelectedValues] = useState({
  //   SortByAccess: "",
  //   Older: "",
  // });

  // const handleSelectChange = (name, value) => {
  //   setSelectedValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value,
  //   }));
  // };

  // const [switchStates, setSwitchStates] = useState();

  // useEffect(() => {
  //   if (currentData) {
  //     setSwitchStates(Array(currentData.length).fill(false))
  //   }
  // }, [currentData])

  // const toggleSwitch = (index) => {
  //   const updatedSwitchStates = [...switchStates];
  //   updatedSwitchStates[index] = !updatedSwitchStates[index];
  //   setSwitchStates(updatedSwitchStates);
  // };

  const goToUserDetails = (id) => {
    navigate('/Admin/CreateAdmin/Admin', { state: { response: id } });
  }

  useEffect(() => {
    if (accessUserId) {
      const userData = currentData.find(user => user.id === accessUserId)
      const data = {
        active: userData.active
      }
      axiosInstance
        .put(`users/user/${accessUserId}/`, data)
        .then(res => console.log(res))
        .catch(error => console.error(error))
    }
  }, [accessUserId, currentData])

  const toggleUserActive = (id) => {
    setCurrentData((prevData) => {
      const updatedData = prevData.map((user) => {
        if (user.id === id) {
          // Toggle user active state and return updated user object
          const newUserState = { ...user, active: !user.active };
  
          // Determine the message based on the new active state
          const message = newUserState.active ? "This user is now active." : "This user is now inactive.";
  
          // Show the SweetAlert2 popup with the appropriate message
          Swal.fire({
            title: newUserState.active ? 'Activated!' : 'Deactivated!',
            text: message,
            icon: newUserState.active ? 'success' : 'warning',
            confirmButtonText: 'OK'
          });
  
          return newUserState;
        }
        return user;
      });
      return updatedData;
    });
  
    setAccessUserId(id);
  };
  

  return (
    <>
      <Box sx={AdminContainerBox}>
        <HeadingContent data={DataFeedback} />
        <Box sx={AdminButtonBox}>
          <Box sx={SelectGroup}>
          {/* <select 
             className="sort-by-access-select"
             onChange={(e) => sortByAccess(e.target.value)}
          >
            <option 
              value="null" 
              // style={{ ...optionBg }}
            >
              Sort By Access
            </option>
            {["ascending", "descending"].map((item, index) => (
                <option 
                  key={index} 
                  value={item}
                  // style={{ ...optionBg }}
                >
                  {item}
                </option>
            ))}
          </select> */}
            {/* <InputSelect
              data={selectData?.Country}
              name="Older"
              selectedValue={selectedValues.Older}
              onSelectChange={handleSelectChange}
            /> */}
            <MainButton name="Filter" width="123px" height="36px" />
          </Box>
          <Box>
          <Link to={"/Admin/CreateAdmin"}>
          <button style={{ ...buttonbg, cursor: "pointer", ':hover': { backgroundColor: '#DA218' } }}>Create New Admin{" "}
              <span
                style={{ color: "black", paddingLeft: "4px", }}
              >{` + `}</span>
            </button>
            </Link>
          </Box>
        </Box>



{/*  Table is showing here  */}



        <Box sx={tableBox}>
          <table style={tableStyle}>
            
            <thead>
              <tr>
                <th style={{ ...cellBody, width: "250px", paddingTop: "20px" }}>
                  Name
                  <Typography sx={tableData}>
                    {" "}
                    Showing {newUserList && newUserList.length} of {newUserList && newUserList.length} total users
                  </Typography>
                </th>
                <th style={{ ...cellBody, width: "350px", paddingTop: "20px" }}>
                  Access<Typography sx={tableData}>{". "}</Typography>
                </th>
                <th style={{ ...cellBody, width: "250px", paddingTop: "20px" }}>
                  Action <Typography sx={tableData}>{" ."}</Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData && currentData.length > 0 && currentData.map((user, index) => (
                <tr key={index} style={{ ...bodyBox, padding: "60px" }}>

                  <td style={bodyCell}>
                    <AdminProfiles
                      profileImage={user.profile_picture}
                      name={user.first_name + " " + user.last_name}
                      role={user.role}
                      email={user.email}
                    />
                  </td>



                  <td style={{ ...bodyCell }}>
                    {user.access && user.access.find(item => item.name === "Admin") && <ButtonAdmin position={"admin"} />}
                    {user.access && user.access.find(item => item.name === "Analytics") && <ButtonAdmin position={"analytic"} />}
                    {user.access && user.access.find(item => item.name === "Assign") && <ButtonAdmin position={"assign"} />}
                    {user.access && user.access.find(item => item.name === "Create")&& <ButtonAdmin position={"create"} />}
                    {user.access && user.access.find(item => item.name === "Creator") && <ButtonAdmin position={"creator"} />}
                    {user.access && user.access.find(item => item.name === "Approve") && <ButtonAdmin position={"approve"} />}
                    {user.plant_access && user.plant_access.length > 0 && <ButtonAdmin position={"plant"} />}
                  </td>



                  <td style={{ ...bodyCell }}>
                    <Box sx={modifyDisplay}>

                    <div onClick={() => goToUserDetails(user.id)} style={{ textDecoration: 'none', color: 'inherit', cursor: "pointer" }}>
                      <Typography component={"span"} sx={modifyText}>
                        <span style={{ marginRight: "4px", paddingTop: "1px" }}>
                          <img src={Image} alt={"nothing"} />
                        </span>
                        Modify
                      </Typography>
                    </div>

                    <div onClick={() => toggleUserActive(user.id)} className="switch">
                          <input
                            type="checkbox"
                            value={user.active}
                            checked={user.active}
                            onChange={() => null}
                          />
                          <span className="slider"></span>
                        </div>
                    </Box>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              ...modifyDisplay,
              ...belowTableTBox,
              justifyContent: "space-between",
              marginTop: "2rem",
            }}
          >
            <Typography
              sx={{ ...tableData, marginLeft: 2, background: "none" }}
            >
              {" "}
              Showing {currentData && currentData.length} of {newUserList && newUserList.length} total users
            </Typography>
            <Box>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ color: "black" }}
                disabled={currentPage === 1}
              >
                {`<`}
              </Button>
              {generatePageNumbers().map((pageNumber, index) => (
                <span
                  key={index}
                  onClick={() => handlePageChange(pageNumber)}
                  style={{
                    cursor: "pointer",
                    margin: "0 5px",
                    fontWeight:
                      pageNumber === currentPage ? "bolder" : "normal",
                    color: pageNumber === currentPage ? "red" : "blue",
                  }}
                >
                  {pageNumber}
                </span>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ color: "#9D9FA2", fontSize: "15px" }}
                disabled={endIndex >= (newUserList && newUserList.length)}
              >
                {`>`}
              </Button>
            </Box>
          </div>
        </Box>
      </Box>
    </>
  );
}
