import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import "../../Styles/globalComponent/RedButton.css"

const RedButton = ({ onClickHandler, text, loading }) => {
  const [ content, setContent ] = useState()

  useEffect(() => {
    if (loading) {
      setContent(
        <ThreeDots
          visible={true}
          height="1.3rem"
          width="3.2rem"
          color="#fff"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
      )
    } else {
      setContent(text)
    }
  }, [loading, text])
    
  return (
    <button onClick={onClickHandler} className='red-btn-global'>
        {content}
    </button>
  )
}

export default RedButton