// AnalysisResults.js
import React from "react";

const AnalysisResults = ({ fileName }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: "#ff4d4f",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.1rem",
          borderRadius: "10px 10px 0 0",
          padding: "10px",
        }}
      >
        {fileName}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "10px", fontWeight: "bold" }}>MALWARE TYPE</td>
            <td style={{ padding: "10px", color: "red", fontWeight: "bold" }}>DDoS</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontWeight: "bold" }}>SEVERITY LEVEL</td>
            <td style={{ padding: "10px", color: "red", fontWeight: "bold" }}>HIGH</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontWeight: "bold" }}>ACCURACY</td>
            <td style={{ padding: "10px", fontWeight: "bold" }}>96%</td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: "0.95rem", color: "#333" }}>
        Know more about this Malware Insight and Prevention?
      </p>
      <button
        style={{
          backgroundColor: "#1a00ff",
          color: "white",
          padding: "10px 20px",
          fontSize: "1rem",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          marginTop: "1rem",
        }}
      >
        Register
      </button>
    </>
  );
};

export default AnalysisResults;
