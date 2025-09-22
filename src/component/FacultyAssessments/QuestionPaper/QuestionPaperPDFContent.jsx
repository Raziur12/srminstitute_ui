import React from 'react'

const QuestionPaperPDFContent = ({ questionPaper, questionPaperId }) => {
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

  // Get all categories dynamically
  const categories = questionPaper.categories || []

  return (
    <div id="question-paper-content" style={{
      backgroundColor: 'white',
      padding: '8mm 15mm 15mm 15mm', // Reduced padding for more content
      fontFamily: 'Times New Roman, serif',
      color: '#000',
      fontSize: '11px', // Smaller font for more content
      lineHeight: '1.2', // Tighter line height
      maxWidth: '210mm',
      margin: '0 auto',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      
      {/* Header with Logo and Institute Info */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '3px', // Reduced margin
        fontFamily: 'Times New Roman, serif',
        marginTop: '0px'
      }}>
        <div style={{ 
          display: 'flex', 
          // alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '3px' // Reduced margin
        }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}> {/* Reduced font and margin */}
            SRM Institute of Science and Technology
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}> {/* Reduced font and margin */}
            Faculty of Management Studies
          </div>
          <div style={{ fontSize: '10px', marginBottom: '5px' }}> {/* Reduced font and margin */}
            Delhi – Meerut Road, Sikri Kalan, Ghaziabad, Uttar Pradesh – 201204
          </div>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}> {/* Reduced font */}
            Academic Year: {questionPaper.academic_year || '2024-25 (EVEN)'}
          </div>
        </div>
            <div style={{ marginLeft: '15px' }}>
              <img 
                src="/static/media/srm-logo-cmpny.66553ef44736779f7948.png" 
                alt="SRM Logo" 
                style={{ 
                  width: '120px', // Reduced logo size
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '5px 0' }} /> {/* Reduced margin */}
        </div>

        {/* Test Details */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '3px', // Reduced margin
          fontSize: '10px', // Reduced font size
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

        {/* Display all categories dynamically */}
        {categories.length > 0 ? (
          categories
            .sort((a, b) => {
              // Sort by category name (A, B, C, D, etc.)
              const getPartLetter = (cat) => {
                if (cat.category) {
                  // Extract letter from "Part A", "A", etc.
                  const match = cat.category.match(/([A-Z])/);
                  return match ? match[1] : cat.category;
                }
                return String.fromCharCode(65 + categories.indexOf(cat));
              };
              
              const categoryA = getPartLetter(a);
              const categoryB = getPartLetter(b);
              return categoryA.localeCompare(categoryB);
            })
            .map((category, sortedIndex) => (
            category.questions && category.questions.length > 0 && (
              <div key={category.id || sortedIndex} style={{ 
                marginBottom: '8px', // Reduced margin
                fontFamily: 'Times New Roman, serif', 
                marginTop: sortedIndex === 0 ? '10px' : '15px', // Reduced margins
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  Part - {category.category || String.fromCharCode(65 + sortedIndex)}
                </div>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '10px'
                }}>
                  <div>{category.instruction || 'Answer all questions'}</div>
                  <div>({category.questions.length}Q x {category.each_question_marks || '2'}M = {(category.questions.length * (category.each_question_marks || 2))} Marks)</div>
                </div>
                
                {sortedIndex === 0 && (
                  <div style={{ display: 'flex', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold', marginTop: '10px' }}>
                    <div style={{ width: '50px', textAlign: 'center' }}>Q.No</div>
                    <div style={{ flex: 1, textAlign: 'left' }}> Question</div>
                    <div style={{ width: '60px', textAlign: 'center' }}>Marks</div>
                    <div style={{ width: '40px', textAlign: 'center' }}>BL</div>
                    <div style={{ width: '40px', textAlign: 'center' }}>CO</div>
                    <div style={{ width: '40px', textAlign: 'center' }}>PO</div>
                  </div>
                )}
                
                {category.questions.map((question, questionIndex) => (
                  <div key={question.id || questionIndex} style={{ 
                    display: 'flex', 
                    // marginBottom: '15px', 
                    fontSize: '12px',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                    marginTop: '6px'
                  }}>
                    <div style={{ width: '50px', textAlign: 'center', paddingTop: '2px' }}>
                      {sortedIndex === 0 ? (questionIndex + 1) : `${questionIndex + 1}.`}
                    </div>
                    <div style={{ flex: 1 }}>
                      {question.sub_questions && question.sub_questions.length > 0 ? (
                        <div>
                          {/* Main Question Text/Title */}
                          <div style={{ 
                            // marginBottom: '10px', 
                            fontWeight: 'bold',
                            fontSize: '12px',
                          }}>
                            {question.text || question.question_type || `Question ${questionIndex + 1}`}
                          </div>
                          
                          {/* Sub Questions */}
                          {question.sub_questions.map((sub, subIndex) => (
                            <div key={sub.id || subIndex} style={{ 
                              // marginBottom: '8px',
                              marginLeft: '15px',
                              pageBreakInside: 'avoid',
                              breakInside: 'avoid'
                            }}>
                              <div style={{
                                textIndent: '-20px',
                                paddingLeft: '20px',
                                lineHeight: '1.4'
                              }}>
                                {sub.option_label ? `(${sub.option_label}) ` : ''}
                                {sub.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{question.text || question.question_type}</div>
                      )}
                    </div>
                    <div style={{ width: '60px', textAlign: 'center', paddingTop: '2px' }}>
                      {question.marks || category.each_question_marks || '2'}
                    </div>
                    {sortedIndex === 0 && (
                      <>
                        <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                          {question.bloom_level || question.bl || ''}
                        </div>
                        <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                          {question.course_outcome || question.co || ''}
                        </div>
                        <div style={{ width: '40px', textAlign: 'center', paddingTop: '2px' }}>
                          {question.program_outcome || question.po || ''}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          ))
        ) : (
          <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#666', marginTop: '50px' }}>
            No question data available
          </div>
        )}
        
        {/* Footer for every page */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5mm 14mm',
          fontSize: '10px',
          color: '#000',
          fontFamily: 'Times New Roman, serif',
          pageBreakInside: 'avoid'
        }}>
          <span>Question Paper ID: {questionPaperId || questionPaper?.id || 'N/A'}</span>
          <span>Created: {questionPaper?.created_at ? new Date(questionPaper.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
        </div>
    </div>
  )
}

export default QuestionPaperPDFContent