import React, { useState } from 'react';
import '../../Styles/Program.css'; // Import the CSS file

import ProgramsTab from './ProgramsTab/ProgramTable';
import DesignationTab from './Designation/DesignationTable';
import DepartmentTab from './Department/DepartmentTable';
import SemesterTab from './Semester/SemesterTable';
import SubjectTab from './Subject/SubjectTable';

const TAB_OPTIONS = ['Programs', 'Designation', 'Department', 'Semester', 'Subject'];
const tabComponents = {
  Programs: ProgramsTab,
  Designation: DesignationTab,
  Department: DepartmentTab,
  Semester: SemesterTab,
  Subject: SubjectTab,
};

const Programs = () => {
  const [activeTab, setActiveTab] = useState('Programs');
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="program-tab-container">
      <div className="program-tab-buttons">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`program-tab-button ${
              activeTab === tab ? 'active' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="program-tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Programs;
