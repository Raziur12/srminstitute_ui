import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import AddSemester from './AddSemester';
import { format } from 'date-fns';
import axiosInstance from '../../../interceptor/axiosInstance';
import debounce from 'lodash.debounce';
import '../../../Styles/Program.css';
import EditSemester from './EditSemester';

const SemesterTable = () => {
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // Fetch programs when the component mounts or currentPage changes.
  useEffect(() => {
    fetchSemesters(searchTerm, currentPage);
  }, [currentPage]);

  const fetchSemesters = (query, page = 1) => {
    setLoading(true);
    axiosInstance
      .get(`programs/semesters/?search=${query}&page=${page}`)
      .then((response) => {
        // Extract programs array and pagination info from response
        setSemesters(response.data?.data?.semesters || []);
        setPagination(response.data?.data?.pagination || {});
      })
      .catch((error) => {
        console.error('Error fetching semesters:', error);
      })
      .finally(() => setLoading(false));
  };

  // Debounced search to reduce API calls
  const handleSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchSemesters(value, 1);
    }, 500),
    []
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  // Delete action with refresh after deletion
  const handleDelete = (id) => {
    // Use your delete API endpoint; here it's a GET request for deletion as per your setup.
    axiosInstance
      .delete(`programs/semesters/${id}`)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted successfully!',
          text: 'The semester has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Refresh the data after deletion
          fetchSemesters(searchTerm, currentPage);
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Delete failed!',
          text: error.response?.data?.message || 'Something went wrong.',
          showConfirmButton: true,
        });
      });
  };

  const totalPages = Math.ceil(pagination.count / 5); // assuming 5 items per page

  return (
    <div className="program-table-container">
      {/* Header section with search input and ADD button */}
      <div className="program-table-search-btn">
        <input
          type="text"
          placeholder="Search semesters..."
          value={searchTerm}
          onChange={onSearchChange}
          className="program-table-search"
        />
        <button
          onClick={() => setIsAddOpen(true)}
          className="program-table-add-btn"
        >
          ADD
        </button>
      </div>

      {/* Display table or loading indicator */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="program-table-box">
          {/* <h3 className="program-table-title">Semesters</h3> */}
          <table className="program-table w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Semester</th>
                <th className="border px-2 py-1">Created At</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {semesters.length > 0 ? (
                semesters.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">
                      {item.name}
                    </td>
                    <td className="border px-2 py-1">
                      {(() => {
                        try {
                          return item.created_at
                            ? format(new Date(item.created_at), 'dd-MM-yyyy HH:mm')
                            : 'N/A';
                        } catch {
                          return 'Invalid Date';
                        }
                      })()}
                    </td>
                    <td className="table-program-action">
                      <button
                        onClick={() => setEditData(item)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="program-table-pagination">
          <button
            disabled={!pagination.previous}
            className="program-table-page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`program-table-page-btn ${
                currentPage === i + 1 ? 'active' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={!pagination.next}
            className="program-table-page-btn"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add Program Modal */}
      {isAddOpen && (
        <AddSemester
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            fetchSemesters(searchTerm, currentPage);
          }}
        />
      )}

      {editData && (
        <EditSemester
          semesterData={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            setEditData(null);
            fetchSemesters(searchTerm, currentPage);
          }}
        />
      )}
    </div>
  );
};

export default SemesterTable;
