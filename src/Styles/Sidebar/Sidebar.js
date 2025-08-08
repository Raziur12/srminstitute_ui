export const LearnBox={
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    width:"100%",
    height:"5rem",
    borderBottom: '1px solid #FFF', 
    "@media (min-width: 1341px)": {
        height:"6rem",
      },
}

export const sidebarComponent={
    width:"20%",
    backgroundColor: "#13A4E1",
    height:"calc(100vh - 6rem)",
    position:"fixed",
    top:"6rem",
    zIndex:7,
    left:0,
    overflowY: "scroll",
    overflowX: "visible",
    /* Hide scrollbar */
    scrollbarWidth: "none", /* Firefox */
    msOverflowStyle: "none", /* IE/Edge */
    "&::-webkit-scrollbar": {
        width: 0,
        height: 0
    }
}


export const learnText = {
    cursor: 'pointer', // Corrected property name and value
    color: '#FFF',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 500,
    marginLeft: 3,
    // line-height: normal; // Omit this line or use a specific value if needed
  };
  
  