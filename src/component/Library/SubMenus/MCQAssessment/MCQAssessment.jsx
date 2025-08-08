import React, { useState } from 'react';
import '../../../../Styles/MCQAssessments/MCQAssessment.css'; 
import Assessments from './Assessments/Assessments';
import AddAssessments from './AddAssessments/AddAssessments';
import QuestionTable from './Questions/QuestionTable';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';

const MCQAssessment = () => {
  const [activeData, setActiveData] = useState(<Assessments />);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [csvloading, setCsvLoading] = useState(false); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleButtonClick = (data) => {
    setActiveData(data);
  };


  const handleDownloadXLSX = () => {
    setCsvLoading(true); // Set loading state to true when download starts

    axiosInstance
        .get('reports/download_template/?type=assessment', {
            responseType: 'blob', // Ensure response is treated as a file
        })
        .then((response) => {
            // Create a Blob object for the downloaded file
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Create a URL for the Blob object
            const fileURL = URL.createObjectURL(blob);
            
            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'template.xlsx'); // Set filename with .xlsx extension
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link);
            
            // Show success message
            Swal.fire({
                title: 'Success!',
                text: 'XLSX file download successful.',
                icon: 'success',
            });
        })
        .catch(() => {
            // Show error message if download fails
            Swal.fire({
                title: 'Error!',
                text: 'XLSX file download failed. Please try again.',
                icon: 'error',
            });
        })
        .finally(() => {
            setCsvLoading(false); // Reset loading state after download completes
        });
};

  return (
    <div className="mcq-assessment">
          <h2 className="assessments-title">Assessments</h2>
 <div className='btnsss'>
 <div className="add-user-container">
      <button className="add-user-btn" onClick={toggleDropdown}>
          Assessments <span className="dropdown-icon">▼</span>
        </button>
     
        {isDropdownOpen && (
          <div className="dropdown-options">
            <div className="dropdown-option"  onClick={() => handleButtonClick(<Assessments />)}>
            List Assessment
            </div>
            <div className="dropdown-option" onClick={() => handleButtonClick(<AddAssessments />)}>
              Add Assessment
            </div>
          </div>
        )}
         </div>

         <div className='assment-download-btn'>
      <button
      onClick={handleDownloadXLSX}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      disabled={csvloading} // Disable button while downloading
    >
      {csvloading ? 'Downloading...' : 'Download Assessment Template'} {/* Change text based on loading state */}
    </button>
        </div>


         </div>
      <div className="mcq-assessment__content">
        {activeData}
      </div>
    </div>
  );
};

export default MCQAssessment;
