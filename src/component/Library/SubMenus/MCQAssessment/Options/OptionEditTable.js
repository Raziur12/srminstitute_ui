import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../../interceptor/axiosInstance';

const OptionEditTable = ({ optionId, onClose, onSaveSuccess }) => {
  const [option, setOption] = useState(null);
  const [question, setQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const questionTypes = ["mcq", "mcsr", "mcmr", "short", "long"];

  useEffect(() => {
    const fetchOption = async () => {
      try {
        const response = await axiosInstance.get(`assessments/options/${optionId}/`);
        const data = response.data.data;
        const q = data.question?.[0];

        setOption({
          id: data.id,
          text: data.text || '',
          is_correct: data.is_correct || false,
          preview: data.image ? `https://bpanelskillcrest.srmup.in${data.image}` : null,
          image: null,
        });

        setQuestion({
          ...q,
          max_selection: q?.max_selection ?? 1,
          marks: q?.marks ?? 1,
          is_randomized: q?.is_randomized ?? false,
        });
      } catch (error) {
        console.error('Error loading option:', error);
      }
    };
    fetchOption();
  }, [optionId]);

  const handleOptionChange = (key, value) => {
    setOption((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionChange = (key, value) => {
    setQuestion((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setOption((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataOption = new FormData();
      formDataOption.append('text', option.text);
      formDataOption.append('is_correct', option.is_correct);
      if (option.image instanceof File) {
        formDataOption.append('image', option.image);
      }

      await axiosInstance.put(`assessments/options/${option.id}/`, formDataOption, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully!',
        text: 'Option and question updated.',
      });

      onSaveSuccess(); // refresh the parent table
      onClose();       // close the modal

    } catch (error) {
      console.error('Error saving:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not save changes.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!option || !question) return <div className="p-4">Loading option data...</div>;

  return (
    <div className="popup-overlay">
      <div className="popup-content max-w-2xl bg-white p-6 rounded shadow-lg relative">
        <span className="close-icon absolute right-4 top-2 text-2xl cursor-pointer" onClick={onClose}>
          &times;
        </span>

        <h3 className="text-xl font-semibold mb-4">Edit Option & Question</h3>

        {/* Option Text */}
        <label className="block font-medium mb-1">Option Text</label>
<input
  type="text"
  value={option.text ?? ''}
  onChange={(e) => handleOptionChange('text', e.target.value)}
  className="border p-2 w-full"
/>


        {/* Image Upload */}
        <div className="mt-4">
          {option.preview && (
            <img src={option.preview} alt="Preview" className="table-option-img" />
          )}
          <input
            type="file"
            id="option-image-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
          <button
            className="bg-blue-500 text-white px-2 py-1"
            onClick={() => document.getElementById('option-image-upload').click()}
          >
            {option.preview ? 'Change Image' : 'Upload Image'}
          </button>
        </div>

        {/* Correct Checkbox */}
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={option.is_correct}
            onChange={(e) => handleOptionChange('is_correct', e.target.checked)}
          />
          Correct
        </label>


        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 mt-6"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default OptionEditTable;
