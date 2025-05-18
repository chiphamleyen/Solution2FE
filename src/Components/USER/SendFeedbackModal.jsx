import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const SendFeedbackModal = ({ 
    show, 
    handleClose, 
    onSubmit, 
    loading = false,
    error = null,
    success = false
}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ content });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title>Send Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert variant="success" className="mb-3">
                        Feedback sent successfully!
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your feedback here..."
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : 'Send Feedback'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SendFeedbackModal; 