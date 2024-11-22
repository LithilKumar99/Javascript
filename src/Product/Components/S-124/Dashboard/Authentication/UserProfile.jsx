import React, { useState, useEffect, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import { toast } from 'react-toastify';
import { id, name, isBuilder } from '../../../../../Utils/AppDetails';
import { useUtility } from '../../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { useColor } from '../../../../../Context/ColorContext';

function UserProfile() {

    const { backgroundColor, textColor, borderColor } = useColor();
    const navigate = useNavigate();
    const { projectId: routeProjectId, projectName: routerProjectName } = useParams();

    const selectedProjectId = routeProjectId || id;
    const selectedProjectName = routerProjectName || name;

    const [sessionUsername, setSessionUsername] = useState('');
    const [isLoginRegisterBtnVisible, setIsLoginRegisterBtnVisible] = useState(true);
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

    const location = useLocation();
    const pathname = location.pathname;
    const parts = pathname.split('/').filter(part => part);
    const desiredPath = '/' + parts.slice(0, 1).join('/');

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole);
        setSessionUsername(storedUsername);

        if (storedUsername) {
            setIsLoginRegisterBtnVisible(false);

            const sessionTimeoutDuration = 30 * 60 * 1000;
            const timeoutId = setTimeout(() => setSessionShowModal(true), sessionTimeoutDuration);
            setSessionTimeout(timeoutId);
        }

        //getDashboardPath();

        return () => {
            if (sessionTimeout) {
                clearTimeout(sessionTimeout);
            }
        };

    }, [sessionTimeout]);

    const getDashboardPath = () => {
        const basename = import.meta.env.MODE === 'development' ? '/' : '/s124app';
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const path = url.pathname.replace(basename, '');
        const parts = path.split('/').filter(part => part);
        const dashboardPath = '/' + parts.slice(0, 1).join('/');
        if (dashboardPath === '/S124UserDashboard') {
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
        if (sessionUsername) {
            sessionStorage.clear();
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
        navigate(`/S124UserDashboard/${selectedProjectName}/${selectedProjectId}`, { replace: true });
    };

    const changePasswordClick = () => {
        setChangePasswordShow(true);
    };

    const navigateToHome = () => {
        if (sessionUsername || dashboardValue) {
            navigate(`/`, { replace: true });
        }
    };

    const handleSessionTimeoutClose = () => {
        setSessionShowModal(false);
        sessionStorage.clear();
        navigate(location.pathname === "/S124UserDashboard" ? '/' : `/`, { replace: true });
    };

    const handleSaveChangesClick = () => {
        const sessionTimeoutDuration = 30 * 60 * 1000;
        setSessionShowModal(false);
        const newSessionTimeout = setTimeout(() => setSessionShowModal(true), sessionTimeoutDuration);
        setSessionTimeout(newSessionTimeout);
    };

    const menuItems = [
        role === 'ADMINISTRATOR' && desiredPath !== "/S124UserDashboard" && {
            key: 'dashboard',
            label: 'Settings',
            onClick: navigateToDashboard,
            iconClass: 'bi bi-gear me-1 p-1'
        },
        dashboardValue && {
            key: 'map',
            label: 'Map',
            onClick: navigateToHome,
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

    return (
        <>
            <Dropdown className='w-100'>
                <Dropdown.Toggle style={{ backgroundColor, color: textColor, borderColor: borderColor, height: '40px' }} className='p-1 d-flex flex-wrap align-content-center align-items-center justify-items-center w-100 mb-3'>
                    <i className="bi bi-person-circle me-1" style={{ fontSize: '18.7px' }}></i>
                    <div>{sessionUsername}</div>
                </Dropdown.Toggle>

                {isLoginRegisterBtnVisible && (
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLoginShow} id="login-btn">
                            <i className="bi bi-person-down me-1 p-1"></i>Login
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleRegistrationShow} id="register-button">
                            <i className="bi bi-person-up me-1 p-1"></i>Register
                        </Dropdown.Item>
                    </Dropdown.Menu>
                )}

                {sessionUsername && (
                    <Dropdown.Menu>
                        {menuItems.map(item => (
                            <Dropdown.Item key={item.key} onClick={item.onClick}>
                                <i className={item.iconClass}></i>
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
            </Dropdown>

            <SignIn show={loginShow} onHide={() => setLoginShow(false)} fullscreen={fullscreen} />
            <SignUp show={registrationShow} onHide={() => setRegistrationShow(false)} fullscreen={fullscreen} />
            <ChangePassword show={changePasswordShow} onHide={() => setChangePasswordShow(false)} fullscreen={fullscreen} />

            {sessionShowModal && (
                <SessionTimeoutModal
                    onClose={handleSessionTimeoutClose}
                    onSaveChanges={handleSaveChangesClick}
                />
            )}
        </>
    );
}

function SessionTimeoutModal({ onClose, onSaveChanges }) {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Session Timeout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Your session is about to expire. Do you want to extend your session?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Logout
                </Button>
                <Button variant="primary" onClick={onSaveChanges}>
                    Stay Logged In
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserProfile;
