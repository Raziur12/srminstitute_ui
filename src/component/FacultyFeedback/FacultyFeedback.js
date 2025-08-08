import React, { useState, useEffect } from "react";
import axiosInstance from "../../interceptor/axiosInstance";
import { useNavigate } from "react-router-dom";

const FacultyFeedback = () => {
  const navigate = useNavigate();
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  const fetchQuestionPapers = async () => {
    try {
      const response = await axiosInstance.get("feedback/admin-faculty-feedback");
      setQuestionPapers(response.data?.data);
    } catch (error) {
      console.error("Error fetching question papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchQuestionPapers();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    const sortedData = [...questionPapers].sort((a, b) => {
      return sortOrder === "asc" ? a.ranking - b.ranking : b.ranking - a.ranking;
    });
    setQuestionPapers(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredPapers = questionPapers.filter((paper) =>
    paper.faculty_name?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );  

  const handlePreview = (id) => {
    navigate(`/facultyPreview`, {
      state: { facultyId: id },
    });
  };


  return (
    <div className="faculty-main-div-container">
      <h1>Faculty Ranking</h1>

      <div className="faculty-main-container">
        <div className="faculty-top-controls">
          <input
            type="text-search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="refresh-btn" onClick={handleRefresh}>Refresh</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Overall Satisfaction</th>
              <th>Total Feedbacks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  <div className="loader"></div>
                </td>
              </tr>
            ) : filteredPapers.length > 0 ? (
              filteredPapers.map((paper) => (
                <tr key={paper.faculty_name.id}>
                  <td>{paper.faculty_name.email}</td>
                  <td>{paper.overall_satisfaction}</td>
                  <td>{paper.total_feedbacks}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handlePreview(paper.faculty_name.id)}
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No faculty found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyFeedback;