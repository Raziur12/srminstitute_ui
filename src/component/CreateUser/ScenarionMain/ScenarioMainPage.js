import React, { useState } from 'react'
import "../../../Styles/CreateUser/scenarionMainPage.css";
import ScenarioContent from './ScenarioAddFrom/ScenarioContent';
import ScenarioTable from './ScenarioTable/ScenarioTable';

const ScenarioMainPage = () => {
    const [isScenarioFormOpen, setIsScenarioFormOpen] = useState(false);

    const handleopenScenarioForm = () => {
      setIsScenarioFormOpen(true);
    }

  return (
    <div className='scenario-Main-page-container'>      
 {/*---------------------- Here Open the new form of Create Scenario--------------- */}

 <div className='scenario-main-page-top-headers'>
  {!isScenarioFormOpen ? (
    <>
      <h3>Scenario Table</h3>
      <button className="scenario-create-btn" onClick={handleopenScenarioForm}>
        Create Scenario
      </button>
    </>
  ) : (
    <ScenarioContent />
  )}
</div>


{/*-----------Show Here Scenario Table Data-----------------*/}
<div className="scenario-main-table-container">
{!isScenarioFormOpen && <ScenarioTable />}
</div>
        </div>
  )
}

export default ScenarioMainPage
