import React from "react";
import "./App.css";

function ProjectOverviewPage() {
  return (
    <div className="overview-container">
      <h1>PROJECT VISION AND MISSION</h1>
      <p className="problem-statement">
        <strong>The Problem:</strong> Subway systems often face unpredictable ridership, leading to overcrowding, inefficient scheduling, and commuter dissatisfaction.
      </p>
      <p className="solution-statement">
        <strong>Our Solution:</strong> BetterTransit provides data-driven predictions to help optimize ridership, improving scheduling and enhancing the commuter experience.
      </p>
    <div id="next-section" className="next-container">
    <button 
      className="scroll-button" 
      onClick={() => {
        window.scrollTo({
          top: document.getElementById("next-section").offsetTop,
          behavior: "smooth"
        });
      }}
    >
      How do we do that?
    </button>


      </div>

    </div>
  );
}

export default ProjectOverviewPage;
