import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Pagination, Spinner, Alert } from 'react-bootstrap';
import UserNavigation from '../Common/Navbar/UserNavigation';
import SendFeedbackModal from './SendFeedbackModal';
import axiosUser from '../../api/axiosUser';
import { format } from 'date-fns';
import { API_PATHS_USER } from '../../api/config';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 10;

    // Modal states
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [sendSuccess, setSendSuccess] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, [currentPage]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await axiosUser.get(`${API_PATHS_USER.MY_FEEDBACK_LIST}?page=${currentPage}&size=${pageSize}`);
            
            if (response.data.error_code === 0) {
                setFeedbacks(response.data.items);
                setTotalPages(Math.ceil(response.data.total / pageSize));
            } else {
                setError('Failed to fetch feedbacks');
            }
        } catch (error) {
            setError('Failed to fetch feedbacks');
        } finally {
            setLoading(false);
        }
    };

    const handleSendFeedback = async (formData) => {
        setSendLoading(true);
        setSendError(null);
        setSendSuccess(false);

        try {
            const response = await axiosUser.post(`${API_PATHS_USER.CREATE_FEEDBACK}`, formData);
            
            if (response.data.error_code === 0) {
                setSendSuccess(true);
                fetchFeedbacks(); // Refresh the list
                // Close modal after delay
                setTimeout(() => {
                    handleCloseModal();
                }, 1500);
            } else {
                setSendError('Failed to send feedback');
            }
        } catch (error) {
            setSendError(error.response?.data?.message || 'Failed to send feedback');
        } finally {
            setSendLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowSendModal(false);
        setSendError(null);
        setSendSuccess(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <UserNavigation />
            <div className="container py-4">
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <Card.Title>My Feedback</Card.Title>
                            <Button 
                                variant="primary"
                                onClick={() => setShowSendModal(true)}
                            >
                                <i className="fa-solid fa-paper-plane me-2"></i>
                                Send New Feedback
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Content</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedbacks.map((feedback) => (
                                            <tr key={feedback._id}>
                                                <td>{feedback.content}</td>
                                                <td>
                                                    <span className={`badge bg-${feedback.status === 'pending' ? 'warning' : 'success'}`}>
                                                        {feedback.status}
                                                    </span>
                                                </td>
                                                <td>{format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm')}</td>
                                                <td>{format(new Date(feedback.updated_at), 'dd/MM/yyyy HH:mm')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First 
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(1)}
                                        />
                                        <Pagination.Prev 
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        />
                                        {[...Array(totalPages)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={currentPage === index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next 
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        />
                                        <Pagination.Last 
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(totalPages)}
                                        />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <SendFeedbackModal 
                show={showSendModal}
                handleClose={handleCloseModal}
                onSubmit={handleSendFeedback}
                loading={sendLoading}
                error={sendError}
                success={sendSuccess}
            />
        </>
    );
};

export default Feedback; 