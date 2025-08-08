import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const EditDepartment = ({ departmentData, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (departmentData) {
      setName(departmentData.name || '');
    }
  }, [departmentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put(`programs/departments/${departmentData.id}/`, {
        name,
      });

      Swal.fire('Success', 'Department updated successfully.', 'success');
      onSuccess();
    } catch (error) {
      console.error('Update failed:', error);
      Swal.fire('Error', 'Failed to update department.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="popup-content bg-white p-6 rounded shadow-md w-96 relative">
        <div className="program-table-add-header-close-btn flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Department</h2>
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-1.5"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
