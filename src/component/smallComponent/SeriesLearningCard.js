import React from 'react'
import CardBackground from "./CardBackground"
import ProgressBar from "./ProgressBar"
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


const SeriesLearningCard = ({seriescardData, title, color}) => {
    // const noOfCourses = cardData.length || 0
    // const noOfCourses = seriescardData || 0  // this was remove after come dymic data

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
                    <p className='title'>{title}</p>
                </div>
    
                <div className='total-div'>
                    <p className='text'>
                        Total: <span>{Object.keys(seriescardData.series_progress).length}</span>
                    </p>
                </div>
    
                <div className='progress-text'>
                    <p className='text'>Progress so far</p>
                </div>
    
                {Object.entries(seriescardData.series_progress).map(([seriesName, progressData], id) => (
    <div className='course-card-div' key={id}>
        <p className='title'>{seriesName}</p>
        <p className='type-text'>{progressData.type}</p>

        <ProgressBar total={100} completed={progressData} />

        <div className='progress-and-btn'>
            <div className='progress'>
                <p className='progress-num'>{seriesName} | {progressData}%</p>
            </div>
        </div>

    
                        {/* {(progressData.series_progress === 100) &&
                            <div className='completed-div'>
                                <p className='label'>
                                    <img src={CertificateIcon} className='icon' alt='icon' />
                                    Completion Certificate
                                    <span>|</span>
                                </p>
                                <button
                                    className="red-text-btn"
                                    onClick={() => handleDownload(progressData.certificate, progressData.title)}
                                    style={{ cursor: "pointer" }}
                                >
                                    Download
                                </button>
                                <span>|</span>
                                <button className="red-text-btn" style={{ cursor: "pointer" }}>
                                    Share
                                </button>
                            </div>
                        } */}
    
                        {/* {progressData.series_progress !== 0 &&
                            <p className='refresher-date'>
                                Refresher Date: <span>{progressData.refresher_date}</span>
                            </p>
                        } */}
                    </div>
                ))}
            </div>
        </CardBackground>
    );
    
}

export default SeriesLearningCard