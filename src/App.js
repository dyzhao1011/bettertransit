import React from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  // Store the text as an array of letters for animation
  const text = "betterTransit".split("");

  return (
    <div className="home-container">
      {/* Animated text container */}
      <motion.div className="title">
        {text.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }} // Start hidden and slightly lower
            animate={{ opacity: 1, y: 0 }} // Fade in and move up to normal position
            transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }} // More prominent fade effect
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default App;
