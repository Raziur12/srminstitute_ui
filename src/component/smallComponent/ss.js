import React from 'react'
import { useUserContext } from '../../../globalComponents/userContext/UserContext'
import PinnedTitleHead from '../../../globalComponents/pinnedTitleHead/PinnedTitleHead'
import profilePlaceHolder from "../../../assets/delete/profilePlaceHolder.png"
import roundRedAnimation from "../../../assets/animated/round-animation.svg"
import invertedTriangle from "../../../assets/icons/inverted-triangle.svg"
import peopleIcon from "../../../assets/icons/people.svg"
import pressentorIcon from "../../../assets/icons/presentor.svg"
import clockyIcon from "../../../assets/icons/clocky.svg"
import samplePdf from "../../../assets/delete/sampleCertificate.pdf"
import UserDataCard from '../../../globalComponents/UserDataCard/UserDataCard'
import arrowLeft from "../../../assets/icons/arrow-left.svg"
import "../../../styles/Home/components/LearningPathMain.css"

const LearningPathMain = ({ subTitle, currentpage, setCurrentpage }) => {
    const { name } = useUserContext()

    const userName = name || "Lorem Ipsum"

    const cardData = [
        {
            title: "Mandatory Courses",
            noOfCourses: 3,
            color: "#da2124",
            completed: [
                {
                    title: "Chemical Handling",
                    type: "assessment",
                    progress: 50,
                    refresherDate: "28 Sep 2023",
                    certificate: null
                },
                {
                    title: "Fire Safety",
                    type: "training",
                    progress: 100,
                    refresherDate: "28 Sep 2023",
                    certificate: samplePdf,
                },
                {
                    title: "Electrical Safety",
                    type: "checklist",
                    progress: 70,
                    certificate: null
                },
            ]
        },
        {
            title: "Advised Courses",
            noOfCourses: 3,
            color: "#88FF95",
            completed: [
                {
                    title: "Emergency preparedness",
                    type: "assessment",
                    progress: 0,
                    refresherDate: "28 Sep 2023",
                    certificate: null
                },
                {
                    title: "Hot Works",
                    type: "training",
                    progress: 0,
                    refresherDate: "28 Sep 2023",
                    certificate: null,
                },
                {
                    title: "Slip, trip, falls",
                    type: "checklist",
                    progress: 0,
                    certificate: null
                },
            ]
        },
        {
            title: "Other Courses",
            noOfCourses: 3,
            color: "#4AB9FF",
            completed: [
                {
                    title: "Machine Guarding",
                    type: "assessment",
                    progress: 0,
                    refresherDate: "28 Sep 2023",
                    certificate: null
                },
                {
                    title: "General Safety",
                    type: "training",
                    progress: 0,
                    refresherDate: "28 Sep 2023",
                    certificate: null,
                },
                {
                    title: "Hand Safety",
                    type: "checklist",
                    progress: 0,
                    certificate: null
                },
            ]
        },
    ]


  const handleBackbtn = () => {
    setCurrentpage(currentpage - 1)
  }

  return (
    <div className='learning-path-main-div'>
        <div className='back-btn-container'>
            <button 
                className='back-btn-main-btn' 
                onClick={handleBackbtn}
            >
                <img src={arrowLeft} className='arrow-left' alt='arrow' />
                <p className='text'>Go Back</p>
            </button>
        </div>

        <div className='header'>

            <PinnedTitleHead title={subTitle} />

            <div className='user-name-div'>
                <div className='line'></div>
                <p className='user-name'>
                    {userName}
                </p>
                <div className='line'></div>
            </div>

            <div className='user-info'>
                <div className='left'>
                    <img 
                        src={profilePlaceHolder}
                        className='profile-pic'
                        alt={"userName"}
                    />
                    <img
                        src={roundRedAnimation}
                        className='animated-circle'
                        alt='animation'
                    />
                </div>
                <div className='right'>
                    <div className='tag-div'>
                        <p className='label'>Designation</p>
                        <p className='value-text'>Head-Operations</p>
                    </div>
                    <div className='tag-div'>
                        <p className='label'>Department</p>
                        <p className='value-text'>Operations Department</p>
                    </div>
                    <div className='tag-div'>
                        <p className='label'>Location</p>
                        <p className='value-text'>New Delhi</p>
                    </div>
                </div>
            </div>

            <img src={invertedTriangle} className='inverted-triangle' alt='triangle' />
        </div>

        <div className='main-info'>
        <div className='contribution-main-div'>
            <div className='main-data'>
                <p className='main-head'>{userName}'s Contribution</p>
                {/* <FadedLine /> */}
            </div>
             
             <div className='main-data'>
                <img src={peopleIcon} className='icon' alt='icoon' />
                <p className='text'>
                    <span>72</span>
                    People trained
                </p>
             </div>
             <div className='main-data'>
                <img src={pressentorIcon} className='icon' alt='icoon' />
                <p className='text'>
                    <span>123</span>
                    Number of sessions conducted
                </p>
             </div>
             <div className='main-data'>
                <img src={clockyIcon} className='icon' alt='icoon' />
                <p className='text'>
                    <span>2,500</span>
                    Mins of training given
                </p>
             </div>
        </div>

        <div className='user-card-container'>
            <UserDataCard cardData={cardData[0]}/>
            <UserDataCard cardData={cardData[1]}/>
            <UserDataCard cardData={cardData[2]}/>
        </div>

        </div>
    </div>
  )
}

export default LearningPathMain