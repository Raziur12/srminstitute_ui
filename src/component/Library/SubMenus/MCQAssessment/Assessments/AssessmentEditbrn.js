import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const AssessmentEditbrn = ({
  fetchAssessments,
  selectedTest,
  setShowPopup,
}) => {

  const [startDate, setStartDate] = useState(selectedTest?.start_date_time || '');
  const [endDate, setEndDate] = useState(selectedTest?.end_date_time || '');
  const [duration, setDuration] = useState(selectedTest?.duration || '');
  const [isCheck, setIsCheck] = useState(selectedTest?.is_active || false);
  const [isRandomized, setIsRandomized] = useState(selectedTest?.is_randomized || false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (selectedTest) {
      setStartDate(selectedTest.start_date_time ? selectedTest.start_date_time.slice(0, 16) : '');
      setEndDate(selectedTest.end_date_time ? selectedTest.end_date_time.slice(0, 16) : '');
      setDuration(selectedTest.duration || '');
      setIsCheck(selectedTest.is_active || false);
      setIsRandomized(selectedTest.is_randomized || false);
    }
  }, [selectedTest]);

  // Convert UTC to IST with offset
  const convertUTCToISTWithOffset = (utcDate) => {
    const date = new Date(utcDate);
    const offset = 5.5 * 60 * 60 * 1000; // IST offset
    const istDate = new Date(date.getTime() + offset);
    const formattedDate = istDate.toISOString().slice(0, 19);
    return `${formattedDate}+05:30`;
  };

  const handleUpdateTest = async () => {
    setLoading(true); // Start loader
    try {
      const fieldsToUpdate = {
        start_date_time: startDate ? convertUTCToISTWithOffset(startDate) : '',
        end_date_time: endDate ? convertUTCToISTWithOffset(endDate) : '',
        duration,
        is_active: isCheck,
        is_randomized: isRandomized,
      };
  
      const updatedFields = {};
  
      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] !== selectedTest[key]) {
          updatedFields[key] = fieldsToUpdate[key];
        }
      });
  
      if (file) {
        updatedFields['test_file'] = file;
      }
  
      if (Object.keys(updatedFields).length === 0) {
        Swal.fire('Info', 'No changes detected.', 'info');
        setLoading(false);
        return;
      }
  
      let payload;
      let headers = {};
  
      if (file) {
        payload = new FormData();
        Object.entries(updatedFields).forEach(([key, value]) => {
          payload.append(key, value);
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = updatedFields;
      }
  
      const response = await axiosInstance.put(
        `/assessments/tests/${selectedTest.id}/`,
        payload,
        { headers }
      );
  
      if (response.status >= 200 && response.status < 300) {
        Swal.fire('Success', 'Test updated successfully!', 'success');
        fetchAssessments();
        setShowPopup(false);
      }
    } catch (error) {
      console.error('Error updating test', error);
      const errorMessage = error.response?.data?.message || 'Failed to update the test.';
      const validationErrors = error.response?.data?.errors;
  
      const formattedErrors = validationErrors
        ? Object.entries(validationErrors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n')
        : '';
  
      Swal.fire({
        title: 'Error',
        text: `${errorMessage}\n\n${formattedErrors}`,
        icon: 'error',
      });
    } finally {
      setLoading(false); // Stop loader
    }
  };
  

  return (
    <div>
      <h3>Edit Test</h3>
      <label>
        Start Date:
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </label>
      <label>
        End Date:
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={
            startDate
              ? new Date(new Date(startDate).getTime() + 1 * 60000).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16)
          }
        />
      </label>

      <div className="form-group">
        <label htmlFor="duration">Duration (in minutes)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isCheck}
            onChange={(e) => setIsCheck(e.target.checked)}
          />
          Is Check
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isRandomized}
            onChange={(e) => setIsRandomized(e.target.checked)}
          />
          Is Randomized
        </label>
      </div>

      <div className="form-group">
      {selectedTest?.test_file && (
  <>
    <label>
      Existing Assessment File: {selectedTest?.test_file?.split('/').pop()}
</label>

  </>
)}
        <label htmlFor="fileUpload" style={{ display: 'block', marginTop: '10px' }}>
          Upload New Assessment File (.xlsx):
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="popup-actions">
  <button className="popup-button" onClick={handleUpdateTest} disabled={loading}>
    {loading ? 'Saving...' : 'Save'}
  </button>
  <button className="popup-button" onClick={() => setShowPopup(false)} disabled={loading}>
    Cancel
  </button>
</div>

    </div>
  );
};

export default AssessmentEditbrn;
