import React from 'react'
import CardBackground from "./CardBackground"
// import ProgressBar from "./ProgressBar"
// import ArrowLeft from "../../Assets/LearningPath/arrowLeft.svg"
// import CertificateIcon from "../../Assets/LearningPath/certificate.svg"

import "../../Styles/HeadingStyle/LearningCard.css"


// const exampleCardData = [
//     {
//       course: 'React Basics',
//       type: 'Online',
//       progress_percentage: 75,
//       progress: 75, // Assuming this should match progress_percentage
//       certificate: 'https://example.com/certificates/react_basics.pdf',
//       title: 'React Basics',
//       refresher_date: '2024-03-27',
//     },
//     {
//       course: 'Advanced React',
//       type: 'Online',
//       progress_percentage: 100,
//       progress: 100, // Assuming this indicates completion
//       certificate: 'https://example.com/certificates/advanced_react.pdf',
//       title: 'Advanced React',
//       refresher_date: '2024-04-15',
//     },
//     {
//       course: 'Intro to Redux',
//       type: 'Online',
//       progress_percentage: 0,
//       progress: 0, // Assuming this indicates not started
//       // No certificate yet as the course is not completed
//       title: 'Intro to Redux',
//       refresher_date: '', // No refresher date since not started
//     }
//   ];


const UserDataCard = ({cardData, title, color}) => {
    // const noOfCourses = cardData.length || 0
    const noOfCourses = cardData || 0  // this was remove after come dymic data

    // const handleDownload = (certificateUrl, certificateTitle) => {
    //     const link = document.createElement('a');
    //     link.href = certificateUrl;
    //     link.download = `${certificateTitle}_Certificate.pdf`;
    //     link.click();
    //   };
      

    //   const btnText = (num) => {
    //     if(num === 0) {
    //         return "Start"
    //     } else if(num === 100) {
    //         return "Re-Take"
    //     } else {
    //         return "Continue"
    //     }
    //   }

  return (
    <CardBackground color={color}>
        <div className='userdata-card-main-div'>

            <div className='main-title'>
                <p className='title'>{title} </p>
            </div>

            <div className='total-div'>
                <p className='text'>
                    Total: <span>{noOfCourses}</span>
                </p>
            </div>

            {/* <div className='progress-text'>
                <p className='text'>Progress so far</p>
               
            </div> */}

            {/* {exampleCardData.map((item, id) => (
                <div className='course-card-div' key={id}>

                    <p className='title'>{item.course}</p>
                    <p className='type-text'>{item.type}</p>

                    <ProgressBar total={100} completed={item.progress_percentage} />

                    <div className='progress-and-btn'>
                        <div className='progress'>
                            <p className='progress-num'>In-Progress | {item.progress_percentage}%</p>
                        </div> */}
                        {/* <button className='text-btn' style={{cursor:"pointer"}}>
                            {btnText(item.progress_percentage)}
                            <img src={ArrowLeft} className='icon' alt='nothing' />
                        </button> */}
                    {/* </div>
                    {(item.progress === 100) && 
                    <div className='completed-div'>
                        <p className='label'>
                            <img src={CertificateIcon} className='icon' alt='icoon' />
                            Completion Certificate
                            <span>|</span>
                        </p>
                        <button 
                            className="red-text-btn"
                            onClick={() => handleDownload(item.certificate, item.title)}
                            style={{cursor:"pointer"}}
                        >
                            Download
                        </button>
                        <span>|</span>
                        <button className="red-text-btn" style={{cursor:"pointer"}}>
                            Share
                        </button>
                    </div>}
                    {!(item.progress === 0) &&
                    <p className='refresher-date'>
                        Refresher Date: <span>{item.refresher_date}</span>
                    </p>} */}
                {/* </div>
            ))} */}
        </div>
    </CardBackground>
  )
}

export default UserDataCard