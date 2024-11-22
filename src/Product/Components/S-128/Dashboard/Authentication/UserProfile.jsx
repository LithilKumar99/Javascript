import React, { useState, useEffect, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ChangePassword from './ChangePassword';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { id, name, isBuilder } from '../../../../../Utils/AppDetails';
import { useUtility } from '../../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { useColor } from '../../../../../Context/ColorContext';

function UserProfile() {
    const { backgroundColor, textColor, borderColor } = useColor();
    const navigate = useNavigate();
    const { projectId: routeProjectId, projectName: routerProjectName } = useParams();
    const location = useLocation();

    const selectedProjectId = routeProjectId || id;
    const selectedProjectName = routerProjectName || name;

    const [sessionUsername, setSessionUsername] = useState('');
    const [loginAndRegisterBtnHandle, setLoginAndRegisterBtnHandle] = useState(true);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [dashboardValue, setDashboardValue] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [changePasswordShow, setChangePasswordShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);
    const [registrationShow, setRegistrationShow] = useState(false);
    const [sessionShowModal, setSessionShowModal] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(null);

    const { updates124activekey, updates124NavWarningsSideBarPanel, toggleComponent, updateUserRole } = useUtility();
    const { olMap } = useContext(OLMapContext);

    // Handle session timeout and user state
    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole);
        setUsername(storedUsername);

        if (storedUsername) {
            setSessionUsername(storedUsername);
            setLoginAndRegisterBtnHandle(false);
            const sessionTimeoutDuration = 30 * 60 * 1000; // 30 minutes
            const timeoutId = setTimeout(() => setSessionShowModal(true), sessionTimeoutDuration);
            setSessionTimeout(timeoutId);
        }

        getDashboardPath();
    }, []);

    // Detect current path to set dashboard state
    const getDashboardPath = () => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const path = url.pathname.split('/').filter(part => part);
        if (path[0] === 'userDashboard') {
            setDashboardValue(true);
        }
    };

    const handleLoginShow = (breakpoint) => {
        toggleComponent('default', olMap);
        setFullscreen(breakpoint);
        setLoginShow(true);
    };

    const handleRegistrationShow = () => {
        toggleComponent('default', olMap);
        setRegistrationShow(true);
    };

    const logoutClick = () => {
        if (username) {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('checkedItems');
            sessionStorage.removeItem('sessionId');
            sessionStorage.removeItem('role');
            updateUserRole('');
            toast.success("Successfully logged out.");
            updates124activekey('listAllActiveWarns');
            updates124NavWarningsSideBarPanel(false);

            if (isBuilder) {
                navigateToHome();
            } else {
                navigate(`/mainLayout/${selectedProjectName}/${selectedProjectId}`, { replace: true });
                window.location.reload();
            }
        }
    };

    const navigateToDashboard = () => {
        navigate(`/userDashboard/${selectedProjectName}/${selectedProjectId}`, { replace: true });
    };

    const changePasswordClick = () => {
        setChangePasswordShow(true);
    };

    const navigateToHome = () => {
        if (username || dashboardValue) {
            navigate(`/`, { replace: true });
        }
    };

    const handleSaveChangesClick = () => {
        const sessionTimeoutDuration = 30 * 60 * 1000; // 30 minutes
        setSessionShowModal(false);

        // Reset the timeout
        const newSessionTimeout = setTimeout(() => {
            setSessionShowModal(true);
        }, sessionTimeoutDuration);

        setSessionTimeout(newSessionTimeout);
    };

    const handleSessionClose = () => {
        setSessionShowModal(false);
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('checkedItems');
        sessionStorage.removeItem('sessionId');

        if (location.pathname === "/userDashboard") {
            navigate('/', { replace: true });
        }
    };

    const navigateToMap = () => {
        navigate(`/mainLayout/${selectedProjectName}/${selectedProjectId}`, { replace: true });
    };

    const menuItems = [
        (location.pathname !== '/userDashboard') && {
            key: 'dashboard',
            label: 'Dashboard',
            onClick: navigateToDashboard,
            iconClass: 'bi bi-gear me-1 p-1'
        },
        (dashboardValue) && {
            key: 'map',
            label: 'Map',
            onClick: navigateToMap,
            iconClass: 'bi bi-layout-text-sidebar-reverse me-1 p-1'
        },
        {
            key: 'change-password',
            label: 'Change Password',
            onClick: changePasswordClick,
            iconClass: 'bi bi-pass me-1 p-1'
        },
        {
            key: 'logout',
            label: 'Logout',
            onClick: logoutClick,
            iconClass: 'bi bi-box-arrow-right me-1 p-1'
        }
    ].filter(Boolean);

    const handleLoginClose = () => {
        setLoginShow(false);
    };

    return (
        <>
            <Dropdown className="w-100">
                <Dropdown.Toggle
                    style={{ backgroundColor, color: textColor, borderColor: borderColor, height: '40px' }}
                    className="p-1 d-flex flex-wrap align-content-center align-items-center justify-items-center w-100 mb-3"
                >
                    <i className="bi bi-person-circle me-1" style={{ fontSize: '18.7px' }}></i>
                    <div>{sessionUsername}</div>
                </Dropdown.Toggle>

                {loginAndRegisterBtnHandle && (
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleLoginShow(true)} id="login-btn">
                            <i className="bi bi-person-down me-1 p-1"></i> Login
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleRegistrationShow} id="register-button">
                            <i className="bi bi-person-up me-1 p-1"></i> Register
                        </Dropdown.Item>
                    </Dropdown.Menu>
                )}

                {sessionUsername && (
                    <Dropdown.Menu>
                        {menuItems.map((item) => (
                            <Dropdown.Item key={item.key} onClick={item.onClick}>
                                <i className={item.iconClass}></i>
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
            </Dropdown>

            {/* Modals */}
            <SignIn show={loginShow} onHide={handleLoginClose} fullscreen={fullscreen} />
            <SignUp show={registrationShow} onHide={() => setRegistrationShow(false)} fullscreen={fullscreen} />
            <ChangePassword show={changePasswordShow} onHide={() => setChangePasswordShow(false)} fullscreen={fullscreen} />

            {/* Session Timeout Modal */}
            {sessionShowModal && (
                <div className="session-timeout-modal">
                    <div className="modal-content">
                        <h5>Session Expired</h5>
                        <button onClick={handleSaveChangesClick}>Save Changes</button>
                        <button onClick={handleSessionClose}>Logout</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfile;
