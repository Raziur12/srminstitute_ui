import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axiosInstance from '../../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import HodAddOwn from './HodAddOwn';

const HodTTPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [allSubjects, setAllSubjects] = useState({ core: [], elective: [], prp: [] });
  const [subjectSelection, setSubjectSelection] = useState({});
  const [updateId, setUpdateId] = useState(null);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get('timetable/subjects-list/');
        const data = res.data?.data || {};
        setAllSubjects(data);

        const all = [...(data.core || []), ...(data.elective || []), ...(data.prp || [])];
        const selection = {};
        all.forEach((subject) => {
          selection[subject.id] = false;
        });
        setSubjectSelection(selection);
      } catch (err) {
        console.error('Error fetching all subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  const loadFacultyOptions = async (inputValue) => {
    try {
      const response = await axiosInstance.get('timetable/faculty-list/', {
        params: { search: inputValue },
      });

      if (response.data?.data) {
        return response.data.data.map((faculty) => ({
          value: faculty.user.id,
          label: `${faculty.title} ${faculty.user.first_name} ${faculty.user.last_name} | Dept: ${faculty.department} | ${faculty.designation}`,
        }));
      } else {
        Swal.fire('Error', 'No data found for faculty', 'error');
        return [];
      }
    } catch (error) {
      console.error('Error fetching faculty list:', error);
      Swal.fire('Error', 'Failed to fetch faculty list.', 'error');
      return [];
    }
  };

  const handleFacultyChange = async (selectedOption) => {
    setSelectedFaculty(selectedOption);
    const facultyId = selectedOption?.value;

    try {
      const res = await axiosInstance.get('timetable/faculty-subjects-preference/', {
        params: { faculty_id: facultyId },
      });

      const result = res.data?.data?.results;
      setUpdateId(result?.id);
      setIsFinalized(result?.status === 'final');

      const preferredSubjects = result?.subjects || [];
      const preferredSubjectIds = preferredSubjects.map((s) => s.id);

      setSubjectSelection((prev) => {
        const updated = {};
        Object.keys(prev).forEach((id) => {
          updated[id] = preferredSubjectIds.includes(parseInt(id));
        });
        return updated;
      });

    } catch (err) {
      console.error('Error fetching preferences:', err);
      Swal.fire('Error', 'Failed to fetch subject preferences.', 'error');
    }
  };

  const handleCheckboxChange = (subjectId) => {
    if (isFinalized) return;
    setSubjectSelection((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const handleSubmit = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to finalize subject preferences?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const facultyId = selectedFaculty?.value;
        if (!facultyId) {
          Swal.fire('Error', 'No faculty selected!', 'error');
          return;
        }

        const selectedIds = Object.entries(subjectSelection)
          .filter(([_, checked]) => checked)
          .map(([id]) => id)
          .join(',');

        const data = {
          faculty_id: facultyId,
          subjects: selectedIds,
          status: 'final',
        };

        try {
          const res = await axiosInstance.put(
            `timetable/faculty-subjects-preference/${updateId}/`,
            data
          );
          if (res.status === 200) {
            Swal.fire('Success', 'Data submitted successfully!', 'success');
            setIsFinalized(true);
          } else {
            Swal.fire('Error', 'Submission failed.', 'error');
          }
        } catch (err) {
          console.error('Submission error:', err);
          const msg =
            err.response?.data?.message || err.response?.data?.detail || 'Something went wrong';
          Swal.fire('Error', msg, 'error');
        }
      }
    });
  };

  const handleReset = () => {
    if (!selectedFaculty) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reset this subject preference?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reset',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.post('timetable/faculty-list/', {
            faculty_id: selectedFaculty?.value,
          });

          if (res.status === 200 && res.data?.status === 'success') {
            // Reset subject selection
            const resetSelection = {};
            Object.keys(subjectSelection).forEach((id) => {
              resetSelection[id] = false;
            });
            setSubjectSelection(resetSelection);
            setIsFinalized(false);
            setUpdateId(null);
            Swal.fire('Reset Complete', 'Subject preferences have been reset.', 'success');
          } else {
            Swal.fire('Error', 'Reset failed.', 'error');
          }
        } catch (err) {
          console.error('Reset error:', err);
          Swal.fire('Error', 'Reset API failed.', 'error');
        }
      }
    });
  };

  const renderSubjectsByCategory = (category, title) => (
    <div
      style={{
        flex: 1,
        padding: '16px',
        margin: '10px',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px' }}>{title}</h3>
      {allSubjects[category]?.map((subject) => (
        <label
          key={subject.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            marginBottom: '8px',
            background: '#f9f9f9',
            borderRadius: '6px',
            opacity: isFinalized ? 0.6 : 1,
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={!!subjectSelection[subject.id]}
              onChange={() => handleCheckboxChange(subject.id)}
              disabled={isFinalized}
              style={{ marginRight: '10px' }}
            />
            {subject.name} ({subject.code})
          </div>
          <span style={{ fontSize: '12px', color: '#666' }}>Credit: {subject.credit}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
        HOD Time Table Management
      </h2>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadFacultyOptions}
            onChange={handleFacultyChange}
            placeholder="Select Faculty"
          />
        </div>
        <button
          onClick={handleReset}
          disabled={!selectedFaculty}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedFaculty ? '#dc3545' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedFaculty ? 'pointer' : 'not-allowed',
          }}
        >
          Reset
        </button>
      </div>

      {isFinalized && (
        <div style={{ color: 'red', marginBottom: '20px', fontWeight: '600' }}>
          This subject list is finalized by you. You cannot change any subjects.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {renderSubjectsByCategory('core', 'Core Subjects')}
        {renderSubjectsByCategory('elective', 'Elective Subjects')}
        {renderSubjectsByCategory('prp', 'PRP Subjects')}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isFinalized}
        style={{
          padding: '12px 24px',
          backgroundColor: isFinalized ? '#ccc' : '#007bff',
          color: '#fff',
          fontWeight: '600',
          border: 'none',
          borderRadius: '6px',
          cursor: isFinalized ? 'not-allowed' : 'pointer',
        }}
      >
        Submit
      </button>

      <div style={{ marginTop: '20px' }}>
        <HodAddOwn />
      </div>
    </div>
  );
};

export default HodTTPage;
