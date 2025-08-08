import React, { useEffect, useState } from 'react';
import BackButton from '../../../../BackButton';
import OptionEditTable from './OptionEditTable';
import axiosInstance from '../../../../../interceptor/axiosInstance';
import { useLocation } from 'react-router-dom';
import AddNewOptions from './AddNewOptions';
import Swal from 'sweetalert2';
import "../../../../../Styles/PageSizeSelector.css"

const OptionsTable = () => {
  const location = useLocation();
  const questionID = location.state?.questionID;

  const [optionsData, setOptionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [deletingOptionId, setDeletingOptionId] = useState(null);
  const [editingOptionId, setEditingOptionId] = useState(null); // ✅ track edit loader

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`assessments/options/?question_id=${questionID}`);
      setOptionsData(response.data.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [questionID]);

  const openEditPopup = (optionId) => {
    setEditingOptionId(optionId); // Start loader
    setSelectedOptionId(optionId);
    setShowPopup(true);
  };

  const closeEditPopup = () => {
    setEditingOptionId(null); // Reset loader
    setSelectedOptionId(null);
    setShowPopup(false);
  };

  const handleDeleteOption = async (optionId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this option!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setDeletingOptionId(optionId);
          await axiosInstance.delete(`assessments/options/${optionId}/`);
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
          return false;
        } finally {
          setDeletingOptionId(null);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (confirm.isConfirmed) {
      Swal.fire('Deleted!', 'The option has been deleted.', 'success');
      fetchOptions();
    }
  };

  return (
    <div className="relative p-4">
      <div className="question-page-dropdown mb-4 flex justify-between items-center">
        <BackButton />
        <button
          className="assessments-button bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowAddPopup(true)}
        >
          Add New Options
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
      <thead>
  <tr className="bg-gray-100 border-b">
    <th className="p-2 text-left">Option Text</th>
    <th className="p-2 text-left">Correct</th>
    <th className="p-2 text-left">Image</th>
    <th className="p-2 text-left">Actions</th>
  </tr>
</thead>


        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center p-4">Loading data...</td>
            </tr>
          ) : (
            optionsData.map((option) => (
              <tr key={option.id} className="border-b">
                <td className="p-2">{option.text}</td>
                <td className="p-2">{option.is_correct ? '✔️' : '❌'}</td>
                <td className="p-2">
          {option.image ? (
            <img
            src={`${axiosInstance.defaults.baseURL}${option.image}`}
              alt="Option"
              className="table-option-img"
            />
          ) : (
            <span className="text-gray-400 italic">No Image</span>
          )}
        </td>
                <td className="button-dived p-2 flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      editingOptionId === option.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => openEditPopup(option.id)}
                    disabled={editingOptionId === option.id}
                  >
                    {editingOptionId === option.id ? 'Opening...' : 'Edit'}
                  </button>

                  <button
                    className={`px-3 py-1 rounded ${
                      deletingOptionId === option.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    disabled={deletingOptionId === option.id}
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    {deletingOptionId === option.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showPopup && selectedOptionId && (
        <OptionEditTable
          optionId={selectedOptionId}
          onClose={closeEditPopup}
          onSaveSuccess={fetchOptions}
        />
      )}

      {/* Add Modal */}
      {showAddPopup && (
        <AddNewOptions
          questionID={questionID}
          onClose={() => setShowAddPopup(false)}
          onSaveSuccess={fetchOptions}
        />
      )}
    </div>
  );
};

export default OptionsTable;
