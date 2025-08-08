import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const QuestionPopup = ({ onClose, questionData, loading, refreshData }) => {
  const [formData, setFormData] = useState({
    id: '',
    question_type: 'MCSR',
    text: '',
    marks: 1,
    image: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (questionData?.data) {
      const data = questionData.data;
      setFormData({
        id: data.id,
        question_type: data.question_type || 'MCSR',
        text: data.text || '',
        marks: data.marks || 1,
        image: data.image ? `https://bpanelskillcrest.srmup.in${data.image}` : '',
      });
    }
  }, [questionData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'marks' ? parseInt(value) : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file, // hold as File object
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.text.trim() || !formData.question_type || !formData.marks) {
      Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('question_type', formData.question_type);
      payload.append('text', formData.text.trim());
      payload.append('marks', formData.marks);

      if (formData.image instanceof File) {
        payload.append('image', formData.image);
      }

      const response = await axiosInstance.put(
        `papers/questions/${formData.id}/`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Swal.fire('Success', 'Question updated successfully.', 'success');
        refreshData();
        onClose();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      Swal.fire('Error', 'Failed to update question.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            <h2>Edit Question</h2>
            <form>
              <label>
                Question Text *
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </label>

              <label>
                Question Type *
                <select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MCSR">MCSR (Single Correct)</option>
                  <option value="MCMR">MCMR (Multiple Correct)</option>
                  <option value="SHORT">SHORT Answer</option>
                  <option value="LONG">LONG Answer</option>
                </select>
              </label>

              <label>
                Marks *
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Image (optional)
                {formData.image && typeof formData.image === 'string' && (
                  <img
                    src={formData.image}
                    alt="Question"
                    style={{ maxWidth: '200px', marginBottom: '10px' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
                {formData.image instanceof File && formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', marginBottom: '10px' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <div className="buttons-container mt-4">
                <button type="button" onClick={onClose} className="bg-gray-500 text-white">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionPopup;
