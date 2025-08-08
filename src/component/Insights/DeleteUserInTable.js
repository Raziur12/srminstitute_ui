import React from 'react';
import { ImBin } from "react-icons/im";
import Swal from 'sweetalert2';
import axiosInstance from '../../interceptor/axiosInstance';

const DeleteUserInTable = ({ attemptId, trustScore }) => {
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`userprogress/user-test-submission/${attemptId}/`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "The attempt has been deleted.",
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => {
              window.location.reload(); // Refresh the page after success
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong. Please try again.",
              icon: "error"
            });
          });
      }
    });
  };

  return (
    <ImBin
  onClick={handleDelete}
  color="black"  // Black if trust_score <= 20 (including 0)
  size={28}
  className='bin-table'
 />

  
  );
};

export default DeleteUserInTable;
