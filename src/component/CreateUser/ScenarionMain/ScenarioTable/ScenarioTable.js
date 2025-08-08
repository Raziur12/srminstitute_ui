import React, { useState } from "react";
import "../../../../Styles/CreateUser/scenarioTable.css";
import ScenarioEditBtn from "../ScenarioEditBtn/ScenarioEditBtn";

// Sample data in JSON format
const scenarios = [
  {
    id: 1, // Add a unique ID to each scenario
    name: "Scenario 1",
    scenario: "Lorem ipsum dolor sit amet",
    itemNumber: 12345,
    keywords: ["keyword1", "keyword2", "keyword3"],
  },
  {
    id: 2,
    name: "Scenario 2",
    scenario: "Consectetur adipiscing elit",
    itemNumber: 54321,
    keywords: ["keyword4", "keyword5", "keyword6"],
  },
  // Add more scenarios as needed
];

function ScenarioTable() {
  const [editScenarioId, setEditScenarioId] = useState(null); // State to store the scenario ID to edit

  const handleEditbtn = (scenarioId) => {
    setEditScenarioId(scenarioId); // Store the scenario ID to be edited
  };

  // If an ID is set for editing, render ScenarioEditBtn and hide the table
  if (editScenarioId !== null) {
    return <ScenarioEditBtn scenarioId={editScenarioId} />;
  }

  // If no ID is set for editing, render the table
  return (
    <div className="scenario-main-table">
      <table className="scenario-table">
        <thead className="scenario-table-thead">
          <tr>
            <th>Name</th>
            <th>Scenario</th>
            <th>Item Number</th>
            <th>Keywords</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {scenarios.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.scenario}</td>
              <td>{item.itemNumber}</td>
              <td>{item.keywords.join(", ")}</td>
              <td>
                <button
                  className="scenario-table-edt-btn"
                  onClick={() => handleEditbtn(item.id)} // Pass the scenario ID
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScenarioTable;
