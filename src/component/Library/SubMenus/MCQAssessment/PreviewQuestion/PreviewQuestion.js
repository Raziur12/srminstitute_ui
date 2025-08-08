import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../interceptor/axiosInstance";
import { useLocation } from "react-router-dom";
import "../../../../../Styles/PreviewTest/PreviewQuestion.css";
import BackButton from "../../../../BackButton";

const PreviewQuestion = () => {
    const location = useLocation();
    const { testId } = location.state || {};
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = axiosInstance.defaults.baseURL;
    const optionLabels = ["A", "B", "C", "D", "E", "F"];

    useEffect(() => {
        if (testId) {
            setLoading(true);
            axiosInstance.get(`assessments/segments/${testId}/`)
                .then(response => {
                    if (response.data.status === "success") {
                        setQuestions(response.data.data.questions || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching questions:", error);
                    setLoading(false);
                });
        }
    }, [testId]);

    const getOptionClass = (question, option) => {
        const isCorrect = option.is_correct;
        return `option-item ${isCorrect ? "correct" : ""}`;
    };

    return (
        <div className="preview-question-container">

            <div className="preview-header">
                
            <BackButton />
            </div>
            <h1 className="preview-title">Preview Questions</h1>
  
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading...</p>
                </div>
            ) : questions.length > 0 ? (
                questions.map((question, qIndex) => (
                    <div key={question.id} className="question-card">
                        <h2 className="question-text">
                            {qIndex + 1}. {question.text}
                        </h2>

                        {question.image && (
                            <img
                                src={`${baseURL}${question.image}`}
                                alt="Question"
                                className="question-image"
                            />
                        )}

                        <div className="options-container">
                            {question.question_type.toUpperCase() === "SUBJECTIVE" ? (
                                <textarea
                                    className="subjective-input"
                                    placeholder="Type your answer here..."
                                    value=""
                                    disabled
                                />
                            ) : question.options?.length > 0 ? (
                                question.options.map((option, oIndex) => (
                                    <label
                                        key={option.id}
                                        className={getOptionClass(question, option)}
                                    >
                                     
                                        <span className="option-label">{optionLabels[oIndex]}. </span>
                                        {option.text}
                                        {option.image && (
                                            <img
                                                src={`${baseURL}${option.image}`}
                                                alt="Option"
                                                className="option-image"
                                            />
                                        )}
                                        <input
                                            type={["MCSR", "EITHEROR"].includes(question.question_type.toUpperCase()) ? "radio" : "checkbox"}
                                            name={`question-${question.id}`}
                                            disabled
                                            checked={option.is_correct}
                                            readOnly
                                        />
                                    </label>
                                ))
                            ) : (
                                <p className="no-options">No options available</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-questions">No questions available</p>
            )}
        </div>
    );
};

export default PreviewQuestion;
