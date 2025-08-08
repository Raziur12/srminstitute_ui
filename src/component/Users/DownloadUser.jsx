import React, { useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const DownloadUser = () => {
  const [loadingStates, setLoadingStates] = useState({
    student: false,
    faculty: false,
    prospective_faculty: false,
    hod: false,
    time_table_coordinator: false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownload = async (type) => {
    setLoadingStates((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await axiosInstance.get(
        `reports/download_template/?type=${type}`,
        { responseType: 'blob' }
      );

      const disposition = response.headers['content-disposition'];
      let filename = `${type}.xlsx`;

      if (disposition) {
        const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'file.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        title: 'Success!',
        text: 'File download successful.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Failed to download the file:', error);
      Swal.fire({
        title: 'Error!',
        text: 'File download failed. Please try again.',
        icon: 'error',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const options = [
    { type: 'student', label: 'Student' },
    { type: 'faculty', label: 'Faculty' },
    { type: 'prospective_faculty', label: 'Prospective Faculty' },
    { type: 'hod', label: 'HOD (Head of Department)' },
    { type: 'time_table_coordinator', label: 'Time Table Coordinator' },
  ];

  return (
    <div>
      <div className="add-user-container">
        <button className="add-user-btn" onClick={toggleDropdown}>
          Download XLSX <span className="dropdown-icon">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="dropdown-options">
            {options.map((option) => (
              <div
                key={option.type}
                className="dropdown-option"
                onClick={() => handleDownload(option.type)}
              >
                {loadingStates[option.type] ? 'Downloading...' : option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadUser;
