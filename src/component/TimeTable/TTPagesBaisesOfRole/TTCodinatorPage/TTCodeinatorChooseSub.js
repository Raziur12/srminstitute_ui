import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../interceptor/axiosInstance';
import debounce from 'lodash.debounce';

const TTCodeinatorChooseSub = () => {
    const loginFaclityId = localStorage.getItem('user_id');

    const [subjects, setSubjects] = useState({ core: [], elective: [], prp: [] });
    const [filteredSubjects, setFilteredSubjects] = useState({ core: [], elective: [], prp: [] });
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    useEffect(() => {
      const fetchInitialData = async () => {
        try {
          // Fetch all subjects
          const subjectRes = await axiosInstance.get('timetable/subjects-list/');
          const subjectData = subjectRes.data?.data || {};
          setSubjects(subjectData);
          setFilteredSubjects(subjectData);
  
          // Try to fetch preference
          try {
            const preferenceRes = await axiosInstance.get(
              `timetable/faculty-subjects-preference/?faculty_id=${loginFaclityId}`
            );
            const preference = preferenceRes?.data?.data?.results;
  
            if (preference?.subjects?.length > 0) {
              const subjectIds = preference.subjects.map(sub => sub.id);
              setSelectedSubjects(subjectIds);
              if (preference.status === 'final') {
                setIsSubmitted(true);
              }
            }
          } catch (err) {
            if (err.response?.status === 404) {
              // No preferences saved yet, allow selection
              console.log('No saved preference found. User can start fresh.');
            } else {
              console.error('Error fetching preferences:', err);
            }
          }
        } catch (err) {
          console.error('Error fetching subject list:', err);
        }
      };
  
      fetchInitialData();
    }, [loginFaclityId]);
  
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
      if (isSubmitted) return;
      setSelectedSubjects((prev) =>
        prev.includes(subjectId)
          ? prev.filter((id) => id !== subjectId)
          : [...prev, subjectId]
      );
    };
  
    const countSelected = (category) =>
      filteredSubjects[category].filter((s) => selectedSubjects.includes(s.id)).length;
  
    const handleSubmit = async () => {
      
      Swal.fire({
        title: 'Are you sure?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Finalize',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const payload = {
            faculty: loginFaclityId,
            subjects: selectedSubjects.join(','),
            status: 'selected',
          };
  
          try {
            await axiosInstance.post('timetable/faculty-subjects-preference/', payload);
            Swal.fire('Submitted!', 'Your selection has been finalized.', 'success');
            setIsSubmitted(true);
          } catch (err) {
            const message = err.response?.data?.message || 'Submission failed.';
            Swal.fire('Error!', message, 'error');
          } finally {
            setLoading(false);
          }
        }
      });
    };
  
    const renderSubjectGroup = (category, title) => (
      <div style={{
        flex: 1,
        padding: '20px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        margin: '10px',
        minWidth: '280px',
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {title} <span style={{ fontSize: '14px', color: '#888' }}>({countSelected(category)} selected)</span>
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
                background: selectedSubjects.includes(subject.id) ? '#eaffea' : '#fafafa',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                cursor: isSubmitted ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => handleCheckboxChange(subject.id)}
                  disabled={isSubmitted}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#28a745',
                  }}
                />
                <span style={{ fontWeight: '500', fontSize: '15px', color: '#333' }}>
                  {subject.name} ({subject.code})
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>Credit: {subject.credit}</span>
            </label>
          ))}
        </div>
      </div>
    );
  
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        backgroundColor: '#f0f2f5',
        borderRadius: '10px',
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#2c3e50',
        }}>
          Subject Preference Selection
        </h2>
  
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
  
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
        }}>
          {renderSubjectGroup('core', 'Core Subjects')}
          {renderSubjectGroup('elective', 'Elective Subjects')}
          {renderSubjectGroup('prp', 'PRP Subjects')}
        </div>
  
        <button
          onClick={handleSubmit}
          disabled={loading || isSubmitted}
          style={{
            marginTop: '30px',
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            backgroundColor: (loading || isSubmitted) ? '#ccc' : '#28a745',
            color: '#fff',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || isSubmitted) ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitted ? 'Selection Finalized' : loading ? 'Submitting...' : 'Finalize Selection'}
        </button>
      </div>
    );
  };

export default TTCodeinatorChooseSub