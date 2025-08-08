import React, { useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const SummaryPDFDownload = ({ testId }) => {
  const [summaryLoad, setSummaryLoad] = useState(false);

  const handleSummaryDownload = () => {
    setSummaryLoad(true);
    axiosInstance.get(`reports/test_summary_report/?test_id=${testId}`, {
      responseType: 'blob', // Ensure response is treated as binary data
    })
    .then((response) => {
      // Create a blob from the response data with the correct Excel MIME type
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary_of_test.xlsx'); // Corrected file extension

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove link and revoke object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Download Successful!',
        text: 'The summary file has been downloaded successfully.',
      });

      setSummaryLoad(false);
    })
    .catch((error) => {
      // Read the error message from response if available
      const errorMessage = error.response?.data?.message || 'Something went wrong during the download.';

      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Download Failed!',
        text: errorMessage,
      });
      setSummaryLoad(false);
    });
  };

  return (
    <div className="download-summary-title" onClick={handleSummaryDownload}>
      {summaryLoad ? 'Downloading...' : 'Download Summary'}
    </div>
  );
};

export default SummaryPDFDownload;
