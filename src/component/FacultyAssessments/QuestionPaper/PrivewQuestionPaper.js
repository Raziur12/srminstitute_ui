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
      <div className="preview-wrapper" style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '10mm 20mm 20mm 20mm',
        boxSizing: 'border-box',
        border: '1px solid #ccc'
      }}>
        {/* SRM Institute Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '5px',
          fontFamily: 'Times New Roman, serif',
          marginTop: '0px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '5px'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                SRM Institute of Science and Technology
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '3px' }}>
                Faculty of Management Studies
              </div>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                Delhi – Meerut Road, Sikri Kalan, Ghaziabad, Uttar Pradesh – 201204
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                Academic Year: {questionPaper.academic_year || '2024-25 (EVEN)'}
              </div>
            </div>
            <div style={{ marginLeft: '20px' }}>
              <img 
                src="/static/media/srm-logo-cmpny.66553ef44736779f7948.png" 
                alt="SRM Logo" 
                style={{ 
                  width: '170px', 
                  height: '170px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Test Details */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '5px',
          fontSize: '12px',
          fontFamily: 'Times New Roman, serif',
          textAlign:'left'
        }}>
          <div>
            <div><strong>Test:</strong> {questionPaper?.name || 'Internal Examination I'}</div>
            <div><strong>Course Code & Title:</strong> {questionPaper.course_code || 'Course Code & Title'}</div>
            <div><strong>Year & Sem:</strong> {questionPaper?.year_and_semester || 'Year & Sem'}</div>
            {/* <div style={{ marginTop: '15px' }}><strong>Answer all questions</strong></div> */}
          </div>
          <div style={{ textAlign: 'right', textAlignLast: 'left' }}>
            <div><strong>Date & Session:</strong></div>
            <div><strong>Duration: {questionPaper?.duration || '60'} Minutes</strong></div>
            <div><strong>Max. Marks: {questionPaper?.total_marks || '60'}</strong></div>
          </div>
        </div>

        {/* Part A */}
        {questionPaper.categories && questionPaper.categories[0] && questionPaper.categories[0].questions && questionPaper.categories[0].questions.length > 0 && (
          <div style={{ marginBottom: '40px', fontFamily: 'Times New Roman, serif', marginTop: '5px' }}>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              Part - A
            </div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '10px'
            }}>
              <div>Answer all questions</div>
              <div>(5Q x 2M = 10 Marks)</div>
            </div>
            
            <div style={{ display: 'flex', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
              <div style={{ width: '50px', textAlign: 'center' }}>Q.No</div>
              <div style={{ flex: 1, textAlign: 'left', paddingLeft: '20px' }}> Question</div>
              <div style={{ width: '60px', textAlign: 'center' }}>Marks</div>
              <div style={{ width: '40px', textAlign: 'center' }}>BL</div>
              <div style={{ width: '40px', textAlign: 'center' }}>CO</div>
              <div style={{ width: '40px', textAlign: 'center' }}>PO</div>
            </div>
            
            {questionPaper.categories[0].questions.map((question, index) => (
              <div key={question.id} style={{ 
                display: 'flex', 
                marginBottom: '15px', 
                fontSize: '12px',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}>
                <div style={{ width: '50px', textAlign: 'center', paddingTop: '2px' }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, paddingLeft: '20px', lineHeight: '1.4' }}>
                  {question.sub_questions && question.sub_questions.length > 0 ? (
                    <div>
                      {question.sub_questions.map((sub, subIndex) => (
                        <div key={sub.id} style={{ marginBottom: '8px' }}>
                          <div>{sub.text}</div>
                          {sub.options && sub.options.length > 0 && (
                            <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                              {sub.options.map((opt, optIdx) => (
                                <div key={optIdx} style={{ marginBottom: '2px' }}>
                                  {String.fromCharCode(65 + optIdx)}.&nbsp;{opt.option_text || opt.text || opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>{question.text || question.question_type}</div>
                  )}
                </div>
                <div style={{ width: '60px', textAlign: 'center', paddingTop: '2px' }}>
                  {question.marks || '2'}
                </div>
                <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                  {question.bloom_level || ''}
                </div>
                <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                  {question.course_outcome || question.co || ''}
                </div>
                <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                  {question.program_outcome || question.po || ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Part B */}
        {questionPaper.categories && questionPaper.categories[1] && questionPaper.categories[1].questions && questionPaper.categories[1].questions.length > 0 && (
          <div style={{ marginBottom: '30px', fontFamily: 'Times New Roman, serif' }}>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              Part B
            </div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '10px'
            }}>
              <div>Answer any 5 questions</div>
              <div>(5Q x 10M = 50 Marks)</div>
            </div>
            
            {questionPaper.categories[1].questions.map((question, index) => (
              <div key={question.id} style={{ 
                display: 'flex', 
                marginBottom: '25px', 
                fontSize: '12px',
                alignItems: 'flex-start',
                textAlignLast: 'left'
              }}>
                <div style={{ width: '50px', textAlign: 'center', paddingTop: '2px' }}>
                  {index}.
                </div>
                <div style={{ flex: 1, paddingLeft: '20px', lineHeight: '1.4' }}>
                  {question.sub_questions && question.sub_questions.length > 0 ? (
                    <div>
                      {question.sub_questions.map((sub, subIndex) => (
                        <div key={sub.id} style={{ marginBottom: '15px' }}>
                          <div><strong>{sub.option_label ? `(${sub.option_label})` : ''}</strong> {sub.text}</div>
                          {sub.options && sub.options.length > 0 && (
                            <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                              {sub.options.map((opt, optIdx) => (
                                <div key={optIdx} style={{ marginBottom: '2px' }}>
                                  {String.fromCharCode(65 + optIdx)}.&nbsp;{opt.option_text || opt.text || opt}
                                </div>
                              ))}
                            </div>
                          )}
                          {subIndex < question.sub_questions.length - 1 && (
                            <div style={{ marginTop: '10px', fontSize: '10px', textAlign: 'center' }}>
                              (OR)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>{question.text || question.question_type}</div>
                  )}
                </div>
                <div style={{ width: '60px', textAlign: 'center', paddingTop: '2px' }}>
                  {question.marks || '10'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Display message if no categories */}
        {(!questionPaper.categories || questionPaper.categories.length === 0) && (
          <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#666', marginTop: '50px' }}>
            No question data available
          </div>
        )}

        {/* Footer */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderTop: '1px solid #000',
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
              color: '#000',
              fontSize: '12px'
            }}>
              Question Paper ID: {id}
            </p>
            {questionPaper.created_at && (
              <p style={{
                margin: 0,
                color: '#000',
                fontSize: '12px'
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