import React from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const text = "betterTransit".split(""); // Split text into individual letters

  return (
    <div className="home-container">
      <motion.div className="title">
        {text.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: index * 10 - text.length * 5 }} // Spreads letters outward
            transition={{ delay: index * 0.05, duration: 0.5 }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default App;
