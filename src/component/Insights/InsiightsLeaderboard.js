import React, { useEffect, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';
import "../../Styles/Insights/ContentBox.css"
import InsightsAssmentData from './InsightsAssmentData';

const InsiightsLeaderboard = () => {
  const [subOrg, setSubOrg] = useState([]); // For storing sub organizations
  const [competencyData, setCompetencyData] = useState([]); // For storing the full competency data (including nested competency arrays)
  const [selectedSubOrgId, setSelectedSubOrgId] = useState(null); // Selected subOrg ID
  const [selectedCompetencyId, setSelectedCompetencyId] = useState(null); // Selected competency ID
  const [leaderboard, setLeaderboard] = useState([]); // For storing leaderboard data
  const [errorMessage, setErrorMessage] = useState(''); // For showing error or informational messages

  // Fetch sub organizations
  useEffect(() => {
    axiosInstance.get('orgss/suborgs/')
      .then((response) => {
        setSubOrg(response.data.results || []); // Fallback to empty array if response.data is undefined
      })
      .catch((error) => console.error("Error fetching subOrgs:", error));
  }, []);

  // Fetch competency data
  useEffect(() => {
    axiosInstance.get('zola/item_library/')
      .then((response) => {
        setCompetencyData(response.data.results || []); // Store the full competency data
      })
      .catch((error) => console.error("Error fetching competency data:", error));
  }, []);

  // Extract and flatten all competencies from nested structure
  const allCompetencies = competencyData.flatMap(item => item.competencys || []);

  // Trigger the leaderboard API call when both IDs are selected
  useEffect(() => {
    if (selectedSubOrgId && selectedCompetencyId) {
      axiosInstance.get(`/zola/leaderboardpercentile/?competency_id=${selectedCompetencyId}&suborg_id=${selectedSubOrgId}`)
        .then((response) => {
          if (response.data?.data && response.data.data.length > 0) {
            setLeaderboard(response.data.data); // Set the leaderboard data
            setErrorMessage(''); // Clear any previous error message
          } else {
            setLeaderboard([]); // Clear leaderboard data
            setErrorMessage('Data not found. Please change the dropdown options and try again.');
          }
        })
        .catch((error) => {
          setLeaderboard([]);
          setErrorMessage('Error fetching leaderboard data. Please try again later.');
          console.error("Error calling API:", error);
        });
    } else {
      if (selectedSubOrgId || selectedCompetencyId) {
        setErrorMessage('Please choose the second dropdown to see the response.');
      } else {
        setErrorMessage('');
      }
      setLeaderboard([]); // Reset leaderboard when IDs are not selected
    }
  }, [selectedSubOrgId, selectedCompetencyId]);

  const handleSelectChange = (type, value) => {
    if (type === 'subOrg') {
      setSelectedSubOrgId(value);
    } else if (type === 'competency') {
      setSelectedCompetencyId(value);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Insights Leaderboard</h2>
      <div className='user-tit-top'>
  <h2>Choose a particular Sub Organisation and Competency from the drop downs below to see the Leaderboard in that particular competency based on Score and Percentile.    </h2>
</div>

<div className='drop-down-main'>
      <div className="dropdown-container">
        <label htmlFor="subOrgDropdown" style={{color: "#000"}}>Select Sub Organization</label>
        <select
          id="subOrgDropdown"
          className="dropdown"
          value={selectedSubOrgId || ''}
          onChange={(e) => handleSelectChange('subOrg', e.target.value)}
        >
          <option value="">Select SubOrg</option>
          {subOrg?.map((org) => ( // Optional chaining ensures that subOrg exists before map
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label htmlFor="competencyDropdown" style={{color: "#000"}}>Select Competency</label>
        <select
          id="competencyDropdown"
          className="dropdown"
          value={selectedCompetencyId || ''}
          onChange={(e) => handleSelectChange('competency', e.target.value)}
        >
          <option value="" >Select Competency</option>
          {allCompetencies?.map((competency) => ( // Optional chaining ensures that competency array exists before map
            <option key={competency.id} value={competency.id}>
              {competency.name}
            </option>
          ))}
        </select>
      </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error or informational message */}

      {leaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Total Score</th>
              <th>Percentile</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index}>
                <td>{user.user_email}</td>
                <td>{user.total_score}</td>
                <td>{user.percentile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

<div className='insight-assment'>
      <InsightsAssmentData />
      </div>
    </div>
  );
};

export default InsiightsLeaderboard;
