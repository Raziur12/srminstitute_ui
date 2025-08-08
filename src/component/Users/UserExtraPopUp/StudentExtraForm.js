import React, { useState, useEffect } from "react";
import axiosInstance from "../../../interceptor/axiosInstance";
import Swal from "sweetalert2";

const StudentExtraForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({
    user: id,
    program: "",
    semester: "",
    section: "",
    gender: "",
  });

  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/programs/details/`)
      .then((response) => {
        const { programs, semesters } = response.data?.data || {};
        setPrograms(programs || []);
        setSemesters(semesters || []);
      })
      .catch((error) => {
        Swal.fire("Error", "Failed to fetch program details.", "error");
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
      await axiosInstance.post("accounts/student/", { ...formData });
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

        if (message) {
          errorMessage = message;
        }

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
      <h2 className="text-xl font-semibold text-center mb-4">Complete Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-md max-w-md mx-auto space-y-4"
      >
        <div className="form-group">
          <label className="block mb-1">Program *</label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.name}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-1">Semester *</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.name}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-1">Section *</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Section</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-1">Gender</label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default StudentExtraForm;
