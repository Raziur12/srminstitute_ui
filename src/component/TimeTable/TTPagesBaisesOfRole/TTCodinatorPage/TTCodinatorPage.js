import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axiosInstance from '../../../../interceptor/axiosInstance';
import { debounce } from '@mui/material';
import TTCodeinatorChooseSub from './TTCodeinatorChooseSub';

const TTCodinatorPage = () => {
  const [subjects, setSubjects] = useState({ core: [], elective: [], prp: [] });
  const [filteredSubjects, setFilteredSubjects] = useState({ core: [], elective: [], prp: [] });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get('timetable/subjects-list/');
        const data = res.data?.data || {};
        setSubjects(data);
        setFilteredSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
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
        return [];
      }
    } catch (error) {
      console.error('Error loading faculty options:', error);
      return [];
    }
  };

  const handleFacultyChange = async (selectedOption) => {
    setSelectedFaculty(selectedOption);
    setIsReadOnly(true); // Make checkboxes readonly
    try {
      const res = await axiosInstance.get('timetable/faculty-subjects-preference/', {
        params: { faculty_id: selectedOption.value },
      });
      const subjectIds = res.data?.data?.results?.subjects?.map((s) => s.id) || [];
      setSelectedSubjects(subjectIds);
    } catch (err) {
      console.error('Error fetching faculty subject preferences:', err);
      setSelectedSubjects([]);
    }
  };

  const handleSearch = debounce((inputValue) => {
    const filterCategory = (items) =>
      items.filter((subject) =>
        `${subject.name} ${subject.code}`.toLowerCase().includes(inputValue.toLowerCase())
      );

    setFilteredSubjects({
      core: filterCategory(subjects.core),
      elective: filterCategory(subjects.elective),
      prp: filterCategory(subjects.prp),
    });
  }, 300);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  const handleCheckboxChange = (subjectId) => {
    if (isReadOnly) return;
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const countSelected = (category) =>
    filteredSubjects[category].filter((s) => selectedSubjects.includes(s.id)).length;

  const renderSubjectGroup = (category, title) => (
    <div
      style={{
        flex: 1,
        padding: '20px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        margin: '10px',
        minWidth: '280px',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        {title}{' '}
        <span style={{ fontSize: '14px', color: '#888' }}>
          ({countSelected(category)} selected)
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredSubjects[category]?.map((subject) => (
          <label
            key={subject.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              background: '#fafafa',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              cursor: isReadOnly ? 'not-allowed' : 'pointer',
              opacity: isReadOnly ? 0.9 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedSubjects.includes(subject.id)}
                disabled={isReadOnly}
                onChange={() => handleCheckboxChange(subject.id)}
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '12px',
                  accentColor: '#28a745',
                  cursor: isReadOnly ? 'not-allowed' : 'pointer',
                  pointerEvents: isReadOnly ? 'none' : 'auto',
                }}
              />
              <span style={{ fontWeight: '500', fontSize: '15px', color: '#333' }}>
                {subject.name} ({subject.code})
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Credit: {subject.credit}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        backgroundColor: '#f0f2f5',
        borderRadius: '10px',
      }}
    >
      <h2
        style={{
          fontSize: '26px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#2c3e50',
        }}
      >
        Subject Selection View (Read Only When Faculty Selected)
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadFacultyOptions}
          onChange={handleFacultyChange}
          placeholder="Select Faculty"
        />
      </div>

      <input
        type="text"
        value={searchText}
        onChange={handleSearchInputChange}
        placeholder="Search by subject name or code..."
        style={{
          width: '100%',
          padding: '12px 16px',
          marginBottom: '32px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '16px',
          outline: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {renderSubjectGroup('core', 'Core Subjects')}
        {renderSubjectGroup('elective', 'Elective Subjects')}
        {renderSubjectGroup('prp', 'PRP Subjects')}
      </div>

      <div style={{ marginTop: '20px' }}>
        <TTCodeinatorChooseSub />
      </div>
    </div>
  );
};

export default TTCodinatorPage;
