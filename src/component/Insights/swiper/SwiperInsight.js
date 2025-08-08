import { Box, Typography } from "@mui/material";
import React from "react";
import ImageIcon from "../../../Assets/Insight/eye.svg";

const SwiperInsight = ({ insightsData }) => {
  // const boxCount = 10; // Number of total boxes
  const imageBox = {
    width: "200px",
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    borderRadius: "0.8rem",
    overflow: "hidden"
  };
  const title = {
    // position: "absolute",
    // top: "10px",
    // left: "10px",
    color:"#1F48D6",
    zIndex: 10,
    fontSize: "1rem",
    width: "100%",
    textWrap: "wrap",
    fontStyle: "normal",
    textAlign: "center",
    fontWeight: 800,
    lineHeight: "108.3%",
    textTransform: "uppercase",
  };

  const contentBox = {
    padding: "15px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  };
 
  return (
    <div
    style={{
      width: "100%",
      backgroundColor: "transparent",
      boxSizing: "border-box",
      padding: "30px",
      overflowX: "auto",
      whiteSpace: "nowrap",
      scrollbarWidth: "thin", // For Firefox
      scrollbarColor: "transparent transparent ", // For Firefox
      WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
      WebkitScrollbarTrack: {
        background: "transparent",
        width: "20px", // Set the width of the WebKit scrollbar track
      },
      WebkitScrollbarThumb: {
        background: "transparent",
        width: "5px", // Set the width of the WebKit scrollbar thumb
      },
    }}
    
    >
      {/* All boxes */}
      {insightsData && insightsData.map((item, index) => (
        <div
          key={index}
          style={{
            width: "200px",
            height: "auto",
            marginRight: "30px",
            boxSizing: "border-box",
            display: "inline-block",
            position: "relative",
          }}
        >
          <Box sx={imageBox}>
            <img src={item.image} style={{ position: "absolute", width: "100%", height: "100%", top: "0", left: "0"}} alt={item.name} />
            {/* <Typography sx={title}>{item.name}</Typography> */}
          </Box>
          <div style={contentBox}>
          <Typography color="wheat" sx={title}>{item.name}</Typography>
            <Typography color="#000" align="center">
              {item.highest_view_element}
            </Typography>
            <Typography
              color="#000"
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
            >
              <Typography component={"span"} margin={"-16px"}>
                <img src={ImageIcon} alt="eyeIcon" style={{ width: "50px" }} />{" "}
              </Typography>
              <Typography component="span" marginTop={"-2px"}>
                {item.view_count}
              </Typography>{" "}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwiperInsight;
