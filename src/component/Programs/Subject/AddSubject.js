import React, { useState, useCallback } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import '../../../Styles/Program.css';

const pageSize = 10;

const AddSubject = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [credit, setCredit] = useState('');
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [semesterPage, setSemesterPage] = useState(1);
    const [departmentPage, setDepartmentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch semesters with search and pagination
    const loadSemesters = useCallback(
        debounce((inputValue, callback, page = 1) => {
            axiosInstance
                .get(`programs/semesters/?search=${inputValue}&page_size=${pageSize}&page=${page}`)
                .then(res => {
                    const options = res.data?.data?.semesters?.map(item => ({
                        label: item.name,
                        value: item.id,
                    })) || [];
                    callback(options);
                })
                .catch(err => console.error('Semester fetch error:', err));
        }, 500),
        []
    );

    // Fetch programs with search and pagination
    const loadDepartments = useCallback(
        debounce((inputValue, callback, page = 1) => {
            axiosInstance
                .get(`programs/programs/?search=${inputValue}&page_size=${pageSize}&page=${page}`)
                .then(res => {
                    const options = res.data?.data?.programs?.map(item => ({
                        label: item.name,
                        value: item.id,
                    })) || [];
                    callback(options);
                })
                .catch(err => console.error('Department fetch error:', err));
        }, 500),
        []
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !code || !selectedSemester || !selectedDepartment || !credit) {
            setError('Please fill all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axiosInstance.post('programs/subjects/', {
                name,
                code,
                semester: selectedSemester.value,
                department: selectedDepartment.value,
                credit: credit,
            });

            Swal.fire({
                title: 'Success!',
                text: 'Subject added successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                setName('');
                setCode('');
                setCredit('');
                setSelectedSemester(null);
                setSelectedDepartment(null);
                onSuccess(); // Refresh data
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong.';
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
            <div className="popup-content bg-white p-6 rounded shadow-md w-full max-w-lg relative">
                <div className="program-table-add-header-close-btn flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add Subject</h2>
                    <span className="mouse-of-popup text-xl cursor-pointer" onClick={onClose}>&times;</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Subject Name */}
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="block mb-1">Subject Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    {/* Subject Code */}
                    <div className="form-group mb-3">
                        <label htmlFor="code" className="block mb-1">Subject Code</label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    {/* Credit */}

                    <div className="form-group mb-3">
                        <label htmlFor="credit" className="block mb-1">Credit</label>
                        <input
                            id="credit"
                            type="text"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    {/* Semester Select */}
                    <div className="form-group mb-3 subject-table-select-wrapper">
  <label className="block mb-1">Semester</label>
  <AsyncSelect
    value={selectedSemester}
    onChange={setSelectedSemester}
    loadOptions={(inputValue, callback) =>
      loadSemesters(inputValue, callback, semesterPage)
    }
    onMenuScrollToBottom={() => setSemesterPage(prev => prev + 1)}
    defaultOptions
    isClearable
    isSearchable
    placeholder="Search and select semester..."
    classNamePrefix="subject-table-select"
    menuPortalTarget={document.body}  // important: render dropdown outside
    styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menu: base => ({ ...base, width: '100%' }),
        container: base => ({ ...base, width: '100%' }),
        control: base => ({ ...base, width: '100%' }),
      }}
  />
</div>


                    {/* programs Select */}
                    <div className="form-group mb-4 subject-table-select-wrapper">
  <label className="block mb-1">Program</label>
  <AsyncSelect
    value={selectedDepartment}
    onChange={setSelectedDepartment}
    loadOptions={(inputValue, callback) =>
      loadDepartments(inputValue, callback, departmentPage)
    }
    onMenuScrollToBottom={() => setDepartmentPage(prev => prev + 1)}
    defaultOptions
    isClearable
    isSearchable
    placeholder="Search and select program..."
    classNamePrefix="subject-table-select"
    menuPortalTarget={document.body}
    styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menu: base => ({ ...base, width: '100%' }),
        container: base => ({ ...base, width: '100%' }),
        control: base => ({ ...base, width: '100%' }),
      }}
  />
</div>


                    {/* Error message */}
                    {error && <div className="text-red-600 mb-3">{error}</div>}

                    {/* Submit button */}
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

export default AddSubject;
