import React from 'react'

const QuestionPaperPDFContent = ({ questionPaper }) => {
  if (!questionPaper) return null

  // Helper function to render questions for each part
  const renderQuestions = (questions, startNumber = 1) => {
    return questions.map((question, index) => (
      <tr key={question.id}>
        <td style={{ 
          width: '40px', 
          textAlign: 'center', 
          verticalAlign: 'top',
          paddingTop: '5px',
          fontSize: '12px'
        }}>
          {startNumber + index}
        </td>
        <td style={{ 
          paddingLeft: '10px', 
          verticalAlign: 'top',
          paddingTop: '5px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {question.sub_questions && question.sub_questions.length > 0 ? (
            <div>
              {question.sub_questions.map((sub, subIndex) => (
                <div key={sub.id} style={{ marginBottom: '8px' }}>
                  <div><strong>({sub.option_label})</strong> {sub.text}</div>
                  {sub.options && sub.options.length > 0 && (
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
            <div>{question.text || question.question_type}</div>
          )}
        </td>
        <td style={{ 
          width: '60px', 
          textAlign: 'center', 
          verticalAlign: 'top',
          paddingTop: '5px',
          fontSize: '12px'
        }}>
          {question.marks || '2'}
        </td>
      </tr>
    ))
  }

  // Split questions into parts based on categories
  const partAQuestions = questionPaper.categories?.[0]?.questions || []
  const partBQuestions = questionPaper.categories?.[1]?.questions || []

  return (
    <div id="question-paper-content" style={{
      backgroundColor: 'white',
      padding: '10mm 20mm 20mm 20mm',
      fontFamily: 'Times New Roman, serif',
      color: '#000',
      fontSize: '12px',
      lineHeight: '1.3',
      maxWidth: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      boxSizing: 'border-box',
      border: '1px solid #ccc'
    }}>
      {/* Header with Logo and Institute Info */}
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
          <div style={{ fontSize: '12px', marginBottom: '10px' }}>
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
          <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '10px 0' }} />
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
          </div>
          <div style={{ textAlign: 'right', textAlignLast: 'left' }}>
            <div><strong>Date & Session:</strong></div>
            <div><strong>Duration: {questionPaper?.duration || '60'} Minutes</strong></div>
            <div><strong>Max. Marks: {questionPaper?.total_marks || '60'}</strong></div>
          </div>
      </div>

        {/* Part A */}
        {partAQuestions.length > 0 && (
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
            
            {partAQuestions.map((question, index) => (
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
                  {question.bloom_level || question.co || ''}
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
        {partBQuestions.length > 0 && (
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
          
            
            {partBQuestions.map((question, index) => (
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
    </div>
  )
}

export default QuestionPaperPDFContent