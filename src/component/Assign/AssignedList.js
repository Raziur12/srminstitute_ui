import React, { useEffect, useState } from "react";
import axiosInstance from "../../interceptor/axiosInstance";

const AssignedList = ({ user, onClose }) => {
  const [assignedTests, setAssignedTests] = useState([]);

  useEffect(() => {
    const fetchAssignedTests = async () => {
      if (!user?.email) return; // Ensure user exists

      try {
        const response = await axiosInstance.get(
          `assign/bulk-assign/?name=${user.email}&page_size=20`
        );
        setAssignedTests(response.data?.data?.results || []);
      } catch (error) {
        console.error("Error fetching assigned tests:", error);
      }
    };

    fetchAssignedTests();
  }, [user]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <h2>Assigned List</h2>

        {assignedTests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Assigned Test</th>
                <th>Test Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedTests.map((assignment, index) => (
                <tr key={assignment.id}>
                  <td>Assigned Test {index + 1}</td>
                  <td>{assignment.test?.name || "No test name available"}</td>
                 <td>{assignment.status || "No Status is come"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tests assigned.</p>
        )}
      </div>
    </div>
  );
};

export default AssignedList;
