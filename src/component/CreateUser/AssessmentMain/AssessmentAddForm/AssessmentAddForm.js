import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';

const AssessmentAddForm = () => {
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    level: '',
    timer: '',
  });

  const [optionFormData, setOptionFormData] = useState({
    question: '',
    option: '',
    is_correct: '',
  });

  const [assessmentFormData, setAssessmentFormData] = useState({
    assessment_type: '',
    questions: '',
    access: '',
  });

  // Separate states for form visibility
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);


  const handleInputChange = (setState, currentData, e) => {
    const { name, value } = e.target;
    setState({
      ...currentData,
      [name]: value,
    });
  };
  

  // Submission handlers
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/assessment/question/', questionFormData);
      Swal.fire('Success', 'Question submitted successfully!', 'success');
      setQuestionFormData({ question: '', level: '', timer: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to submit question.', 'error');
    }
  };

  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/assessment/option/', optionFormData);
      Swal.fire('Success', 'Option submitted successfully!', 'success');
      setOptionFormData({ questionId: '', option: '', is_correct: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to submit option.', 'error');
    }
  };

  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('assessments/assessment/', assessmentFormData);
      Swal.fire('Success', 'Assessment submitted successfully!', 'success');
      setAssessmentFormData({ assessment_type: '', questionIds: '', access: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to submit assessment.', 'error');
    }
  };


  return (
    <div className='assessment-main-form-container'>
      <div className='assessment-title-click'>
        <p className='assessment-add-tittle'>
          Add Question
        </p>
        <button className="create-user-submenu-body-list-item" onClick={() => setShowQuestionForm((prev) => !prev)}>
          {showQuestionForm ? 'Hide Add Question' : 'Add Question'}
        </button>
      </div>

      {showQuestionForm && (
        <form className="scenariocontaent-main-form" onSubmit={handleQuestionSubmit}>
          <div className='scenariocontaent-two-divs'>
            <label className='scenariocontaent-one-input'>
            Question:
              <input
                name="question"
                value={questionFormData.question}
                onChange={(e) => handleInputChange(setQuestionFormData, questionFormData, e)}
                placeholder="Enter Question"
              />
            </label>

            <label className='scenariocontaent-one-input'>
            Level:
              <select
                name="level"
                value={questionFormData.level}
                onChange={(e) => handleInputChange(setQuestionFormData, questionFormData, e)}
              >
                <option value="">Select Level</option>
                <option value="easy">Easy</option>
                <option value="hard">Hard</option>
                <option value="difficult">Difficult</option>
              </select>
            </label>
          </div>

          <div className='scenariocontaent-two-divs'>

            <label className='scenariocontaent-one-input'>
            Timer (optional):
              <input
                name="timer"
                value={questionFormData.timer}
                onChange={(e) => handleInputChange(setQuestionFormData, questionFormData, e)}
                placeholder="Timer in seconds"
              />
            </label>
          </div>

          <button type="submit">Submit Question</button>
        </form>
      )}

      <div className='assessment-title-click'>
        <p className='assessment-add-tittle'>
          Add Option
        </p>
        <button className="create-user-submenu-body-list-item" onClick={() => setShowOptionForm((prev) => !prev)}>
          {showOptionForm ? 'Hide Add Option' : 'Add Option'}
        </button>
      </div>

      {showOptionForm && (
        <form className="scenariocontaent-main-form" onSubmit={handleOptionSubmit}>
          <div className='scenariocontaent-two-divs'>

            <label className='scenariocontaent-one-input'>
            Question
              <select
                name="questionId"
                value={optionFormData.questionId}
                onChange={(e) => handleInputChange(setOptionFormData, optionFormData, e)}
              >
                <option value="">Select Question</option>
                <option value="1">Question 1</option>
                <option value="2">Question 2</option>
                {/* Example values for question options */}
              </select>
            </label>

            <label className='scenariocontaent-one-input'>
            Option
              <textarea
                name="option"
                value={optionFormData.option}
                onChange={(e) => handleInputChange(setOptionFormData, optionFormData, e)}
                placeholder="Enter Option Text"
              />
            </label>
          </div>

          <div className='scenariocontaent-two-divs'>
            <label className='scenariocontaent-one-input'>
            Is Correct (True/False)
              <input
                name="is_correct"
                value={optionFormData.is_correct}
                onChange={(e) => handleInputChange(setOptionFormData, optionFormData, e)}
                placeholder="True or False"
              />
            </label>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}

      <div className='assessment-title-click'>
        <p className='assessment-add-tittle'>
          Add Assessment
        </p>
        <button className="create-user-submenu-body-list-item" onClick={() => setShowAssessmentForm((prev) => !prev)}>
          {showAssessmentForm ? 'Hide Add Assessment' : 'Add Assessment'}
        </button>
      </div>

      {showAssessmentForm && (
        <form className="scenariocontaent-main-form" onSubmit={handleAssessmentSubmit}>
          <div className='scenariocontaent-two-divs'>
            <label className='scenariocontaent-one-input'>
            Assessment Type
              <select
                name="assessment_type"
                value={assessmentFormData.assessment_type}
                onChange={(e) => handleInputChange(setAssessmentFormData, assessmentFormData, e)}
              >
                <option value="">Select Type</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                {/* Example assessment types */}
              </select>
            </label>

            <label className='scenariocontaent-one-input'>
          Questions
          <select
            name="questionIds"
            value={assessmentFormData.questionIds}
            onChange={(e) => handleInputChange(setAssessmentFormData, assessmentFormData, e)}
          >
            <option value="">Select Questions</option>
            <option value="addquestion">Add Questions</option>
            <option value="existing_question_1">Existing Question 1</option>
            <option value="existing_question_2">Existing Question 2</option>
            {/* Add more question options as needed */}
          </select>
        </label>
          </div>

          <div className='scenariocontaent-two-divs'>
            <label className='scenariocontaent-one-input'>
            Access
              <select
                name="access"
                value={assessmentFormData.access}
                onChange={(e) => handleInputChange(setAssessmentFormData, assessmentFormData, e)}
              >
                <option value="">Select Access Level</option>
                <option value="pre">Pre</option>
                <option value="mid">Mid</option>
                <option value="post">Post</option>
              </select>
            </label>

          </div>



          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AssessmentAddForm
