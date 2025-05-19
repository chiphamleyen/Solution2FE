import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaExclamationTriangle, FaChartPie, FaServer } from 'react-icons/fa';

const StatsCards = ({ dashboardData }) => {
  const totalTraffic = dashboardData.detection_benign + dashboardData.detection_malware;
  const malwarePercentage = ((dashboardData.detection_malware / totalTraffic) * 100).toFixed(1);
  const severityLevel = dashboardData.mean_severity >= 0.8 ? "HIGH" : dashboardData.mean_severity >= 0.5 ? "MEDIUM" : "LOW";
  const severityColor = dashboardData.mean_severity >= 0.8 ? "#dc2626" : dashboardData.mean_severity >= 0.5 ? "#d97706" : "#059669";

  const COLORS = {
    malware: "#dc2626",
    benign: "#059669"
  };

  return (
    <Row className="g-3 mb-4">
      <Col md={3}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="p-2 rounded-circle me-3" style={{ backgroundColor: "#fee2e2" }}>
                <FaExclamationTriangle size={20} style={{ color: severityColor }} />
              </div>
              <h6 className="card-title mb-0" style={{ color: "#475569" }}>Mean Severity</h6>
            </div>
            <h3 className="mb-0" style={{ color: severityColor, fontWeight: "600" }}>
              {dashboardData.mean_severity.toFixed(3)}
            </h3>
            <small style={{ color: "#64748b" }}>{severityLevel} Risk Level</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="p-2 rounded-circle me-3" style={{ backgroundColor: "#fee2e2" }}>
                <FaShieldAlt size={20} style={{ color: COLORS.malware }} />
              </div>
              <h6 className="card-title mb-0" style={{ color: "#475569" }}>Malware Detections</h6>
            </div>
            <h3 className="mb-0" style={{ color: COLORS.malware, fontWeight: "600" }}>
              {dashboardData.detection_malware.toLocaleString()}
            </h3>
            <small style={{ color: "#64748b" }}>{malwarePercentage}% of total traffic</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="p-2 rounded-circle me-3" style={{ backgroundColor: "#dcfce7" }}>
                <FaServer size={20} style={{ color: COLORS.benign }} />
              </div>
              <h6 className="card-title mb-0" style={{ color: "#475569" }}>Benign Traffic</h6>
            </div>
            <h3 className="mb-0" style={{ color: COLORS.benign, fontWeight: "600" }}>
              {dashboardData.detection_benign.toLocaleString()}
            </h3>
            <small style={{ color: "#64748b" }}>{(100 - parseFloat(malwarePercentage)).toFixed(1)}% of total traffic</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="p-2 rounded-circle me-3" style={{ backgroundColor: "#e0e7ff" }}>
                <FaChartPie size={20} style={{ color: "#4f46e5" }} />
              </div>
              <h6 className="card-title mb-0" style={{ color: "#475569" }}>Total Analysis</h6>
            </div>
            <h3 className="mb-0" style={{ color: "#4f46e5", fontWeight: "600" }}>
              {totalTraffic.toLocaleString()}
            </h3>
            <small style={{ color: "#64748b" }}>Total network events</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards; 