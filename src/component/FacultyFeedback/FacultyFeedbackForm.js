import React, { useEffect, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import "../../Styles/Faculty/facultyfeedback.css";

const FacultyFeedbackForm = () => {
  const [options, setOptions] = useState([]);
  const [fields, setFields] = useState([
    { name: "", parameter: "", details: "", date: "" },
  ]);

  // Helper function to format the date in 'YYYY-MM-DDTHH:MM:SS+05:30'
  const formatToIST = (date) => {
    const inputDate = new Date(date); // Parse the input date
    const offset = 5.5 * 60 * 60 * 1000; // Add 5 hours and 30 minutes
    const istDate = new Date(inputDate.getTime() + offset);

    // Format to 'YYYY-MM-DDTHH:MM:SS+05:30'
    const formattedDate = istDate.toISOString().slice(0, 19); // Remove milliseconds
    return `${formattedDate}+05:30`;
  };

  const handleChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const addMoreFields = () => {
    setFields([...fields, { name: "", parameter: "", details: "", date: "" }]);
  };

  const handleSubmit = () => {
    // Format all date fields to 'YYYY-MM-DDTHH:MM:SS+05:30'
    const formattedFields = fields.map((field) => ({
      ...field,
      date: field.date ? formatToIST(field.date) : "", // Format date to IST
    }));

    axiosInstance.post("/submit", { data: formattedFields }).then((response) => {
      alert("Form submitted successfully!");
    });
  };

  useEffect(() => {
    // Fetch dropdown options from backend
    axiosInstance.get("/names").then((response) => {
      setOptions(response.data);
    });
  }, []);

  return (
    <div className="faclity-feed-container">
      <div className='faclity-feed-drop-top'>
        <select
          className="faclity-feed-dropdown"
          value={fields[0].name}
          onChange={(e) => handleChange(0, "name", e.target.value)}
        >
          <option value="">Select Name</option>
          {options.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {fields.map((field, index) => (
        <div className="faclity-feed-row" key={index}>
          <select
            className="faclity-feed-dropdown"
            value={field.parameter}
            onChange={(e) => handleChange(index, "parameter", e.target.value)}
          >
            <option value="">Select Parameter</option>
            {options.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="faclity-feed-details"
            placeholder="Enter Details"
            value={field.details}
            onChange={(e) => handleChange(index, "details", e.target.value)}
          />

          <input
            type="date"
            className="faclity-feed-date-picker"
            value={field.date}
            onChange={(e) => handleChange(index, "date", e.target.value)}
          />
        </div>
      ))}

      <button className="faclity-feed-add-button" onClick={addMoreFields}>Add More</button>
      <button className="faclity-feed-submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FacultyFeedbackForm;
