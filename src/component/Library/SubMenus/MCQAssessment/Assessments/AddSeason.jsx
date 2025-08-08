import React, { useState } from 'react';
import axiosInstance from '../../../../../interceptor/axiosInstance';

const AddSeason = ({ modalData, closeModal, seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState(null);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedSeason) {
      const body = {
        season: selectedSeason,
        assessments: {
          assessment_type: modalData.id,
          access: 'mid',
          is_approved: true,
          is_live: true,
        },
      };

      try {
        const response = await axiosInstance.post('/series/assessment-season/', body);
        if (response.status === 200 || response.status === 201) {
          alert('Success: Season added successfully!'); // Success alert
          closeModal(); // Close the modal after successful submission
        }
      } catch (error) {
        console.error('Error submitting data', error);
        alert('Error: There was a problem submitting the data.'); // Error alert
      }
    } else {
      alert('Please select a season before submitting.'); // Alert if no season is selected
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ marginBottom: '2rem' }}>{modalData?.name}</h3>
          <span className="close-icon" onClick={closeModal}>&times;</span>
        </div>
        <h2>Select a Season</h2>
        <div className='add-season-drop'>
          <label htmlFor="season-select">Choose a season:</label>
          <select id="season-select" onChange={handleSeasonChange}>
            <option value="">--Please choose an option--</option>
            {seasons && seasons.length > 0 ? (
              seasons.map((season) => (
                <option key={season.id} value={season.name}>
                  {season.name}
                </option>
              ))
            ) : (
              <option value="">No seasons available</option>
            )}
          </select>
          <button onClick={handleSubmit} disabled={!selectedSeason}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AddSeason;
