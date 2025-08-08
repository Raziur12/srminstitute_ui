import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import axiosInstance from '../../interceptor/axiosInstance';

const UpdateUserProgram = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    if (showPopup) {
      setProgramOptions([]); // clear old data
      fetchAllPrograms('programs/programs/');
    }
  }, [showPopup]);

  const fetchAllPrograms = async (url) => {
    try {
      const response = await axiosInstance.get(url);
      const programs = response?.data?.data?.programs || [];
      const newOptions = programs.map((program) => ({
        label: program.name,
        value: program.id,
      }));
      setProgramOptions((prev) => [...prev, ...newOptions]);

      const nextPage = response?.data?.data?.pagination?.next;
      if (nextPage) {
        await fetchAllPrograms(nextPage); // recursive fetch next page
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProgram) {
      Swal.fire('Error', 'Please select a program.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the program of students?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.get(
          `programs/program-wise-semester-update/?program_id=${selectedProgram.value}`
        );
    
        const successMessage = response?.data?.message || 'The program has been changed.';
        
        Swal.fire('Updated!', successMessage, 'success');
    
        setShowPopup(false);
        setSelectedProgram(null);
      } catch (error) {
        console.error('Update error:', error);
    
        const errorMessage =
          error?.response?.data?.message || 'Failed to update program.';
    
        Swal.fire('Error', errorMessage, 'error');
      }
    }    
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowPopup(true)}
        className="refresh-btn"
      >
       Update Semester Program Wise
      </button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <h2 className="text-xl font-bold mb-4">Select Program</h2>

            <Select
  options={programOptions}
  value={selectedProgram}
  onChange={setSelectedProgram}
  isSearchable
  placeholder="Choose a program"
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  }}
  menuPortalTarget={document.body}
/>


            <div className="user-program-update-btn">
              <button
                onClick={() => setShowPopup(false)}
                className="refresh-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="refresh-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUserProgram;
