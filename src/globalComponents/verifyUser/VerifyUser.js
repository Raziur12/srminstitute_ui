import React, { useEffect, useState } from 'react'
import SinglePersonForm from './components/SinglePersonForm'
import NameNotFound from './components/nameNotFound/NameNotFound'
import HeadingContent from '../../component/smallComponent/HeadingContent'
import axiosInstance from '../../interceptor/axiosInstance'
import "../../Styles/globalComponent/VerifyUser.css"

const VerifyUser = ({ 
    name, 
    setName, 
    pageTitle,
    postApiData,
    analyticsUserApiData,
    setMessage,
    setSendUserId,
    sendUserId,
    data }) => {

    const [ popUpFormVisible, setPopUpFormVisible ] = useState(false)
    const [ userList, setUserList ] = useState()

    useEffect(() => {
        axiosInstance
            .get("individual_analytics/users/")
            .then(res => {
                setUserList(res.data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

  return (
    <div className='verify-user-main-div'>
        
        <HeadingContent data={data} />

        <div className='form-container'>
            <SinglePersonForm 
                title={pageTitle}
                name={name}
                setName={setName}
                postApiData={postApiData}
                analyticsUserApiData={analyticsUserApiData}
                setMessage={setMessage}
                userList={userList}
                sendUserId={sendUserId}
                setSendUserId={setSendUserId}
            />
        </div>

        <p className='text'>
            If you didn’t find a name in the list.
        </p>
        <p onClick={() => setPopUpFormVisible(true)} className='click-text'>
            Click here
        </p>

        {popUpFormVisible && 
        <div className='pop-up-container'>
            <NameNotFound
                setPopUpFormVisible={setPopUpFormVisible}
            />
        </div>}
    </div>
  )
}

export default VerifyUser