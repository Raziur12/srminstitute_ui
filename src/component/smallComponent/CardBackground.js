import React from 'react';

const CardBackground = ({ color, children }) => {
    const bgColor = color || "#da2124"
    const card = {
        width: '100%',
        height: '100%',
        borderRadius: '2.5rem',
        boxSizing: 'border-box',
        zIndex: 1,
        borderTop: '7px solid #DA2128',
        boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
      };
      
    return (
        <div style={{...card,borderTop:` 7px solid ${bgColor}`}} >
            {children}
        </div>
    );
}

export default CardBackground;