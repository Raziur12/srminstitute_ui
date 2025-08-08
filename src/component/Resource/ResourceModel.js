import React from 'react';
import "../../Styles/Resource/Resource.css";

const ResourceModal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-resource">
        <span className="modal-close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default ResourceModal;
