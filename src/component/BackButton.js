import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import the Font Awesome back arrow icon

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button 
      onClick={handleBack} 
      style={{ 
        padding: '10px', 
        backgroundColor: '#007bff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '5px', 
        display: 'flex', 
        alignItems: 'center', // Align the icon and text
        gap: '8px' // Add some space between the icon and the text
      }}
    >
      <FaArrowLeft /> {/* Add the back arrow icon */}
      Back
    </button>
  );
};

export default BackButton;
