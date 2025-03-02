import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import UploadPage from "./UploadPage"; 
import CalendarComponent from "./CalendarComponent"; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectOverviewPage from "./ProjectOverviewPage"; 

function App() {
  const text = "betterTransit".split("");

  // Track scroll position
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <Router>
      <Routes>
        {/* Main Page */}
        <Route
          path="/"
          element={
            <div className="app-container">
              {/* Home Section */}
              <section className="home-container">
                <div className="title-container">
                  <motion.div className="title" style={{ opacity }}>
                    {text.map((letter, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Motto underneath the title */}
                  <motion.p
                    className="motto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                  >
                    "Optimizing subway ridership, one prediction at a time."
                  </motion.p>

                  {/* Button to Navigate to Project Overview */}
                  <Link to="/overview" className="overview-button">Learn More</Link>
                </div>
              </section>

              {/* Upload Section with Calendar */}
              <section id="upload" section className="upload-page">
                <UploadPage />
                <div className="calendar-container">
                  <CalendarComponent />
                </div>
              </section>
            </div>
          }
        />

        {/* Project Overview Page Route */}
        <Route path="/overview" element={<ProjectOverviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
