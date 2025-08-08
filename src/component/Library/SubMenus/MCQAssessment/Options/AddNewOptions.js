import React, { useState } from 'react';
import axiosInstance from '../../../../../interceptor/axiosInstance';

const AddNewOptions = ({ questionID, onClose, onSaveSuccess }) => {
  const [text, setText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!text && !image) {
      alert('Please provide text or an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('question', questionID);
    formData.append('text', text);
    formData.append('is_correct', isCorrect ? 'true' : 'false');
    if (image) {
      formData.append('image', image); // ✅ send binary file
    }

    try {
      const response = await axiosInstance.post(
        'assessments/options/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ Let browser handle boundary
          },
        }
      );

      if (response.status === 201) {
        alert('Option saved successfully');
        onSaveSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving option:', error);
      const errorMsg =
        error.response?.data?.errors?.image?.[0] ||
        error.response?.data?.message ||
        'Failed to save option.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="popup-content max-w-2xl w-full bg-white p-6 rounded shadow-lg relative">
        <span
          className="close-icon absolute right-4 top-2 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>

        <h2 className="text-xl font-semibold mb-4">Add New Option</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Option Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter option text"
          />
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
            id="isCorrectCheckbox"
          />
          <label htmlFor="isCorrectCheckbox" className="font-medium">
            Is Correct
          </label>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Option Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="table-option-img"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AddNewOptions;
