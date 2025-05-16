// FileUploadForm.js
import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const FileUploadForm = ({ onFileAnalyzed }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid CSV or Excel file.");
    }
  };

  const handleAnalyseClick = () => {
    if (file) {
      onFileAnalyzed(file);
    } else {
      setError("Please upload a file before analysing.");
    }
  };

  return (
    <>
      <div style={uploadBoxStyle}>
        <span>+<br />Upload or Drag File</span>
        <input
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          style={inputStyle}
        />
      </div>
      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
      {file && (
        <p style={{ color: "green", fontSize: "0.9rem" }}>
          File selected: {file.name}
        </p>
      )}
      <button onClick={handleAnalyseClick} style={buttonStyle}>
        Analyse <FaPaperPlane />
      </button>
    </>
  );
};

// Reuse styles from main file or extract to a common style file
const uploadBoxStyle = {
  width: "100%",
  minHeight: "150px",
  border: "2px dashed #ccc",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#aaa",
  fontSize: "1.2rem",
  position: "relative",
  cursor: "pointer",
  marginBottom: "1.5rem",
};

const inputStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
  top: 0,
  left: 0,
};

const buttonStyle = {
  backgroundColor: "#1a00ff",
  color: "white",
  padding: "10px 20px",
  fontSize: "1rem",
  border: "none",
  borderRadius: "25px",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  float: "right",
  marginTop: "1rem",
};

export default FileUploadForm;
