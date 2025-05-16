// FileUploader.js
import React, { useState } from "react";
import FileUploadForm from "../Common/Functions/FileUploadForm";
import AnalysisResults from "../Common/Functions/AnalysisResults";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileAnalyzed = (uploadedFile) => {
    setFile(uploadedFile);
    setShowResults(true);
  };

  const containerStyle = {
    backgroundColor: "#f6f9fc",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const wrapperStyle = {
    width: "100%",
    maxWidth: "500px",
    padding: "2rem",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {!showResults ? (
          <FileUploadForm onFileAnalyzed={handleFileAnalyzed} />
        ) : (
          <AnalysisResults fileName={file?.name || "Uploaded File"} />
        )}
      </div>
    </div>
  );
};

export default FileUploader;
