import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import BackButton from '../BackButton';
import "../../Styles/AnswerPdf.css";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const formatDateTime = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const AnswerPDFDisplay = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  // const location = useLocation();
  // const { attemptId, testId } = location.state || {};
  const attemptId = queryParams.get("attemptId");
  const testId = queryParams.get("testId");
  const [answerData, setAnswerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);  // Ref for printing
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);


  const link ="https://bpanelskillcrest.srmup.in"

  // Show button when user scrolls down
useEffect(() => {
  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 300);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  useEffect(() => {
    if (attemptId && testId) {
      axiosInstance
        .get(`reports/answers/?user_id=${attemptId}&test_id=${testId}`)
        .then((response) => {
          setAnswerData(response.data?.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching answers:', error);
          setError('Failed to load answer data. Please try again.');
          setLoading(false);
        });
    }
  }, [attemptId, testId]);

  // const handleDownloadPDF = async () => {
  //   const originalElement = contentRef.current;
  
  //   if (!originalElement) {
  //     Swal.fire("Error", "Content not found", "error");
  //     return;
  //   }
  
  //   setDownloadingPDF(true);
  
  //   // 1. Clone the entire content to avoid touching the visible DOM
  //   const clone = originalElement.cloneNode(true);
  
  //   // 2. Remove all images from clone
  //   const images = clone.querySelectorAll('img');
  //   images.forEach((img) => img.remove());
  
  //   // 3. Append clone off-screen
  //   clone.style.position = 'absolute';
  //   clone.style.left = '-9999px';
  //   document.body.appendChild(clone);
  
  //   try {
  //     const canvas = await html2canvas(clone, {
  //       useCORS: false,         // No need to load external images
  //       allowTaint: false,
  //       scrollX: 0,
  //       scrollY: 0,
  //       scale: 2,
  //     });
  
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'pt', 'a4');
  
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  
  //     const ratio = pdfWidth / imgWidth;
  //     const scaledHeight = imgHeight * ratio;
  
  //     let position = 0;
  
  //     while (position < scaledHeight) {
  //       const pageCanvas = document.createElement('canvas');
  //       const context = pageCanvas.getContext('2d');
  //       const pageHeightPx = pdfHeight / ratio;
  
  //       pageCanvas.width = imgWidth;
  //       pageCanvas.height = pageHeightPx;
  
  //       context.drawImage(
  //         canvas,
  //         0,
  //         position / ratio,
  //         imgWidth,
  //         pageHeightPx,
  //         0,
  //         0,
  //         imgWidth,
  //         pageHeightPx
  //       );
  
  //       const pageImgData = pageCanvas.toDataURL('image/png');
  
  //       if (position === 0) {
  //         pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       } else {
  //         pdf.addPage();
  //         pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       }
  
  //       position += pdfHeight;
  //     }
  
  //     pdf.save(`Test_Response_${answerData.test?.name || 'Report'}.pdf`);
  //   } catch (err) {
  //     console.error('PDF Generation Error:', err);
  //     Swal.fire("Error", "PDF generation failed. Try again.", "error");
  //   } finally {
  //     document.body.removeChild(clone);
  //     setDownloadingPDF(false);
  //   }
  // };
  
  const handleDownloadPDF = async () => {
    if (loading || !contentRef.current) {
      Swal.fire("Please wait", "Content is still loading...", "info");
      return;
    }
  
    setDownloadingPDF(true);
  
    try {
      const response = await axiosInstance.get("reports/answers/", {
        params: {
          test_id: testId,
          user_id: attemptId,
          type: "file",
        },
        responseType: "blob",
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Answer_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      Swal.fire("Download Complete", "Your report has been downloaded.", "success");
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
  

  if (loading) {
    return <div>Loading answers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }


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
          <div>Hey, {answerData.user?.first_name } {answerData.user?.last_name }👋</div>
        </div>
      </nav>
    </div>
    {/* Main content */}
    <div className="trust-container">
      <div className="trust-header">
      {/* <BackButton /> */}
        <div className="trust-title">
          <h3>{answerData.submitted_date} Online MCQ Test - {answerData.test?.name}</h3><br />
          <h3>{answerData.test_name}</h3>
        </div>
      </div>

      <div className="proctoring-summary">
      <p className='answer-pdf-email'>{answerData.user?.email}</p>
     
      <button className='btn-answer-pdf' onClick={handleDownloadPDF} disabled={downloadingPDF}>
  {downloadingPDF ? (
    <span className="pdf-loading-spinner">Downloading... (take a time)</span>
  ) : (
    "SRM SKILLCREST ASSESSMET REPORT"
  )}
</button>

      </div>

      <div className="ans-pdf-tracking">
       
   <div className='answer-pdf-cards'>
    <p className='ans-pdf-cards-title'>Points Scored</p>
    <p className='ans-pdf-cards-scors'>{answerData.points_scored}/{answerData.total_marks}</p>
   </div>

   <div className='answer-pdf-cards'>
    <p className='ans-pdf-cards-title'>Correctly Answered</p>
    <p className='ans-pdf-cards-scors'>{answerData.correctly_answered}/{answerData.total_questions}</p>
   </div>

   <div className='answer-pdf-cards'>
    <p className='ans-pdf-cards-title'>Submitted At</p>
    <p className='ans-pdf-cards-scors'>{formatDateTime(answerData.submitted_at)}</p>
   </div>

   <div className='answer-pdf-cards'>
    <p className='ans-pdf-cards-title'>Time Taken</p>
    <p className='ans-pdf-cards-scors'>{answerData.time_taken}</p>
   </div>

      </div>


{/* Answer Cards Show */}
<div className="answer-showing-cards">
      {answerData.segments.map((segment, index) => (
        <div key={index} className="answer-pdf-segment">
          <h3 className='answer-pdf-segment-name'>{segment.name}</h3>
          {segment.questions.map((question, qIndex) => {
            // Check if any option was selected
            const isAnyOptionSelected = question.options.some((option) => option.is_selected);
            const isSelectedCorrect = question.options.some((option) => option.is_selected && option.is_correct);
            const isSelectedWrong = question.options.some((option) => option.is_selected && !option.is_correct);
            
            let statusMessage = "";
            if (question.user_answer_status === "skipped") {
              statusMessage = "⏭ Skipped";
            } else if (question.user_answer_status === "review") {
              statusMessage = "🔄 Marked for Review";
            } else {
              if (question.question_type === "subjective") {
                if (!question.user_answer || question.user_answer.trim() === "") {
                  statusMessage = "❌ Not Attempted";
                }
              } else {
                if (!isAnyOptionSelected) {
                  statusMessage = "❌ Not Attempted";
                }
              }
            }
            

            return (
              <div
                key={qIndex}
                className={`answer-pdf-question-card ${
                  isSelectedCorrect
                    ? "selected-correct"
                    : isSelectedWrong
                    ? "selected-wrong"
                    : ""
                }`}
              >
               <p className='answer-pdf-cards-question'>
  <strong>Q{qIndex + 1}:</strong>{" "}
  {question.text && <span>{question.text}</span>}
  {question.image && (
    <div>
 <img
  src={question.image}
  alt="question"
  className="answer-pdf-question-img pdf-remove-on-pdf"
/>

    </div>
  )}
</p>


                <ul>
                  {question.options.map((option, oIndex) => {
                    let optionClass = "answer-pdf-option";
                    let icon = null;

                    if (option.is_correct) {
                      optionClass += " answer-pdf-correct";
                      icon = <FaCheckCircle className="answer-pdf-icon correct-icon" />;
                    }
                    if (option.is_selected && !option.is_correct) {
                      optionClass += " answer-pdf-incorrect";
                      icon = <FaTimesCircle className="answer-pdf-icon incorrect-icon" />;
                    }

                    return (
                      <li key={oIndex} className={optionClass}>
                       {icon}{" "}
{option.text && <span>{option.text}</span>}
{option.image && (
  <img
  src={option.image}
  alt="option"
  className="answer-pdf-option-img pdf-remove-on-pdf"
/>

)}
                      </li>
                    );
                  })}
                </ul>

                {question.question_type === "subjective" && question.user_answer && (
  <div className="answer-pdf-subjective-answer">
    <strong>Answer:</strong> {question.user_answer}
  </div>
)}

                {/* Show status message if applicable */}
                {statusMessage && (
                  <p className="answer-pdf-status-message">{statusMessage}</p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
      </div>

      {showScrollButton && (
  <button className="scroll-to-top-btn" onClick={scrollToTop}>
    ⬆ Back to Top
  </button>
)}


      </div>
  );
};

export default AnswerPDFDisplay;