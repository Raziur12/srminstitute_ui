import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../interceptor/axiosInstance';

const QuestionPaperEditbrn = ({
  fetchAssessments,
  selectedTest,
  setShowPopup,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    academic_year: '',
    year_and_semester: '',
    date_and_session: '',
    duration: '',
    total_marks: '',
    submitted: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTest) {
      setFormData({
        name: selectedTest.name || '',
        academic_year: selectedTest.academic_year || '',
        year_and_semester: selectedTest.year_and_semester || '',
        date_and_session: selectedTest.date_and_session || '',
        duration: selectedTest.duration || '',
        total_marks: selectedTest.total_marks || '',
        submitted: selectedTest.submitted || false,
      });
    }
  }, [selectedTest]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateTest = async () => {
    setLoading(true);

    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== selectedTest[key]) {
        updatedFields[key] =
          key === 'total_marks' || key === 'duration'
            ? parseInt(formData[key]) || 0
            : formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      Swal.fire('Info', 'No changes detected.', 'info');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/papers/question-papers/${selectedTest.id}/`,
        updatedFields
      );

      if (response.status >= 200 && response.status < 300) {
        Swal.fire('Success', 'Question Paper updated successfully!', 'success');
        fetchAssessments();
        setShowPopup(false);
      }
    } catch (error) {
      console.error('Error updating question paper:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update the question paper.';
      const validationErrors = error.response?.data?.errors;

      const formattedErrors = validationErrors
        ? Object.entries(validationErrors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n')
        : '';

      Swal.fire({
        title: 'Error',
        text: `${errorMessage}\n\n${formattedErrors}`,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Edit Question Paper</h3>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Academic Year *</label>
        <input
          type="text"
          name="academic_year"
          value={formData.academic_year}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Year & Semester *</label>
        <input
          type="text"
          name="year_and_semester"
          value={formData.year_and_semester}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Date & Session *</label>
        <input
          type="text"
          name="date_and_session"
          value={formData.date_and_session}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Duration in Minutes *</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Total Marks *</label>
        <input
          type="number"
          name="total_marks"
          value={formData.total_marks}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="submitted"
            checked={formData.submitted}
            onChange={handleChange}
          />{' '}
          Submitted
        </label>
      </div>

      <div className="popup-actions">
        <button className="popup-button" onClick={handleUpdateTest} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="popup-button" onClick={() => setShowPopup(false)} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuestionPaperEditbrn;
