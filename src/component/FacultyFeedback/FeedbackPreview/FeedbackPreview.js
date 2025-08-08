import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../interceptor/axiosInstance';
import '../../../Styles/FeedbackPreview.css';
import BackButton from '../../BackButton';

const FeedbackPreview = () => {
  const location = useLocation();
  const facultyId = location.state?.facultyId;
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    if (facultyId) {
      axiosInstance
        .post('feedback/admin-faculty-feedback/', { faculty_id: facultyId })
        .then((res) => {
          setFeedbackData(res.data.data);
        })
        .catch((error) => {
          console.error('Error fetching feedback:', error);
        });
    }
  }, [facultyId]);

  if (!feedbackData) {
    return (
      <div className="feedback-preview-container">
        <h2 className="feedback-preview-title">Feedback Preview</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const { profile, consolidated_feedback, comments } = feedbackData;

  return (
    <div className="feedback-preview-container">
      <BackButton />
      <h2 className="feedback-preview-title">Faculty Feedback Report</h2>

      <table className="feedback-preview-table">
        <tbody>
          <tr>
            <th colSpan="2" className="section-header">Faculty Details</th>
          </tr>
          <tr><td>Name</td><td>{profile.title} {profile.first_name} {profile.last_name}</td></tr>
          <tr><td>Email</td><td>{profile.email}</td></tr>
          <tr><td>Department</td><td>{profile.profile?.department}</td></tr>
          <tr><td>Designation</td><td>{profile.profile?.designation}</td></tr>
          <tr><td>Date of Joining</td><td>{profile.profile?.doj}</td></tr>

          <tr>
            <th colSpan="2" className="section-header">Feedback Scores</th>
          </tr>
          {Object.entries(consolidated_feedback).map(([key, value]) => (
            <tr key={key}>
              <td>{key.replace(/_/g, ' ')}</td>
              <td>{value}</td>
            </tr>
          ))}

          <tr>
            <th colSpan="2" className="section-header">Student Comments</th>
          </tr>
          {Object.entries(comments).map(([key, values]) => (
            <tr key={key}>
              <td>{key.replace(/_/g, ' ')}</td>
              <td>
                <ul className="feedback-preview-comment-list">
                  {values.map((comment, idx) => (
                    <li key={idx}>{comment}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackPreview;
