import React from 'react';
import { ButtonGroup, Button, Form } from 'react-bootstrap';

const DateRangeSelector = ({ 
  activePreset, 
  customDates, 
  onPresetChange, 
  onCustomDateChange 
}) => {
  return (
    <div className="d-flex align-items-center gap-3">
      <ButtonGroup>
        <Button 
          variant={activePreset === 'week' ? 'primary' : 'outline-primary'}
          onClick={() => onPresetChange('week')}
        >
          This Week
        </Button>
        <Button 
          variant={activePreset === 'month' ? 'primary' : 'outline-primary'}
          onClick={() => onPresetChange('month')}
        >
          This Month
        </Button>
        <Button 
          variant={activePreset === 'quarter' ? 'primary' : 'outline-primary'}
          onClick={() => onPresetChange('quarter')}
        >
          Last 90 Days
        </Button>
      </ButtonGroup>
      <div className="d-flex align-items-center gap-2">
        <Form.Control
          type="date"
          value={customDates.startDate}
          onChange={(e) => onCustomDateChange(e, 'startDate')}
          style={{ width: 'auto' }}
        />
        <span>to</span>
        <Form.Control
          type="date"
          value={customDates.endDate}
          onChange={(e) => onCustomDateChange(e, 'endDate')}
          style={{ width: 'auto' }}
        />
      </div>
    </div>
  );
};

export default DateRangeSelector; 