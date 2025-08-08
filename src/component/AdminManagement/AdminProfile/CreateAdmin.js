import React, { useEffect, useState } from "react";
import {
  CreateAdminContainerBox,
  adminText,
  lineSpan,
  textAdminBox,
  inputFeedback,
  lineSpantext,
  lineSpans,
  ORBOx,
  buttonbg,
  FormBox,
} from "../../../Styles/AdminManagement/CreateAdminStyle";
import { selectStyles, optionBg } from "../../../Styles/HeadingStyle/InputSelectStyle";
import { Box, Typography } from "@mui/material";
import HeadingContent from "../../smallComponent/HeadingContent";
// import InputSelect from "../../smallComponent/InputSelect";
import MainButton from "../../smallComponent/MainButton";
import Arrow from "../../../Assets/icons/Arrow.svg";
import ProfilePage from "../../smallComponent/ProfilePage";
// import Accessibility from "./Accessibility";
import { Link } from "react-router-dom";
import axiosInstance from "../../../interceptor/axiosInstance";
import swal from 'sweetalert';



function CreateAdmin() {
  const [open, setOpen] = useState(false);
  const [ userList, setUserList ] = useState([])
  const [ selectedValue, setSelectedValue ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ firstName, setFirstName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ userId, setUserId ] = useState()
  const [ userData, setUserData ] = useState(null)
  const [ apiChanges, setApiChanges ] = useState()
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');


  const DataFeedback = {
    text: " Create an Admin ",
  };

  useEffect(() => {
    if (userData) {
      setApiChanges({
        AdminManagement: (userData.rights.includes(1)),
        AssignManagement: (userData.rights.includes(2)),
      })
    }
  }, [ userData])

  useEffect(() => {
  }, [selectedValue])

  useEffect(() => {
    if (userList) {
      setLoading(false)
    }
  }, [userList])

  // const department = [
  //   "operations",
  //   "development",
  //   "design"
  // ]

  //Call User Role APi here----------
  useEffect(() => {
    axiosInstance
      .get("orgss/role/")
      .then((res) => {
        const response = res.data.data
        setRole(response)
      })
  }, [])

  useEffect(() => {
    axiosInstance
      .get("users/user/")
      .then((res) => {
        const response = res.data.data
        setUserList(response)
      })
  }, [])

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`users/user/${userId}/`)
        .then(res => {
          setUserData(res.data.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [userId])

  const handleClickOpen = () => {
    setOpen(true);
    const adminDetail = { user_role: "admin" };
    
    const createUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      user_role: "admin",
      role: selectedRole,
    };
  
    if (firstName && lastName && email && selectedRole) {
      axiosInstance
        .post("users/user/", createUser)
        .then((res) => {
          setUserId(res.data.data.id);
          swal("Success!", "User created successfully!", "success");
        })
        .catch((error) => {
          swal("Error!", "There was an issue creating the user.", "error");
        });
  
      return;
    }
  
    if (selectedValue) {
      axiosInstance
        .put(`users/user/${selectedValue}/`, adminDetail)
        .then((res) => {
          swal("Success!", "User role updated successfully!", "success");
        })
        .catch((error) => {
          console.error(error);
          swal("Error!", "There was an issue updating the user role.", "error");
        });
  
      return;
    }
  
    if (!(firstName && lastName && email)) {
      swal("Warning!", "Please fill in all required fields.", "warning");
    }
  };
  




  const handleDepartmentSelect = (event) => {
    const { value } = event.target;
    setSelectedRole(value);
  }

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValue(value);
  };

  const handleClick = () => {
    if (apiChanges) {
      const data = {
        ...(apiChanges.AdminManagement && {rights: 2}),
        ...(apiChanges.AssignManagement && {rights: 1}),
        ...(apiChanges.AssignManagement && apiChanges.AdminManagement && {rights: "1,2"}),
      }
      axiosInstance
        .patch(`accounts/api/users/${userId}/`, data)
        .catch((error) => {
          console.error(error)
        })
    } 
  }

  return (
    <Box sx={CreateAdminContainerBox}>

    {!loading &&
    <>
      <HeadingContent data={DataFeedback} />

      <Box sx={textAdminBox}>
        {" "}
        <Typography component={"span"} sx={adminText}>
          Admin Details
        </Typography>
        <Typography component={"span"} sx={lineSpan}></Typography>
      </Box>

      <Box sx={textAdminBox}>
        <Box sx={{ ...textAdminBox, marginLeft: "3rem", marginTop: "3rem" }}>
          {/* <InputSelect
            // data={userList}
            name="Select_Employee"
            selectedValue={selectedValues.SortByAccess}
            onSelectChange={handleSelectChange}
            onChange={handleChange}
          /> */}
          <div>
            <select value={selectedValue} style={{ ...selectStyles }} onChange={handleChange}>
              <option style={{ ...optionBg }} value="">User List</option>
              {userList.map((item, index) => (
                <option style={{ ...optionBg }} key={index} value={item.id}>
                  {item.first_name + ' ' + item.last_name}
                </option>
              ))}
            </select>
          </div>


          <Box sx={ORBOx}>
            <span style={{ ...lineSpans }}></span>
            <span style={{ ...lineSpantext }}>OR</span>
            <span style={{ ...lineSpans }}></span>
          </Box>{" "}
        </Box>


        <Box style={FormBox}>

          <input
            style={{
              ...inputFeedback, // Add padding as needed
              // Add any additional styles you need
            }}
            type="text" // You can adjust the input type as needed
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />{" "}

<input
            style={{
              ...inputFeedback, // Add padding as needed
              marginTop: "0.2rem"
              // Add any additional styles you need
            }}
            type="text" // You can adjust the input type as needed
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />{" "}

{/* <Box marginTop={1}>
          <div>
              <select value={selecteduserRole} style={{ ...selectStyles }} onChange={handleDepartmentSelect}>
              <option style={{ ...optionBg }} value="admin">Select User Role</option>
              <option style={{ ...optionBg }} value="admin">Admin</option>
              <option style={{ ...optionBg }} value="user">User</option>
              </select>
            </div>

            </Box> */}

          <Box marginTop={0.6}>

            {/* <InputSelect
              data={selectData?.Country}
              name="Department"
              // selectedValue={selectedValues.SortByAccess}
              // onSelectChange={handleSelectChange}
            /> */}

            <div>
  <select value={selectedRole} style={{ ...selectStyles }} onChange={handleDepartmentSelect}>
    <option style={{ ...optionBg }} value="">Select Role</option>
    {role.map((item, index) => ( // Assume `roles` is the array you want to map over
      <option style={{ ...optionBg }} key={index} value={item.id}>
        {item.name}
      </option>
    ))}
  </select>
</div>


          </Box>

          <input
            style={{
              ...inputFeedback, // Add padding as needed
              marginTop:".6rem"// Add any additional styles you need
            }}
            type="text" // You can adjust the input type as needed
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}




          <Typography marginTop={".7rem"} onClick={() => {
            handleClickOpen();
          }}>

          <MainButton
            name="submit"
            width="143px"
            height="36px"
            setOpen={setOpen}
            onClick={() => {
              handleClickOpen();
            }}
          />

          </Typography>
     
        </Box>
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

      {open && userData && 
        <Box sx={{ marginTop: "2rem" }}>
          <Box sx={textAdminBox}>
            {" "}
            <Typography component={"span"} sx={adminText}>
              Accessibility
            </Typography>
            <Typography
              component={"span"}
              sx={{ ...lineSpan, marginLeft: "10px" }}
            ></Typography>
          </Box>
          
          <Box>
            <ProfilePage 
              name={userData.full_name} 
              designation={userData.designation}
              department={userData.department}
              location={userData.location}
            />
          </Box>

          {/* <Box>
            <Accessibility userData={userData} apiChanges={apiChanges} setApiChanges={setApiChanges}/>
          </Box> */}

          <Box align="left" marginLeft={"3rem"} marginTop={"2rem"}>
            <MainButton onClick={handleClick} name="Save & Submit" width="215px" height="46px" />
          </Box>
          <Box align="left" marginLeft={"3rem"} marginTop={"2rem"}>
         
            <button style={{ ...buttonbg }}>
              <span style={{ color: "#DA2128", paddingRight: "4px" }}>
                <img src={Arrow} alt="nothing" />
              </span>
              Go Back{" "}
            </button>
          </Box>
        </Box>}

      </>}

    </Box>
  );
}

export default CreateAdmin;