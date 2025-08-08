import React, { useEffect, useState } from "react";
// import cardicon from "../../../assets/course-page-icons/image 122.png";

import axiosInstance from "../../../interceptor/axiosInstance";
import UserDashboard from "../UserDashboard";
// import studenticon from "../../../assets/dashboardimg/book.png";
// import sessionsicon from "../../../assets/dashboardimg/teacher.png";


const UserMainDashboard = ( {userData} ) => {

// const userid = localStorage.getItem('user_id');

const userid = userData.account_data?.id
console.log(userid)
const [cardData, setCardData] = useState([]);
const [tableLastAttmpt, setTableLastAttmpt] = useState(null);


  useEffect(() => {
    axiosInstance.get(`individual_analytics/users/${userid}/`)
      .then(response => {
        setCardData(response.data);
        // console.log(response.data.data.series_progress);
      })
      .catch(error => {
        console.error('Error fetching item analytics:', error);
      });
  }, [userid]); 


  useEffect(() => {
    axiosInstance.get(`individual_analytics/users/${userid}/`)
      .then(response => {
        setTableLastAttmpt(response.data);
        // console.log(response.data.data.series_progress);
      })
      .catch(error => {
        console.error('Error fetching item analytics:', error);
      });
  }, [userid]); 


  return (
    
        <UserDashboard
        cardData={cardData} 
        // leadetTabeldata={leadetTabeldata}
        lastTableAttmpt ={tableLastAttmpt}
        />
  );
};

export default UserMainDashboard;
