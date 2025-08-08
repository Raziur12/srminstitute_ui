import React, { useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const AddUsers = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a CSV file to upload.',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    setIsUploading(true);
  
    axiosInstance
      .post('accounts/bulkuserupload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const { status, message, data } = response.data;
  
        if (status === 'success') {
          let successText = `${data.created_users} users created successfully!`;
  
          if (data.skiped_rows > 0) {
            successText += `\n${data.skiped_rows} rows were skipped due to errors.`;
          }
  
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            successText += `\n\n<strong>Errors:</strong>\n${data.errors.join('\n')}`;
          }
  
          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            html: successText.replace(/\n/g, '<br/>'), // Format new lines correctly
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: message || 'Error uploading file.',
          });
        }
  
        setIsUploading(false);
      })
      .catch((error) => {
        const { message, errors } = error.response?.data || {};
        let errorText = message || 'Error uploading file.';
  
        if (errors && Array.isArray(errors) && errors.length > 0) {
          errorText += `\n\n<strong>Errors:</strong>\n${errors.join('\n')}`;
        }
  
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: errorText.replace(/\n/g, '<br/>'),
        });
  
        setIsUploading(false);
      });
  };

  return (
    <div className="add-users-container">
      <h2>Upload XLSX</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select XLSX File:
          <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileChange} required />
        </label>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
