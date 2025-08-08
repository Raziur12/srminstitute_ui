export const AssignBoxContainers = {
    width: "100%",
    paddingBottom:"1rem",
    marginBottom:"2rem",
    borderRadius: "44.96px 44.96px 44.96px 44.96px",
    borderTop: "0.749px solid #989898",
    borderRight: "0.749px solid #989898",
    borderLeft: "0.749px solid #989898",
    borderBottom: "0.749px solid #989898",
    background:"#000",
  };
  
    export const imageBox={
        width:"100%",
        height:"190px",
   
        borderRadius: "44.96px 44.96px 0px 0px",
        borderTop: "0.749px solid #989898",
    borderRight: "0.749px solid #989898",
    borderLeft: "0.749px solid #989898",
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.00) 100%)",
    display:"flex",
    justifyContent:"center",
    paddingTop:"1rem"
    }
    export const imageBoxText = {
        marginTop:"1rem",
        width:"100%",
        color: '#FFF',
        textAlign: 'center',
        textShadow: '0px 4.362px 4.362px rgba(0, 0, 0, 0.25)',
        fontSize: '25.968px',
        fontStyle: 'normal',
        fontWeight: 800,
        lineHeight: '35.968px',
        textTransform: 'uppercase',
      };
      export const formRow={
        display:"flex",
        flexDirection:"row",
        gap: '10px',
        justifyContent:"center",
        alignItems:"center",
      }
      export const formColumn={
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
      }
      export const contentText = {
        color: '#FFF',
        textAlign: 'right',
        textShadow: '0px 4.362px 4.362px rgba(0, 0, 0, 0.25)',
        fontSize: '10px',
        fontStyle: 'normal',
        fontWeight: 800,
        lineHeight: '12px',
        "@media (minWidth:1340px)": {
            fontSize: '13px',
          },
      };
      export const formChild = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexShrink: 0,
        color: '#464646',
        textAlign: 'center',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 350,
        lineHeight: '135.8%',
        "@media (minWidth:1340px)": {
            fontSize: '14px',
          }, /* Adjusted the value, use '135.8%' or '16.296px' depending on your preference */
      };
      
      
      export const selectStyles={    
      color: '#FFF',
      backgroundColor:" #000",
      textAlign: 'center',
      boxSizing: 'border-box',
      textDecoration: 'none',
      fontSize: '15px',
      padding:"5px",
      fontStyle: 'normal',
      fontWeight: 550,
      lineHeight: '82%', // Adjusted to a string with a unit
      border:"none",
      borderBottom: '2.429px solid #4C4C4C',
     
    };
    export const optionBg = {
        // backgroundColor: "#1F1F1F",
        borderBottom: "4px solid white",
        padding:2,
        color: "#000",
        fontSize: "13px",
        fontStyle: "normal",
        fontWeight: 350,
        lineHeight: "135.8%", /* 17.654px */
        textTransform: "uppercase",
        alignItems: "start", // Corrected property name
      };