import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import UploadPage from "./UploadPage"; // Import your friend's component

function App() {
  const text = "betterTransit".split("");

  // Track scroll position
  const { scrollYProgress } = useScroll();

  // Fade out text when scrolling
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="app-container">
      {/* First section with the animated logo */}
      <section className="home-container">
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
      </section>

      {/* UploadPage component (New Page) */}
      <section className="upload-page">
        <UploadPage />
      </section>
    </div>
  );
}

export default App;
