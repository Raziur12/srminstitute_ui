import React from 'react'
import HodTTPage from './TTPagesBaisesOfRole/HODTTPages/HodTTPage'
import ProsFaclityPage from './TTPagesBaisesOfRole/ProsFaclityPages/ProsFaclityPage'
import TTCodinatorPage from './TTPagesBaisesOfRole/TTCodinatorPage/TTCodinatorPage'

const SubjectPerfrence = () => {
  const loginUserCheck = localStorage.getItem('user_type');
  const userRole = localStorage.getItem('role');

  return (
    <div>
      {loginUserCheck === 'hod' && <HodTTPage />}
      {loginUserCheck === 'prospective_faculty' && <ProsFaclityPage />}
      {loginUserCheck === 'time_table_coordinator' && <TTCodinatorPage />}
      {loginUserCheck === 'faculty' && <ProsFaclityPage />}

      {userRole === 'super_admin' && <ProsFaclityPage />}
    </div>
  )
}

export default SubjectPerfrence