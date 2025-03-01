import React, { useState } from "react";
import "./App.css";

function UploadPage() {
  const [files, setFiles] = useState([]); // Store uploaded files
  const [data, setData] = useState([]); // Store parsed CSV data
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    uploadFiles(selectedFiles);
  };

  // Upload files to Flask
  const uploadFiles = async (selectedFiles) => {
    setUploading(true);

    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setData(result.data); // Store parsed data from Flask
          } else {
            console.error("Error:", result.error);
          }
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
  };

  return (
    <div className="upload-container">
      {/* Upload Box */}
      <div className="upload-box">
        <p>Drag and drop files here</p>
        <p>- OR -</p>
        <label className="upload-button">
          {uploading ? "Uploading..." : "Browse Files"}
          <input type="file" accept=".csv" multiple onChange={handleFileChange} hidden />
        </label>
      </div>

      {/* Uploaded Files List */}
      <div className="uploaded-files">
        <h3>Files</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      {/* Display Parsed CSV Data */}
      <div className="parsed-data">
        <h3>Parsed Ridership Data</h3>
        {data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Datetime</th>
                <th>Day</th>
                <th>Ridership</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.datetime}</td>
                  <td>{row.day}</td>
                  <td>{row.ridership}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
