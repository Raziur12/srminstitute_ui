// import { boxSizing, color, display, width } from "@mui/system";
// import { AlignItems } from "../Navbar/navbar";

export const feedbox = {
    minHeight: "100vh",
    width: "80%",
    position: "absolute",
    top: "6rem",
    left: "20%",
    // backgroundColor: "#1F1F1F",
    backgroundColor: "#FCF8F2",
    index:1,
    
  };
  
export const starContent = {
    // color: '#FFF', // Make sure to use quotes around the color value
    color:"#000",
    boxSizing: 'border-box',
    textDecoration: 'none',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 1.3,
    textAlign:"left" // Use a unitless number or a percentage without a unit
  };
 export  const starBox={
    display:"flex",
    flexDirextion:"row",
    jutifyContent:"space-around",
    marginLeft:7
 }
 
 export const starMargin={
    marginRight:4
 }
  export const inputFeedback={
    borderRadius: '8.433px',
        border: '1.406px solid #414141',
        // background: '#1F1F1F',
        background:"#fff",
        boxShadow: '4.217px 4.217px 9.839px 0px rgba(0, 0, 0, 0.30) inset',
        color: '#545454',
        boxSizing: 'border-box',
        textDecoration: 'none',
        fontSize: '19.677px',
        fontStyle: 'normal',
        fontWeight: 550,
        lineHeight: '143.8%', // Use a string with a unit
        padding: '8px',
        marginRight:"50px"
  }
  export const inputBox={
    display:"flex",
    flexDirextion:"row",
    textAlign:"start",
    marginLeft:7,
    marginBottom:6,
  }

  export const inputFocused={
    outline: "none",
    color: "#ffffff"
  }

  export const textAreaBox={
    textAlign:"start",
    marginLeft:7,
    marginTop:2,
    marginBottom:6,
    display:"flex",
    flexDirextion:"column"
  }
  export const buttonBox={
    marginLeft:7,
    textAlign:"start",
    marginBottom:5
  }
  export const textAreafield = {
    // color: '#FFF', // Make sure to use quotes around the color value
    color:"#000",
    boxSizing: 'border-box',
    textDecoration: 'none',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    textAlign:"start",
    marginTop:5,
    marginLeft:7,
    lineHeight: '1.27', // Use a unitless number or a value with the "em" unit
  };
  

  export const submitBtn = {
    width: '100%',
    boxSizing: 'border-box',
    paddingInline: "4rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }