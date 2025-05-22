import React, { useState, useEffect } from "react";
import UserNavigation from "../Common/Navbar/UserNavigation";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts";
import { Container, Row, Col, Card, ButtonGroup, Button, Form } from "react-bootstrap";
import { FaShieldAlt, FaExclamationTriangle, FaChartPie, FaServer } from "react-icons/fa";
import axiosUser from "../../api/axiosUser";
import { API_PATHS_USER } from "../../api/config";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import MalwareDistributionChart from "../Common/Dashboard/MalwareDistributionChart";
import MalwareTypePieChart from "../Common/Dashboard/MalwareTypePieChart";
import MalwareVsBenignChart from "../Common/Dashboard/MalwareVsBenignChart";

const COLORS = {
  malware: "#dc2626",
  benign: "#059669",
  chart: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"]
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="500"
    >
      {value.toLocaleString()}
    </text>
  );
};

const UserDash = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get initial date range (last 7 days by default)
  const today = new Date();
  const defaultStartDate = format(subDays(today, 6), 'yyyy-MM-dd'); // 7 days ago
  const defaultEndDate = format(today, 'yyyy-MM-dd'); // today
  const adjustedEndDate = format(addDays(today, 1), 'yyyy-MM-dd'); // today + 1 to include full current day

  const [dateRange, setDateRange] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });
  
  const [customDates, setCustomDates] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });
  
  const [activePreset, setActivePreset] = useState('week');

  const handlePresetChange = (preset) => {
    const today = new Date();
    let newStartDate, newEndDate;

    switch (preset) {
      case 'week':
        // Last 7 days
        newStartDate = format(subDays(today, 6), 'yyyy-MM-dd');
        newEndDate = format(today, 'yyyy-MM-dd');
        break;
      case 'month':
        // Last 30 days
        newStartDate = format(subDays(today, 29), 'yyyy-MM-dd');
        newEndDate = format(today, 'yyyy-MM-dd');
        break;
      case 'quarter':
        // Last 90 days
        newStartDate = format(subDays(today, 89), 'yyyy-MM-dd');
        newEndDate = format(today, 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    setDateRange({ startDate: newStartDate, endDate: newEndDate });
    setCustomDates({ startDate: newStartDate, endDate: newEndDate });
    setActivePreset(preset);
    fetchDashboardData(newStartDate, format(addDays(new Date(newEndDate), 1), 'yyyy-MM-dd')); // Add one day to include today's data
  };

  const handleCustomDateChange = (e, type) => {
    const newDates = { ...customDates, [type]: e.target.value };
    setCustomDates(newDates);
    
    if (newDates.startDate && newDates.endDate) {
      // Validate dates
      let start = new Date(newDates.startDate);
      let end = new Date(newDates.endDate);
      const today = new Date();
      
      // If either date is in the future, adjust to today
      if (end > today) {
        newDates.endDate = format(today, 'yyyy-MM-dd');
        end = today;
      }
      if (start > today) {
        newDates.startDate = format(subDays(today, 6), 'yyyy-MM-dd');
        start = subDays(today, 6);
      }
      
      // Ensure start date is not after end date
      if (start > end) {
        newDates.startDate = format(subDays(end, 6), 'yyyy-MM-dd');
      }

      setDateRange(newDates);
      setCustomDates(newDates);
      setActivePreset('custom');
      fetchDashboardData(newDates.startDate, format(addDays(new Date(newDates.endDate), 1), 'yyyy-MM-dd')); // Add one day to include today's data
    }
  };

  const fetchDashboardData = async (startDate, endDate) => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data with dates:', { startDate, endDate });
      const response = await axiosUser.get(
        `${API_PATHS_USER.REPORT}?min_date=${startDate}&max_date=${endDate}`
      );
      console.log('API Response:', response.data);
      if (response.data.error_code === 0) {
        console.log('Dashboard data:', response.data.data);
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with last 7 days of data
    fetchDashboardData(defaultStartDate, format(addDays(new Date(defaultEndDate), 1), 'yyyy-MM-dd')); // Add one day to include today's data
  }, []);

  if (loading || !dashboardData) {
    return (
      <>
        <UserNavigation />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  const totalTraffic = dashboardData.detection_benign + dashboardData.detection_malware;
  const malwarePercentage = ((dashboardData.detection_malware / totalTraffic) * 100).toFixed(1);
  const severityLevel = dashboardData.mean_severity >= 0.8 ? "HIGH" : dashboardData.mean_severity >= 0.5 ? "MEDIUM" : "LOW";
  const severityColor = dashboardData.mean_severity >= 0.8 ? "#dc2626" : dashboardData.mean_severity >= 0.5 ? "#d97706" : "#059669";

  const pieChartData = dashboardData.classifier
  .filter(item => item.type !== "Benign")
  .map(item => ({
    name: item.type,
    value: item.total
  }));

  const barChartData = dashboardData.classifier
  .filter(item => item.type !== "Benign")
  .map(item => ({
    name: item.type,
    Total: item.total
  }));

  return (
    <>
      <UserNavigation />
      <Container fluid className="px-4 py-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2 style={{ color: "#1e293b", fontWeight: "600" }}>
                Network Security Overview
              </h2>
              <div className="d-flex align-items-center gap-3">
                <ButtonGroup>
                  <Button 
                    variant={activePreset === 'week' ? 'primary' : 'outline-primary'}
                    onClick={() => handlePresetChange('week')}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant={activePreset === 'month' ? 'primary' : 'outline-primary'}
                    onClick={() => handlePresetChange('month')}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant={activePreset === 'quarter' ? 'primary' : 'outline-primary'}
                    onClick={() => handlePresetChange('quarter')}
                  >
                    Last 90 Days
                  </Button>
                </ButtonGroup>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="date"
                    value={customDates.startDate}
                    onChange={(e) => handleCustomDateChange(e, 'startDate')}
                    style={{ width: 'auto' }}
                  />
                  <span>to</span>
                  <Form.Control
                    type="date"
                    value={customDates.endDate}
                    onChange={(e) => handleCustomDateChange(e, 'endDate')}
                    style={{ width: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards
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
        </Row> */}

        <Row className="mt-4 g-3">
          <Col md={6}>
            <Row className="mb-4">
              <Col md={6}>
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

              <Col md={6}>
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
            </Row>
            <MalwareTypePieChart data={dashboardData.classifier.filter(item => item.type !== "Benign")} />
          </Col>
          <Col md={6}>
            <MalwareVsBenignChart/>
          </Col>
        </Row>

       
      </Container>
    </>
  );
};

export default UserDash;
