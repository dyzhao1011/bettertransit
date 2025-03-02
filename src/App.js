import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import UploadPage from "./UploadPage";
import CalendarComponent from "./CalendarComponent";
import ProjectOverviewPage from "./ProjectOverviewPage"; 

function App() {
  const text = "betterTransit".split("");

  // Track scroll position
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Ref for the project overview section
  const overviewRef = useRef(null);

  // Function to scroll smoothly to the overview section
  const scrollToOverview = () => {
    overviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-container">
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

          {/* Scroll Down Button */}
          <button className="scroll-button" onClick={scrollToOverview}>Learn More</button>
        </div>
      </section>

      {/* Project Overview Section (Scroll Target) */}
      <section ref={overviewRef} className="overview-section">
        <ProjectOverviewPage />
      </section>

      {/* Upload Section (Blue background) with Calendar */}
      <section className="upload-page">
        <UploadPage />
        <div className="calendar-container">
          <CalendarComponent />
        </div>
      </section>
    </div>
  );
}

export default App;
