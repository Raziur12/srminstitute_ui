import React, { useState } from 'react';
import axiosInstance from '../../../../../interceptor/axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../../Styles/MCQAssessments/MCQAssessment.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddAssessments = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    test_file: '',
    thumbnail: '',
    start_date_time: null,
    end_date_time: null,
    is_released: false,
    is_randomized: false,
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setUploadStatus('');
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploadStatus('Uploading...');
  
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('test_file', formData.test_file);
      formDataToSend.append('thumbnail', formData.thumbnail);
      formDataToSend.append('start_date_time', formData.start_date_time.toISOString());
      formDataToSend.append('end_date_time', formData.end_date_time.toISOString());
      formDataToSend.append('is_released', formData.is_released);
      formDataToSend.append('is_randomized', formData.is_randomized);
  
      const response = await axiosInstance.post('/assessments/tests/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        setUploadStatus('Assessment created successfully!');
        Swal.fire({
          title: 'Success!',
          text: 'Assessment created successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then(() => {
          setUploadStatus('');
          setFormData({
            name: '',
            description: '',
            duration: '',
            test_file: '',
            thumbnail: '',
            start_date_time: null,
            end_date_time: null,
            is_released: false,
            is_randomized: false,
          });
        });
      }
    } catch (error) {
      const backendData = error.response?.data || {};
      const message = backendData.message || 'An error occurred.';
      const nonFieldErrors = backendData.errors?.non_field_errors?.join('\n') || '';
  
      let errorText = message;
      if (nonFieldErrors) {
        errorText += `\n${nonFieldErrors}`;
      }
  
      Swal.fire({
        title: 'Error!',
        text: errorText,
        icon: 'error',
        confirmButtonText: 'Try Again',
      }).then(() => {
        setUploadStatus('');
      });
    }
  };
  
  return (
    <div className="add-assessments-container">
      <h2 className="add-assessments-title">Add Assessment</h2>
      <form className="add-assessments-form-add" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Assessment Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (in minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="date-time-container">
          <div className="form-group">
            <label htmlFor="start_date_time">Start Date and Time</label>
            <DatePicker
              selected={formData.start_date_time}
              onChange={(date) => handleDateChange(date, 'start_date_time')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select start date and time"
              className="date-picker-input"
              minDate={new Date()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date_time">End Date and Time</label>
            <DatePicker
              selected={formData.end_date_time}
              onChange={(date) => handleDateChange(date, 'end_date_time')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select end date and time"
              className="date-picker-input"
              minDate={formData.start_date_time || new Date()}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload CSV</label>
          <input
            type="file"
            id="file"
            name="test_file"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">Upload Thumbnail</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="is_released">Release</label>
          <input
            type="checkbox"
            id="is_released"
            name="is_released"
            checked={formData.is_released}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="is_randomized">Randomized</label>
          <input
            type="checkbox"
            id="is_randomized"
            name="is_randomized"
            checked={formData.is_randomized}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
         {uploadStatus ? "Uploading" : "Add Assessment"} 
        </button>
      </form>
    </div>
  );
};

export default AddAssessments;
