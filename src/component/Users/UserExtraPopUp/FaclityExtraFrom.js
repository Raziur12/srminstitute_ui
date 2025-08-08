import React, { useState, useEffect } from "react";
import axiosInstance from "../../../interceptor/axiosInstance";
import Swal from "sweetalert2";

const FacilityExtraForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({
    user: id,
    department: "",
    designation: "",
    title: "",
    gender: "",
    doj: "",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/programs/details/`)
      .then((response) => {
        const { designations, departments } = response.data?.data || {};
        setDesignations(designations || []);
        setDepartments(departments || []);
      })
      .catch((error) => {
        Swal.fire('Error', 'Failed to fetch program details.', 'error');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("accounts/faculty/", { ...formData });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Form submitted successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form", error);
      let errorMessage = "Failed to submit form";
      
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        if (message) errorMessage = message;

        if (errors) {
          const errorDetails = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          errorMessage += `\n${errorDetails}`;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <h2>Add Faculty</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded-md max-w-md mx-auto">

        {/* Department Dropdown */}
        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Dropdown */}
        <div className="form-group">
          <label>Designation *</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Designation</option>
            {designations.map((desig) => (
              <option key={desig.id} value={desig.name}>
                {desig.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Gender Dropdown */}
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>

        {/* Date of Joining */}
        <div className="form-group">
          <label>Date of Joining (Optional)</label>
          <input
            type="date"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default FacilityExtraForm;
