import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../interceptor/axiosInstance';

const AddOneQuestion = ({ onClose, assessmentId, refreshData }) => {
  const [formData, setFormData] = useState({
    text: '',
    image: '',
    question_type: 'MCSR',
    marks: 1,
  });

  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSave = async () => {
    if (!formData.text.trim() || !formData.question_type || !formData.marks) {
      Swal.fire('Validation Error', 'Please fill all mandatory fields.', 'warning');
      return;
    }

    setSaving(true);

    try {
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      // // const userId = user.id;
      // const userId = user.id || user.userId || user.userid; // adapt this as per your backend key
      const payload = new FormData();
      payload.append('question_paper', assessmentId);
      payload.append('question_type', formData.question_type);
      payload.append('text', formData.text.trim());
      payload.append('marks', parseInt(formData.marks));
      // payload.append('created_by', userId); // ✅ Fix added here

      if (formData.image) {
        const imageBlob = dataURItoBlob(formData.image);
        payload.append('image', imageBlob, 'image.jpg');
      }

      const response = await axiosInstance.post('papers/questions/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Swal.fire('Success', 'Question added successfully.', 'success');
        refreshData(); // Refresh table
        onClose();     // Close popup
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to add question.', 'error');
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
        <h2>Add Question</h2>
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
            {formData.image ? (
              <div>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{ maxWidth: '200px', marginBottom: '10px' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
              >
                Upload Image
              </button>
            )}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>

          <div className="buttons-container">
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
      </div>
    </div>
  );
};

export default AddOneQuestion;
