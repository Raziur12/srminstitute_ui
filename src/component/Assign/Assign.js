import React, { useEffect, useState } from "react";
import "../../Styles/Assign/assign.css";
import Modal from "./Model";
import axiosInstance from "../../interceptor/axiosInstance";
import AssignBulk from "./AssignBulk/AssignBulk";
import SearchBarAssign from "./SearchBarAssign";
import AssignedList from "./AssignedList";

const Assign = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectAssignUser, setSelectAssignUser] = useState(null);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10)

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const fetchData = async (pageUrl = `accounts/users/?page=1&page_size=${pageSize}`) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(pageUrl);
      const { pagination, results } = response.data.data;
      setUsers(results);
      setNextPage(pagination.next);
      setPreviousPage(pagination.previous);
      setCurrentPage(new URL(pageUrl, window.location.origin).searchParams.get("page") || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when the page size changes
  useEffect(() => {
    fetchData();
  }, [pageSize]);
  

  // Sorting function
  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key: columnKey, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return direction === "asc" ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  // Function to display correct sorting icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

  const handleChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="assign-container">
      <h2 className="assign-name-top">Assign User Series</h2>
      <div className="user-tit-top">
        <h2>Map all the users you want to assess to a Series.</h2>
        <h2>An email is sent to the User with their login credentials and instructions to access the scenarios.</h2>
        <h2>Activate a user from the User section to allow access.</h2>
      </div>

      <div className="assign-top-button">
        <SearchBarAssign setUsers={setUsers} setLoading={setLoading} fetchData={fetchData} />
        <div className="assign-top-two-btn">
        <button onClick={() => setIsBulkAssignOpen(true)}>Bulk Assign</button>
        <div className="flex items-center space-x-2">
      <select
        id="pageSize"
        value={pageSize}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-1"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
    </div>
      </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("first_name")}>
                  First Name {getSortIcon("first_name")}
                </th>
                <th onClick={() => handleSort("last_name")}>
                  Last Name {getSortIcon("last_name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortIcon("email")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td className="assign-user-btn">
                    <button onClick={() => setSelectedUser(user)}>Edit</button>
                    <button onClick={() => setSelectAssignUser(user)}>Assigned List</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={() => fetchData(previousPage)} disabled={!previousPage}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={() => fetchData(nextPage)} disabled={!nextPage}>
              Next
            </button>
          </div>
        </div>
      )}

      {selectedUser && <Modal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {selectAssignUser && <AssignedList user={selectAssignUser} onClose={() => setSelectAssignUser(null)} />}
      {isBulkAssignOpen && <AssignBulk onClose={() => setIsBulkAssignOpen(false)} />}
    </div>
  );
};

export default Assign;
