import React, { useState, useEffect } from "react";
import QuestionPopup from "./QuestionPOPup";
import axiosInstance from "../../../interceptor/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../BackButton";
import AddOneQuestion from "./AddOneQuestion";
import Swal from "sweetalert2";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const QuestionPaperTable = () => {
  const location = useLocation();
  const assessmentId = location.state?.questions;
  const navigate = useNavigate();

  const [questionsData, setQuestionsData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleNavigate = async (page = 1, size = pageSize, search = debouncedSearch) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`papers/questions/`, {
        params: {
          question_paper_id: assessmentId,
          page,
          page_size: size,
          search,
        },
      });
      setQuestionsData(response.data.data.data || []);
      setNextPage(response.data.data.pagination?.next);
      setPrevPage(response.data.data.pagination?.previous);
      setPageNumber(page);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId) handleNavigate(1, pageSize, debouncedSearch);
  }, [assessmentId, pageSize, debouncedSearch]);

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPageNumber(1);
    handleNavigate(1, newSize, debouncedSearch);
  };

  const handleNextPage = () => {
    if (nextPage) handleNavigate(pageNumber + 1, pageSize, debouncedSearch);
  };

  const handlePrevPage = () => {
    if (prevPage) handleNavigate(pageNumber - 1, pageSize, debouncedSearch);
  };

  const fetchQuestionDetails = async (questionID) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`papers/questions/${questionID}/`);
      setSelectedQuestion(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching question details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateOption = (questionID) => {
    navigate("/QuestionOptionsTable", { state: { questionID } });
  };

  const toggleEditPopup = () => {
    setShowPopup(!showPopup);
    setSelectedQuestion(null);
  };

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this Question!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setDeletingQuestionId(questionId);
          await axiosInstance.delete(`/papers/questions/${questionId}/`);
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
          return false;
        } finally {
          setDeletingQuestionId(null);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (confirm.isConfirmed) {
      Swal.fire("Deleted!", "The question has been deleted.", "success");
      handleNavigate(pageNumber, pageSize, debouncedSearch);
    }
  };

  return (
    <div className="relative p-4">
      <div className="question-page-dropdown flex justify-between items-center mb-4">
        <BackButton />
        <div className="flex items-center gap-3">
        
          <label className="mr-2 font-semibold">Page Size:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border p-1 rounded"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
          <button className="assessments-button" onClick={toggleAddPopup}>
            Add Question
          </button>
        </div>

      </div>
      <input
            type="text"
            className="border p-1 rounded w-60"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Question</th>
            <th className="p-2 text-left">Marks</th>
            <th className="p-2 text-left">Question Type</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                Loading data...
              </td>
            </tr>
          ) : (
            questionsData.map((question) => (
              <tr key={question.id} className="border-b">
                <td className="p-2">
                  {(question.text || "")
                    .replaceAll("\r", "")
                    .split("\n")
                    .map((line, i) => (
                      <React.Fragment key={i}>
                        <span style={{ whiteSpace: "pre-wrap" }}>{line}</span>
                        <br />
                      </React.Fragment>
                    ))}
                </td>
                <td className="p-2">{question.marks}</td>
                <td className="p-2">{question.question_type?.toLowerCase()}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="assessments-button"
                    onClick={() => fetchQuestionDetails(question.id)}
                  >
                    Edit
                  </button>
                  <button
  className={`assessments-button ${
    ["short", "long"].includes(question.question_type?.toLowerCase())
      ? "bg-gray-300 cursor-not-allowed"
      : ""
  }`}
  onClick={() => handleNavigateOption(question.id)}
  disabled={["short", "long"].includes(question.question_type?.toLowerCase())}
>
  Options
</button>

                  <button
                    className="assessments-button"
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deletingQuestionId === question.id}
                  >
                    {deletingQuestionId === question.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="assessments-pagination mt-4 flex items-center">
        <button
          className="pagination-button bg-gray-300 px-3 py-1 rounded mr-2"
          onClick={handlePrevPage}
          disabled={!prevPage}
        >
          Prev
        </button>
        <span className="pagination-page">Page {pageNumber}</span>
        <button
          className="pagination-button bg-gray-300 px-3 py-1 rounded ml-2"
          onClick={handleNextPage}
          disabled={!nextPage}
        >
          Next
        </button>
      </div>

      {showPopup && (
        <QuestionPopup
          onClose={toggleEditPopup}
          questionData={selectedQuestion}
          loading={loading}
          refreshData={() => handleNavigate(pageNumber, pageSize, debouncedSearch)}
        />
      )}

      {showAddPopup && (
        <AddOneQuestion
          onClose={toggleAddPopup}
          assessmentId={assessmentId}
          refreshData={() => handleNavigate(pageNumber, pageSize, debouncedSearch)}
        />
      )}
    </div>
  );
};

export default QuestionPaperTable;
