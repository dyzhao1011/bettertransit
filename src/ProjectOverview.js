import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ProjectOverview() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="project-overview-container">
      <h1>Project Overview</h1>
      <p>
        This project helps users upload and analyze ridership data. You can
        upload CSV files, view parsed data, and perform calculations.
      </p>
      <p>
        Features include:
        <ul>
          <li>CSV file upload with parsing</li>
          <li>Data visualization and calculation</li>
          <li>A built-in calendar for tracking dates</li>
        </ul>
      </p>

      {/* Button to go back to the upload page */}
      <button className="nav-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default ProjectOverview;
