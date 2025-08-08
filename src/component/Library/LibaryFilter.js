import React, { useEffect, useState } from 'react';
import axiosInstance from '../../interceptor/axiosInstance';

const LibraryFilter = ({ handleFilterChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get('/zola/items/library-filter-choices/');
        setOptions(response.data); // Assuming the API returns an array of options
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchOptions();
  }, []);

  // Handle option selection and apply filter
  const handleSelectionChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue === '') {
      // Refresh the page when the user selects "Select an option"
      window.location.reload();
    } else {
      // Fetch filtered results based on the selected option
      try {
        const response = await axiosInstance.get(`zola/items/filter/?library_filter=${selectedValue}`);
        handleFilterChange(response.data.results, response.data.next, response.data.previous); // Pass results and pagination links to parent
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    }
  };

  return (
    <div>
      {options.length > 0 ? (
        <select className='select-model' value={selectedOption} onChange={handleSelectionChange}>
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label} {/* Adjust according to the structure of your API response */}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading options...</p>
      )}
    </div>
  );
};

export default LibraryFilter;
