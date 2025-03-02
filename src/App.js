import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import UploadPage from "./UploadPage"; 
import CalendarComponent from "./CalendarComponent"; 

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
                </div>
              </section>

              {/* Upload Section (Blue background) with Calendar */}
              <section className="upload-page">
                {/* Upload page contents */}
                <UploadPage />
                
                {/* Calendar should be positioned in the top right of the blue section */}
                <div className="calendar-container">
                  <CalendarComponent />
                </div>
              </section>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
