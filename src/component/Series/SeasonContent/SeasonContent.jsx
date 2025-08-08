import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../interceptor/axiosInstance';
import "../../../Styles/Series/Series.css";

const SeasonContent = () => {
  const [seasons, setSeasons] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Changed to false initially
  const [newSeason, setNewSeason] = useState({ name: '', series: '' });
  const [selectedOrg, setSelectedOrg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);

  // Fetch seasons based on pagination
  const fetchSeasons = (pageNum) => {
    setLoading(true);
    setError(false);

    axiosInstance.get(`series/seasons/?page=${pageNum}`)
      .then(response => {
        if (response.data && response.data.results.length > 0) {
          setSeasons(response.data.results);
          setTotalPages(Math.ceil(response.data.count / 10));
        } else {
          setSeasons([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  // Initial season fetch
  useEffect(() => {
    fetchSeasons(page);
  }, [page]);

  // Fetch series list
  useEffect(() => {
    axiosInstance.get('/series/series/')
      .then(response => {
        setSelectedOrg(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching series data:', error);
      });
  }, []);

  // Handle edit mode
  const handleEdit = (id) => {
    const seasonToEdit = seasons.find(season => season.id === id);
    setEditMode(id);
    setFormData(seasonToEdit);
    setImagePreview(seasonToEdit.thumbnail);
  };

  // Handle input changes for editing form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save the edited season
  const handleSave = (id) => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    axiosInstance.put(`series/seasons/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setSeasons(seasons.map(season => 
          season.id === id ? response.data : season
        ));
        setEditMode(null);
        setImagePreview(null);
      })
      .catch(error => console.error('Error saving data:', error));
  };

  // Handle the addition of a new season
  const handleAddSeason = () => {
    axiosInstance.post('series/seasons/', newSeason)
      .then(response => {
        setSeasons([...seasons, response.data]);
        setShowPopup(false);
        setNewSeason({ name: '', series: '' });
      })
      .catch(error => console.error('Error adding season:', error));
  };

  // Handle input change for new season form
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewSeason({ ...newSeason, [name]: value });
  };

  // Pagination handling
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <>
      <div className='btn'>
        <button 
          className="button"
          onClick={() => setShowPopup(true)} // Ensure the popup opens when clicked
        >
          Add Seasons
        </button>
      </div>

      <div className="container">
        {/* Add Popup here */}
        {showPopup && ( // Conditionally render the popup if `showPopup` is true
          <div className="popup-overlay">
            <div className="popup-content">
              <span className="close-icon" onClick={() => setShowPopup(false)}>&times;</span>
              <h2>Add New Season</h2>
              <input 
                type="text" 
                name="name" // Ensure the input has a name
                placeholder="Season Name" 
                value={newSeason.name} // Bind value to state
                onChange={handleNewInputChange} // Use the handler here
              />
              <div className="card-field">
                <label htmlFor="series">Series </label>
                <select
                  id="series"
                  name="series"
                  value={newSeason.series}
                  onChange={handleNewInputChange}
                >
                  <option value="">Select Series</option>
                  {selectedOrg.map(org => (
                    <option key={org.id} value={org.name}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div className='series-pop-btn'>
                <button 
                  className="button submit-button"
                  onClick={handleAddSeason}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {seasons.map(season => (
          <div key={season.id} className="card">
            {editMode === season.id ? (
              <div className="edit-mode">
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name || ''} 
                  onChange={handleChange}
                />
                <textarea 
                  name="description" 
                  value={formData.description || ''} 
                  onChange={handleChange}
                />
                <select 
                  name="series" 
                  value={formData.series || ''} 
                  onChange={handleChange}
                >
                  {selectedOrg.map(org => ( // Populate series options
                    <option key={org.id} value={org.name}>{org.name}</option>
                  ))}
                </select>
                <input 
                  type="file" 
                  name="thumbnail" 
                  accept="image/*" 
                  onChange={handleChange}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="thumbnail-preview" />}
                <button 
                  className="button save-button"
                  onClick={() => handleSave(season.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="card-content">
                {season.thumbnail && <img src={season.thumbnail} alt="Thumbnail" className="thumbnail-preview" />}
                <h3>{season.name}</h3>
                <p>{season.description || 'No description available'}</p>
                <p>Series: {season.series}</p>
                <button 
                  className="button edit-button"
                  onClick={() => handleEdit(season.id)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default SeasonContent;
