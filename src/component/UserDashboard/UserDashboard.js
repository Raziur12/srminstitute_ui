import React from "react";
import "../../Styles/UserDashboard/UserDashboard.css";
import seanpower from "../../Assets/senti-result/champion.png";
import seanweek from "../../Assets/senti-result/wordsletyoudown.png";
import scenrioAttempted from "../../Assets/dashboard-user/scenariosattempted.png";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const UserDashboard = ({ lastTableAttmpt }) => {
  const location = useLocation();
  const state = location.state || {}; // Fallback to an empty object if no state is provided
  const cardData = state.data;

  if (!cardData || Object.keys(cardData).length === 0) {
    // Data is not available yet, display loading indicator or message
    return <div>Loading...</div>;
  }

  const getValueOrFallback = (value, fallback = "Data not available") =>
    value !== null && value !== undefined ? value : fallback;

  return (
    <div className="main-dasboard-container">
      <p className="dashboard-levels">
        Your Level: {getValueOrFallback(cardData.current_level)}
      </p>
      <div className="dashboard-cards">
        <p className="cumulative-main-title">Power/Weak Words:</p>
        <div className="home-custom-level-side-menu">
          <div className="home-custom-course-sidemenu-dashboard">
            <img
              src={seanpower}
              className="senti-cloud-box-img"
              alt="champion words"
            />
            <div className="senti-cloud-title-discrption">
              <p className="senti-cloud-sidemenu-main-des">
                Champion Words Used By You
              </p>
              <p className="senti-words-sidemenu-description">
                {getValueOrFallback(cardData.user_powerwords)}
              </p>
            </div>
          </div>

          <div className="home-custom-course-sidemenu-week-dashboard">
            <img
              src={seanweek}
              className="senti-cloud-box-img"
              alt="words that let you down"
            />
            <div className="senti-cloud-title-discrption">
              <p className="senti-cloud-sidemenu-main-des-week">
                Words which let you down
              </p>
              <p className="senti-words-sidemenu-description-week">
                {getValueOrFallback(cardData.user_weakwords)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Score Table */}
      <div className="table-set">
        <div className="graph-container-table">
          <table className="senti-cloud-table">
            <thead>
              <tr>
                <th>Competency</th>
                <th>Last Three Values</th>
              </tr>
            </thead>
            <tbody>
              {cardData.competency_score ? (
                Object.entries(
                  JSON.parse(cardData.competency_score)
                ).map(([competency, score]) => {
                  const scoreArray = score.split(","); // Split the score string into an array
                  const lastThreeValues = scoreArray.slice(-3); // Get the last three values

                  return (
                    <tr key={competency}>
                      <td>{competency}</td> {/* Competency Name */}
                      <td>{lastThreeValues.join(", ")}</td> {/* Last Three Values */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="2">Competency data not available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


{/* Competency Score Table */}
<div className="table-set">
  <div className="graph-container-table">
    <table className="senti-cloud-table">
      <thead>
        <tr>
          <th>Assessment</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {cardData.assessment_score ? (
          // Split the "assessment_score" string by ", " to separate each assessment.
          cardData.assessment_score.split(", ").map((scoreItem, index) => {
            // Split each "Pre: 90" into "Pre" and "90"
            const [assessmentName, assessmentScore] = scoreItem.split(": ");

            return (
              <tr key={index}>
                <td>{assessmentName}</td> {/* Show "Pre" as Assessment */}
                <td>{assessmentScore}</td> {/* Show "90" as Score */}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="2">Assessment Score is not available</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>



      {/* Competency Attempted/Assigned */}
      <div className="dashboard-competency-main">
        <div className="dashboard-competency-container">
          <div className="dashboard-comeptency-img-title">
            <img
              className="senti-cloud-attempted-img"
              src={scenrioAttempted}
              alt="Scenarios attempted"
            />
            <p className="dashboard-competency-assigned-names">
              Scenarios attempted
            </p>
          </div>
          <p className="dashboard-competency-assigned">
            {getValueOrFallback(cardData.scenarios_attempted)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
