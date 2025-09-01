import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../../Styles/Faculty/faculty.css';
import axiosInstance from '../../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const NewPaperCategory = () => {
  const { id } = useParams(); // Question paper ID
  const navigate = useNavigate();
  const [activeData, setActiveData] = useState([]);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [isAddCategoryPopupOpen, setIsAddCategoryPopupOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    questionpaper: id || '',
    category: '',
    instruction: '',
    each_question_marks: '',
    total_questions: '',
  });

  const fetchQuestionPaper = async () => {
    try {
      const res = await axiosInstance.get(`papers/question-papers/${id}/`);
      setQuestionPaper(res.data.data);
    } catch (error) {
      console.error('Failed to fetch question paper', error);
      Swal.fire('Error', 'Failed to fetch question paper details', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(`papers/paper-categories/?questionpaper_id=${id}`);
      console.log('Categories API Response:', res.data); // Debug log
      
      // Handle different possible response structures
      let categories = [];
      if (res.data.data) {
        if (Array.isArray(res.data.data)) {
          categories = res.data.data;
        } else if (res.data.data.data && Array.isArray(res.data.data.data)) {
          categories = res.data.data.data;
        } else if (res.data.data.results && Array.isArray(res.data.data.results)) {
          categories = res.data.data.results;
        }
      } else if (Array.isArray(res.data)) {
        categories = res.data;
      }
      
      console.log('Processed categories:', categories); // Debug log
      setActiveData(categories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      Swal.fire('Error', 'Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestionPaper();
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleAddCategory = () => {
    setFormData({
      questionpaper: id || '',
      category: '',
      instruction: '',
      each_question_marks: '',
      total_questions: '',
    });
    setIsAddCategoryPopupOpen(true);
  };

  const handleEditCategory = (category) => {
    setFormData({
      id: category.id,
      questionpaper: id || '',
      category: category.category,
      instruction: category.instruction,
      each_question_marks: category.each_question_marks.toString(),
      total_questions: category.total_questions.toString(),
    });
    setIsAddCategoryPopupOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the category and all its questions!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`papers/paper-categories/${categoryId}/`);
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        fetchCategories();
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Failed to delete category.', 'error');
      }
    }
  };

  const handleManageQuestions = (categoryId) => {
    navigate(`/new-category-question/${categoryId}`);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    setSubmitLoading(true);

    if (!formData.category || !formData.instruction || !formData.each_question_marks || !formData.total_questions) {
      Swal.fire('Error', 'Please fill all required fields.', 'warning');
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        questionpaper: parseInt(formData.questionpaper),
        category: formData.category.toUpperCase(),
        instruction: formData.instruction,
        each_question_marks: parseInt(formData.each_question_marks),
        total_questions: parseInt(formData.total_questions),
      };

      if (formData.id) {
        // Update existing category
        await axiosInstance.put(`papers/paper-categories/${formData.id}/`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Paper category updated successfully!',
          confirmButtonColor: '#27ae60',
        });
      } else {
        // Create new category
        await axiosInstance.post('papers/paper-categories/', payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Paper category created successfully!',
          confirmButtonColor: '#27ae60',
        });
      }

      setIsAddCategoryPopupOpen(false);
      fetchCategories();
      setFormData({
        questionpaper: id || '',
        category: '',
        instruction: '',
        each_question_marks: '',
        total_questions: '',
      });
    } catch (error) {
      console.error('Submit error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to save paper category.',
        confirmButtonColor: '#e74c3c',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseFormPopup = () => {
    setIsAddCategoryPopupOpen(false);
    setFormData({
      questionpaper: id || '',
      category: '',
      instruction: '',
      each_question_marks: '',
      total_questions: '',
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
          Paper Categories {questionPaper && `- ${questionPaper.name}`}
        </h2>
        <button 
          onClick={() => navigate('/faculty')} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Question Papers
        </button>
      </div>
      
      {questionPaper && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Question Paper Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><strong>Academic Year:</strong> {questionPaper.academic_year}</div>
            <div><strong>Session:</strong> {questionPaper.date_and_session}</div>
            <div><strong>Semester:</strong> {questionPaper.year_and_semester}</div>
            <div><strong>Total Marks:</strong> {questionPaper.total_marks}</div>
            <div><strong>Duration:</strong> {questionPaper.duration} minutes</div>
          </div>
        </div>
      )}
      
      <div className='btnsss'>
        <div className="add-user-container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="add-user-btn" onClick={handleAddCategory}>
            Add Paper Category
          </button>
        </div>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Instruction</th>
            <th>Each Question Marks</th>
            <th>Total Questions</th>
            <th>Questions Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No categories found.</td>
            </tr>
          ) : (
            activeData.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '30px',
                    fontWeight: 'bold'
                  }}>
                    {item.category}
                  </span>
                </td>
                <td>{item.instruction}</td>
                <td>{item.each_question_marks}</td>
                <td>{item.total_questions}</td>
                <td>
                  <span style={{
                    color: item.questions?.length > 0 ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {item.questions?.length || 0} / {item.total_questions}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleManageQuestions(item.id)}
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
                      📝 Manage Questions
                    </button>
                    <button 
                      onClick={() => handleEditCategory(item)}
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
                      onClick={() => handleDeleteCategory(item.id)}
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

      {isAddCategoryPopupOpen && (
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
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h3
              style={{
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '24px',
                marginBottom: '1.5rem',
              }}
            >
              {formData.id ? '✏️ Edit Paper Category' : '➕ Add Paper Category'}
            </h3>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ccc',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">-- Select Category --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Instruction */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                Instruction *
              </label>
              <input
                name="instruction"
                type="text"
                value={formData.instruction}
                onChange={handleFormChange}
                placeholder="e.g. Answer any 2 questions"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ccc',
                }}
              />
            </div>

            {/* Each Question Marks and Total Questions in one row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {/* Each Question Marks */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                  Each Question Marks *
                </label>
                <input
                  name="each_question_marks"
                  type="number"
                  value={formData.each_question_marks}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #ccc',
                  }}
                />
              </div>

              {/* Total Questions */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                  Total Questions *
                </label>
                <input
                  name="total_questions"
                  type="number"
                  value={formData.total_questions}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #ccc',
                  }}
                />
              </div>
            </div>



            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleCloseFormPopup}
                disabled={submitLoading}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={submitLoading}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#2ecc71',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {submitLoading ? '⏳ Saving...' : (formData.id ? '✅ Update Category' : '✅ Save Category')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewPaperCategory;
