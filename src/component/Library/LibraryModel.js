import React, { useState, useEffect } from 'react';
import '../../Styles/Library/Library.css';
import axiosInstance from '../../interceptor/axiosInstance';

const LibraryModel = ({ item, onClose }) => {
  const [season, setSeason] = useState(''); // Selected season
  const [seasons, setSeasons] = useState([]); // All seasons from the API

  // Fetch seasons from the API when the component mounts
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await axiosInstance.get('series/seasons/');
        setSeasons(response.data.results); // Set the seasons data
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchSeasons();
  }, []);

  // Handle form submission to map the item to a selected season
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send selected season name and item name to the API
      await axiosInstance.post('series/item-seasons/', {
        item: item.item_name,
        season: season, // Send the selected season
      });
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error mapping item to season:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className='library-model'>{item.item_name}</h2>
        <form onSubmit={handleSubmit}>
            <div className='library-model-drop'>
          <label htmlFor="season">Season:</label>
          <select
            id="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            required
          >
            <option value="" disabled>Select a season</option>
            {/* Display available seasons */}
            {seasons.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          </div>
          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibraryModel;
