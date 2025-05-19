import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import EditUserModal from './EditUserModal';
import axiosUser from '../../../api/axiosUser';
import ProfileImage from '../../../assets/profile.png';
import { API_PATHS_USER } from '../../../api/config';

const ProfileButton = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(false);

    const fetchProfile = async () => {
        setFetchingProfile(true);
        try {
            const response = await axiosUser.get(`${API_PATHS_USER.PROFILE}`);
            if (response.data.error_code === 0) {
                setProfileData(response.data.data);
            } else {
                setError('Failed to fetch profile information');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch profile information');
            handleModalClose();
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleProfileClick = async () => {
        setShowEditModal(true);
        setError(null);
        setSuccess(false);
        await fetchProfile();
    };

    const handleModalClose = () => {
        setShowEditModal(false);
        setProfileData(null);
        setError(null);
        setSuccess(false);
        setFetchingProfile(false);
    };

    const handleProfileUpdate = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axiosUser.put(`${API_PATHS_USER.UPDATE_PROFILE}`, formData);
            
            if (response.data.error_code === 0) {
                setSuccess(true);
                // Close modal after delay
                setTimeout(() => {
                    handleModalClose();
                }, 1500);
            } else {
                setError('Failed to update profile information');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav.Link onClick={handleProfileClick}>
                <img
                    src={ProfileImage}
                    alt="Profile"
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        cursor: "pointer"
                    }}
                />
            </Nav.Link>

            <EditUserModal 
                show={showEditModal}
                handleClose={handleModalClose}
                user={profileData}
                onSubmit={handleProfileUpdate}
                loading={loading}
                error={error}
                success={success}
                initialLoading={fetchingProfile}
            />
        </>
    );
};

export default ProfileButton; 