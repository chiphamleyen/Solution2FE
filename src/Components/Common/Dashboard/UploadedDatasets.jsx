import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaDatabase, FaFileUpload } from 'react-icons/fa';
import { formatFileSize } from './utils';

const UploadedDatasets = ({ datasets, onViewDetails, onDelete, onUpload }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaDatabase size={20} style={{ color: "#4f46e5" }} />
            <h5 className="card-title mb-0" style={{ color: "#475569" }}>Uploaded Datasets</h5>
          </div>
          <Button variant="primary" size="sm" className="d-flex align-items-center gap-2" onClick={onUpload}>
            <FaFileUpload size={14} />
            Upload New
          </Button>
        </div>
        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#f8fafc", position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th>Dataset</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaDatabase size={16} style={{ color: "#64748b" }} />
                      <div>
                        <div style={{ color: "#1e293b", fontWeight: "500" }}>
                          {dataset.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {new Date(dataset.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{formatFileSize(dataset.size)}</td>
                  <td>
                    <Badge 
                      bg={dataset.status === 'processed' ? 'success' : 
                          dataset.status === 'processing' ? 'warning' : 'secondary'}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {dataset.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="link" 
                        size="sm"
                        className="p-0 text-primary"
                        onClick={() => onViewDetails(dataset.id)}
                      >
                        View
                      </Button>
                      <span className="text-muted mx-1">|</span>
                      <Button 
                        variant="link" 
                        size="sm"
                        className="p-0 text-danger"
                        onClick={() => onDelete(dataset.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UploadedDatasets; 