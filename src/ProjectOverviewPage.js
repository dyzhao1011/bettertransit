import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ProjectOverviewPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // Go back to the home page
    setTimeout(() => {
      const uploadSection = document.getElementById("upload");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Ensure smooth scrolling after navigation
  };

  return (
    <div className="overview-container">
      <h1>MISSION AND VISION</h1>
      <p className="problem-statement">
        <strong>The Problem:</strong> Subway systems often face unpredictable ridership, leading to overcrowding, inefficient scheduling, and commuter dissatisfaction.
      </p>
      <p className="solution-statement">
        <strong>Our Solution:</strong> betterTransit provides data-driven predictions to help optimize ridership, improving scheduling and enhancing the commuter experience.
      </p>
      <p className="elevator-pitch">
        <em>“Optimizing subway ridership, one prediction at a time.”</em>
      </p>
      <button className="back-button" onClick={handleBackClick}>
        Back to Upload Page
      </button>
    </div>
  );
}

export default ProjectOverviewPage;
