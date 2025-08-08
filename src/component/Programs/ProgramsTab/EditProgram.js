import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import { AsyncPaginate } from 'react-select-async-paginate';

const EditProgram = ({ programData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    total_semesters: '',
    department: null, // department ID
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set initial form values
  useEffect(() => {
    if (programData) {
      setFormData({
        name: programData.name || '',
        total_semesters: programData.total_semesters || '',
        department: programData.department?.id || null,
      });

      if (programData.department) {
        setSelectedDepartment({
          value: programData.department.id,
          label: programData.department.name,
        });
      }
    }
  }, [programData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setFormData((prev) => ({
      ...prev,
      department: selectedOption?.value || null,
    }));
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`programs/programs/${programData.id}/`, formData);
      Swal.fire('Success', 'Program updated successfully.', 'success');
      onSuccess();
    } catch (err) {
      console.error('Update failed:', err);
      Swal.fire('Error', 'Failed to update program.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="program-table-add-header-close-btn">
          <h2 className="text-lg font-semibold">Edit Program</h2>
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            &times;
          </span>
        </div>

        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Program Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1.5"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Total Semesters</label>
            <input
              type="number"
              name="total_semesters"
              value={formData.total_semesters}
              onChange={handleChange}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                width: '96%',
              }}
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

          <div style={{ marginTop: '2rem' }}>
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

export default EditProgram;
