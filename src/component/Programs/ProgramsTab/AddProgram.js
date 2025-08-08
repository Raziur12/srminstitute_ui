import React, { useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import { AsyncPaginate } from 'react-select-async-paginate';

const AddProgram = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [totalSemesters, setTotalSemesters] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const loadDepartments = async (searchQuery, loadedOptions, { page }) => {
    try {
      const res = await axiosInstance.get(`programs/departments/?search=${searchQuery}&page=${page}`);
      const departments = res.data?.data?.departments || [];

      return {
        options: departments.map((dept) => ({
          value: dept.id,
          label: dept.name,
        })),
        hasMore: !!res.data?.data?.pagination?.next,
        additional: {
          page: page + 1,
        },
      };
    } catch (err) {
      console.error('Error loading departments:', err);
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !totalSemesters || !selectedDepartment) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('programs/programs/', {
        name,
        total_semesters: totalSemesters,
        department: selectedDepartment.value,
      });

      Swal.fire({
        title: 'Success!',
        text: 'Program added successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setName('');
        setTotalSemesters('');
        setSelectedDepartment(null);
        onSuccess();
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
          <h2 className="text-lg font-semibold mb-4">Add Program</h2>
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
              Program Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="block mb-1 text-sm font-medium">Total Semesters</label>
            <input
              type="number"
              name="total_semesters"
              value={totalSemesters}
              onChange={(e) => setTotalSemesters(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Department</label>
            <AsyncPaginate
              value={selectedDepartment}
              loadOptions={loadDepartments}
              onChange={handleDepartmentChange}
              additional={{ page: 1 }}
              isSearchable
              placeholder="Search and select department..."
              className="w-full"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{marginTop:'2rem'}}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProgram;
