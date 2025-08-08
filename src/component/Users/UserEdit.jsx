import React, { useEffect, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import Swal from 'sweetalert2';

const EditUserPopup = ({ user, onClose, roles }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    role: '',
    gender: '',
    program: '',
    section: '',
    semester: '',
    department: '',
    designation: '',
    doj: '',
    user_type: '',
    mobile_number: '',
    is_active: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [errorMessage, setErrorMessage] = useState('');
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch programs, semesters, and sections
    axiosInstance.get(`/programs/details/`)
      .then((response) => {
        const { programs, semesters, designations, departments } = response.data?.data || {};
        setPrograms(programs || []); // Default to empty array if not available
        setSemesters(semesters || []);
        setDesignations(designations || []);
        setDepartments(departments || []);

      })
      .catch((error) => {
        setErrorMessage('Failed to fetch program details.');
      });
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      setErrorMessage(''); // Reset error message
      try {
        const response = await axiosInstance.get(`accounts/users/${user.id}/`);
        const userData = response.data?.data;

        // Extract role safely


        setFormData((prevFormData) => ({
          ...prevFormData, // Preserve existing values
          ...(userData.first_name && { first_name: userData.first_name }),
          ...(userData.last_name && { last_name: userData.last_name }),
          ...(userData.email && { email: userData.email }),
          ...(userData.username && { username: userData.username }),
          ...(userData.role && { role: userData.role }),
          ...(userData.user_type && { user_type: userData.user_type }),
          ...(userData?.profile?.gender && { gender: userData.profile.gender }),
          ...(userData?.profile?.program && { program: userData.profile.program }),
          ...(userData?.profile?.section && { section: userData.profile.section }),
          ...(userData?.profile?.semester && { semester: userData.profile.semester }),
          ...(userData?.profile?.department && { department: userData.profile.department }),
          ...(userData?.profile?.designation && { designation: userData.profile.designation }),
          ...(userData?.profile?.doj && { doj: userData.profile.doj }),
          ...(userData.mobile_number && { mobile_number: userData.mobile_number }),
          ...(userData.is_active !== undefined && { is_active: userData.is_active }),
        }));
      } catch (error) {
        setErrorMessage('Failed to fetch user data. Please try again.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const response = await axiosInstance.put(
        `accounts/users/${user.id}/`,
        formData
      );

      // Show success alert and close both popups when the user clicks "OK"
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: `${response.data.message || 'User profile has been successfully updated!'}`,
        confirmButtonText: 'OK',
      }).then(() => {
        // Close the normal popup after the success alert
        onClose();
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to save user data. Please try again.';

      // Show error alert and close both popups when the user clicks "OK"
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        confirmButtonText: 'OK',
      }).then(() => {
        // Close the normal popup even on error
        onClose();
      });

      setErrorMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="popup">
        <div className="popup-content">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <h3>Edit User</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="form-layout">
          <div className="form-row">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email ID:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Registration Number:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={formData.first_time}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="">Select Role</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_with_suborg}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>User Type:</label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleInputChange}
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="prospective_faculty">Prospective Faculty</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="is_active">Is Active</label>
              <select
                id="is_active"
                name="is_active"
                value={formData.is_active === true ? 'true' : 'false'}
                onChange={(e) => {
                  const isTrue = e.target.value === 'true'; // Convert the string value back to boolean
                  setFormData((prevState) => ({
                    ...prevState,
                    is_active: isTrue,
                  }));
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Conditionally render fields based on user_type */}
          {formData.user_type === 'student' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Program:</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                  >
                    <option value={formData.program} disabled>
                      {formData.program}
                    </option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.name}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
        <label>Semester:</label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleInputChange}
        >
          <option value="">Select Semester</option>
          {semesters
            .filter(
              (semester) =>
                semester.name.toLowerCase() !== 'all'
            )
            .map((semester) => (
              <option key={semester.id} value={semester.name}>
                {semester.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label>Section:</label>
        <select
          name="section"
          value={formData.section}
          onChange={handleInputChange}
        >
          <option value="">Select Section</option>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>
              </div>
            </>
          ) : ['faculty', 'prospective_faculty'].includes(formData.user_type) ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Designation:</label>

<select
                    name="semester"
                    value={formData.designation}
                    onChange={handleInputChange}
                  >
                    <option value={formData.designation} disabled>
                      {formData.designation}
                    </option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.name}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department:</label>
<select
                    name="semester"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value={formData.department} disabled>
                      {formData.department}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Joining:</label>
                  <input
                    type="date"
                    name="doj"
                    value={formData.doj}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div className="form-actions">
            <button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;
