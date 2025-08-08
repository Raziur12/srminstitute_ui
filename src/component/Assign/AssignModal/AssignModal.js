import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  modalContainer,
  modalBox,
  textmodal,
  formRow,
  contentText,
  formColumn,
  formChild,
  buttonReset,
} from '../../../Styles/Assign/AsignModalStyle';

const AssignModal = ({ designation, setShowMenu }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    // trainingModule: null,
    // assessment: null,
    // guidebook: null,
    // checklist: null,
    assign:null,
  });

  const handleOptionChange = (category, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [category]: value,
    }));
  };

  return (
    <>
      <Box sx={modalContainer}>
        <Box sx={modalBox}>
          <Typography sx={textmodal}>{designation} - Fire Safety Department</Typography>

          {/* Training Module */}
          <Box sx={{ ...formRow, borderBottom: '2px dotted #404040', marginBottom: '2rem' }} marginTop="1rem">
            <Box sx={contentText} width="30%" align="left">
              Assign:
            </Box>
            <Box sx={formRow} width="70%">
              {['assign'].map((option) => (
                <Box key={option} sx={formColumn}>
                  <input
                    type="radio"
                    name="trainingModule"
                    value={option}
                    checked={selectedOptions.trainingModule === option}
                    onChange={() => handleOptionChange('trainingModule', option)}
                  />
                  <label style={{ ...formChild }}>{option}</label>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Assessment */}
          {/* <Box sx={{ ...formRow, borderBottom: '2px dotted #404040', marginBottom: '2rem' }} marginTop="1rem">
            <Box sx={contentText} width="30%" align="left">
              Assessment:
            </Box>
            <Box sx={formRow} width="70%">
              {['Mandatory', 'Advised', 'Others'].map((option) => (
                <Box key={option} sx={formColumn}>
                  <input
                    type="radio"
                    name="assessment"
                    value={option}
                    checked={selectedOptions.assessment === option}
                    onChange={() => handleOptionChange('assessment', option)}
                  />
                  <label style={{ ...formChild }}>{option}</label>
                </Box>
              ))}
            </Box>
          </Box> */}

          {/* Guidebook */}
          {/* <Box sx={{ ...formRow, borderBottom: '2px dotted #404040', marginBottom: '2rem' }} marginTop="1rem">
            <Box sx={contentText} width="30%" align="left">
              Guidebook:
            </Box>
            <Box sx={formRow} width="70%">
              {['Mandatory', 'Advised', 'Others'].map((option) => (
                <Box key={option} sx={formColumn}>
                  <input
                    type="radio"
                    name="guidebook"
                    value={option}
                    checked={selectedOptions.guidebook === option}
                    onChange={() => handleOptionChange('guidebook', option)}
                  />
                  <label style={{ ...formChild }}>{option}</label>
                </Box>
              ))}
            </Box>
          </Box> */}

          {/* Checklist */}
          {/* <Box sx={{ ...formRow, borderBottom: '2px dotted #404040', marginBottom: '3rem' }} marginTop="1rem">
            <Box sx={contentText} width="30%" align="left">
              Checklist:
            </Box>
            <Box sx={formRow} width="70%">
              {['Mandatory', 'Advised', 'Others'].map((option) => (
                <Box key={option} sx={formColumn}>
                  <input
                    type="radio"
                    name="checklist"
                    value={option}
                    checked={selectedOptions.checklist === option}
                    onChange={() => handleOptionChange('checklist', option)}
                  />
                  <label style={{ ...formChild }}>{option}</label>
                </Box>
              ))}
            </Box>
          </Box> */}

          {/* Submit Button */}
          <Box marginTop="2rem">
            <button 
              onClick={() => setShowMenu(false)} 
              style={{ ...buttonReset, background: '#DA2128', width: '155px' }}
            >
              Submit
            </button>
          </Box>

        </Box>
      </Box>
    </>
  );
};

export default AssignModal;
