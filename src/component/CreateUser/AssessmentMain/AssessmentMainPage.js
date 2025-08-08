import React, { useState } from 'react'
import AssessmentAddForm from './AssessmentAddForm/AssessmentAddForm';
import AssessmentTable from './AssessmentTable/AssessmentTable';

const AssessmentMainPage = () => {
    const [isAssessmentFormOpen, setIsAssessmentFormOprn] = useState(false);

    const handleopenAssessmentForm = () => {
        setIsAssessmentFormOprn(true);
      }

      
  return (
    <div className='scenario-Main-page-container'>     
      
      {/*---------------------- Here Open the new form of Create Scenario--------------- */}

 <div className='scenario-main-page-top-headers'>
  {!isAssessmentFormOpen ? (
    <>
      <h3>Assessment Table</h3>
      <button className="scenario-create-btn" onClick={handleopenAssessmentForm}>
        Add Assessment
      </button>
    </>
  ) : (
    <AssessmentAddForm />
  )}
</div>


{/*-----------Show Here Scenario Table Data-----------------*/}
<div className="scenario-main-table-container">
{!isAssessmentFormOpen && <AssessmentTable />}
</div>
        </div>
  )
}

export default AssessmentMainPage
