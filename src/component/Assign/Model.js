import React, { useState, useEffect, useRef } from "react";
import Select from "react-select"; // Import react-select
import axiosInstance from "../../interceptor/axiosInstance";
import Swal from "sweetalert2";

const Modal = ({ user, onClose }) => {
  const [series, setSeries] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoad, setSubmitLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const initialized = useRef(false);

  const handleSearchInput = (inputValue) => {
    setSearchTerm(inputValue); // Store search input separately
  }

  // Fetch series data
  const fetchSeries = async (url = "assessments/tests/", page = 1, pageSize = 15, name = "",) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url, {
        params: url.includes("?") ? {} : { page, page_size: pageSize, name }, // Use nextPage URL as-is if it already has params
      });

      const newOptions = response.data?.data?.results.map((s) => ({
        value: s.id,
        label: s.name,
      }));

      setSeries((prevSeries) => [...prevSeries, ...newOptions]);
      setNextPage(response.data?.data?.pagination?.next); // Store next page URL
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Trigger API Call Whenever searchTerm Changes
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchSeries("assessments/tests/", 1, 15, searchTerm);
    }
  }, [searchTerm]); // ✅ Runs when searchTerm changes


  useEffect(() => {
    if (!initialized.current) {
      fetchSeries();
      initialized.current = true;
    }
  }, []);

  // Handle dropdown change
  const handleSeriesChange = (selectedOption) => {
    if (selectedOption.value === "see-more") {
      if (nextPage) {
        fetchSeries(nextPage); // Fetch next available page dynamically
      }
    } else {
      setSelectedSeriesId(selectedOption.value);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedSeriesId) {
      Swal.fire("Error", "Please select an assessment.", "error");
      return;
    }

    setSubmitLoader(true);
    try {
      await axiosInstance.post("assign/user-test-assignment/", {
        user: user.id,
        test: selectedSeriesId,
      });

      Swal.fire("Success!", "Test assignment was successful.", "success");
      onClose();
    } catch (error) {
      console.error("Error assigning series:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong! Please try again later.";
      Swal.fire("Oops...", errorMessage, "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <h2>Assign Assessment to</h2>
        <div className="assign-model-top">
          <h3>Email: </h3>
          <h3>{user.email}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="assign-model-select">
            <label htmlFor="series">Select Assessments:</label>
             <Select
      id="series"
      options={[
        ...series,
        nextPage ? { value: "see-more", label: "See More..." } : null,
      ].filter(Boolean)}
      onChange={handleSeriesChange}
      isLoading={loading}
      isSearchable
      placeholder="Search and select an assessment..."
      noOptionsMessage={() => "No assessments found"}
      menuPortalTarget={document.body}
      styles={{
        control: (base) => ({
          ...base,
          width: "500px",
          minWidth: "500px",
          maxWidth: "500px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
      }}
      onInputChange={handleSearchInput}
    />
          </div>
          <div className="assign-model">
            <button type="submit" disabled={submitLoad}>
              {submitLoad ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
