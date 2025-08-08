import React, { useEffect, useState } from 'react';
import '../../../Styles/MCQAssessments/MCQAssessment.css';
import axiosInstance from '../../../interceptor/axiosInstance';
import { useNavigate } from 'react-router-dom';
import QuestionPaperEditbrn from './QuestionPaperEditbrn';
import CloneButton from './CloneButton';
import GenerateLinkButton from './GenerateLinkButton';
import Swal from 'sweetalert2';

const QuestionPaper = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      if (typeof valueA === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, [pageNumber, searchQuery, pageSize]);

  const fetchQuestionPapers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`papers/question-papers`, {
        params: {
          page: pageNumber,
          search: searchQuery,
          page_size: pageSize,
        },
      });

      const resData = response.data?.data;
      if (resData?.data) {
        setData(resData.data);
        setCount(resData.pagination?.count);
        setNextPage(resData.pagination?.next);
        setPrevPage(resData.pagination?.previous);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching question papers', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTestFile = async (testId, testName) => {
    try {
      setDownloading(testId);
      const response = await axiosInstance.get(
        `papers/download-question-paper/?question_paper_id=${testId}`,
        { responseType: 'blob' }
      );
  
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${testName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading test file', error);
      Swal.fire('Error', 'Failed to download the file.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  const handlePreviewClick = (assessmentId) => {
    navigate(`/preview-question-paper/${assessmentId}`);
  };

  const handleEditClick = async (test) => {
    try {
      // Fetch the detailed data for editing
      const response = await axiosInstance.get(`papers/question-papers/${test.id}/`);
      const detailedTest = response.data?.data || test;
      setSelectedTest(detailedTest);
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching test details:', error);
      Swal.fire('Error', 'Failed to fetch test details for editing.', 'error');
    }
  };

  const handleCategoryClick = (assessmentId) => {
    // Navigate to paper category page
    navigate(`/paper-category/${assessmentId}`);
  };

  const handleDeleteClick = async (assessmentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Question Paper?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`papers/question-papers/${assessmentId}/`);
        Swal.fire('Deleted!', 'The question paper has been deleted.', 'success');
        fetchQuestionPapers(); // 🔁 Refresh table after deletion
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.fire('Error', 'Failed to delete the question paper.', 'error');
      }
    } else {
      Swal.close();
    }
  };
  
  const handleChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="assessments-container">
      <div className='drop-search-assement'>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <select
          id="pageSize"
          value={pageSize}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <table className="assessments-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {getSortArrow('name')}</th>
            <th onClick={() => handleSort('academic_year')}>Academic Year {getSortArrow('academic_year')}</th>
            <th onClick={() => handleSort('year_and_semester')}>Year & Semester {getSortArrow('year_and_semester')}</th>
            <th onClick={() => handleSort('date_and_session')}>Date & Session {getSortArrow('date_and_session')}</th>
            <th onClick={() => handleSort('duration')}>Duration (min) {getSortArrow('duration')}</th>
            <th onClick={() => handleSort('total_marks')}>Total Marks {getSortArrow('total_marks')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center">Loading...</td></tr>
          ) : sortedData.length > 0 ? (
            sortedData.map((assessment) => (
              <tr key={assessment.id} className={assessment.submitted ? 'submitted-row' : ''}>
                <td>{assessment.name}</td>
                <td>{assessment.academic_year}</td>
                <td>{assessment.year_and_semester}</td>
                <td>{assessment.date_and_session}</td>
                <td>{assessment.duration} mins</td>
                <td>{assessment.total_marks}</td>
                <td className="button-group-assess">
                  <div className="button-grid">
                    <button
                      className="assessments-button"
                      onClick={() => handleEditClick(assessment)}
                    >
                      Edit
                    </button>
                    <button
                      className="assessments-button"
                      onClick={() => handleCategoryClick(assessment.id)}
                    >
                      Category
                    </button>
                    <button
                      className="assessments-button"
                      onClick={() => handleDeleteClick(assessment.id)}
                    >
                      Delete
                    </button>
                    <button
                    onClick={() => handlePreviewClick(assessment.id)} 
                    >Preview</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No question papers found</td></tr>
          )}
        </tbody>
      </table>

      <div className="assessments-pagination">
        <button
          className="pagination-button"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={!prevPage}
        >
          Prev
        </button>
        <span className="pagination-page">Page {pageNumber}</span>
        <button
          className="pagination-button"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={!nextPage}
        >
          Next
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <QuestionPaperEditbrn
              fetchAssessments={fetchQuestionPapers}
              selectedTest={selectedTest}
              setShowPopup={setShowPopup}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPaper;
