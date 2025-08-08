// File: PreviewQuestionPaper.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../interceptor/axiosInstance'
import html2pdf from 'html2pdf.js'
import Swal from 'sweetalert2'
import QuestionPaperPDFContent from './QuestionPaperPDFContent'
// import '../../../Styles/QuestionPaperPreview/PreviewQuestionPaper.css'
import '../../../Styles/QuestionPaperPreview/QuestionPaperPreview.css'

const PreviewQuestionPaper = () => {
  const { id } = useParams()
  const [questionPaper, setQuestionPaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [error, setError] = useState(null)
  const [showPDFModal, setShowPDFModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`papers/question-papers/${id}/`)
        setQuestionPaper(res.data.data)
      } catch (err) {
        setError("Failed to load paper")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

   // Helper function to render image
  const renderImage = (imageUrl, altText = "Question Image", maxWidth = "100%", maxHeight = "300px") => {
    if (!imageUrl) return null
    
    return (
      <div style={{
        marginTop: '10px',
        textAlign: 'center'
      }}>
        <img 
          src={imageUrl} 
          alt={altText}
          style={{
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}
          onError={(e) => {
            e.target.style.display = 'none'
            console.error('Failed to load image:', imageUrl)
          }}
        />
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('question-paper-content')
    if (!element) {
      Swal.fire("Error", "No content to export", "error")
      return
    }

    setDownloadingPDF(true)

    try {
      const images = element.querySelectorAll('img')
      for (const img of images) {
        const response = await fetch(img.src)
        const blob = await response.blob()
        const base64 = await new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
        img.src = base64
      }

      await html2pdf()
        .set({
          margin: 10,
          filename: `${questionPaper.name || 'Question_Paper'}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save()

      Swal.fire("Downloaded", "PDF downloaded successfully", "success")
      setShowPDFModal(false) // Close modal after successful download
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to generate PDF", "error")
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleOpenPDFModal = () => {
    setShowPDFModal(true)
  }

  const handleClosePDFModal = () => {
    setShowPDFModal(false)
  }

  if (loading) return <div className="preview-container">Loading...</div>
  if (error) return <div className="preview-container">{error}</div>
  if (!questionPaper) return <div className="preview-container">No question paper data found.</div>

  return (
    <>
    <div className="preview-container">
      <div className="preview-wrapper">
        <div className="header-box">
          <h1>{questionPaper?.name || 'Question Paper Preview'}</h1>
          <div className="header-details">
            <span>Academic Year: {questionPaper?.academic_year}</span>
            <span>Year & Semester: {questionPaper?.year_and_semester}</span>
            <span>Date & Session: {questionPaper?.date_and_session}</span>
          </div>
        </div>

        {/* <div className="info-cards"> */}
         <div style={{
          padding: '30px',
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {questionPaper.duration && (
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 5px', color: '#495057', fontSize: '14px' }}>Duration</h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#212529' }}>
                  {questionPaper.duration} minutes
                </p>
              </div>
            )}
            {questionPaper.total_marks && (
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 5px', color: '#495057', fontSize: '14px' }}>Total Marks</h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#212529' }}>
                  {questionPaper.total_marks}
                </p>
              </div>
            )}
            {questionPaper.categories && (
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 5px', color: '#495057', fontSize: '14px' }}>Categories</h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#212529' }}>
                  {questionPaper.categories.length}
                </p>
              </div>
            )}
            {questionPaper.created_by && (
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 5px', color: '#495057', fontSize: '14px' }}>Created By</h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#212529' }}>
                  {questionPaper.created_by.first_name} {questionPaper.created_by.last_name}
                </p>
              </div>
            )}
          </div>
           <button
          onClick={handleOpenPDFModal}
          style={{
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minWidth: '140px',
              justifyContent: 'center'
            }}
        >
          📄 Download PDF
        </button>
        </div>
        {/* </div> */}

         {/* Categories and Questions Section */}
        <div style={{ padding: '30px' }}>
          <h2 style={{
            margin: '0 0 25px',
            fontSize: '24px',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Question Categories
          </h2>

          {questionPaper.categories && questionPaper.categories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {questionPaper.categories.map((category, categoryIndex) => (
                <div key={category.id} style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#fafbfc'
                }}>
                  {/* Category Header */}
                  <div style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '20px 25px',
                    borderBottom: '1px solid #2980b9'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '600'
                      }}>
                        Category {category.category}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        fontSize: '14px'
                      }}>
                        {category.each_question_marks && (
                          <span style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: '20px'
                          }}>
                            {category.each_question_marks} marks each
                          </span>
                        )}
                        {category.total_questions && (
                          <span style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: '20px'
                          }}>
                            {category.total_questions} questions
                          </span>
                        )}
                      </div>
                    </div>
                    {category.instruction && (
                      <p style={{
                        margin: '10px 0 0',
                        fontSize: '16px',
                        opacity: 0.9
                      }}>
                        {category.instruction}
                      </p>
                    )}
                  </div>

                  {/* Questions in Category */}
                  <div style={{ padding: '25px' }}>
                    {category.questions && category.questions.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {category.questions.map((question, questionIndex) => (
                          <div key={question.id} style={{
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: 'white'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '15px',
                              marginBottom: '15px'
                            }}>
                              <div style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: '600',
                                flexShrink: 0
                              }}>
                                {question.number}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  marginBottom: '10px',
                                  flexWrap: 'wrap'
                                }}>
                                  <span style={{
                                    backgroundColor: '#f39c12',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                  }}>
                                    {question.question_type}
                                  </span>
                                  {question.marks && (
                                    <span style={{
                                      backgroundColor: '#27ae60',
                                      color: 'white',
                                      padding: '4px 12px',
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: '600'
                                    }}>
                                      {question.marks} marks
                                    </span>
                                  )}
                                  {question.co && (
                                    <span style={{
                                      backgroundColor: '#9b59b6',
                                      color: 'white',
                                      padding: '4px 12px',
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: '600'
                                    }}>
                                      CO: {question.co}
                                    </span>
                                  )}
                                  {question.po && (
                                    <span style={{
                                      backgroundColor: '#34495e',
                                      color: 'white',
                                      padding: '4px 12px',
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: '600'
                                    }}>
                                      PO: {question.po}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Sub Questions */}
                            {question.sub_questions && question.sub_questions.length > 0 && (
                              <div style={{ marginLeft: '50px' }}>
                                {question.sub_questions.map((subQuestion, subIndex) => (
                                  <div key={subQuestion.id} style={{
                                    marginBottom: '15px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #e9ecef'
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '10px',
                                      marginBottom: '10px'
                                    }}>
                                      {subQuestion.option_label && (
                                        <div style={{
                                          backgroundColor: '#6c757d',
                                          color: 'white',
                                          width: '25px',
                                          height: '25px',
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '12px',
                                          fontWeight: '600',
                                          flexShrink: 0
                                        }}>
                                          {subQuestion.option_label}
                                        </div>
                                      )}
                                      <div style={{ flex: 1 }}>
                                        <p style={{
                                          margin: '0 0 10px',
                                          fontSize: '16px',
                                          color: '#2c3e50',
                                          lineHeight: '1.5'
                                        }}>
                                          {subQuestion.text}
                                        </p>
                                        
                                        {/* Question Image */}
                                        {subQuestion.image && renderImage(subQuestion.image, "Question Image")}
                                        
                                        {/* Options for MCQ */}
                                        {subQuestion.options && subQuestion.options.length > 0 && (
                                          <div style={{ marginTop: '10px' }}>
                                            <h5 style={{
                                              margin: '0 0 8px',
                                              fontSize: '14px',
                                              color: '#6c757d',
                                              fontWeight: '600'
                                            }}>
                                              Options:
                                            </h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                              {subQuestion.options.map((option, optionIndex) => (
                                                <div key={optionIndex} style={{
                                                  display: 'flex',
                                                  alignItems: 'flex-start',
                                                  gap: '8px',
                                                  padding: '6px 10px',
                                                  backgroundColor: 'white',
                                                  borderRadius: '4px',
                                                  border: '1px solid #dee2e6'
                                                }}>
                                                  <div style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    border: '2px solid #6c757d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    color: '#6c757d',
                                                    flexShrink: 0,
                                                    marginTop: '2px'
                                                  }}>
                                                    {String.fromCharCode(65 + optionIndex)}
                                                  </div>
                                                  <div style={{ flex: 1 }}>
                                                    <span style={{ fontSize: '14px', color: '#495057' }}>
                                                      {option.option_text || option.text || option}
                                                    </span>
                                                    {/* Option Image */}
                                                    {option.image && renderImage(option.image, `Option ${String.fromCharCode(65 + optionIndex)} Image`, "200px", "150px")}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Question Image (if no sub-questions) */}
                            {(!question.sub_questions || question.sub_questions.length === 0) && question.image && (
                              <div style={{ marginLeft: '50px', marginTop: '10px' }}>
                                {renderImage(question.image, "Question Image")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#6c757d'
                      }}>
                        <p style={{ margin: 0, fontSize: '16px' }}>No questions in this category.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6c757d'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No categories available for this paper.</p>
            </div>
          )}
        </div>

         {/* Footer */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px 30px',
          borderTop: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <p style={{
              margin: 0,
              color: '#6c757d',
              fontSize: '14px'
            }}>
              Question Paper ID: {id}
            </p>
            {questionPaper.created_at && (
              <p style={{
                margin: 0,
                color: '#6c757d',
                fontSize: '14px'
              }}>
                Created: {new Date(questionPaper.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* PDF Preview Modal */}
    {showPDFModal && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Modal Header */}
          <div style={{
            padding: '20px 30px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px 12px 0 0'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              PDF Preview - {questionPaper?.name || 'Question Paper'}
            </h3>
            <button
              onClick={handleClosePDFModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6c757d',
                padding: '5px',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px'
          }}>
            <div id="question-paper-content">
              <QuestionPaperPDFContent questionPaper={questionPaper} />
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '20px 30px',
            borderTop: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px'
          }}>
            <button
              onClick={handleClosePDFModal}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              style={{
                backgroundColor: downloadingPDF ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: downloadingPDF ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                minWidth: '140px',
                justifyContent: 'center'
              }}
            >
              {downloadingPDF ? 'Downloading...' : '📄 Download PDF'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default PreviewQuestionPaper