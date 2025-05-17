// FileUploader.js
import React, { useState } from "react";
import AdminFileUploadForm from "./AdminFileUploadForm";
import AdminAnalysisResults from "./AdminAnalysisResults";

const AdminFileUploader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const handleFileAnalyzed = (uploadedFile, apiResult) => {
    try {
      if (!apiResult || !Array.isArray(apiResult.items)) {
        throw new Error('Invalid data format received from server');
      }

      const items = apiResult.items;
      const { malwareResults, overallStats } = summarizeResults(items);
      
      setFile(uploadedFile);
      setResult({
        summary: malwareResults,
        stats: overallStats,
        total: apiResult.total || items.length,
        timeRange: getTimeRange(items),
        rawData: items
      });
      setShowResults(true);
      setError(null);
    } catch (error) {
      console.error("Error processing results:", error);
      setError(error.message || "Error processing analysis results");
      setShowResults(false);
    }
  };

  const getTimeRange = (data) => {
    if (!data || !data.length) return null;
    
    const timestamps = data
      .map(item => parseFloat(item.timestamp))
      .filter(ts => !isNaN(ts));

    if (timestamps.length === 0) return null;
    
    const startTime = new Date(Math.min(...timestamps) * 1000);
    const endTime = new Date(Math.max(...timestamps) * 1000);
    
    return {
      start: startTime,
      end: endTime,
      duration: Math.floor((endTime - startTime) / (1000 * 60))
    };
  };

  const summarizeResults = (data) => {
    let totalSeverity = 0;
    let totalMalwareCount = 0;
    let benignCount = 0;
    let highSeverityCount = 0;
    const grouped = {};

    data.forEach(item => {
      if (!item) return;

      const classifier = item.classifier || 'Unknown';
      const severity = parseFloat(item.severity) || 0;
      const detection = item.detection === true;
      
      if (classifier.toLowerCase() === 'benign') {
        benignCount++;
        return;
      }

      if (!grouped[classifier]) {
        grouped[classifier] = {
          count: 0,
          totalSeverity: 0,
          timestamps: [],
          detections: 0
        };
      }

      grouped[classifier].count += 1;
      grouped[classifier].totalSeverity += severity;
      
      if (item.timestamp) {
        grouped[classifier].timestamps.push(parseFloat(item.timestamp));
      }
      
      if (detection) {
        grouped[classifier].detections += 1;
        totalSeverity += severity;
        totalMalwareCount++;
        if (severity >= 0.8) highSeverityCount++;
      }
    });

    const malwareResults = Object.entries(grouped).map(([type, stats]) => {
      const avgSeverity = stats.count ? (stats.totalSeverity / stats.count).toFixed(3) : "0.000";
      return {
        malware_type: type,
        severity_level: getSeverityLevel(parseFloat(avgSeverity)),
        average_severity: avgSeverity,
        count: stats.count,
        detections: stats.detections,
        detection_rate: ((stats.detections / stats.count) * 100).toFixed(1),
        first_seen: stats.timestamps.length ? new Date(Math.min(...stats.timestamps) * 1000) : null,
        last_seen: stats.timestamps.length ? new Date(Math.max(...stats.timestamps) * 1000) : null
      };
    }).sort((a, b) => parseFloat(b.average_severity) - parseFloat(a.average_severity));

    const overallStats = {
      averageSeverity: totalMalwareCount ? (totalSeverity / totalMalwareCount) : 0,
      malwareCount: totalMalwareCount,
      benignCount: benignCount,
      highSeverityCount: highSeverityCount,
      severityScore: totalMalwareCount ? (totalSeverity / totalMalwareCount) * 100 : 0,
      detectionRate: ((totalMalwareCount / (totalMalwareCount + benignCount)) * 100).toFixed(1)
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
    maxWidth: "1200px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {error && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            margin: "1rem",
            borderRadius: "6px",
            fontSize: "0.875rem"
          }}>
            {error}
          </div>
        )}
        
        {!showResults ? (
          <AdminFileUploadForm onFileAnalyzed={handleFileAnalyzed} />
        ) : (
          <AdminAnalysisResults 
            fileName={file?.name || "Uploaded File"} 
            result={result.summary}
            stats={result.stats}
            totalRecords={result.total}
            timeRange={result.timeRange}
            rawData={result.rawData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminFileUploader;
