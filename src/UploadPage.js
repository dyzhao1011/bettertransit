import React, { useState } from "react";
import "./App.css";

function UploadPage() {
  const [fileName, setFileName] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Update filename display
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload File</h1>
      <label className="upload-button">
        Choose File
        <input type="file" onChange={handleFileChange} hidden />
      </label>
      {fileName && <p className="file-name">Selected: {fileName}</p>}
    </div>
  );
}

export default UploadPage;
