import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

const UserAnalysisResults = ({ fileName, result, stats, totalRecords, timeRange }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes ? ` ${remainingMinutes} min` : ''}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header with Severity Score */}
      <div style={{
        backgroundColor: "#2563eb",
        color: "white",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "16px" 
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
              Analysis Results: {fileName}
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", opacity: 0.9 }}>
              {timeRange ? (
                <>
                  Data period: {formatDuration(timeRange.duration)}
                  <br />
                  {formatDate(timeRange.start)} - {formatDate(timeRange.end)}
                </>
              ) : 'No time data available'}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Total Records</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {totalRecords.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Severity Score Bar */}
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "0.875rem" 
          }}>
            <span>Overall Severity Score</span>
            <span>{stats.severityScore.toFixed(1)}%</span>
          </div>
          <div style={{ 
            height: "8px", 
            backgroundColor: "rgba(255,255,255,0.2)", 
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${Math.min(stats.severityScore, 100)}%`,
              height: "100%",
              backgroundColor: "white",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Traffic Distribution */}
      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{
          flex: 1,
          padding: "16px",
          backgroundColor: "#fee2e2",
          borderRadius: "8px",
          border: "1px solid #fecaca"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#991b1b" }}>Malicious Traffic</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#dc2626" }}>
            {stats.malwareCount.toLocaleString()}
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: "16px",
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
          border: "1px solid #dcfce7"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#166534" }}>Benign Traffic</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#16a34a" }}>
            {stats.benignCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Malware Types Table */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
        <thead style={{ backgroundColor: "#f8fafc" }}>
          <tr>
            <th style={thStyle}>Malware Type</th>
            <th style={thStyle}>Severity Level</th>
            <th style={thStyle}>Average Severity</th>
            <th style={thStyle}>Count</th>
            <th style={thStyle}>First Seen</th>
            <th style={thStyle}>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {result.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
              <td style={tdStyle}>{row.malware_type}</td>
              <td style={{ 
                ...tdStyle, 
                color: severityColor(row.severity_level),
                fontWeight: "600"
              }}>
                {row.severity_level}
              </td>
              <td style={tdStyle}>
                <div style={{ 
                  width: `${Math.min(parseFloat(row.average_severity) * 100, 100)}%`,
                  backgroundColor: severityColor(row.severity_level),
                  height: "6px",
                  borderRadius: "3px",
                  marginRight: "8px",
                  display: "inline-block"
                }}></div>
                {row.average_severity}
              </td>
              <td style={tdStyle}>{row.count.toLocaleString()}</td>
              <td style={tdStyle}>{formatDate(row.first_seen)}</td>
              <td style={tdStyle}>{formatDate(row.last_seen)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ 
        backgroundColor: "#f8fafc", 
        padding: "16px", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
      }}>
        <h4 style={{ 
          color: "#334155", 
          marginBottom: "12px",
          fontSize: "1rem",
          fontWeight: "600"
        }}>
          About the Results
        </h4>
        <ul style={{ 
          color: "#475569", 
          lineHeight: "1.6", 
          paddingLeft: "20px",
          margin: 0
        }}>
          <li>Overall Severity Score represents the average severity of all malicious traffic</li>
          <li>Severity Level indicates the potential impact (HIGH ≥ 0.8, MEDIUM ≥ 0.5, LOW {'<'} 0.5)</li>
          <li>First/Last Seen shows when this type of malware was first and last detected in the dataset</li>
        </ul>
      </div>

      {/* Add this after the Legend section */}
      <div style={{
        marginTop: "24px",
        padding: "24px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h4 style={{
            color: "#334155",
            margin: "0 0 4px 0",
            fontSize: "1.1rem",
            fontWeight: "600"
          }}>
            View Complete Analysis
          </h4>
          <p style={{
            color: "#64748b",
            margin: 0,
            fontSize: "0.875rem"
          }}>
            Access your dashboard to see analytics across all your datasets
          </p>
        </div>
        <button
          onClick={() => navigate("/user/dashboard")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            hover: {
              backgroundColor: "#1d4ed8",
              transform: "translateY(-1px)"
            }
          }}
        >
          <FaChartLine style={{ fontSize: "1rem" }} />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px 16px",
  borderBottom: "2px solid #e2e8f0",
  textAlign: "left",
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#475569",
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "0.875rem",
  color: "#334155",
};

const severityColor = (level) => {
  switch (level.toUpperCase()) {
    case "HIGH":
      return "#dc2626";
    case "MEDIUM":
      return "#d97706";
    case "LOW":
      return "#059669";
    default:
      return "#64748b";
  }
};

export default UserAnalysisResults;
