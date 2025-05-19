import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Common/Navbar/AdminNavigation";
import { Container, Row, Col } from "react-bootstrap";
import axiosAdmin from "../../api/axiosAdmin";
import { API_PATHS_ADMIN } from "../../api/config";
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

// Import shared components
import StatsCards from "../Common/Dashboard/StatsCards";
import DateRangeSelector from "../Common/Dashboard/DateRangeSelector";
import MalwareDistributionChart from "../Common/Dashboard/MalwareDistributionChart";
import DetailedAnalysisTable from "../Common/Dashboard/DetailedAnalysisTable";
import UploadedDatasets from "../Common/Dashboard/UploadedDatasets";
import MalwareTypePieChart from "../Common/Dashboard/MalwareTypePieChart";
import TrendLineChart from "../Common/Dashboard/TrendLineChart";
import { generateTrendData } from "../Common/Dashboard/utils";

const AdminDash = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get initial date range (last 7 days by default)
  const today = new Date();
  const defaultStartDate = format(subDays(today, 6), 'yyyy-MM-dd'); // 7 days ago
  const defaultEndDate = format(today, 'yyyy-MM-dd'); // today

  const [dateRange, setDateRange] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });
  
  const [customDates, setCustomDates] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });
  
  const [activePreset, setActivePreset] = useState('week');
  const [datasets] = useState([
    {
      id: 1,
      name: "Network_Traffic_2024_Q1.csv",
      size: 1572864000,
      status: "processed",
      uploadDate: "2024-03-15T08:30:00"
    },
    {
      id: 2,
      name: "Malware_Signatures_March.json",
      size: 524288000,
      status: "processing",
      uploadDate: "2024-03-14T15:45:00"
    },
    {
      id: 3,
      name: "IDS_Logs_Week12.pcap",
      size: 2147483648,
      status: "processed",
      uploadDate: "2024-03-13T11:20:00"
    }
  ]);

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
    fetchDashboardData(newStartDate, newEndDate);
  };

  const handleCustomDateChange = (e, type) => {
    const newDates = { ...customDates, [type]: e.target.value };
    setCustomDates(newDates);
    
    if (newDates.startDate && newDates.endDate) {
      // Validate dates
      const start = new Date(newDates.startDate);
      const end = new Date(newDates.endDate);
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
      fetchDashboardData(newDates.startDate, newDates.endDate);
    }
  };

  const fetchDashboardData = async (startDate, endDate) => {
    try {
      setLoading(true);
      console.log('Fetching admin dashboard data with dates:', { startDate, endDate });
      const response = await axiosAdmin.get(
        `${API_PATHS_ADMIN.REPORT}?min_date=${startDate}&max_date=${endDate}`
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
    fetchDashboardData(defaultStartDate, defaultEndDate);
  }, []);

  if (loading || !dashboardData) {
    return (
      <>
        <Navigation />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  const totalTraffic = dashboardData.detection_benign + dashboardData.detection_malware;
  const barChartData = dashboardData.classifier
    .filter(item => item.type !== "Benign")
    .map(item => ({
      name: item.type,
      Total: item.total
    }));

  const trendData = generateTrendData(dashboardData.classifier);

  return (
    <>
      <Navigation />
      <Container fluid className="px-4 py-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2 style={{ color: "#1e293b", fontWeight: "600" }}>
                Network Security Overview
              </h2>
              <DateRangeSelector
                activePreset={activePreset}
                customDates={customDates}
                onPresetChange={handlePresetChange}
                onCustomDateChange={handleCustomDateChange}
              />
            </div>
          </Col>
        </Row>

        <StatsCards dashboardData={dashboardData} />

        <Row className="mt-4 g-3">
          <Col md={8}>
            <TrendLineChart data={trendData} />
          </Col>
          <Col md={4}>
            <MalwareTypePieChart data={dashboardData.classifier.filter(item => item.type !== "Benign")} />
          </Col>
        </Row>
        
        <Row className="mt-4 g-3">
          <Col md={6}>
            <MalwareDistributionChart data={barChartData} />
          </Col>
          <Col md={6}>
          <Row>
            <Col md={12} className="mb-4">
            <DetailedAnalysisTable
              data={dashboardData.classifier.filter(item => item.type !== "Benign")}
              totalTraffic={totalTraffic}
            />
            </Col>
            <Col md={12}>
            <UploadedDatasets
              datasets={datasets}
              onViewDetails={(id) => navigate(`/admin/datasets/${id}`)}
              onDelete={(id) => {
                if (window.confirm('Are you sure you want to delete this dataset?')) {
                  console.log('Deleting dataset:', id);
                }
              }}
              onUpload={() => navigate('/admin/analysis')}
            />
            </Col>
          </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDash;
