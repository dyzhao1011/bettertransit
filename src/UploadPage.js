import React, { useState } from "react";
import "./App.css";
import LineGraph from "./LineGraph";

function UploadPage({selectedDate}) {
  const [files, setFiles] = useState([]); 
  const [data, setData] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [predictions, setPredictions] = useState([]);
  const [actuals, setActuals] = useState([]);

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    uploadFiles(selectedFiles);
  };

  const uploadFiles = async (selectedFiles) => {
    setUploading(true);

    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5555/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setData(result.data);
            console.log(result)
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

  const makePrediction = async () =>{
    console.log(selectedDate);
    try {
      const response = await fetch("http://localhost:5555/predict", {
        method: "POST",
        body: selectedDate,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.prediction) {
          console.log(result.prediction);
          console.log(result.actual);
          setPredictions(result.prediction);
          setActuals(result.actual);
          
        } else {
          console.error("Error:", result.error);
        }
      } else {
        console.error("Response error:", response.status);
      }
    } catch(error){
      console.log(error)
    }}
  return (
    <div className="upload-container">
            {/* New instruction box on the left */}
            <div className="instruction-box">
        <h3> Instructions</h3>
        <p>1. Upload your ridership data file.</p>
        <p>2. Select a date and time for analysis.</p>
        <p>3. Click 'Calculate" to get results.</p>
      </div>

      {/* Upload Box in the center */}
      <div className="upload-content">
       <div className="upload-box">
        <p>Drag and drop files here</p>
        <p>- OR -</p>
        <label className="upload-button">
          {uploading ? "Uploading..." : "Browse Files"}
          <input type="file" accept="*" multiple onChange={handleFileChange} hidden />
        </label>
      </div>

      <div className="uploaded-files">
        <h3>Files</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {formatFileSize(file.size)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

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

      <div className="calc-button-container">
        <button className="calc-button" onClick={() => {setIsModalOpen(true);makePrediction()}}>Calculate</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>X</button>
            <h2>Calculation Results</h2>
            <LineGraph data1 = {predictions} data2={actuals} />
          </div>
        </div>
        
      )}
      </div>
    </div>
  );
}

export default UploadPage;