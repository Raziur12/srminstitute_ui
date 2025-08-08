import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import AddSubject from './AddSubject';
import { format } from 'date-fns';
import axiosInstance from '../../../interceptor/axiosInstance';
import debounce from 'lodash.debounce';
import '../../../Styles/Program.css';
import EditSubject from './EditSubject';

const SubjectTable = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null); // for edit modal

  useEffect(() => {
    fetchSubjects(searchTerm, currentPage);
  }, [currentPage]);

  const fetchSubjects = (query, page = 1) => {
    setLoading(true);
    axiosInstance
      .get(`programs/subjects/?search=${query}&page=${page}`)
      .then((response) => {
        setSubjects(response.data?.data?.subjects || []);
        setPagination(response.data?.data?.pagination || {});
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchSubjects(value, 1);
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
      .delete(`programs/subjects/${id}`)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted successfully!',
          text: 'The subject has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          fetchSubjects(searchTerm, currentPage);
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

  const totalPages = Math.ceil(pagination.count / 5);

  return (
    <div className="program-table-container">
      <div className="program-table-search-btn">
        <input
          type="text"
          placeholder="Search subjects..."
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
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Code</th>
                <th className="border px-2 py-1">Program</th>
                <th className="border px-2 py-1">Semester</th>
                <th className="border px-2 py-1">Credit</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? (
                subjects.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">{index + 1 + (currentPage - 1) * 5}</td>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">{item.code}</td>
                    <td className="border px-2 py-1">{item.program?.name || '-'}</td>
                    <td className="border px-2 py-1">{item.semester?.name || '-'}</td>
                    <td className="border px-2 py-1">{item.credit || '-'}</td>
                    <td className="table-program-action">
                      <button
                        onClick={() => setEditingSubject(item)}
                        className="text-blue-600 hover:underline mr-2"
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
              className={`program-table-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
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

      {/* Add Modal */}
      {isAddOpen && (
        <AddSubject
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            fetchSubjects(searchTerm, currentPage);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingSubject && (
        <EditSubject
          subjectData={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSuccess={() => {
            setEditingSubject(null);
            fetchSubjects(searchTerm, currentPage);
          }}
        />
      )}
    </div>
  );
};

export default SubjectTable;
