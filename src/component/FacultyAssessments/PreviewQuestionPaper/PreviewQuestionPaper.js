import React, { useEffect, useState } from "react";
import axiosInstance from "../../../interceptor/axiosInstance";
import { useLocation } from "react-router-dom";
import BackButton from "../../BackButton";

const PreviewQuestionPaper = () => {
  const location = useLocation();
  const { testId } = location.state || {};
  const [paperData, setPaperData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = axiosInstance.defaults.baseURL;
  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  useEffect(() => {
    if (testId) {
      setLoading(true);
      axiosInstance
        .get(`papers/preview-question-paper/?question_paper_id=${testId}`)
        .then((response) => {
          if (response.data.status === "success") {
            setPaperData(response.data.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
        });
    }
  }, [testId]);

  const getOptionStyle = (isCorrect) => ({
    padding: "10px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: isCorrect ? "#d4edda" : "#f9f9f9",
  });

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <BackButton />
      <h1 style={{ fontSize: "28px", margin: "20px 0", fontWeight: "bold" }}>
        Preview Question Paper
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : paperData ? (
        <>
          <div style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            backgroundColor: "#f8f8f8"
          }}>
            <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
              {paperData.question_paper.name}
            </h2>
            <p><strong>Subject:</strong> {paperData.question_paper.subject}</p>
            <p><strong>Semester:</strong> {paperData.question_paper.semester}</p>
            <p><strong>Duration:</strong> {paperData.question_paper.duration} minutes</p>
            <p><strong>Total Marks:</strong> {paperData.question_paper.marks}</p>
            <p style={{ marginTop: "10px", whiteSpace: "pre-line" }}>
              {paperData.question_paper.description}
            </p>
          </div>

          {Object.entries(paperData.grouped_questions).map(([section, questions], sIndex) => (
            <div key={section} style={{ marginBottom: "40px" }}>
              <h2 style={{
                backgroundColor: "#e0e0e0",
                padding: "10px 15px",
                borderRadius: "5px",
                fontSize: "20px"
              }}>
                Section - {section}
              </h2>

              {questions.map((question, qIndex) => (
                <div key={question.id} style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginTop: "15px"
                }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                    Q{qIndex + 1}. {question.text} ({question.marks} marks)
                  </h3>

                  {question.image && (
                    <img
                      src={`${baseURL}${question.image}`}
                      alt="Question"
                      style={{ maxWidth: "300px", marginBottom: "15px" }}
                    />
                  )}

                  {["MCSR", "MCMR"].includes(section.toUpperCase()) && question.options?.length > 0 ? (
                    <div style={{ marginTop: "10px" }}>
                      {question.options.map((opt, oIndex) => (
                        <div key={opt.id} style={getOptionStyle(opt.is_correct)}>
                          <label>
                            <input
                              type={section === "MCSR" ? "radio" : "checkbox"}
                              checked={opt.is_correct}
                              readOnly
                              disabled
                              style={{ marginRight: "10px" }}
                            />
                            <strong>{optionLabels[oIndex]}.</strong> {opt.text}
                          </label>
                          {opt.image && (
                            <div style={{ marginTop: "8px" }}>
                              <img
                                src={`${baseURL}${opt.image}`}
                                alt="Option"
                                style={{ maxWidth: "200px" }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (["SHORT", "LONG"].includes(section.toUpperCase()) && (
                    <textarea
                      disabled
                      placeholder="Answer here..."
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        backgroundColor: "#f2f2f2"
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PreviewQuestionPaper;
