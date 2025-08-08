import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import AddProgram from './AddProgram';
import EditProgram from './EditProgram';
import { format } from 'date-fns';
import axiosInstance from '../../../interceptor/axiosInstance';
import debounce from 'lodash.debounce';
import '../../../Styles/Program.css';

const ProgramTable = () => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchPrograms(searchTerm, currentPage);
  }, [currentPage]);

  const fetchPrograms = (query, page = 1) => {
    setLoading(true);
    axiosInstance
      .get(`programs/programs/?search=${query}&page=${page}`)
      .then((response) => {
        setPrograms(response.data?.data?.programs || []);
        setPagination(response.data?.data?.pagination || {});
      })
      .catch((error) => {
        console.error('Error fetching programs:', error);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchPrograms(value, 1);
    }, 500),
    []
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`programs/programs/${id}`)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted successfully!',
          text: 'The program has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          fetchPrograms(searchTerm, currentPage);
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Delete failed!',
          text: error.response?.data?.message || 'Something went wrong.',
        });
      });
  };

  const totalPages = Math.ceil(pagination.count / 5);

  return (
    <div className="program-table-container">
      <div className="program-table-search-btn">
        <input
          type="text"
          placeholder="Search programs..."
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

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="program-table-box">
          <table className="program-table w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Total Semesters</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Created At</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.length > 0 ? (
                programs.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">{index + 1 + (currentPage - 1) * 5}</td>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">
                      {item.total_semesters !== null && item.total_semesters !== undefined
                        ? item.total_semesters
                        : 'Not available'}
                    </td>
                    <td className="border px-2 py-1">
                      {item.department?.name || 'Not available'}
                    </td>
                    <td className="border px-2 py-1">
                      {item.created_at
                        ? format(new Date(item.created_at), 'dd-MM-yyyy HH:mm')
                        : 'N/A'}
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
                  <td colSpan="6" className="text-center py-3 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
        <AddProgram
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            fetchPrograms(searchTerm, currentPage);
          }}
        />
      )}

      {/* Edit Program Modal */}
      {editData && (
        <EditProgram
          programData={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            setEditData(null);
            fetchPrograms(searchTerm, currentPage);
          }}
        />
      )}
    </div>
  );
};

export default ProgramTable;
