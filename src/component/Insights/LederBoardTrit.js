import React, { useState, useEffect } from "react";
import "../../Styles/Insights/ContentBox.css";
import axiosInstance from "../../interceptor/axiosInstance";

const LederBoardTrit = () => {
  const [options, setOptions] = useState([]); // Dropdown options
  const [subOrgs, setSubOrgs] = useState([]); // Sub organizations
  const [selectedOption, setSelectedOption] = useState(""); // Selected main option
  const [selectedSubOrg, setSelectedSubOrg] = useState(""); // Selected sub-organization
  const [tableData, setTableData] = useState([]); // Data for the table
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state

  // Fetch main dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("/zola/items/library-filter-choices/");
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Fetch sub organizations
  useEffect(() => {
    const fetchSubOrgs = async () => {
      try {
        const response = await axiosInstance.get("/orgss/suborgs/");
        setSubOrgs(response.data.results);
      } catch (error) {
        console.error("Error fetching sub organizations:", error);
      }
    };

    fetchSubOrgs();
  }, []);

  // Format the selected option for the API
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  // Fetch data based on the selected dropdown values
  useEffect(() => {
    if (!selectedOption || !selectedSubOrg) return;

    setError(""); // Clear error if both are selected

    const formattedOption = capitalizeFirstLetter(selectedOption);
    const formattedSubOrg = capitalizeFirstLetter(selectedSubOrg);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/zola/user-scores/${formattedOption}/${formattedSubOrg}/`
        );
        setTableData(response.data); // Assuming response.data contains table rows
      } catch (error) {
        console.error("Error fetching user scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOption, selectedSubOrg]); // Trigger fetch when either option or subOrg changes

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard Based on Trait</h2>
      <div className='user-tit-top'>
  <h2>Choose a particular Sub Organisation & Trait from the drop downs below to see the Leaderboard in that particular trait based on Score and Percentile. </h2>
</div>

      <div className="drop-down-main">
        {/* Main Dropdown */}
        <div className="dropdown-container">
        <label htmlFor="subOrgDropdown" style={{color: "#000"}}>Select Competency</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Trait</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-organization Dropdown */}
        <div className="dropdown-container">
        <label htmlFor="subOrgDropdown" style={{color: "#000"}}>Select Sub Organization</label>
          <select
            value={selectedSubOrg}
            onChange={(e) => setSelectedSubOrg(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Sub Organization</option>
            {subOrgs.map((suborg) => (
              <option key={suborg.id} value={suborg.name}>
                {suborg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Table Section */}
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : tableData.length > 0 ? (
          <table className="assessment-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Percentile</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.percentile}</td>
                  <td>{item.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for the selected options.</p>
        )}
      </div>
    </div>
  );
};

export default LederBoardTrit;
