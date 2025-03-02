import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import UploadPage from "./UploadPage";
import CalendarComponent from "./CalendarComponent";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectOverview from "./ProjectOverviewPage";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState();
  const text = "betterTransit".split("");

  // Track scroll position
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Home Section (Yellow background) */}
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

                    {/* Link to Project Overview */}
                    <Link to="/overview" className="overview-button">Learn More</Link>
                  </div>
                </section>

                {/* Upload Section (Blue background) with Calendar */}
                <section className="upload-page">
                  {/* Upload page contents */}
                  <UploadPage selectedDate={selectedDate}/>

                  {/* Calendar should be positioned in the top right of the blue section */}
                  <div className="calendar-container">
                    <CalendarComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                  </div>
                </section>
              </>
            }
          />
          <Route path="/overview" element={<ProjectOverview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
