import React from 'react'
import "../../../Styles/Navbar/Alert.css"

const Alert = ({ message }) => {
  return (
    <div className='alert-box'>
        <p className='alert-text'>
            {message}
        </p>
    </div>
  )
}

export default Alert