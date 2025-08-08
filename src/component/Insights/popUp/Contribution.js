import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../../interceptor/axiosInstance";
import peopleIcon from "../../../Assets/icons/people.svg"
import pressentorIcon from "../../../Assets/icons/presentor.svg"
import clockyIcon from "../../../Assets/icons/clocky.svg"
import "../../../Styles/Insights/Contribution.css"

const Contribution = ({ setPopUpFormVisible, id }) => {
    const [userData, setUserData] = useState();

    useEffect(() => {
        axiosInstance
            .get(`analytics/learning-path/${id}`)
            .then(res => {
                setUserData(res.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [id])
  
    return (
    <>
        {userData &&
        <div className='contribution-main-div'>
    
            <div 
                onClick={() => setPopUpFormVisible(false)}
                className='cross-icon'>
                <RxCross2 />
            </div>
        
            <p className='page-title'>{userData.name}'s Contribution</p>

            <div className="contribution-div">
                
                <div className='main-data'>
                    <img src={peopleIcon} className='icon' alt='icoon' />
                    <p className='text'>
                        <span>{userData.contribution.people_trained}</span>
                        People trained
                    </p>
                </div>
                <div className='main-data'>
                    <img src={pressentorIcon} className='icon' alt='icoon' />
                    <p className='text'>
                        <span>{userData.contribution.total_sessions}</span>
                        Number of sessions conducted
                    </p>
                </div>
                <div className='main-data'>
                    <img src={clockyIcon} className='icon' alt='icoon' />
                    <p className='text'>
                        <span>{userData.contribution.time_in_mins}</span>
                        Mins of training given
                    </p>
                </div>
            </div>

            <p className='page-title'>Training Recieved</p>

            <table>
                <thead>
                    <th>Topic</th>
                    <th>Data</th>
                    <th>Location</th>
                </thead>
                <tbody>
                    {userData.training_received.map((item, index) => (
                    <tr key={index}>
                        <td>{item.course_name}</td>
                        <td>{item.date}</td>
                        <td>{item.location}</td>
                    </tr>
                    ))}
                    {/* <tr>{userData.training_received.data}</tr>
                    <tr>{userData.training_received.location}</tr> */}
                </tbody>
            </table>

        </div>}
    </>
    );
  };
  
  export default Contribution;