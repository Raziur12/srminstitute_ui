import React from 'react'

const QuestionPaperPDFContent = ({ questionPaper }) => {
  if (!questionPaper) return null

  return (
    <div id="question-paper-content" style={{
      backgroundColor: 'white',
      padding: '40px',
      fontFamily: 'Times New Roman, serif',
      color: '#000',
      fontSize: '12px',
      lineHeight: '1.4',
      maxWidth: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0',
          letterSpacing: '2px'
        }}>
          {questionPaper.name || 'Question Paper'}
        </h1>
      </div>

      {/* Academic Details - Left and Right aligned */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'left',
      }}>
        <div >
          <div><strong>Academic Year:</strong> {questionPaper.academic_year}</div>
          <div><strong>Year & Semester:</strong> {questionPaper.year_and_semester}</div>
          <div><strong>Date & Session:</strong> {questionPaper.date_and_session}</div>
        </div>
        <div>
          <div><strong>Total Marks:</strong> {questionPaper.total_marks}</div>
          <div><strong>Duration:</strong> {questionPaper.duration} minutes</div>
          <div><strong>Created By:</strong> {questionPaper.created_by.first_name} {questionPaper.created_by.last_name}</div>
        </div>
      </div>

      {/* Horizontal line */}
      <hr style={{
        border: 'none',
        borderTop: '1px solid #000',
        margin: '20px 0 30px 0'
      }} />

      {/* Categories */}
      {questionPaper.categories?.map((category, catIndex) => (
        <div key={category.id} style={{ marginBottom: '30px' }}>
          {/* Category Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            <h2 style={{
              fontSize: '14px',
              margin: '0',
              textDecoration: 'underline'
            }}>
              Category {category.category}
            </h2>
          </div>

          {/* Category Instructions */}
          <div style={{
            fontStyle: 'italic',
            marginBottom: '10px',
            fontSize: '11px',
            textAlign: 'left'
          }}>
            {category.instruction}
          </div>
          <div style={{
            fontSize: '11px',
            marginBottom: '15px',
            textAlign: 'left'
          }}>
            Each Question: 1 marks | Total Questions: {category.questions?.length || 0}
          </div>

          {/* Questions */}
          {category.questions?.map((question, qIndex) => (
            <div key={question.id} style={{
              marginBottom: '20px',
              paddingLeft: '0',
              textAlign: 'left'
            }}>
              {/* Question Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '8px'
              }}>
                <div>
                  <strong>{question.number}. {question.question_type}</strong>
                </div>
                <div style={{ fontSize: '11px' }}>
                  [{question.marks} Marks]
                </div>
              </div>

              {/* Question Details */}
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginBottom: '8px',
                fontStyle: 'italic'
              }}>
                BL: {question.bloom_level || 'N/A'} | CO: {question.course_outcome || 'N/A'} | PO: {question.program_outcome || 'N/A'}
              </div>

              {/* Sub-questions or Main question text */}
              {question.sub_questions?.length > 0 ? (
                <div style={{ marginLeft: '20px' }}>
                  {question.sub_questions.map((sub, subIndex) => (
                    <div key={sub.id} style={{ marginBottom: '10px' }}>
                      <div>
                        <strong>{sub.option_label})</strong> {sub.text}
                      </div>
                      
                      {/* Options if any */}
                      {sub.options?.length > 0 && (
                        <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                          {sub.options.map((opt, optIdx) => (
                            <div key={optIdx} style={{ marginBottom: '2px' }}>
                              {String.fromCharCode(65 + optIdx)}. {opt.option_text || opt.text || opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginLeft: '20px' }}>
                  {question.text || '[No sub-questions]'}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Display message if no categories */}
      {(!questionPaper.categories || questionPaper.categories.length === 0) && (
        <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
          No categories available
        </div>
      )}
    </div>
  )
}

export default QuestionPaperPDFContent