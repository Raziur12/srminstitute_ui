
export const NavbarContainer={
    display:"flex",
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between",
    width:"100%",
    backgroundColor:"#000000",
    height:"6rem",
    boxSizing: "border-box",
    paddingInline: "2rem",
    position:"fixed",
    zIndex:12,
    top:0,
    right:0,
    left:0,
}

export const AlignItems={
    display: "flex",
    flexDirection:"row",
    width:"50%",
    alignItems: "center",
    justifyContent:"space-between",
    zIndex: "555",
}
export const LogoSection = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row", // "row" is correct; remove the duplicate entry below
    justifyContent: "space-between", // Use "justifyContent" for spacing between items
    width: "22%",
    padding:1
  };
  export const iconSearchMessage={
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
     
  }
  export const ProfileText1 = {
    color: 'black', // Make sure to enclose the color value in quotes

    fontSize: '17.5px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '17.5px', // Make sure to enclose the value in quotes
  };
  export const ProfileText2 = {
    color: 'black', // Make sure to enclose the color value in quotes
    textTransform: "capitalize",
    fontSize: '11.5px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '17.5px', // Make sure to enclose the value in quotes
  };
  export const imageProfileBox={
    marginLeft:5,
    paddingLeft:3,
    borderLeft: '1px solid #FFF', 
  }
  export const searchBox={
    position: "relative",
    width: "614.444px",
    "@media (max-width: 1341px)": {
      width: "834px"
  }
}