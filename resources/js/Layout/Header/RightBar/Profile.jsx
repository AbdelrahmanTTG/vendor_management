// Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip } from 'reactstrap';
import { User } from 'react-feather';
import UserSidebar from './UsersSidebar';
import { useStateContext } from '../../../pages/context/contextAuth'
import LogoutClass from './Logout';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const sidebarRef = useRef(null);
    const { user } = useStateContext();

    // const auth0_profile = JSON.parse(localStorage.getItem('auth0_profile'));

    const handleLogout = () => {
    //     const navigate = useNavigate();

    //     const logoutUser = () => {
    //         localStorage.removeItem('ACCESS_TOKEN');
    //         localStorage.removeItem('USER');
    //         // navigate('/login'); 
    //     };

    //     return logoutUser;
    };

    const handleClose = () => {
        setSidebarOpen(false);
    };

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <div

                id="userProfileButton" // Set an ID for the tooltip
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                onMouseEnter={toggleTooltip}
                onMouseLeave={toggleTooltip}
            >
                <User />
            </div>
            {/* <Tooltip
                placement="bottom"
                isOpen={tooltipOpen}
                target="userProfileButton"
                toggle={toggleTooltip}
            >
                Open User Profile
            </Tooltip> */}
            {isSidebarOpen && (

                <div
                    ref={sidebarRef}
                    className="sidebar"
                    style={{
                        position: 'fixed',
                        right: 0,
                        top: 0,
                        width: '250px',
                        height: '100%',
                        backgroundColor: '#fff',
                        boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)',
                        padding: '20px',
                        zIndex: 1000,
                    }}
                >

                    <UserSidebar
                        user={user}
                        onLogout={handleLogout}
                        onClose={handleClose}
                    />
    
                    <LogoutClass />

                </div>

            )}

        </div>

    );
};

export default Profile;
