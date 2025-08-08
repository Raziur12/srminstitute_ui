import React, { useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import '../../../Styles/MCQAssessments/MCQAssessment.css';
import Swal from 'sweetalert2';

const AddQuestionPaper = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    semester: '',
    description: '',
    marks: '',
    duration: '',
    is_active: true,
  });

  const [uploadStatus, setUploadStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Submitting...');

    const dataToSend = {};

    if (formData.name.trim()) dataToSend.name = formData.name.trim();
    if (formData.subject.trim()) dataToSend.subject = formData.subject.trim();
    if (formData.semester.trim()) dataToSend.semester = formData.semester.trim();
    if (formData.description.trim()) dataToSend.description = formData.description.trim();
    if (formData.marks) dataToSend.marks = parseInt(formData.marks);
    if (formData.duration) dataToSend.duration = parseInt(formData.duration);
    dataToSend.is_active = formData.is_active;

    try {
      const response = await axiosInstance.post('/papers/question-papers/', dataToSend);

      if (response.status === 201) {
        setUploadStatus('Question Paper created successfully!');
        Swal.fire({
          title: 'Success!',
          text: 'Question Paper created successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then(() => {
          setUploadStatus('');
          setFormData({
            name: '',
            subject: '',
            semester: '',
            description: '',
            marks: '',
            duration: '',
            is_active: false,
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
      <h2 className="add-assessments-title">Add Question Paper</h2>
      <form className="add-assessments-form-add" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Question Paper Name</label>
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
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <input
            type="text"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ height: '13rem' }}>  
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="marks">Total Marks (Optional)</label>
          <input
            type="number"
            id="marks"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration in Minutes (Optional)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="is_active">Is Active</label>
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          {uploadStatus ? 'Submitting...' : 'Add Question Paper'}
        </button>
      </form>
    </div>
  );
};

export default AddQuestionPaper;
