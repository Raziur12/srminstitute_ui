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
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            letterRendering: true
          },
          jsPDF: { 
            unit: 'pt', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: '.page-break-avoid'
          }
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
        <QuestionPaperPDFContent questionPaper={questionPaper} />
        
        {/* Footer */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderTop: '1px solid #000',
          textAlign: 'center',
          marginTop: '20px'
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
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '20px',
          padding: '20px'
        }}>
         
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