import React from 'react';
import { Card } from 'react-bootstrap';

const DetailedAnalysisTable = ({ data, totalTraffic }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="card-title mb-4" style={{ color: "#475569" }}>Detailed Analysis</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th>Malware Type</th>
                <th>Total Events</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span style={{
                      color: "#1e293b",
                      fontWeight: "500"
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.total.toLocaleString()}</td>
                  <td>{((item.total / totalTraffic) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DetailedAnalysisTable; 