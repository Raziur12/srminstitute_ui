import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../Styles/trust.css";
import BackButton from '../BackButton';
import html2pdf from 'html2pdf.js';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from "sweetalert2";

const TrustDataDisplay = () => {
  // const location = useLocation();
  // // const { reportData } = location.state || {};

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const userId = queryParams.get("user_id"); // Corrected from "attemptId" to "user_id"
    const testId = queryParams.get("testId");
    
  const [answerData, setAnswerData] = useState([]);

  const [audio, setAudio] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const contentRef = useRef(null);  // Ref for printing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    if (userId && testId) {
      setLoading(true);  // Start loading state
  
      axiosInstance
        .post('reports/test_summary_report/', {
          test_id: testId,
          user_id: userId,
        })
        .then((response) => {
          if (response.data && response.data.data) {
            setAnswerData(response.data.data);  // Safely set the data
          } else {
            console.error('No data found in response.');
            setError('No data found in response. Please try again.');
          }
  
          setLoading(false);  // Stop loading state
        })
        .catch((error) => {
          console.error('Error fetching answers:', error);  // Log the error
          setError('Failed to load answer data. Please try again.');
          setLoading(false);
        });
    }
  }, [userId, testId]);  

  const link = "https://bpskillcrest.srmup.in"

  // const handleDownloadPDF = async () => {
  //   if (loading || !contentRef.current) {
  //     Swal.fire("Please wait", "Content is still loading...", "info");
  //     return;
  //   }
  
  //   const element = contentRef.current;
  //   element.classList.add("pdf-download");
  
  //   // Set width to fit PDF (temporarily)
  //   const originalStyle = element.getAttribute("style") || "";
  //   element.style.width = "800px";
  
  //   // Convert all images inside element to Base64 for embedding
  //   const images = element.querySelectorAll('img');
  //   const convertToBase64 = async (img) => {
  //     const src = img.src;
  //     if (src.startsWith('data:')) return; // Already Base64
  //     try {
  //       const res = await fetch(src, { mode: 'cors' });
  //       const blob = await res.blob();
  //       return await new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result);
  //         reader.onerror = reject;
  //         reader.readAsDataURL(blob);
  //       });
  //     } catch (err) {
  //       console.warn("Image to Base64 failed:", err);
  //     }
  //   };
  
  //   for (const img of images) {
  //     const base64 = await convertToBase64(img);
  //     if (base64) img.src = base64;
  //   }
  
  //   // Use html2pdf to generate and download PDF
  //   html2pdf()
  //     .set({
  //       margin: [10, 10, 10, 10],
  //       filename: `Trust_Report_${answerData?.user_name || "Report"}.pdf`,
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         scrollX: 0,
  //         scrollY: 0,
  //       },
  //       jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
  //     })
  //     .from(element)
  //     .save()
  //     .then(() => {
  //       element.classList.remove("pdf-download");
  //       element.setAttribute("style", originalStyle); // restore
  //     })
  //     .catch((err) => {
  //       Swal.fire("Error", "Failed to generate PDF.", "error");
  //       console.error("PDF error:", err);
  //       element.classList.remove("pdf-download");
  //       element.setAttribute("style", originalStyle); // restore
  //     });
  // };
  const handleDownloadPDF = async () => {
    if (loading || !contentRef.current) {
      Swal.fire("Please wait", "Content is still loading...", "info");
      return;
    }
  
    setDownloadingPDF(true);
  
    const formData = new FormData();
    formData.append("test_id", testId);
    formData.append("user_id", userId);
    formData.append("type", "file");
  
    try {
      const response = await axiosInstance.post("reports/test_summary_report/", formData, {
        responseType: "blob",
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Trust_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      Swal.fire("Download Complete", "Your summary report has been downloaded.", "success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "An error occurred while downloading the PDF.";
      console.error("Error downloading PDF:", error);
      Swal.fire("Download Failed", errorMessage, "error");
    } finally {
      setDownloadingPDF(false);
    }
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
    if (audio) {
      audio.pause();
    }
  };

  const openPopup = (event) => {
    if (event.type === 'noise_detection' && event.image) {
      setCurrentAudioUrl(event.image); // Assuming `event.image` is the audio URL
      // playAudio(event.image);
    } else {
      setCurrentAudioUrl('');
    }
    setIsPopupOpen(true);
  };

  return (
    <div className="trust-main" ref={contentRef}>
      {/* Navbar */}
      <div>
        <nav className="trust-navbar">
          <div className="trust-navbar-container nav-container">
            <input type="checkbox" name="" id="" />
            <div className="hamburger-lines">
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>
            <div>Hey, {answerData.user_name}👋</div>
          </div>
        </nav>
      </div>
      {/* Main content */}
      <div className="trust-container">
        <div className="trust-header">
          {/* <BackButton /> */}
          <div className="trust-title">
            <h3>{answerData.start_time} Online MCQ Test</h3><br />
            <h3>{answerData.test_name}</h3>
          </div>
        </div>

        <div className="proctoring-summary">
          <p>Proctoring Summary</p>
          <p>View the test taker's proctoring report</p>
        </div>

        <div className="tracking">
          <img
            src={`${answerData.initial_image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}`}
            className="initial-trust-img"
            alt="User Image"
          />

          <div className="trust-info">
            <div className="info-data">
              <p>
                STARTED AT <br />
                <span>{answerData.start_time}</span>
              </p>
            </div>
            <div className="info-data">
              <p>SUBMITTED AT <br /><span>{answerData.end_time}</span></p>
              <p>BROWSER (DEVICE) <br /> <span>Chrome (desktop)</span></p>
              <button
  className="btn-answer-pdf"
  onClick={handleDownloadPDF}
  disabled={downloadingPDF}
>
  {downloadingPDF ? "Downloading..." : "Download All Response"}
</button>

            </div>

          </div>
        </div>

        <div className="trust-top-score">
          <div
            className={`trust-score ${answerData.trust_score < 80 ? 'low-trust' : 'high-trust'}`}
          >
            {answerData.trust_score}%
          </div>
          <p className="show-score-trust">
            Trust Score
            <img width="20" height="20" src="https://img.icons8.com/ios/50/737373/help--v1.png" alt="help--v1" />
          </p>
        </div>


        <div className="trust-details">
          <div className="trust-card">
            <h4><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/737373/microphone.png" alt="microphone" />
              NOISE DETECTED
            </h4>
            <p className="trust-box-number">{`${answerData.noise_detection_count}`}</p>
          </div>

          <div className="trust-card">
            <h4><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/737373/microphone.png" alt="microphone" />
              Multiple Face
            </h4>
            <p className="trust-box-number">{`${answerData.multi_face_count}`}</p>
          </div>

          <div className="trust-card">
            <h4><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/737373/microphone.png" alt="microphone" />
              Tab Switch
            </h4>
            <p className="trust-box-number">{`${answerData.tab_switched_count}`}</p>
          </div>

          <div className="trust-card">
            <h4><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/737373/microphone.png" alt="microphone" />
              No Face Detected
            </h4>
            <p className="trust-box-number">{`${answerData.no_face_count}`}</p>
          </div>

          <div className="trust-card">
            <h4><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/737373/microphone.png" alt="microphone" />
              Exited Full Screen
            </h4>
            <p className="trust-box-number">{`${answerData.exited_fullscreen_count}`}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Duration(in seconds)</th>
              <th>Date Time</th>
              <th>Type</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(answerData?.events) && answerData.events.length > 0 ? (
    answerData.events.map((event, index) => (
      <tr key={index}>
        <td>{event.duration === "N/A" ? "0.00" : event.duration}</td>
        <td>{event.time}</td>
        <td>{event.type}</td>
        <td>
          {event.type === 'noise_detection' ? (
            <img
              src="https://img.icons8.com/material-outlined/24/737373/microphone.png"
              alt="microphone"
              onClick={() => openPopup(event)}
            />
          ) : (
            <img 
              className="type-image" 
              src={`${event.image}`} 
              alt={event.text || 'Image'} 
              width="50" 
              height="50" 
            />
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No events found.</td>
    </tr>
  )}
</tbody>


        </table>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={closePopup}>
              &times;
            </span>
            <h4>Audio Record</h4>
            {currentAudioUrl ? (
              <div>
                <audio controls>
                  {/* <source src={`${link}${currentAudioUrl}`} type="audio/mp3" /> */}
                  <source src={`${currentAudioUrl}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <p>No recording was made.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default TrustDataDisplay;
