import { Box } from "@mui/material";
import React  from "react";
// import InputSelect from "../../smallComponent/InputSelect";
import {
  // inputDetailBox,
  // inputDetailText,
  labelBox,
  // plantext,
  accesContainer
} from "../../../Styles/AdminManagement/CreateAdminStyle";
import axiosInstance from "../../../interceptor/axiosInstance";
import Swal from "sweetalert2";
// import { selectStyles, optionBg } from '../../../Styles/HeadingStyle/InputSelectStyle';
// import CrossImage from "../../../Assets/icons/cross.svg"

export default function Accessibility({ 
  plantList,
  setRightsList,
  rightsList,
  selectedRights,
  setSelectedRights,
  plantAccess,
  setPlantAccess,
  accessibility,
  userData
  }) {
  // const [ plantNames, setPlantNames ] = useState()



  // console.log(plantNames)

  // useEffect(() => {
  //   if (plantList && plantAccess) {
  //     const plants = plantList.filter(item => plantAccess.includes(item.id));
  //     setPlantNames(plants);
  //   }    
  // }, [plantAccess, plantList])

  const fetchRights = () => {
    axiosInstance
    .get(`users/user/${userData.id}/`)
    .then((res) => {
      const response = res.data.data
      // setUserData(response)
      setSelectedRights(response.access)
      setRightsList(response.access)
      // setPlantAccess(response.plant_access)
    })
    .catch((err) => {
      console.error(err)
    })
  }
 const handleCheckBoxChange = (item) => {
  // Check if the item is already in the rightsList
  if (rightsList.find(findItem => findItem.name === item.name)) {
    // If found, perform a DELETE request
    const deleteRequest = rightsList.find(findItem => findItem.name === item.name);
    axiosInstance.delete(`users/userightsmapping/${deleteRequest.id}/`)
      .then(() => {
        // Display SweetAlert2 success message
        Swal.fire(
          'Deleted!',
          'The right has been removed.',
          'success'
        );
        // Set a timeout for 500 milliseconds before running fetchRights
        setTimeout(() => {
          fetchRights();
          // After calling fetchRights, set another timeout to show the loader after 500 milliseconds
        }, 800);
      })
      .catch(error => {
        console.error('Error during API call', error);
        // Display SweetAlert2 error message
        Swal.fire(
          'Failed!',
          'There was a problem removing the right. Please try again.',
          'error'
        );
      });    
  } else if (!rightsList.find(findItem => findItem.name === item.name)) {
    // If not found, construct the data payload for a POST request
    const data = {
      right: item.id,
      user: userData.id,
    };
    // Perform a POST request
    axiosInstance.post(`users/userightsmapping/`, data)
      .then(() => {
        // Log the data for debug purpose; consider removing for production
        console.log(data);
        // Display SweetAlert2 success message
        Swal.fire(
          'Added!',
          'The right has been successfully assigned.',
          'success'
        );
        // Refresh the page upon successful completion
        fetchRights();
      })
      .catch(error => {
        console.error('Error during API call', error);
        // Display SweetAlert2 error message
        Swal.fire(
          'Failed!',
          'There was a problem assigning the right. Please try again.',
          'error'
        );
      });
  }
};

  

  // const handlePlantAccessArray = (id) => {
  //   if (id && !plantAccess.includes(id)) {
  //     setPlantAccess(prev => [...prev, parseInt(id)])
  //   }
  // }
  // const handleRemovePlantAccess=(id)=>{
  //   setPlantAccess(prev => prev.filter(item => item !== id))
  // }

  return (
    <>
      <Box sx={accesContainer}>
        <Box display="flex" alignItems="center">
          {accessibility.map((item, id) => (
            <div key={id}>
              <input
                style={{
                  marginRight: '5px',
                }}
                id={`CheckBox-${id}`}
                type="checkbox"
                checked={rightsList.find(findItem => findItem.name === item.name)}
                onChange={() => handleCheckBoxChange(item)}
              />
              <label
                htmlFor={`CheckBox-${id}`}
                style={{
                  ...labelBox,
                  lineHeight: '43.75px',
                }}
              >
                {item.name}
              </label>
            </div>
          ))}
      </Box>
    
        {/* <Box align="left" sx={inputDetailBox}>
          {" "}
          <Typography sx={inputDetailText} component={"span"}>
            {" "}
            Plant Access:
          </Typography>
          <Typography marginTop={1}>
            <select 
              name="Plant" 
              style={{ ...selectStyles }} 
              onChange={e => handlePlantAccessArray(e.target.value)}
            >
              <option default value="" style={{ ...optionBg }}>Plant</option>
              {plantList?.map((item, index) => (
                    <option 
                      key={index} 
                      value={item.id}
                      style={{ ...optionBg }}
                    >
                      {item.plant}
                    </option>
                ))}
            </select>
          </Typography>
        </Box> */}
        {/* <Box align="left" sx={inputDetailBox}>
          {plantNames?.map((item, index)=>(
            <Box key={index} display="flex" flexDirection="row" marginRight={"1rem"}>

              <Typography component={"span"} key={index} sx={plantext} >
                {item.plant}
              </Typography> 

              <Typography component={"span"} onClick={()=>handleRemovePlantAccess(item.id)}>
                <img
                  src={CrossImage}
                  style={{ marginLeft:"-1rem"}}
                  alt="Cross"
                />
              </Typography>

            </Box>
          ))}
        </Box> */}
       
      </Box>
    </>
  );
}
