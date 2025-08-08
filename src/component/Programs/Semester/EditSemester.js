import React, { useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const EditSemester = ({ semesterData, onClose, onSuccess }) => {
  const [semesterName, setSemesterName] = useState(semesterData?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.put(`programs/semesters/${semesterData.id}/`, {
        name: semesterName,
      });

      Swal.fire({
        title: 'Updated!',
        text: response?.data?.message || 'Semester updated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        onSuccess();
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Something went wrong.';
      setError(errorMsg);

      Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="program-table-add-header-close-btn">
          <h2 className="text-lg font-semibold">Edit Semester</h2>
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            &times;
          </span>
        </div>

        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="semester" className="block mb-1">
              Semester Name
            </label>
            <input
              id="semester"
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                width: '96%',
              }}
              required
            />
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{marginTop:'2rem'}}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSemester;
