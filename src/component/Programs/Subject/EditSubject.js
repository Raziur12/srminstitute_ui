import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import Swal from 'sweetalert2';
import axiosInstance from '../../../interceptor/axiosInstance';
import debounce from 'lodash.debounce';

const pageSize = 10;

const EditSubject = ({ subjectData, onClose, onSuccess }) => {
  const [name, setName] = useState(subjectData?.name || '');
  const [code, setCode] = useState(subjectData?.code || '');
  const [credit, setCredit] = useState(subjectData?.credit || '');
  const [subjectType, setSubjectType] = useState(subjectData?.subject_type || '');
  const [selectedProgram, setSelectedProgram] = useState({
    label: subjectData?.program?.name,
    value: subjectData?.program?.id,
  });
  const [selectedSemester, setSelectedSemester] = useState({
    label: subjectData?.semester?.name,
    value: subjectData?.semester?.id,
  });
  const [loading, setLoading] = useState(false);

  const loadPrograms = useCallback(
    debounce((inputValue, callback, page = 1) => {
      axiosInstance
        .get(`programs/programs/?search=${inputValue}&page_size=${pageSize}&page=${page}`)
        .then((res) => {
          const options = res.data?.data?.programs?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
          callback(options);
        })
        .catch((err) => console.error('Program fetch error:', err));
    }, 500),
    []
  );

  const loadSemesters = useCallback(
    debounce((inputValue, callback, page = 1) => {
      axiosInstance
        .get(`programs/semesters/?search=${inputValue}&page_size=${pageSize}&page=${page}`)
        .then((res) => {
          const options = res.data?.data?.semesters?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
          callback(options);
        })
        .catch((err) => console.error('Semester fetch error:', err));
    }, 500),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !code || !subjectType || !credit || !selectedProgram || !selectedSemester) {
      Swal.fire('Error', 'Please fill in all fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.put(`programs/subjects/${subjectData.id}/`, {
        name,
        code,
        subject_type: subjectType,
        credit,
        program: selectedProgram.value,
        semester: selectedSemester.value,
      });

      Swal.fire('Success', 'Subject updated successfully.', 'success').then(() => {
        onSuccess();
      });
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Something went wrong.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="program-table-add-header-close-btn">
          <h2 className="text-lg font-semibold">Edit Subject</h2>
          <span
            className="cursor-pointer text-xl font-bold"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Credit</label>
            <input
              type="number"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Subject Type</label>
            <select
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            >
              <option value="">Select type</option>
              <option value="core">Core</option>
              <option value="elective">Elective</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Program</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadPrograms}
              value={selectedProgram}
              onChange={setSelectedProgram}
              placeholder="Select program..."
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                menu: base => ({ ...base, width: '100%' }),
                container: base => ({ ...base, width: '100%' }),
                control: base => ({ ...base, width: '100%' }),
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Semester</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadSemesters}
              value={selectedSemester}
              onChange={setSelectedSemester}
              placeholder="Select semester..."
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                menu: base => ({ ...base, width: '100%' }),
                container: base => ({ ...base, width: '100%' }),
                control: base => ({ ...base, width: '100%' }),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              padding: '10px',
              width: '100%',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Updating...' : 'Update Subject'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubject;
