import React, { useState } from 'react'
import "../../Styles/Faculty/faculty.css";
import QuestionPaper from './QuestionPaper/QuestionPaper';
// import AddQuestionPaper from './AddQustionPaper/AddQuestionPaper';
import axiosInstance from '../../interceptor/axiosInstance';
import axios from 'axios';
import Swal from 'sweetalert2';
// import AddQuestionPaperNew from './NewApiAddQuestion/AddQuestionPaperNew/AddQuestionPaperNew';

const FacultyAssessmentMain = () => {
  const [activeData, setActiveData] = useState(<QuestionPaper />);
  const [csvloading, setCsvLoading] = useState(false);
  const [isFileCheckPopupOpen, setIsFileCheckPopupOpen] = useState(false);
  const [isAddQuestionPopupOpen, setIsAddQuestionPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileCheckResponse, setFileCheckResponse] = useState(null);
  const [isResponsePopupOpen, setIsResponsePopupOpen] = useState(false);

  // Form state for Add Question Paper popup
  const [formData, setFormData] = useState({
    name: '',
    academic_year: '',
    date_and_session: '',
    year_and_semester: '',
    total_marks: '',
    duration: '',
    question_file: null,
    created_by: localStorage.getItem('user_id'),
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleDownloadXLSX = () => {
    setCsvLoading(true);
    axiosInstance
      .get('reports/download_template/?type=question_paper', {
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'template.xlsx'; // fallback filename

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Swal.fire({
          title: 'Success!',
          text: 'XLSX file download successful.',
          icon: 'success',
        });
      })
      .catch(() => {
        Swal.fire({
          title: 'Error!',
          text: 'XLSX file download failed. Please try again.',
          icon: 'error',
        });
      })
      .finally(() => {
        setCsvLoading(false);
      });
  };

  const handleCheckFile = () => {
    setIsFileCheckPopupOpen(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitFile = () => {
    if (!selectedFile) {
      Swal.fire('No file selected', 'Please choose a file before submitting.', 'warning');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/octet-stream' // fallback for some systems
    ];

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      Swal.fire('Invalid File Type', 'Please select a valid Excel file (.xlsx or .xls)', 'error');
      return;
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      Swal.fire('File Too Large', 'Please select a file smaller than 10MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('question_file', selectedFile, selectedFile.name); // Include filename

    // Log FormData contents for debugging
    console.log('File being uploaded:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
      lastModified: selectedFile.lastModified
    });

    // Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value);
    }

    setUploading(true);

    // Create a separate axios instance for file uploads without default Content-Type
    const uploadAxios = axios.create({
      baseURL: axiosInstance.defaults.baseURL,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      }
    });

    uploadAxios
      .post('papers/validate-excel/', formData)
      .then((response) => {
        console.log('Upload success response:', response);
        setFileCheckResponse({
          type: 'success',
          title: 'File Validation Successful',
          message: 'File validated successfully!',
          data: response.data
        });
        setIsFileCheckPopupOpen(false);
        setIsResponsePopupOpen(true);
        setSelectedFile(null);
      })
      // .catch((error) => {
      //   console.error('Validation error:', error);
      //   console.error('Error response data:', error?.response?.data);
      //   console.error('Error response status:', error?.response?.status);

      //   let errorMessage = 'File validation failed!';
      //   // let errorDetails = '';
      //   let errorDetails = 'No additional details provided by server. Please check Excel format, headers, or empty rows.';


      //   if (error?.response?.data) {
      //     const responseData = error.response.data;
      //     console.log("🚨 Full error response:", JSON.stringify(responseData, null, 2)); // ✅ helpful for debug
      //     // Handle different types of error responses
      //     if (typeof responseData === 'string') {
      //       errorMessage = responseData;
      //     } else if (responseData.message) {
      //       errorMessage = responseData.message;
      //     } else if (responseData.error) {
      //       errorMessage = responseData.error;
      //     } else if (responseData.detail) {
      //       errorMessage = responseData.detail;
      //     }

      //     // Collect all error details
      //     const errorDetailsArray = [];

      //     // Handle field-specific errors
      //     if (responseData.errors) {
      //       Object.keys(responseData.errors).forEach(field => {
      //         const fieldErrors = responseData.errors[field];
      //         if (Array.isArray(fieldErrors)) {
      //           fieldErrors.forEach(err => errorDetailsArray.push(`${field}: ${err}`));
      //         } else {
      //           errorDetailsArray.push(`${field}: ${fieldErrors}`);
      //         }
      //       });
      //     }

      //     // Handle non-field errors
      //     if (responseData.non_field_errors) {
      //       responseData.non_field_errors.forEach(err => errorDetailsArray.push(err));
      //     }

      //     // Handle other potential error arrays
      //     if (Array.isArray(responseData)) {
      //       responseData.forEach(err => errorDetailsArray.push(err));
      //     }

      //     // Combine all error details
      //     if (errorDetailsArray.length > 0) {
      //       errorDetails = errorDetailsArray.join('\n');
      //     }
      //   }

      //   // Set error response for popup
      //   setFileCheckResponse({
      //     type: 'error',
      //     title: 'Validation Error',
      //     message: errorMessage,
      //     details: errorDetails
      //   });
      //   setIsFileCheckPopupOpen(false);
      //   setIsResponsePopupOpen(true);
      // })
      .catch((error) => {
        console.error('Validation error:', error);

        let errorMessage = 'File validation failed!';
        let errorDetails = 'Unknown error occurred.';

        const responseData = error?.response?.data;

        if (!error.response) {
          errorMessage = 'Server not reachable or CORS error.';
          errorDetails = 'Make sure the backend allows cross-origin requests from this frontend domain.';
        }
        if (responseData?.message) {
          errorMessage = responseData.message;
        }

        // ✅ Extract nested errors array (your case!)
        const nestedErrors = responseData?.data?.errors;
        if (Array.isArray(nestedErrors) && nestedErrors.length > 0) {
          errorDetails = nestedErrors.join('\n');
        }

        setFileCheckResponse({
          type: 'error',
          title: 'Validation Error',
          message: errorMessage,
          details: errorDetails
        });

        setIsFileCheckPopupOpen(false);
        setIsResponsePopupOpen(true);
      })

      .finally(() => {
        setUploading(false);
      });
  };


  const handleClosePopup = () => {
    setIsFileCheckPopupOpen(false);
    setSelectedFile(null);
  };

  const handleCloseResponsePopup = () => {
    setIsResponsePopupOpen(false);
    setFileCheckResponse(null);
  };

  // Add Question Paper popup handlers
  const handleAddQuestionPaper = () => {
    setFormData({
      name: '',
      academic_year: '',
      date_and_session: '',
      year_and_semester: '',
      total_marks: '',
      duration: '',
      question_file: null,
      created_by: localStorage.getItem('user_id'),
    });
    setIsAddQuestionPopupOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'question_file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async () => {
    setSubmitLoading(true);
    try {
      const data = new FormData();

      // Append all form fields except the file and object fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'question_file' &&
          key !== 'created_by' &&
          key !== 'categories' &&
          key !== 'created_at' &&
          key !== 'id' &&
          key !== 'submitted' &&
          formData[key] !== null &&
          formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      // Append file separately with proper handling
      if (formData.question_file) {
        data.append('question_file', formData.question_file);
      }

      await axiosInstance.post('papers/question-papers/', data);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Question paper created successfully!',
        confirmButtonColor: '#27ae60'
      });

      setIsAddQuestionPopupOpen(false);
      setFormData({
        name: '',
        academic_year: '',
        date_and_session: '',
        year_and_semester: '',
        total_marks: '',
        duration: '',
        question_file: null,
        created_by: localStorage.getItem('user_id'),
      });
    } catch (error) {
      console.error('Submit error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || error.response?.data?.error || 'Failed to save question paper',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseFormPopup = () => {
    setIsAddQuestionPopupOpen(false);
    setFormData({
      name: '',
      academic_year: '',
      date_and_session: '',
      year_and_semester: '',
      total_marks: '',
      duration: '',
      question_file: null,
      created_by: localStorage.getItem('user_id'),
    });
  };

  return (
    <div className="mcq-assessment">
      <h2 className="assessments-title">Question Paper</h2>
      <div className='btnsss'>
        <div className="add-user-container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className='assment-download-btn'>
            <button className='add-user-btn' onClick={handleCheckFile}>Check File</button>
          </div>
          <div className='assment-download-btn'>
            <button className='add-user-btn' onClick={handleDownloadXLSX}>Download Question Paper Template</button>
          </div>
          <button className="add-user-btn" onClick={handleAddQuestionPaper}>
            Add Question Paper
          </button>
        </div>
      </div>

      {/* File Check Popup */}
      {isFileCheckPopupOpen && (
        <div style={{
          position: 'fixed',
          top: '0', left: '0', right: '0', bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '16px',
            minWidth: '400px',
            maxHeight: '60vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <h3 style={{
              marginBottom: '1.5rem',
              fontSize: '24px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>📁 Upload Excel File</h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{
                marginBottom: '2rem',
                display: 'block',
                margin: '0 auto 2rem auto',
                padding: '12px',
                border: '2px dashed #bdc3c7',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <button
                onClick={handleSubmitFile}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #007BFF, #0056b3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  flex: '1'
                }}
                disabled={uploading}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!uploading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {uploading ? '⏳ Uploading...' : '✅ Submit'}
              </button>
              <button
                onClick={handleClosePopup}
                style={{
                  padding: '12px 24px',
                  background: '#95a5a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  flex: '1'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#7f8c8d';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#95a5a6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Check Response Popup */}
      {isResponsePopupOpen && fileCheckResponse && (
        <div style={{
          position: 'fixed',
          top: '0', left: '0', right: '0', bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '16px',
            minWidth: '500px',
            maxWidth: '700px',
            maxHeight: '60vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                backgroundColor: fileCheckResponse.type === 'success' ? '#d4edda' : '#f8d7da',
                color: fileCheckResponse.type === 'success' ? '#155724' : '#721c24'
              }}>
                {fileCheckResponse.type === 'success' ? '✅' : '❌'}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2c3e50',
                margin: '0'
              }}>
                {fileCheckResponse.title}
              </h3>
            </div>

            {/* Message */}
            <div style={{
              marginBottom: '1.5rem',
              padding: '16px',
              backgroundColor: fileCheckResponse.type === 'success' ? '#d4edda' : '#f8d7da',
              borderRadius: '8px',
              border: `1px solid ${fileCheckResponse.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
              color: fileCheckResponse.type === 'success' ? '#155724' : '#721c24'
            }}>
              <p style={{
                margin: '0',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                {fileCheckResponse.message}
              </p>
            </div>

            {/* Details (if available) */}
            {fileCheckResponse.details && (
              <div style={{
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#34495e',
                  marginBottom: '12px'
                }}>
                  Error Details:
                </h4>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  color: '#495057',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {fileCheckResponse.details}
                </div>
              </div>
            )}

            {/* Parts and Summary Data */}
            {fileCheckResponse.data && fileCheckResponse.data.data && (
              <div style={{
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                {/* Parts Section */}
                {fileCheckResponse.data.data.parts && fileCheckResponse.data.data.parts.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📋 Parts ({fileCheckResponse.data.data.parts.length})
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {fileCheckResponse.data.data.parts.map((part, index) => (
                        <div key={index} style={{
                          padding: '8px 16px',
                          backgroundColor: '#3498db',
                          color: '#fff',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(52, 152, 219, 0.2)'
                        }}>
                          Part {part}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Section */}
                {fileCheckResponse.data.data.summary && (
                  <div>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📊 Summary
                    </h4>
                    <div style={{
                      display: 'grid',
                      gap: '12px'
                    }}>
                      {Object.entries(fileCheckResponse.data.data.summary).map(([part, data]) => (
                        <div key={part} style={{
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: '#f8f9fa'
                        }}>
                          <h5 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#34495e',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            🎯 Part {part}
                          </h5>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '12px'
                          }}>
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6'
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#007bff',
                                marginBottom: '4px'
                              }}>
                                {data.questions}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                              }}>
                                Questions
                              </div>
                            </div>
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6'
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#28a745',
                                marginBottom: '4px'
                              }}>
                                {data.marks}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                              }}>
                                Marks
                              </div>
                            </div>
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6'
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#ffc107',
                                marginBottom: '4px'
                              }}>
                                {data.subjective}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                              }}>
                                Subjective
                              </div>
                            </div>
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6'
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#17a2b8',
                                marginBottom: '4px'
                              }}>
                                {data.mcq}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                              }}>
                                MCQ
                              </div>
                            </div>
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6'
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#6f42c1',
                                marginBottom: '4px'
                              }}>
                                {data.either_or}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                              }}>
                                Either/Or
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errors Section */}
                {fileCheckResponse.data.data.errors && fileCheckResponse.data.data.errors.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#dc3545',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      ⚠️ Errors Found
                    </h4>
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8d7da',
                      borderRadius: '8px',
                      border: '1px solid #f5c6cb',
                      color: '#721c24'
                    }}>
                      {fileCheckResponse.data.data.errors.map((error, index) => (
                        <div key={index} style={{
                          marginBottom: index < fileCheckResponse.data.data.errors.length - 1 ? '8px' : '0',
                          padding: '8px',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          border: '1px solid #f5c6cb'
                        }}>
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleCloseResponsePopup}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #007BFF, #0056b3)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Question Paper Popup */}
      {isAddQuestionPopupOpen && (
        <div style={{
          position: 'fixed',
          top: '0', left: '0', right: '0', bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '60vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            marginTop: '3rem'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              ➕ Add Question Paper
            </h3>

            {/* Form Fields */}
            {[
              ['name', 'Name', 'text'],
              ['academic_year', 'Academic Year', 'text'],
              ['total_marks', 'Total Marks', 'number'],
              ['duration', 'Duration', 'text'],
            ].map(([field, label, type]) => (
              <div key={field} style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#34495e',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>{label}</label>
                <input
                  name={field}
                  type={type}
                  value={formData[field]}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e8ed',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e1e8ed';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
            

            {/* Date & Session field
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Date & Session</label>
              <input
                name="date_and_session"
                type="text"
                value={formData.date_and_session}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div> */}

            {/* Year & Semester field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Year & Semester</label>
              <input
                name="year_and_semester"
                type="text"
                value={formData.year_and_semester}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Question File field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '500',
                color: '#34495e',
                marginBottom: '8px',
                fontSize: '14px'
              }}>Question File</label>
              <input
                type="file"
                name="question_file"
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px dashed #bdc3c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer'
                }}
                accept="*/*"
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #ecf0f1'
            }}>
              <button
                onClick={handleCloseFormPopup}
                style={{
                  padding: '12px 24px',
                  background: '#95a5a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                disabled={submitLoading}
                onMouseEnter={(e) => {
                  if (!submitLoading) {
                    e.target.style.backgroundColor = '#7f8c8d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitLoading) {
                    e.target.style.backgroundColor = '#95a5a6';
                  }
                }}
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                disabled={submitLoading}
                onMouseEnter={(e) => {
                  if (!submitLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {submitLoading ? '⏳ Processing...' : '✅ Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mcq-assessment__content">
        {activeData}
      </div>
    </div>
  );
};

export default FacultyAssessmentMain;
