import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../Styles/Insights/ContentBox.css";
import axiosInstance from '../../interceptor/axiosInstance';
import { format } from 'date-fns';
import ReleaseResult from './ReleaseResult';
import TrustDataDownloadBtn from './TrustDataDownloadBtn';
import AnswerPDFDownload from './AnswerPDFDownload';
import SummaryPDFDownload from './SummaryPDFDownload';
import DeleteUserInTable from './DeleteUserInTable';
import BackButton from '../BackButton';

const Insights = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { testId } = location.state || {}; // Access state data safely

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [releasePopup, setReleasePopup] = useState(false); // For editing popup
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Edit button click
  const handleReleaseClick = () => {
    setReleasePopup(true);
  };

  useEffect(() => {
    if (testId) {
      axiosInstance.get(`reports/test_details/${testId}/`)
        .then((response) => {
          setReport(response.data?.data);
        })
        .catch((err) => {
          setError('Failed to fetch data');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('Invalid Test ID');
    }
  }, [testId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!report || Object.keys(report).length === 0) return <p>This test is not started yet or no user has submitted it.</p>;


  // const handleTrustNavigate = async (user_id, testId) => {
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.post('reports/test_summary_report/', {
  //       test_id: testId,
  //       user_id: user_id,  // Fixed the incorrect 'attemptId'
  //     });
  
  //     // Navigate and send API response to next page
  //     navigate('/trust', { state: {  reportData: response.data } });
  //   } catch (error) {
  //     setError(error.response?.data?.message || 'Failed to fetch data.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleTrustNavigate = (user_id, testId) => {
    const newTabUrl = `/trust?user_id=${user_id}&testId=${testId}`;
    window.open(newTabUrl, "_blank");
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedUsers = report?.users ? [...report.users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let valA = a[sortConfig.key] || '';
    let valB = b[sortConfig.key] || '';
  
    // Handle date fields properly
    const dateFields = ['created_at', 'start_date_time', 'end_date_time'];
    if (dateFields.includes(sortConfig.key)) {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }
  
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
  
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];
  

  
  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  // const handleAnswerBtnDownload = (attemptId, testId) => {
  //   navigate("/answer", { state: { attemptId, testId } });
  // };

  const handleAnswerBtnDownload = (attemptId, testId) => {
    const newTabUrl = `/answer?attemptId=${attemptId}&testId=${testId}`;
    window.open(newTabUrl, "_blank");
  };
  
  
  return (
    <div className='insight-report-main-container'>
      <div className='back-btn'>
      <BackButton />
      </div>
      <h1 className='insight-report-title'>{report?.test?.start_date_time ? format(new Date(report?.test?.start_date_time), 'dd-MM-yyyy HH:mm') : 'N/A'} Online MCQ Test - {report?.test?.name || 'N/A'}</h1>
      <p className='insight-report-subtitle'>Reports of all test takers and their attempts</p>

      <div className='insight-box-container'>

        <div className='insight-test-type-quiz'>
          <p className='insight-test-type-quiz-title'><span>Test Type: </span> Open Quiz</p>
          <p className='insight-test-type-quiz-attempts'>{report?.test?.name || 'N/A'} Quiz</p>
        </div>

        <div className='insight-test-type-quiz'>
          <p className='insight-test-type-quiz-title'>Created on</p>
          <p className='insight-test-type-quiz-attempts'>{report?.test?.created_at ? format(new Date(report?.test?.created_at), 'dd-MM-yyyy HH:mm') : 'N/A'}</p>
        </div>

      </div>



      <div className='insight-reports-section'>
        <h2 className='reports-section'>Reports</h2>
        <p className='reports-section-report-title'>Test Attempt reports of your test takers</p>

        <div className='insight-reports-section-side'>
          <p className='section-side-title'>Summary</p>
          <div className='download-summary'>
            <SummaryPDFDownload
              testId={testId}
            />

            <p className='download-summary-sub-title'>Click to download the table below as Excel</p>
          </div>
        </div>

        <div className='insight-reports-section-side-relse'>
          <p className='section-side-title'>Release Result</p>
          <div className='download-summary'>
            <p
              className='download-summary-title'
              onClick={handleReleaseClick}
            >
              Click Here
            </p>
            <p className='download-summary-sub-title'>Release the user Result</p>
          </div>
        </div>
      </div>

      <div className='submission-summary'>
        <h2 className='summary-title'>Submission Summary</h2>
        <h3 className='summary-sub-title'>How many users started and submitted the test</h3>

        <div className='submission-summary-box'>
          <div className='box-submitted'>
            <p className='box-submitted-title'>Total Num</p>
            <p className='box-submitted-number'>{report?.total || 0}</p>
          </div>

          <div className='box-submitted'>
            <p className='box-submitted-title'>Completed Num</p>
            <p className='box-submitted-number'>{report?.users_completed || 0}</p>
          </div>

          <div className='box-submitted'>
            <p className='box-submitted-title'>Incomplete Num</p>
            <p className='box-submitted-number'>{report?.users_incomplete || 0}</p>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
          <th onClick={() => handleSort('name')}>Name {getSortArrow('name')}</th>
            <th onClick={() => handleSort('email')}>Email {getSortArrow('email')}</th>
            <th onClick={() => handleSort('category')}>Category{getSortArrow('category')}</th>
            <th onClick={() => handleSort('created_at')}>Created</th>
            <th onClick={() => handleSort('start_date_time')}>Started</th>
            <th onClick={() => handleSort('end_date_time')}>Duration</th>
            <th>Complete/Auto</th>
            <th>Trust Score</th>
            <th>Score</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {sortedUsers.length > 0 ? (
    sortedUsers.map((attempt) => (
      <tr
        key={attempt.id}
        style={{
          backgroundColor:
            attempt?.trust_score !== null &&
            attempt?.trust_score !== undefined &&
            attempt?.trust_score < 20
              ? 'red'
              : 'transparent',
          color:
            attempt?.trust_score < 20 ? 'white' : 'black', // Ensures readability
        }}
      >
        <td>{attempt.name || 'N/A'}</td>
        <td>{attempt.email || 'N/A'}</td>
        <td>{attempt.category || 'N/A'}</td>
        <td>
          {attempt.start_time
            ? format(new Date(attempt.start_time), 'dd-MM-yyyy HH:mm')
            : 'N/A'}
        </td>
        <td>
          {attempt.end_time
            ? format(new Date(attempt.end_time), 'dd-MM-yyyy HH:mm')
            : 'N/A'}
        </td>
        <td>{attempt.duration ? attempt.duration : 'N/A'}</td>
        <td>{attempt.submit_type}</td>
        <td>
          {attempt?.trust_score === null || attempt?.trust_score === undefined
            ? 'N/A'
            : attempt?.trust_score === 0
            ? '0'
            : attempt?.trust_score}
          <p
            onClick={() => handleTrustNavigate(attempt.user_id, testId)}
            className='download-summary-table'
          >
            View Report
          </p>
        </td>
        <td >
  {attempt.score !== null &&
  attempt.score !== undefined &&
  attempt.total_marks
    ? attempt.total_marks !== 0
      ? `${((attempt.score / attempt.total_marks) * 100).toFixed(2)}% (${attempt.score} / ${attempt.total_marks})`
      : '0% (0 / 0)'
    : 'N/A'}
  <br />
  <p 
   className='download-summary-table'
  onClick={() => handleAnswerBtnDownload(attempt.user_id, testId)}
  >Answer Report
  </p>
</td>

        <td>
          <DeleteUserInTable attemptId={attempt.test_submitted_id} />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan='10'>No data available</td>
    </tr>
  )}
</tbody>

      </table>

      {releasePopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setReleasePopup(false)}>
              &times;
            </span>
            <ReleaseResult
              user={report}
              onClose={() => setReleasePopup(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Insights;
