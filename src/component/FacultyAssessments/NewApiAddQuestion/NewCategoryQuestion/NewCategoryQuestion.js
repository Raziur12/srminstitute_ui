import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';
import '../../../../Styles/Faculty/faculty.css';

const NewCategoryQuestion = () => {
  const { id } = useParams(); // Category ID
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState(null);
  const [isAddQuestionPopupOpen, setIsAddQuestionPopupOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category: id || '',
    number: '',
    marks: '',
    bl: '',
    co: '',
    po: '',
    question_type: 'subjective',
  });

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`papers/paper-categories/${id}/`);
      const categoryData = res.data.data;
      console.log('Category data:', categoryData); // Debug log
      setCategory(categoryData);
    } catch (error) {
      console.error('Failed to fetch category', error);
      Swal.fire('Error', 'Failed to fetch category details', 'error');
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get(`papers/questions/?category_id=${id}`);
      setQuestions(res.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch questions', error);
      Swal.fire('Error', 'Failed to fetch questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategory();
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddQuestion = () => {
    setFormData({
      category: id || '',
      number: '',
      marks: '',
      bl: '',
      co: '',
      po: '',
      question_type: 'subjective',
    });
    setIsAddQuestionPopupOpen(true);
  };

  const handleEditQuestion = (question) => {
    setFormData({
      id: question.id,
      category: id || '',
      number: question.number.toString(),
      marks: question.marks.toString(),
      bl: question.bl?.toString() || '',
      co: question.co?.toString() || '',
      po: question.po?.toString() || '',
      question_type: question.question_type,
    });
    setIsAddQuestionPopupOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the question and all its sub-questions!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`papers/questions/${questionId}/`);
        Swal.fire('Deleted!', 'Question has been deleted.', 'success');
        fetchQuestions();
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Failed to delete question.', 'error');
      }
    }
  };

  const handleManageSubQuestions = (questionId) => {
    navigate(`/sub-questions/${questionId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const { number, marks, question_type } = formData;

    if (!number || !marks || !question_type) {
      Swal.fire('Error', 'Please fill all required fields.', 'warning');
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        category: parseInt(formData.category),
        number: parseInt(formData.number),
        marks: parseInt(formData.marks),
        bl: formData.bl ? parseInt(formData.bl) : null,
        co: formData.co ? parseInt(formData.co) : null,
        po: formData.po ? parseInt(formData.po) : null,
        question_type: formData.question_type,
      };

      if (formData.id) {
        // Update existing question
        await axiosInstance.put(`papers/questions/${formData.id}/`, payload);
        Swal.fire('Success', 'Question updated successfully.', 'success');
      } else {
        // Create new question
        await axiosInstance.post('papers/questions/', payload);
        Swal.fire('Success', 'Question added successfully.', 'success');
      }

      setFormData({
        category: id || '',
        number: '',
        marks: '',
        bl: '',
        co: '',
        po: '',
        question_type: 'subjective',
      });
      setIsAddQuestionPopupOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save question.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseFormPopup = () => {
    setIsAddQuestionPopupOpen(false);
    setFormData({
      category: id || '',
      number: '',
      marks: '',
      bl: '',
      co: '',
      po: '',
      question_type: 'subjective',
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
          Questions {category && `- Category ${category.category}`}
        </h2>
        <button 
          onClick={() => {
            // Navigate back to paper-category with the questionpaper ID
            console.log('Category object:', category); // Debug log
            const questionpaperId = category?.questionpaper || category?.questionpaper_id || category?.question_paper || category?.id || '';
            console.log('Navigating to:', `/paper-category/${questionpaperId}`); // Debug log
            
            if (questionpaperId) {
              navigate(`/paper-category/${questionpaperId}`);
            } else {
              // Fallback: navigate back using browser history
              navigate(-1);
            }
          }} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Categories
        </button>
      </div>
      
      {category && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Category Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><strong>Category:</strong> {category.category}</div>
            <div><strong>Instruction:</strong> {category.instruction}</div>
            <div><strong>Each Question Marks:</strong> {category.each_question_marks}</div>
            <div><strong>Total Questions:</strong> {category.total_questions}</div>
          </div>
        </div>
      )}
      
      <div className='btnsss'>
        <div className="add-user-container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="add-user-btn" onClick={handleAddQuestion}>
            Add Question
          </button>
        </div>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Question No.</th>
            <th>Marks</th>
            <th>BL</th>
            <th>CO</th>
            <th>PO</th>
            <th>Question Type</th>
            <th>Sub Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No questions found.</td>
            </tr>
          ) : (
            questions.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '30px',
                    fontWeight: 'bold'
                  }}>
                    {item.number}
                  </span>
                </td>
                <td>{item.marks}</td>
                <td>{item.bl || '-'}</td>
                <td>{item.co || '-'}</td>
                <td>{item.po || '-'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: item.question_type === 'mcq' ? '#3498db' : 
                                   item.question_type === 'subjective' ? '#e67e22' : '#9b59b6',
                    color: 'white'
                  }}>
                    {item.question_type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{
                    color: item.sub_questions?.length > 0 ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {item.sub_questions?.length || 0}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleManageSubQuestions(item.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      📝 Sub Questions
                    </button>
                    <button 
                      onClick={() => handleEditQuestion(item)}
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
                      onClick={() => handleDeleteQuestion(item.id)}
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

      {/* Add/Edit Question Form Popup */}
      {isAddQuestionPopupOpen && (
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
          <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px', marginBottom: '24px', color: '#2c3e50' }}>
              {formData.id ? '✏️ Edit Question' : '➕ Add Question'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Question Number *</label>
                  <input
                    type="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Marks *</label>
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc' }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>BL</label>
                  <input
                    type="number"
                    name="bl"
                    value={formData.bl}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>CO</label>
                  <input
                    type="number"
                    name="co"
                    value={formData.co}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>PO</label>
                  <input
                    type="number"
                    name="po"
                    value={formData.po}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc' }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Question Type *</label>
                <select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ccc', backgroundColor: '#fff' }}
                  required
                >
                  <option value="subjective">Subjective</option>
                  <option value="mcq">MCQ</option>
                  <option value="either_or">Either/Or</option>
                </select>
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
                  {submitLoading ? '⏳ Saving...' : (formData.id ? '✅ Update Question' : '✅ Save Question')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NewCategoryQuestion;
