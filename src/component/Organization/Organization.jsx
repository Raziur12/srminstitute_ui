import React, { useEffect, useState } from 'react';
import "../../Styles/Organization/Organization.css";
import OrgMain from './OrgMain/OrgMain';
import SubOrganization from './SubOrganization/SubOrganization';
import Roles from './Roles/Roles';
import axiosInstance from '../../interceptor/axiosInstance';

const Organization = () => {
  // State to track the currently active section
  const [activeSection, setActiveSection] = useState('Organization');
  const [orgs, setOrgs] = useState([]);
  const [orgBtn, setOrgBtn] = useState([]);

  // Handler to change the active section when a button is clicked
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  // Fetch data from the API when the component loads
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await axiosInstance.get('orgss/view/');  //Change the end point of /orgss/orgs to orgss/view
        setOrgs(response.data.results);
        setOrgBtn(response.data)
      } catch (error) {
        console.error("Error fetching organizations", error);
      }
    };

    fetchOrgs();
  }, []);

  return (
    <div className="org-main">
    
    <div className='text-ontop'>
  <h3 className='org-heading'>
    <span className='congrats-text'>Congratulations!</span> You have successfully created your organisation.
    <span className='next-step-text'>Next step</span> is to create a Sub Organisation & Create Roles.
  </h3>

  <h3 className='step1-heading'>
    Step 1 - <span className='sub-org-question'>Why Should I create a Sub Organisation?</span>
  </h3>

  <p className='sub-org-info'>
    A sub-organisation will help you bucket your employees - new or existing and track them better.<br />
    For example, the sub-organisations could be <span className='sales'>Sales</span>, <span className='marketing'>Marketing</span>, or <span className='finance'>Finance</span>.
  </p>

  <p className='sub-org-performance'>
    This will ensure you can track the performance of the people mapped to the <span className='sales'>Sales</span> sub-organisation without it being cluttered with people from the <span className='marketing'>Marketing</span> sub-organisation.
  </p>

  <p className='next-step-create-role'>
    Once you have created a Sub Organisation, the next step is to create a Role.
  </p>

  <h3 className='step2-heading'>
    Step 2 - <span className='role-question'>Why should I create a Role?</span>
  </h3>

  <p className='role-info'>
    A role will help you assign specific access rights to your employees. Only <span className='admins'>Admins</span> and <span className='sub-admins'>Sub Admins</span> can see the progress of all individuals and get an overview of the progress.
  </p>

  <p className='employee-access-info'>
    Employees can only access the assessments assigned to them and only see their progress.
  </p>

  <p className='next-step-create-series'>
    Once Role is created, the next step is to create a <span className='series'>Series</span> and <span className='season'>Season</span>.
  </p>
</div>


      {/* Button group */}
      <div className="org-main-btn">
        <button 
          className={activeSection === 'Organization' ? 'active' : ''} 
          onClick={() => handleButtonClick('Organization')}
        >
          Organization
        </button>
        <button 
          className={activeSection === 'Sub-Organization' ? 'active' : ''} 
          onClick={() => handleButtonClick('Sub-Organization')}
        >
          Sub-Organization
        </button>
        <button 
          className={activeSection === 'Roles' ? 'active' : ''} 
          onClick={() => handleButtonClick('Roles')}
        >
          Roles
        </button>
      </div>
      {/* Conditional content based on the active section */}
 
        {activeSection === 'Organization' && <OrgMain 
        orgs={orgs} setOrgs={setOrgs}
        orgBtn= {orgBtn}
        setOrgBtn = {setOrgBtn}
        />}
        {activeSection === 'Sub-Organization' && <SubOrganization 
        orgs={orgs}
        />}
        {activeSection === 'Roles' && <Roles 
        orgs={orgs}
        />}

    </div>
  );
};

export default Organization;
