import React, { useEffect, useState } from 'react'

const ProgressBar = ({ total, completed }) => {
    const [color, setColor] = useState();
    const progressPercentage = (completed / total) * 100;
    const progressWidth = progressPercentage + "%";
    const progressContainer = {
        width: '100%',
        height: '0.5rem',
        padding: 0,
        overflow: 'hidden',
        borderRadius: '0.25rem',
        backgroundColor: '#484848',
      };
      
      const progressCard = {
        height: '100%',
        borderRadius: '0.25rem',
        // content: ""; // This line is not valid in this context
      };
      
    useEffect(() => {
        setColor(progressPercentage === 100 ? "#70C968" : "#7d7d7d");
    }, [progressPercentage])

    return (
        <div style={{...progressContainer}}>
            <div
                style={{backgroundColor: color , width: progressWidth,...progressCard }}
               
            ></div>
        </div>
    );
}

export default ProgressBar;