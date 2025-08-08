import React, { useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const AddSemester = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      setError('Please enter the semester name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('programs/semesters/', { name });

      Swal.fire({
        title: 'Success!',
        text: 'Semester added successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setName('');
        onSuccess(); // Trigger table refresh and close
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Something went wrong.';
      setError(errorMessage);

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="popup-content bg-white p-6 rounded shadow-md w-96 relative">
       <div className="program-table-add-header-close-btn">
       <h2 className="text-lg font-semibold mb-4">Add Semester</h2>
        <span
          className="mouse-of-popup"
          onClick={onClose}
        >
          &times;
        </span>
</div>
        

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="block mb-1">
              Semester Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSemester;
