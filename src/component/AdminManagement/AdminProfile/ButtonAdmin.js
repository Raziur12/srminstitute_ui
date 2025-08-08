import React from 'react';

function ButtonAdmin({ position }) {
  let defaultStyle = {
    color: '#FFF',
    // fontFamily: 'Poppins',
    fontSize: '11.52px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '25.2px',
    borderRadius: '26.88px',
    marginLeft: 5,
    padding:"10px",
    width:"40px"
  };

  let specificStyle = {};

  switch (position) {
    case 'admin':
      specificStyle = { backgroundColor: '#FFBB37', color: '#fff',width:"83.52px",height:"28px" };
      break;
    case 'assign':
      specificStyle = { backgroundColor: '#4AB9FF', color: '#fff',width:"83.52px",height:"28px" };
      break;
    case 'analytic':
      specificStyle = { backgroundColor: '#DA2128', color: '#fff' ,width:"83.52px",height:"28px"};
      break;
    case 'plants':
      specificStyle = { backgroundColor: '#70C968', color: '#fff',width:"83.52px",height:"28px" };
      break;
    default:
      // Default style if position doesn't match any case
      specificStyle = { backgroundColor: 'gray', color: 'FFF' };
  }

  const buttonStyle = { ...defaultStyle, ...specificStyle };

  return (
    <span style={buttonStyle}>
      {position.charAt(0).toUpperCase() + position.slice(1)}
    </span>
  );
}

export default ButtonAdmin;
