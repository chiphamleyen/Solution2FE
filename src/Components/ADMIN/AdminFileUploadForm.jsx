import React, { useState } from "react";
import { FaPaperPlane, FaUpload } from "react-icons/fa";
import axiosAdmin from "../../api/axiosAdmin";
import { API_PATHS } from "../../api/config"; 

const AdminFileUploadForm = ({ onFileAnalyzed }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAnalyseClick = async () => {
    if (!file) {
      setError("Please upload a file before analysing.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosAdmin.post(API_PATHS.FILE_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resultData = response.data; 
      onFileAnalyzed(file, resultData);
      setIsUploading(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading or analyzing file. Please try again.");
      setIsUploading(false);
    }
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
  };

  const headerStyle = {
    marginBottom: "30px",
  };

  const uploadBoxStyle = {
    width: "100%",
    minHeight: "200px",
    border: "2px dashed #e2e8f0",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    marginBottom: "20px",
    padding: "20px",
    cursor: "pointer",
    transition: "border-color 0.3s ease",
    position: "relative",
  };

  const inputStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0,
    cursor: "pointer",
    zIndex: 1,
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    borderRadius: "6px",
    border: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: "auto"
  };

  const infoTextStyle = {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "8px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "12px" }}>Network Malware Analysis</h1>
        <p style={{ color: "#475569", lineHeight: "1.5" }}>
          Upload your network traffic data in CSV format for malware detection analysis. 
          The system will analyze patterns and identify potential security threats in your network.
        </p>
      </div>

      <div style={uploadBoxStyle}>
        <input
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          style={inputStyle}
        />
        <FaUpload style={{ fontSize: "32px", color: "#64748b", marginBottom: "16px", position: "relative", zIndex: 0 }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 0 }}>
          <h3 style={{ marginBottom: "8px", color: "#334155" }}>Upload CSV File</h3>
          <p style={{ color: "#64748b", marginBottom: "16px" }}>
            Click to browse or drag and drop your file here
          </p>
          {!file && (
            <div style={infoTextStyle}>
              <p>Supported formats: CSV, Excel</p>
              <p>Maximum file size: 10MB</p>
              <p>Required columns: timestamp, source_ip, destination_ip, protocol, bytes</p>
            </div>
          )}
          {file && (
            <p style={{ color: "#059669", fontWeight: "500" }}>
              Selected file: {file.name}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: "#fef2f2", 
          color: "#dc2626", 
          padding: "12px", 
          borderRadius: "6px",
          marginBottom: "16px" 
        }}>
          {error}
        </div>
      )}

      <button 
        onClick={handleAnalyseClick} 
        style={{
          ...buttonStyle,
          opacity: isUploading || !file ? 0.7 : 1,
          cursor: file ? "pointer" : "not-allowed",
        }}
        disabled={!file || isUploading}
      >
        {isUploading ? "Analyzing..." : "Analyze Network Data"}
        {!isUploading && <FaPaperPlane />}
      </button>

      <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
        <h4 style={{ color: "#334155", marginBottom: "8px" }}>What happens next?</h4>
        <ol style={{ color: "#475569", lineHeight: "1.6", paddingLeft: "20px" }}>
          <li>Your network data will be analyzed for potential malware patterns</li>
          <li>The system will identify suspicious network behaviors and connections</li>
          <li>You'll receive a detailed report of potential security threats</li>
          <li>Recommendations for security improvements will be provided</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminFileUploadForm;
