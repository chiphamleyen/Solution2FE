import React, { useState, useEffect } from 'react';
import Navigation from "../Common/Navbar/AdminNavigation";
import { Card, ListGroup, Pagination, Badge, Button, Tabs, Tab, Modal, Form, Alert } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosAdmin from '../../api/axiosAdmin';
import { format } from 'date-fns';
import EditUserModal from '../Common/Account/EditUserModal';
import { API_PATHS_ADMIN } from '../../api/config';

const userLogData = [
    {
        date: "2024-03-01",
        logins: 45,
        actions: 120,
        errors: 5
    },
    {
        date: "2024-03-02",
        logins: 52,
        actions: 145,
        errors: 3
    },
    {
        date: "2024-03-03",
        logins: 38,
        actions: 98,
        errors: 7
    },
    {
        date: "2024-03-04",
        logins: 65,
        actions: 178,
        errors: 4
    },
    {
        date: "2024-03-05",
        logins: 48,
        actions: 156,
        errors: 6
    },
    {
        date: "2024-03-06",
        logins: 57,
        actions: 167,
        errors: 2
    },
    {
        date: "2024-03-07",
        logins: 43,
        actions: 134,
        errors: 8
    }
];

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState({ user: 1, admin: 1 });
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [totalPages, setTotalPages] = useState({ user: 1, admin: 1 });
    const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbackError, setFeedbackError] = useState(null);
    const [activeTab, setActiveTab] = useState('user');
    
    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(false);
    const pageSize = 10;

    // Add delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Create Admin modal states
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [createAdminError, setCreateAdminError] = useState(null);
    const [createAdminSuccess, setCreateAdminSuccess] = useState(false);

    useEffect(() => {
        fetchUsers(currentPage[activeTab], activeTab);
    }, [currentPage, activeTab]);

    useEffect(() => {
        fetchFeedbacks();
    }, [feedbackPage]);

    const fetchUsers = async (page, role) => {
        try {
            setLoading(true);
            const response = await axiosAdmin.get(`${API_PATHS_ADMIN.USER_MANAGEMENT_LIST}?page=${page}&size=${pageSize}`);
            
            if (response.data.error_code === 0) {
                // Filter users based on role
                const filteredUsers = response.data.items.filter(user => user.role === role);
                setUsers(filteredUsers);
                
                // Calculate total pages for the current role
                const totalRoleUsers = response.data.items.filter(user => user.role === role).length;
                setTotalPages(prev => ({
                    ...prev,
                    [role]: Math.ceil(totalRoleUsers / pageSize)
                }));
            } else {
                setError('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserById = async (userId) => {
        setFetchingUser(true);
        try {
            const response = await axiosAdmin.get(`${API_PATHS_ADMIN.USER_MANAGEMENT_GET_USER}/${userId}`);
            if (response.data.error_code === 0) {
                setSelectedUser(response.data.data);
            } else {
                setEditError('Failed to fetch user information');
            }
        } catch (error) {
            setEditError(error.response?.data?.message || 'Failed to fetch user information');
            handleEditModalClose();
        } finally {
            setFetchingUser(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(prev => ({
            ...prev,
            [activeTab]: page
        }));
    };

    const handleEditClick = async (user) => {
        setShowEditModal(true);
        setEditError(null);
        setEditSuccess(false);
        await fetchUserById(user._id);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setSelectedUser(null);
        setEditError(null);
        setEditSuccess(false);
        setFetchingUser(false);
    };

    const handleEditSubmit = async (formData) => {
        setEditLoading(true);
        setEditError(null);
        setEditSuccess(false);

        try {
            const response = await axiosAdmin.put(`${API_PATHS_ADMIN.USER_MANAGEMENT_UPDATE_USER}/${selectedUser._id}`, formData);
            
            if (response.data.error_code === 0) {
                setEditSuccess(true);
                // Refresh the user list
                fetchUsers(currentPage[activeTab], activeTab);
                // Close modal after delay
                setTimeout(() => {
                    handleEditModalClose();
                }, 1500);
            } else {
                setEditError('Failed to update user information');
            }
        } catch (error) {
            setEditError(error.response?.data?.message || 'An error occurred while updating user information');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteClose = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await axiosAdmin.delete(`${API_PATHS_ADMIN.USER_MANAGEMENT_DELETE_USER}/${userToDelete._id}`);
            
            if (response.data.error_code === 0) {
                // Refresh the user list after successful deletion
                fetchUsers(currentPage[activeTab], activeTab);
                handleDeleteClose();
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCreateAdminSubmit = async (formData) => {
        setCreateAdminLoading(true);
        setCreateAdminError(null);
        setCreateAdminSuccess(false);

        try {
            const response = await axiosAdmin.post(`${API_PATHS_ADMIN.USER_MANAGEMENT_CREATE_ADMIN}`, formData);
            
            if (response.data.error_code === 0) {
                setCreateAdminSuccess(true);
                // Refresh the user list
                fetchUsers(currentPage[activeTab], activeTab);
                // Close modal after delay
                setTimeout(() => {
                    handleCreateAdminClose();
                }, 1500);
            } else {
                setCreateAdminError('Failed to create new admin');
            }
        } catch (error) {
            setCreateAdminError(error.response?.data?.message || 'An error occurred while creating new admin');
        } finally {
            setCreateAdminLoading(false);
        }
    };

    const handleCreateAdminClose = () => {
        setShowCreateAdminModal(false);
        setCreateAdminError(null);
        setCreateAdminSuccess(false);
    };

    // Create Admin Modal Component
    const CreateAdminModal = ({ show, handleClose, onSubmit, loading, error, success }) => {
        const [formData, setFormData] = useState({
            user_name: '',
            password: '',
            email: ''
        });

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Administrator</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success" role="alert">
                                Administrator created successfully!
                            </div>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating...
                                </>
                            ) : 'Create Administrator'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    };

    const containerStyle = {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f8fafc",
    };
    
    const cardStyle = {
        width: "90%",
        marginBottom: "2rem",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        border: "none",
        borderRadius: "0.5rem",
    };

    const getRoleBadgeVariant = (role) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'danger';
            case 'user':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    const UsersTable = ({ users }) => (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.user_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Badge bg={getRoleBadgeVariant(user.role)}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td>{format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}</td>
                            <td>{format(new Date(user.updated_at), 'dd/MM/yyyy HH:mm')}</td>
                            <td>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEditClick(user)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeleteClick(user)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const fetchFeedbacks = async () => {
        try {
            setFeedbackLoading(true);
            const response = await axiosAdmin.get(`${API_PATHS_ADMIN.USER_MANAGEMENT_FEEDBACK_LIST}?page=${feedbackPage}&size=${pageSize}`);
            
            if (response.data.error_code === 0) {
                setFeedbacks(response.data.items);
                setFeedbackTotalPages(Math.ceil(response.data.total / pageSize));
            } else {
                setFeedbackError('Failed to fetch feedbacks');
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setFeedbackError('Failed to fetch feedbacks');
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleFeedbackPageChange = (page) => {
        setFeedbackPage(page);
    };

    const FeedbacksTable = ({ feedbacks }) => (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback) => (
                        <tr key={feedback._id}>
                            <td>{feedback.user_name}</td>
                            <td>{feedback.content}</td>
                            <td>
                                <Badge bg={feedback.status === 'pending' ? 'warning' : 'success'}>
                                    {feedback.status}
                                </Badge>
                            </td>
                            <td>{format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm')}</td>
                            <td>{format(new Date(feedback.updated_at), 'dd/MM/yyyy HH:mm')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            <Navigation />
            <div style={containerStyle}>
                <Card style={cardStyle}>
                    <Card.Body>
                        <Card.Title className="mb-4">User Activity Log</Card.Title>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={userLogData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                                />
                                <YAxis />
                                <Tooltip 
                                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                                    formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="logins" 
                                    stroke="#8884d8" 
                                    name="Logins"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="actions" 
                                    stroke="#82ca9d" 
                                    name="Actions"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="errors" 
                                    stroke="#ff8042" 
                                    name="Errors"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                <Card style={cardStyle}>
                    <Card.Body>
                        <Card.Title className="mb-4">Account Management</Card.Title>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-4"
                        >
                            <Tab eventKey="user" title="Users">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="text-danger text-center py-4">{error}</div>
                                ) : (
                                    <>
                                        <UsersTable users={users.filter(u => u.role === 'user')} />
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination>
                                                <Pagination.First 
                                                    disabled={currentPage.user === 1}
                                                    onClick={() => handlePageChange(1)}
                                                />
                                                <Pagination.Prev 
                                                    disabled={currentPage.user === 1}
                                                    onClick={() => handlePageChange(currentPage.user - 1)}
                                                />
                                                {[...Array(totalPages.user)].map((_, index) => (
                                                    <Pagination.Item
                                                        key={index + 1}
                                                        active={currentPage.user === index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next 
                                                    disabled={currentPage.user === totalPages.user}
                                                    onClick={() => handlePageChange(currentPage.user + 1)}
                                                />
                                                <Pagination.Last 
                                                    disabled={currentPage.user === totalPages.user}
                                                    onClick={() => handlePageChange(totalPages.user)}
                                                />
                                            </Pagination>
                                        </div>
                                    </>
                                )}
                            </Tab>
                            <Tab eventKey="admin" title="Administrators">
                                <div className="mb-3">
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setShowCreateAdminModal(true)}
                                    >
                                        Create New Admin
                                    </Button>
                                </div>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="text-danger text-center py-4">{error}</div>
                                ) : (
                                    <>
                                        <UsersTable users={users.filter(u => u.role === 'admin')} />
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination>
                                                <Pagination.First 
                                                    disabled={currentPage.admin === 1}
                                                    onClick={() => handlePageChange(1)}
                                                />
                                                <Pagination.Prev 
                                                    disabled={currentPage.admin === 1}
                                                    onClick={() => handlePageChange(currentPage.admin - 1)}
                                                />
                                                {[...Array(totalPages.admin)].map((_, index) => (
                                                    <Pagination.Item
                                                        key={index + 1}
                                                        active={currentPage.admin === index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next 
                                                    disabled={currentPage.admin === totalPages.admin}
                                                    onClick={() => handlePageChange(currentPage.admin + 1)}
                                                />
                                                <Pagination.Last 
                                                    disabled={currentPage.admin === totalPages.admin}
                                                    onClick={() => handlePageChange(totalPages.admin)}
                                                />
                                            </Pagination>
                                        </div>
                                    </>
                                )}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>

                <Card style={cardStyle}>
                    <Card.Body>
                        <Card.Title className="mb-4">User Feedback</Card.Title>
                        {feedbackError && (
                            <Alert variant="danger" className="mb-4">
                                {feedbackError}
                            </Alert>
                        )}

                        {feedbackLoading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <FeedbacksTable feedbacks={feedbacks} />
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First 
                                            disabled={feedbackPage === 1}
                                            onClick={() => handleFeedbackPageChange(1)}
                                        />
                                        <Pagination.Prev 
                                            disabled={feedbackPage === 1}
                                            onClick={() => handleFeedbackPageChange(feedbackPage - 1)}
                                        />
                                        {[...Array(feedbackTotalPages)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={feedbackPage === index + 1}
                                                onClick={() => handleFeedbackPageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next 
                                            disabled={feedbackPage === feedbackTotalPages}
                                            onClick={() => handleFeedbackPageChange(feedbackPage + 1)}
                                        />
                                        <Pagination.Last 
                                            disabled={feedbackPage === feedbackTotalPages}
                                            onClick={() => handleFeedbackPageChange(feedbackTotalPages)}
                                        />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <EditUserModal 
                show={showEditModal}
                handleClose={handleEditModalClose}
                user={selectedUser}
                onSubmit={handleEditSubmit}
                loading={editLoading}
                error={editError}
                success={editSuccess}
                initialLoading={fetchingUser}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user <strong>{userToDelete?.user_name}</strong>?
                    <br />
                    <small className="text-danger">This action cannot be undone.</small>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button 
                        variant="outline-secondary" 
                        onClick={handleDeleteClose}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteConfirm}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Deleting...
                            </>
                        ) : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <CreateAdminModal 
                show={showCreateAdminModal}
                handleClose={handleCreateAdminClose}
                onSubmit={handleCreateAdminSubmit}
                loading={createAdminLoading}
                error={createAdminError}
                success={createAdminSuccess}
            />
        </>
    );
};

export default UserManagement;