
export const assignContainer = {
  minHeight: "100vh",
  width: "80%",
  position: "absolute",
  top: "6rem",
  left: "20%",
  // backgroundColor: "#1F1F1F",
  backgroundColor: "#FCF8F2",
  index: 1,
  paddingBottom:"5rem"
};
export const searchBoxContainer = {
  width: "30%",
  top:0,
  Left:0,
  display: "flex",
  flexDirection: "column",


};
export const profileSearch = {
  width: "90%",
  height: "400px",
  overflowY: "auto",
  marginTop: "1rem",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};
export const assignBox = {
  display: "flex",
  flexDirection: "row",
  marginLeft: "3rem",
};

export const adminProfileBox = {
  paddingBottom: "10px",
  paddingTop: "10px",

  position: "relative",
  borderBottom: "1px dotted #464646",
  borderRight: "2px solid #464646",
};
export const swiperContainerBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Corrected spelling of alignItems
  // Add other styles as needed
};

export const AssignContBox = {
  width: "69%",
};
export const AssignSwiperTextBox = {
  display: "flex",
  flexDirection: "row",
  marginLeft: "1rem",
  marginTop: "3rem",
};
export const AssignswiperHeadder = {
  width: "30%",
  // color: "#FFF", // Enclose color value in quotation marks
  color: "#000",
  boxSizing: "border-box",
  textDecoration: "none",
  fontSize: "18px", // Use quotation marks and provide appropriate units
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "43.75px", // Use quotation marks for percentage values
  // Add other styles as needed
};
export const AssignswiperHeadderBodder = {
  width: "60%",
  height: "2px",
  borderBottom: "2px dotted #464646",
  marginTop: "1.2rem",
  marginLeft: 2, // Use "dotted" for a dotted border
  // Add other styles as needed
};
export const AssignSwiperContainer = {
  width: "100%",
  height: "10rem",
  overflowX: "auto",
  display: "flex",
  gap: "1.8rem",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginTop: "1rem",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

export const contentBoxSwiper = {
  minHeight: "120px",
  minWidth: "150px",

  borderRadius: "20.053px", // Use camelCase for CSS property with hyphen
  border: "1.003px solid #96090E",
  // background: "radial-gradient(50% 50% at 50% 50%, #DA2128 0%, #97090E 100%)",
  background: '#e18000',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  // Media query for screen widths above 1240px
  "@media (minWidth:1340px)": {
    height: "140px", // Adjust the height as needed
    width: "180px", // Adjust the height as needed
    // Adjust the width as needed
  },
};
export const assignPersonText = {
  // Media query for screen widths above 1340px
  "@media (minWidth: 1341px)": {
    fontSize: "13px",
    lineHeight: "17px",
  },
  width: "70%",
  marginTop: "10px",
  // Styles outside the media query
  color: "#FFF",
  textAlign: "center",
  fontSize: "11px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "15px" /* 130.769% */,
  textTransform: "capitalize"
};
export const assignPersonTextHover = {
  // Media query for screen widths above 1340px
  "@media (minWidth: 1341px)": {
    fontSize: "19px",
    lineHeight: "17px",
    height: "100%", // Adjust the height as needed
    width: "100%",
  },
  color: "#FFF", // Correcting color property and adding quotes
  textAlign: "center",
  fontSize: "23.83px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "25.319px",
  content: '"Assign"',
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  background: "rgba(0, 0, 0, 0.7)",
  borderRadius: "20.053px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
export const buttonReset={
  borderRadius: "61.111px",
  border:" 1.111px solid #DA2128",
  background: "transparent",
  color: "#FFF",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
  width: "130px",
  height: "36px",
  marginRight:"1rem"
}
export const buttonBox={

}