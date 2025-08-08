import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import MathSymbolPicker from '../../../../../globalComponents/MathSymbolPicker';

const QuestionPopup = ({ onClose, questionData, loading, refreshData }) => {
  const [formData, setFormData] = useState(questionData?.data ?? {});
  const [options, setOptions] = useState(questionData?.data?.options ?? []);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (questionData?.data) {
      setFormData({
        ...questionData.data,
        image: questionData.data.image
          ? `https://bpanelskillcrest.srmup.in${questionData.data.image}`
          : "",
      });

      const updatedOptions = (questionData.data.options || []).map((option) => ({
        ...option,
        preview: option.image ? `https://bpanelskillcrest.srmup.in${option.image}` : null,
        image: null, // This will only hold File when updated
      }));

      setOptions(updatedOptions);
    }
  }, [questionData]);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'question_type' ? value.toLowerCase() : value
    });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: file }); // Store as a File object for upload
      };
      reader.readAsDataURL(file);
    }
  };

  const saveQuestion = async () => {
    try {
      const questionId = formData.id;
      const formDataToSend = new FormData();

      formDataToSend.append('text', formData.text);
      formDataToSend.append('is_randomized', formData.is_randomized);
      formDataToSend.append('marks', formData.marks);
      formDataToSend.append('question_type', formData.question_type?.toLowerCase());

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image); // Append image file
      }

      const response = await axiosInstance.put(
        `assessments/questions/${questionId}/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to save question.');
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);  // Start the saving process

    try {
      await saveQuestion();

      // Show success popup
      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully!',
        text: 'Your question and options have been saved.',
      });
      onClose();  // Close the popup
    } catch (error) {
      // Show error popup
      Swal.fire({
        icon: 'error',
        title: 'Save Failed!',
        text: 'There was an error saving the question or options.',
      });
    } finally {
      refreshData(); 
      setSaving(false);  // Stop the saving process (loader off)
    }
  };

  useEffect(() => {
    if (questionData?.data) {
      setFormData({
        ...questionData.data,
        image: questionData.data.image
          ? `https://bpanelskillcrest.srmup.in${questionData.data.image}`
          : "",
      });
    }
  }, [questionData]);

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
            {/* <RichTextEditor /> */}
            <form>
              <label>
                Question Text:
                <div style={{ position: 'relative' }}>
                  <textarea
                    name="text"
                    value={formData.text || ''}
                    onChange={handleInputChange}
                    rows="3"
                    style={{ width: '100%' }}
                  />
                </div>
              </label>

              <div className="question-pop-showing">
                <label>
                  Image:
                  {formData.image ? (
                    <div className="image-container">
                      <img
                        src={
                          formData.image instanceof File
                            ? URL.createObjectURL(formData.image)
                            : formData.image || "https://via.placeholder.com/200" // Fallback image
                        }
                        alt="Current"
                        style={{ maxWidth: "200px", maxHeight: "100px", marginBottom: "10px" }}
                        onError={(e) => (e.target.style.display = "none")}
                      />


                      <button
                        type="button"
                        onClick={() => document.getElementById("image-upload").click()}
                        className="update-image-btn"
                      >
                        Update Image
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById("image-upload").click()}
                      className="upload-image-btn"
                    >
                      Upload Image
                    </button>
                  )}
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </label>

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
                    <option value="eitheror">Either-Or</option>
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
              </div>

            
            </form>

            <div className="buttons-container">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-500 text-white"
                disabled={saving} // Disable the button while saving
              >
                {saving ? 'Saving...' : 'Save'} {/* Display loader or "Save" */}
              </button>
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default QuestionPopup;
