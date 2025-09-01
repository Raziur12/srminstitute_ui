import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';
import '../../../../Styles/Faculty/faculty.css';

const SubQuestions = () => {
  const { id } = useParams(); // Question ID
  const navigate = useNavigate();
  const [subQuestions, setSubQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [isAddSubQuestionPopupOpen, setIsAddSubQuestionPopupOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    question: id || '',
    option_label: '',
    text: '',
  });

  const fetchQuestion = async () => {
    try {
      const res = await axiosInstance.get(`papers/questions/${id}/`);
      setQuestion(res.data.data);
    } catch (error) {
      console.error('Failed to fetch question', error);
      Swal.fire('Error', 'Failed to fetch question details', 'error');
    }
  };

  const fetchSubQuestions = async () => {
    try {
      const res = await axiosInstance.get(`papers/sub-questions/?question_id=${id}`);
      console.log('Sub-questions API Response:', res.data); // Debug log
      
      // Handle different possible response structures
      let subQuestions = [];
      if (res.data.data) {
        if (Array.isArray(res.data.data)) {
          subQuestions = res.data.data;
        } else if (res.data.data.data && Array.isArray(res.data.data.data)) {
          subQuestions = res.data.data.data;
        } else if (res.data.data.results && Array.isArray(res.data.data.results)) {
          subQuestions = res.data.data.results;
        }
      } else if (Array.isArray(res.data)) {
        subQuestions = res.data;
      }
      
      console.log('Processed sub-questions:', subQuestions); // Debug log
      setSubQuestions(subQuestions);
    } catch (error) {
      console.error('Failed to fetch sub-questions', error);
      Swal.fire('Error', 'Failed to fetch sub-questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchSubQuestions();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubQuestion = () => {
    setFormData({
      question: id || '',
      option_label: '',
      text: '',
    });
    setIsAddSubQuestionPopupOpen(true);
  };

  const handleEditSubQuestion = (subQuestion) => {
    setFormData({
      id: subQuestion.id,
      question: id || '',
      option_label: subQuestion.option_label,
      text: subQuestion.text,
    });
    setIsAddSubQuestionPopupOpen(true);
  };

  const handleDeleteSubQuestion = async (subQuestionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the sub-question permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`papers/sub-questions/${subQuestionId}/`);
        Swal.fire('Deleted!', 'Sub-question has been deleted.', 'success');
        fetchSubQuestions();
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Failed to delete sub-question.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const { option_label, text } = formData;

    if (!option_label || !text) {
      Swal.fire('Error', 'Please fill all required fields.', 'warning');
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        question: parseInt(formData.question),
        option_label: formData.option_label.toUpperCase(),
        text: formData.text,
      };

      if (formData.id) {
        // Update existing sub-question
        await axiosInstance.put(`papers/sub-questions/${formData.id}/`, payload);
        Swal.fire('Success', 'Sub-question updated successfully.', 'success');
      } else {
        // Create new sub-question
        await axiosInstance.post('papers/sub-questions/', payload);
        Swal.fire('Success', 'Sub-question added successfully.', 'success');
      }

      setFormData({
        question: id || '',
        option_label: '',
        text: '',
      });
      setIsAddSubQuestionPopupOpen(false);
      fetchSubQuestions();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.non_field_errors && error.response.data.non_field_errors[0]) ||
                          'Failed to save sub-question.';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseFormPopup = () => {
    setIsAddSubQuestionPopupOpen(false);
    setFormData({
      question: id || '',
      option_label: '',
      text: '',
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
          Sub Questions {question && `- Question ${question.number}`}
        </h2>
        <button 
          onClick={() => navigate(-1)} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Questions
        </button>
      </div>
      
      {question && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Question Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><strong>Question Number:</strong> {question.number}</div>
            <div><strong>Marks:</strong> {question.marks}</div>
            <div><strong>Question Type:</strong> {question.question_type}</div>
            <div><strong>BL:</strong> {question.bl || 'N/A'}</div>
            <div><strong>CO:</strong> {question.co || 'N/A'}</div>
            <div><strong>PO:</strong> {question.po || 'N/A'}</div>
          </div>
        </div>
      )}
      
      <div className='btnsss'>
        <div className="add-user-container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="add-user-btn" onClick={handleAddSubQuestion}>
            Add Sub Question
          </button>
        </div>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Option Label</th>
            <th>Question Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subQuestions.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No sub-questions found.</td>
            </tr>
          ) : (
            subQuestions.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#9b59b6',
                    color: 'white',
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '30px',
                    fontWeight: 'bold'
                  }}>
                    {item.option_label}
                  </span>
                </td>
                <td style={{ maxWidth: '400px', wordWrap: 'break-word' }}>{item.text}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleEditSubQuestion(item)}
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
                      onClick={() => handleDeleteSubQuestion(item.id)}
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
            ))
          )}
        </tbody>
      </table>

      {/* Add/Edit Sub Question Form Popup */}
      {isAddSubQuestionPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxWidth: '600px', width: '90%' }}>
            <h3 style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px', marginBottom: '24px', color: '#2c3e50' }}>
              {formData.id ? '✏️ Edit Sub Question' : '➕ Add Sub Question'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Option Label *</label>
                <select
                  name="option_label"
                  value={formData.option_label}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc', backgroundColor: '#fff' }}
                  required
                >
                  <option value="">-- Select Option --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Question Text *</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter the sub-question text here..."
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
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCloseFormPopup}
                  disabled={submitLoading}
                  style={{ padding: '10px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{ padding: '10px 16px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                >
                  {submitLoading ? '⏳ Saving...' : (formData.id ? '✅ Update Sub Question' : '✅ Save Sub Question')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubQuestions;
