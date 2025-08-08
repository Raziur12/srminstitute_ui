import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../../../../../Styles/MCQAssessments/MCQAssessment.css';
import axiosInstance from '../../../../../interceptor/axiosInstance';

// Custom styles for react-select to show checkboxes
const customStyles = {
  option: (provided, { isSelected }) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: isSelected ? '#e2f4ff' : '#fff',
    color: '#000',
    ':hover': {
      backgroundColor: '#f0f8ff',
    },
  }),
};

const AssessmentModel = ({ modalData, closeModal, isSeasonModal }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Hold selected questions

  // Fetch questions when modal opens
  useEffect(() => {
    if (isSeasonModal) {
      fetchQuestions();
    }
  }, [isSeasonModal]);

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get(`/assessments/questions/`);
      if (response.data) {
        setQuestions(
          response.data.map((question) => ({
            value: question.id,
            label: question.question,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedQuestions(selectedOptions); // Handle multi-select
  };

  const handleSubmit = async () => {
    try {
      const selectedQuestionIds = selectedQuestions.map((q) => q.value);
      const response = await axiosInstance.put(`/assessments/assessment/${modalData.id}/map-questions/`, {
        questions: selectedQuestionIds, // Send as an array
      });
      if (response.status === 200) {
        alert('Questions mapped successfully!');
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.questions) {
        // Display the backend error message in an alert box
        alert(`${error.response.data.questions}`);
      } else {
        // Fallback for other errors
        alert('Error submitting questions');
      }
      console.error('Error submitting questions', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ marginBottom: '2rem' }}>{modalData?.name}</h3>
          <span className="close-icon" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          {isSeasonModal && ( // Only show this part if isSeasonModal is true
            <>
              <h4>Select Questions</h4>
              <Select
                isMulti
                options={questions}
                onChange={handleSelectChange}
                className="questions-dropdown"
                styles={customStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
              />
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentModel;
