import React, { useState } from "react";
import axiosInstance from "../../interceptor/axiosInstance";

const SearchBarAssign = ({ setUsers, setLoading, fetchData }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = async (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.length > 2) {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `accounts/users/?page_size=10&username=${text}`
        );
        setUsers(response.data.data?.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    } else if (text.length === 0) {
      fetchData(); // Reloads full list when search is cleared
    }
  };

  return (
    <input
      placeholder="Search by Name, Email, Registration Number and Employee Id"
      value={searchText}
      onChange={handleSearch}
      className="search-input"
    />
  );
};

export default SearchBarAssign;
