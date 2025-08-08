import React from 'react'
import RedButton from '../../../../redButton/RedButton'
// import RedButton from '../redButton/RedButton'
// import "../../styles/globalComponents/ThankPopUp.css"

const ThankPopUp = ({ btnFunction, text }) => {
  return (
    <div className='thank-popup-container'>
        <div className='pop-up-main'>
            <div className='pop-up-border'>
                <p className='text'>
                    {text}
                </p>
                <RedButton text={"OKAY"} onClickHandler={btnFunction} />
            </div>
        </div>
    </div>
  )
}

export default ThankPopUp