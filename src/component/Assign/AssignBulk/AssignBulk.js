import React, { useEffect, useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import axiosInstance from "../../../interceptor/axiosInstance";

const AssignBulk = ({ onClose }) => {
  const [selectedValues, setSelectedValues] = useState({
    program: null,
    semester: null,
    department: null,
    designation: null,
  });

  const [selectedSeries, setSelectedSeries] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = true;
  }, []);

  // Generic async dropdown fetcher
  const fetchOptions = async (type, inputValue) => {
    try {
      const response = await axiosInstance.get(`programs/details/?name=${inputValue}`);
      const data = response.data?.data || {};
      const options = data[type] || [];

      return options.map((item) => ({
        value: item.name,
        label: item.name,
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  // Fetch assessments with search input
  const fetchAssessmentOptions = async (inputValue = "") => {
    try {
      const response = await axiosInstance.get(`assessments/tests/`, {
        params: {
          name: inputValue,
          pageSize: 20,
        },
      });

      const results = response.data?.data?.results || [];

      return results.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    } catch (error) {
      console.error("Error fetching assessments:", error);
      return [];
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const requestBody = {
      test_id: selectedSeries?.value || "",
      program: selectedValues.program?.value || "",
      semester: selectedValues.semester?.value || "",
      department: selectedValues.department?.value || "",
      designation: selectedValues.designation?.value || "",
    };

    axiosInstance
      .post("assign/bulk-assign/", requestBody)
      .then((response) => {
        const { message, data } = response.data;
        let fullMessage = message || "Users assigned successfully!";

        if (data) {
          const { created_users = 0, skipped_rows = 0, errors = [] } = data;
          fullMessage += `\n\n✅ Created Users: ${created_users}`;
          fullMessage += `\n⚠️ Skipped Rows: ${skipped_rows}`;

          if (errors.length > 0) {
            fullMessage += `\n\n❌ Errors:\n${errors.join("\n")}`;
          }
        }

        Swal.fire("Success", fullMessage, "success");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        let errorMessage = "Failed to assign users. Please try again.";

        if (error.response?.data) {
          const { message, errors = [] } = error.response.data;
          if (message) {
            errorMessage = Array.isArray(message)
              ? message.join("\n")
              : message;
          }

          if (errors.length > 0) {
            errorMessage += `\n\n❌ Errors:\n${errors.join("\n")}`;
          }
        }

        Swal.fire("Error", errorMessage, "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>

        <div className="main-assign-bulk-container">
          {/* Program Dropdown */}
          <div className="assign-bulk-model">
            <label>Program:</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={(inputValue) => fetchOptions("programs", inputValue)}
              value={selectedValues.program}
              onChange={(option) =>
                setSelectedValues({ ...selectedValues, program: option })
              }
              placeholder="Select Program"
              styles={{ control: (base) => ({ ...base, width: "500px" }) }}
            />
          </div>

          {/* Semester Dropdown */}
          <div className="assign-bulk-model">
            <label>Semester:</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={(inputValue) => fetchOptions("semesters", inputValue)}
              value={selectedValues.semester}
              onChange={(option) =>
                setSelectedValues({ ...selectedValues, semester: option })
              }
              placeholder="Select Semester"
              styles={{ control: (base) => ({ ...base, width: "500px" }) }}
            />
          </div>

          {/* Department Dropdown */}
          <div className="assign-bulk-model">
            <label>Department:</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={(inputValue) => fetchOptions("departments", inputValue)}
              value={selectedValues.department}
              onChange={(option) =>
                setSelectedValues({ ...selectedValues, department: option })
              }
              placeholder="Select Department"
              styles={{ control: (base) => ({ ...base, width: "500px" }) }}
            />
          </div>

          {/* Designation Dropdown */}
          <div className="assign-bulk-model">
            <label>Designation:</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={(inputValue) => fetchOptions("designations", inputValue)}
              value={selectedValues.designation}
              onChange={(option) =>
                setSelectedValues({ ...selectedValues, designation: option })
              }
              placeholder="Select Designation"
              styles={{ control: (base) => ({ ...base, width: "500px" }) }}
            />
          </div>

          {/* Assessment Dropdown */}
          <div className="assign-bulk-model-select">
            <label htmlFor="series">Select Assessments:</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={fetchAssessmentOptions}
              value={selectedSeries}
              onChange={setSelectedSeries}
              placeholder="Search & Select Assessment"
              styles={{ control: (base) => ({ ...base, width: "500px" }) }}
            />
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignBulk;
