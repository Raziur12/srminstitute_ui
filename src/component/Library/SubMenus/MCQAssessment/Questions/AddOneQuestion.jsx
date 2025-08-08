import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../../interceptor/axiosInstance';

const AddOneQuestion = ({ onClose, loading, assessmentId, refreshData }) => {
  const [formData, setFormData] = useState({
    text: '',
    image: '',
    is_randomized: false,
    marks: 1,
    level: 'easy',
    question_type: 'mcsr',
    max_selection: 1,
    segment_id: '',
  });

  const [options, setOptions] = useState([]);
  const [segments, setSegments] = useState([]); // State to store segments
  const [loadingSegments, setLoadingSegments] = useState(true); // State to track segment loading
  const [saving, setSaving] = useState(false);  // State to track saving status

  // Fetch segment data on component mount
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await axiosInstance.get(`assessments/segments/?test_id=${assessmentId}`);
        if (response.status === 200) {
          setSegments(response.data?.data); // Assuming data is an array of segments
        }
      } catch (error) {
        console.error('Error fetching segments:', error);
      } finally {
        setLoadingSegments(false); // Set loading to false once data is fetched
      }
    };

    fetchSegments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][key] = value;
    setOptions(updatedOptions);
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

  const saveQuestion = async () => {
    try {
      const formDataToSend = new FormData();

      // Append text fields to the form data
      formDataToSend.append('text', formData.text);
      formDataToSend.append('is_randomized', formData.is_randomized);
      formDataToSend.append('marks', formData.marks);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('question_type', formData.question_type);
      formDataToSend.append('max_selection', formData.max_selection);
      formDataToSend.append('segment', formData.segment_id);  // Send segment ID

      // If an image exists, append it to the form data
      if (formData.image) {
        const imageBlob = dataURItoBlob(formData.image); // Convert image data URL to Blob
        formDataToSend.append('image', imageBlob, 'image.jpg');  // Append image with filename
      }

      const response = await axiosInstance.post('assessments/questions/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        return response.data?.data.id;  // Return the created question ID
      } else {
        throw new Error(`Failed to save question. Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving question:", error);
      throw new Error(`Error saving question: ${error.message || error}`);
    }
  };

  // Helper function to convert image data URL to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: mimeString });
  };

  const handleSave = async () => {
    setSaving(true);  // Start the saving process

    // // Check if options are provided, if not show error
    // if (options.length === 0) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'No Options!',
    //     text: 'Please add at least one option.',
    //   });
    //   setSaving(false);  // Stop the saving process (loader off)
    //   return;  // Prevent saving without options
    // }

    try {
      // Save the question first and get the question ID
      const questionId = await saveQuestion();

      // Show success popup
      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully!',
        text: 'Your question and options have been saved.',
      });
      refreshData();  // ✅ Refresh the question table
      onClose();      // ✅ Close the popup      
    } catch (error) {
      // Show error popup
      Swal.fire({
        icon: 'error',
        title: 'Save Failed!',
        text: 'There was an error saving the question or options.',
      });
      console.error('Error saving question and options:', error);
    } finally {
      setSaving(false);  // Stop the saving process (loader off)
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
            <h2>Add Single Question</h2>
            <form>
              <label>
                Question Text:
                <textarea
                  name="text"
                  value={formData.text || ''}
                  onChange={handleInputChange}
                  rows="3"
                />
              </label>

              {/* Segment Dropdown */}
              <label>
                Segment:
                {loadingSegments ? (
                  <span>Loading...</span>
                ) : (
                  <select
                    name="segment_id"
                    value={formData.segment_id || ''}
                    onChange={handleInputChange}
                    disabled={segments.length === 0}
                  >
                    <option value="" disabled>
                      Select Segment
                    </option>
                    {segments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              {/* Image Upload */}
              <label>
                Image:
                {formData.image ? (
                  <div className="image-container">
                    <img
                      src={formData.image}
                      alt="Current"
                      style={{ maxWidth: '200px', maxHeight: '100px', marginBottom: '10px' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      className="update-image-btn"
                    >
                      Update Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload').click()}
                    className="upload-image-btn"
                  >
                    Upload Image
                  </button>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </label>

              {/* Other Form Fields */}
              <div className="question-pop-showing">
                <label>
                  Question Type:
                  <select
                    name="question_type"
                    value={formData.question_type || ''}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Question Type
                    </option>
                    <option value="mcsr">Multiple Choice - Single Response</option>
                    <option value="eitheror">Eitheror</option>
                    <option value="subjective">Subjective</option>
                  </select>
                </label>
              </div>

              <div className="question-pop-showing">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_randomized"
                    checked={formData.is_randomized || false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_randomized: e.target.checked })
                    }
                  />
                  Randomize Options
                </label>

                <label>
                  Marks:
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Level:
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
              </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default AddOneQuestion;
