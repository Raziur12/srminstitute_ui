import React, { useEffect, useState } from 'react';
import '../../Styles/Library/Library.css';
import LibraryModel from './LibraryModel';
import axiosInstance from '../../interceptor/axiosInstance';
import LibraryFilter from './LibaryFilter';

const Library = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  // Fetch items for normal (non-filtered) pagination
  const fetchItems = async (url) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      setItems(response.data.results);
      setFilteredItems(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load items for the current page (only if not filtered)
    if (!isFiltered) {
      fetchItems(`zola/item_library/?page=${currentPage}`);
    }
  }, [currentPage, isFiltered]);

  // Handle search queries
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`zola/items/search/?tags=${query}`);
      setFilteredItems(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes from the LibraryFilter component
  const handleFilterChange = (filteredResults, next, previous) => {
    setIsFiltered(true); // Mark the data as filtered
    setFilteredItems(filteredResults);
    setNextPageUrl(next);
    setPrevPageUrl(previous);
  };

  // Pagination for filtered data
  const handleFilteredPageChange = async (url) => {
    if (!url) return; // Don't proceed if URL is null

    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      setFilteredItems(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error('Error fetching filtered paginated data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination for both normal and filtered data
  const handleNextPage = () => {
    if (isFiltered && nextPageUrl) {
      handleFilteredPageChange(nextPageUrl);
    } else if (!isFiltered && nextPageUrl) {
      fetchItems(nextPageUrl);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (isFiltered && prevPageUrl) {
      handleFilteredPageChange(prevPageUrl);
    } else if (!isFiltered && prevPageUrl) {
      fetchItems(prevPageUrl);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="library-container">
      <h2>Library</h2>
      <h5 className="libry-sub-tit">
        Browse through our Library of scenarios and add as many as you want to assess people on
      </h5>
      <h5 className="libry-sub-tit">
        Remember to add at least 1 scenario of Level 1.
      </h5>

      {/* Search Bar */}
      <div className="search-bar-contain">
        <input
          className="search-libary"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search items..."
        />
        {/* Pass handleFilterChange to LibraryFilter */}
        <LibraryFilter handleFilterChange={handleFilterChange} />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Level</th>
                <th>Competence</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.level}</td>
                 <td>
  {item.competencys && item.competencys.length > 0
    ? item.competencys.map((competency) => competency.name || competency.competency_name).join(', ')
    : 'No competency'}
</td>
{/* <td>{item.competencys}</td> */}

                  <td>{item.category}</td>
                  <td>
                    <button onClick={() => setSelectedItem(item)}>Map to Season</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              className={`prev-button ${!prevPageUrl ? 'disabled' : ''}`}
              onClick={handlePreviousPage}
              disabled={!prevPageUrl}
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage}</span>
            <button
              className={`next-button ${!nextPageUrl ? 'disabled' : ''}`}
              onClick={handleNextPage}
              disabled={!nextPageUrl}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Display Modal if an item is selected */}
      {selectedItem && (
        <LibraryModel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Library;
