import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';
import '../../../../Styles/Faculty/faculty.css';

const MCQOptions = () => {
  const { id } = useParams(); // Sub-question ID
  const navigate = useNavigate();
  const [mcqOptions, setMcqOptions] = useState([]);
  const [subQuestion, setSubQuestion] = useState(null);
  const [isAddOptionPopupOpen, setIsAddOptionPopupOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingOption, setEditingOption] = useState(null);

  const [optionFormData, setOptionFormData] = useState({
    option_text: '',
    option_label: '',
    is_correct: false
  });

  const fetchSubQuestion = async () => {
    try {
      const res = await axiosInstance.get(`papers/sub-questions/${id}/`);
      setSubQuestion(res.data.data);
    } catch (error) {
      console.error('Failed to fetch sub-question', error);
      Swal.fire('Error', 'Failed to fetch sub-question details', 'error');
    }
  };

  const fetchMcqOptions = async () => {
    try {
      const res = await axiosInstance.get(`papers/mcq-options/?sub_question_id=${id}`);
      
      // Based on API response: data.data.data (nested structure)
      let options = [];
      if (res.data && res.data.status === 'success' && res.data.data && res.data.data.data) {
        options = res.data.data.data;
      }
      
      console.log('MCQ Options API Response:', res.data); // Debug log
      console.log('MCQ Options extracted:', options); // Debug log
      setMcqOptions(options);
    } catch (error) {
      console.error('Failed to fetch MCQ options', error);
      setMcqOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubQuestion();
    fetchMcqOptions();
  }, [id]);

  const handleAddOption = () => {
    setEditingOption(null);
    setOptionFormData({
      option_text: '',
      option_label: '',
      is_correct: false
    });
    setIsAddOptionPopupOpen(true);
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    
    // Parse the combined text back into label, text, and correct answer
    let optionLabel = '';
    let optionText = option.text;
    let isCorrect = false;
    
    // Check for correct answer indicator
    if (optionText.includes(' [CORRECT]')) {
      isCorrect = true;
      optionText = optionText.replace(' [CORRECT]', '');
    }
    
    // Check if text starts with a pattern like "A. " or "B. "
    const labelMatch = optionText.match(/^([A-Z])\.\s*(.*)$/);
    if (labelMatch) {
      optionLabel = labelMatch[1];
      optionText = labelMatch[2];
    }
    
    setOptionFormData({
      option_text: optionText,
      option_label: optionLabel,
      is_correct: isCorrect
    });
    setIsAddOptionPopupOpen(true);
  };

  const handleDeleteOption = async (optionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`papers/mcq-options/${optionId}/`);
        Swal.fire('Deleted!', 'Option has been deleted.', 'success');
        fetchMcqOptions();
      } catch (error) {
        console.error('Failed to delete option', error);
        Swal.fire('Error', 'Failed to delete option.', 'error');
      }
    }
  };

  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Create FormData as expected by the API
      const formData = new FormData();
      formData.append('subquestion', id);
      
      // Combine option label, text, and correct answer indicator
      let combinedText = optionFormData.option_label ? 
        `${optionFormData.option_label}. ${optionFormData.option_text}` : 
        optionFormData.option_text;
      
      // Add correct answer indicator to the text
      if (optionFormData.is_correct) {
        combinedText += ' [CORRECT]';
      }
      
      formData.append('text', combinedText);
      
      // Note: Storing is_correct status within the text field since API only supports subquestion and text

      if (editingOption) {
        // Update existing option
        await axiosInstance.put(`papers/mcq-options/${editingOption.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Success', 'Option updated successfully.', 'success');
      } else {
        // Create new option
        await axiosInstance.post('papers/mcq-options/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Success', 'Option added successfully.', 'success');
      }

      setOptionFormData({
        option_text: '',
        option_label: '',
        is_correct: false
      });
      setIsAddOptionPopupOpen(false);
      fetchMcqOptions();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.non_field_errors && error.response.data.non_field_errors[0]) ||
                          'Failed to save option.';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseFormPopup = () => {
    setIsAddOptionPopupOpen(false);
    setOptionFormData({
      option_text: '',
      option_label: '',
      is_correct: false
    });
  };

  if (loading) {
    return (
      <div className="mcq-assessment">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mcq-assessment">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="assessments-title">
          MCQ Options {subQuestion && `- ${subQuestion.option_label} (${subQuestion.text})`}
        </h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Sub Questions
        </button>
      </div>

      {subQuestion && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Sub Question Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><strong>Option Label:</strong> {subQuestion.option_label}</div>
            <div><strong>Question Text:</strong> {subQuestion.text}</div>
            <div><strong>Question ID:</strong> {subQuestion.question}</div>
          </div>
        </div>
      )}
      
      <div className='btnsss'>
        <div className="add-user-container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="add-user-btn" onClick={handleAddOption}>
            Add MCQ Option
          </button>
        </div>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Option Label</th>
            <th>Option Text</th>
            <th>Correct Answer</th>
            {/* <th>Sub Question ID</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!Array.isArray(mcqOptions) || mcqOptions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No options found.</td>
            </tr>
          ) : (
            mcqOptions
              .sort((a, b) => {
                // Sort by option label (A, B, C, D)
                // Remove [CORRECT] indicator before parsing label
                const textA = a.text.replace(' [CORRECT]', '');
                const textB = b.text.replace(' [CORRECT]', '');
                const labelA = textA.match(/^([A-Z])\.\s*(.*)$/)?.[1] || 'Z';
                const labelB = textB.match(/^([A-Z])\.\s*(.*)$/)?.[1] || 'Z';
                return labelA.localeCompare(labelB);
              })
              .map((option) => {
                // Parse option label, text, and correct answer from the combined text
                let displayLabel = 'N/A';
                let displayText = option.text;
                let isCorrect = false;
                
                // Check for correct answer indicator
                if (displayText.includes(' [CORRECT]')) {
                  isCorrect = true;
                  displayText = displayText.replace(' [CORRECT]', '');
                }
                
                const labelMatch = displayText.match(/^([A-Z])\.\s*(.*)$/);
                if (labelMatch) {
                  displayLabel = labelMatch[1];
                  displayText = labelMatch[2];
                }
                
                return (
                <tr key={option.id}>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#3498db',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {displayLabel}
                    </span>
                  </td>
                  <td>{displayText}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: isCorrect ? '#27ae60' : '#e74c3c',
                      color: 'white'
                    }}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </td>
                  {/* <td>{option.subquestion}</td> */}
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditOption(option)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOption(option.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
            })
          )}
        </tbody>
      </table>

      {/* Add/Edit Option Form Popup */}
      {isAddOptionPopupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px 12px 0 0'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                {editingOption ? 'Edit MCQ Option' : 'Add New MCQ Option'}
              </h3>
            </div>
            
            <form onSubmit={handleOptionSubmit} style={{ padding: '20px 30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                  Option Label *
                </label>
                <input
                  type="text"
                  value={optionFormData.option_label}
                  onChange={(e) => setOptionFormData({...optionFormData, option_label: e.target.value})}
                  placeholder="Enter option label (A, B, C, D)"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '2px solid #ccc',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                  Option Text *
                </label>
                <textarea
                  value={optionFormData.option_text}
                  onChange={(e) => setOptionFormData({...optionFormData, option_text: e.target.value})}
                  placeholder="Enter option text"
                  rows="3"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '2px solid #ccc',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={optionFormData.is_correct}
                    onChange={(e) => setOptionFormData({...optionFormData, is_correct: e.target.checked})}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '500' }}>This is the correct answer</span>
                </label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCloseFormPopup}
                  disabled={submitLoading}
                  style={{ 
                    padding: '10px 16px', 
                    backgroundColor: '#e74c3c', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontWeight: '500', 
                    cursor: 'pointer' 
                  }}
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{ 
                    padding: '10px 16px', 
                    backgroundColor: '#2ecc71', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontWeight: '500', 
                    cursor: 'pointer' 
                  }}
                >
                  {submitLoading ? '⏳ Saving...' : (editingOption ? '✅ Update Option' : '✅ Save Option')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQOptions;
