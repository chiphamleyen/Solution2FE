import React, { useState } from "react";
import UserFileUploadForm from "./UserFileUploadForm";
import UserAnalysisResults from "./UserAnalysisResults";

const UserFileUploader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileAnalyzed = (uploadedFile, apiResult) => {
    try {
      const items = apiResult.items || [];
      const { malwareResults, overallStats } = summarizeResults(items);
      setFile(uploadedFile);
      setResult({
        summary: malwareResults,
        stats: overallStats,
        total: apiResult.total || 0,
        timeRange: getTimeRange(items)
      });
      setShowResults(true);
    } catch (error) {
      console.error("Error processing results:", error);
    }
  };

  const getTimeRange = (data) => {
    if (!data.length) return null;
    
    const timestamps = data.map(item => parseFloat(item.timestamp));
    const startTime = new Date(Math.min(...timestamps) * 1000);
    const endTime = new Date(Math.max(...timestamps) * 1000);
    
    return {
      start: startTime,
      end: endTime,
      duration: Math.floor((endTime - startTime) / (1000 * 60)) // duration in minutes
    };
  };

  const summarizeResults = (data) => {
    let totalSeverity = 0;
    let totalMalwareCount = 0;
    let benignCount = 0;
    const grouped = {};

    data.forEach(item => {
      const { classifier, severity, detection } = item;
      
      if (classifier.toLowerCase() === 'benign') {
        benignCount++;
        return;
      }

      if (!grouped[classifier]) {
        grouped[classifier] = {
          count: 0,
          totalSeverity: 0,
          timestamps: []
        };
      }

      grouped[classifier].count += 1;
      grouped[classifier].totalSeverity += severity;
      grouped[classifier].timestamps.push(parseFloat(item.timestamp));
      
      if (detection) {
        totalSeverity += severity;
        totalMalwareCount++;
      }
    });

    const malwareResults = Object.entries(grouped).map(([type, stats]) => {
      const avgSeverity = (stats.totalSeverity / stats.count).toFixed(3);
      return {
        malware_type: type,
        severity_level: getSeverityLevel(parseFloat(avgSeverity)),
        average_severity: avgSeverity,
        count: stats.count,
        first_seen: new Date(Math.min(...stats.timestamps) * 1000),
        last_seen: new Date(Math.max(...stats.timestamps) * 1000)
      };
    }).sort((a, b) => parseFloat(b.average_severity) - parseFloat(a.average_severity));

    const overallStats = {
      averageSeverity: totalMalwareCount ? (totalSeverity / totalMalwareCount) : 0,
      malwareCount: totalMalwareCount,
      benignCount: benignCount,
      severityScore: totalMalwareCount ? (totalSeverity / totalMalwareCount) * 100 : 0
    };

    return { malwareResults, overallStats };
  };

  const getSeverityLevel = (severity) => {
    if (severity >= 0.8) return "HIGH";
    if (severity >= 0.5) return "MEDIUM";
    return "LOW";
  };

  const containerStyle = {
    backgroundColor: "#f6f9fc",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem"
  };

  const wrapperStyle = {
    width: "100%",
    maxWidth: "1000px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {!showResults ? (
          <UserFileUploadForm onFileAnalyzed={handleFileAnalyzed} />
        ) : (
          <UserAnalysisResults 
            fileName={file?.name || "Uploaded File"} 
            result={result.summary}
            stats={result.stats}
            totalRecords={result.total}
            timeRange={result.timeRange}
          />
        )}
      </div>
    </div>
  );
};

export default UserFileUploader;
