import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AdminImage from "../../Assets/Sidebar/Admin.svg";
import Polygon from "../../Assets/Sidebar/Polygon.svg";
import { LearnBox, learnText, sidebarComponent } from "../../Styles/Sidebar/Sidebar";
import "../../Styles/Sidebar/sidebar.css";
import library from "../../Assets/library.png";
import assign from "../../Assets/assign.png";
import Insight from "../../Assets/Sidebar/Insight.svg";

export default function SideBar() {
  const navigate = useNavigate();

  // Get user type and role from localStorage
  const userType = localStorage.getItem("user_type");
  const userRole = localStorage.getItem("role");

  let sidebarText = [];

  // ✅ Case 1: Full access for super_admin
  if (userRole === "super_admin") {
    sidebarText = [
      { image: library, text: "Library", subMenu: [{ text: "MCQ Assessment", linkTo: "/library/mcq" }] },
      { image: AdminImage, text: "User", linkTo: "/user" },
      { image: assign, text: "Assign", linkTo: "/Assign" },
      { image: Insight, text: "Organisation Insight", linkTo: "/Insight" },
      { image: Insight, text: "Offline Question Paper", linkTo: "/faculty" },
      { image: Insight, text: "Faculty Effort Form", linkTo: "/facultyForm" },
      { image: Insight, text: "Faculty FeedBack", linkTo: "/facultyFeedback" },
      { image: Insight, text: "Programs", linkTo: "/programs" },
      // { image: Insight, text: "Subject Perfrence", linkTo: "/subjectPerfrence" },
    ];
  } else {
    // ✅ Case 2: Limited access for allowed user types
    const allowedUserTypes = ["time_table_coordinator", "prospective_faculty", "hod", "faculty"];
    if (allowedUserTypes.includes(userType)) {
      sidebarText = [
        { image: Insight, text: "Offline Question Paper", linkTo: "/faculty" },
        { image: Insight, text: "Faculty Effort Form", linkTo: "/facultyForm" },
        { image: Insight, text: "Faculty FeedBack", linkTo: "/facultyFeedback" },
        // { image: Insight, text: "Subject Perfrence", linkTo: "/subjectPerfrence" },
      ];
    }
  }

// Check if only one option is available
const isSingleOption = sidebarText.length === 1;

// Initialize active scenario correctly
const [activeScenario, setActiveScenario] = useState(
  sessionStorage.getItem("activeScenario") || (isSingleOption ? sidebarText[0].text : null)
);

  const [expandedMenu, setExpandedMenu] = useState(null);

  // Ensure that the only available option is always active and its page loads
  useEffect(() => {
    if (isSingleOption) {
      const singleItem = sidebarText[0];
      setActiveScenario(singleItem.text);
      sessionStorage.setItem("activeScenario", singleItem.text);
      if (singleItem.linkTo) {
        navigate(singleItem.linkTo); // Automatically navigate
      }
    }
  }, [isSingleOption, sidebarText, navigate]);

  const handleClick = (item) => {
    // Prevent changing selection if only one option exists
    if (isSingleOption) return;

    setActiveScenario(item.text);
    sessionStorage.setItem("activeScenario", item.text);
    if (item.linkTo) {
      navigate(item.linkTo);
    }
  };

  const toggleSubMenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  return (
    <Box sx={sidebarComponent}>
      <Box sx={{ background: "#0613a0", height: "100%" }}>
        {sidebarText.map((item, index) => (
          <React.Fragment key={index}>
            <Box
              onClick={() => handleClick(item)}
              sx={{
                ...LearnBox,
                background: activeScenario === item.text ? "#f3c806" : "#0613a0",
                position: "relative",
                cursor: isSingleOption ? "default" : "pointer", // Disable cursor if only one option
              }}
            >
              <Box display="flex" alignItems="center" marginLeft={3}>
                <img
                  src={item.image}
                  style={{ width: "35px", filter: activeScenario === item.text ? "brightness(0) invert(1)" : "none" }}
                  alt="logo"
                />
                <Typography
                  color={activeScenario === item.text ? "black" : "white"}
                  sx={learnText}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSingleOption && item.subMenu) {
                      toggleSubMenu(index);
                    } else if (!isSingleOption) {
                      handleClick(item);
                    }
                  }}
                >
                  {item.text}
                </Typography>
                {item.subMenu && !isSingleOption && (
                  <Box
                    marginLeft="auto"
                    marginRight={6}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubMenu(index);
                    }}
                  >
                    {expandedMenu === index ? (
                      <IoIosArrowUp color={activeScenario === item.text ? "black" : "white"} size={25} />
                    ) : (
                      <IoIosArrowDown color={activeScenario === item.text ? "black" : "white"} size={25} />
                    )}
                  </Box>
                )}
              </Box>
              {activeScenario === item.text && (
                <img
                  src={Polygon}
                  style={{
                    width: "20px",
                    position: "absolute",
                    right: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  alt="Polygon logo"
                />
              )}
            </Box>
            {item.subMenu && expandedMenu === index && (
              <Box>
                {item.subMenu.map((subItem, subIndex) => (
                  <Box
                    key={subIndex}
                    sx={{
                      ...LearnBox,
                      background: "#5a5e8f",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(subItem)}
                  >
                    <Typography color="white" sx={learnText}>
                      {subItem.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
