import React, { useState } from 'react';
import { Button, Card, Container, Form, Row, Modal } from 'react-bootstrap';
import axios from 'axios';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import ValidateEmail from './ValidateEmail';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import CardLogoImage from './CardLogoImage';
import { useColor } from '../../../../../Context/ColorContext';
import { endpoints } from '../../config';

function SignIn({ show, onHide, fullscreen }) {

    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registartionShow, setRegistartionShow] = useState(false);
    const [forgotPasswordShow, setForgotPasswordShow] = useState(false);
    const [validateemailShow, setValidateEmailShow] = useState(false);

    const handleValidation = () => {
        let formIsValid = true;

        if (!username) {
            setUsernameError('Username should not be empty.');
            formIsValid = false;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('Password should not be empty.');
            formIsValid = false;
        } else {
            setPasswordError('');
        }

        return formIsValid;
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        if (event.target.value && usernameError) {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value && passwordError) {
            setPasswordError('');
        }
    };

    const clearForm = () => {
        setUsername('');
        setPassword('');
        setUsernameError('');
        setPasswordError('');
    };

    const handleClose = () => {
        clearForm();
        onHide();
    };

    const loginSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            const signinObject = {
                username,
                password,
            };

            try {

                setLoading(true);

                const response = await axios.post(endpoints.login, signinObject, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = response.data;

                if (result.role === 0) {
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('role', result.role);
                    const sessionId = generateSessionId();
                    sessionStorage.setItem('sessionId', sessionId);
                    setLoading(false);
                    window.location.reload();
                } else if (result.token === 'user not validated') {
                    clearForm();
                    setLoading(false);
                    toast.success(result.token);
                    handleValidateEmail();
                } else {
                    clearForm();
                    setLoading(false);
                    toast.warn('Invalid Credentials.');
                }
            } catch (error) {
                clearForm();
                setLoading(false);
                toast.error('Login failed due to network error. Please try again later.');
            }
        }
    };

    const generateSessionId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const handleRegistrationShow = () => {
        setRegistartionShow(true);
        onHide();
    };

    const handleForgotPageShow = () => {
        setForgotPasswordShow(true);
        onHide();
    };

    const handleValidateEmail = () => {
        setValidateEmailShow(true);
        onHide();
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen={fullscreen} className="userModal">
                {loading && (
                    <StyledLoaderWraper>
                        <StyledLoaderInner />
                    </StyledLoaderWraper>
                )}
                <Modal.Header className="border-0 position-absolute" style={{ zIndex: '999', top: '10px', right: '10px' }}>
                    <CloseButton onClick={handleClose} className="ms-auto">
                        <i className="bi bi-x"></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body className="p-0 d-flex flex-wrap align-content-center align-items-center bblury">
                    <Container>
                        <Card className="col-sm-12 col-md-9 mx-auto bg-transparent border-0 px-0">
                            <Card.Body className="p-4" style={{ position: 'relative' }}>
                                <div className="bordermask_hz"></div>
                                <div className="bordermask_hz_bottom"></div>
                                <div className="bordermask_vr heigh_1"></div>
                                <div className="bordermask_vr_end heigh_1"></div>
                                <Row className="m-0 p-0">
                                    <CardLogoImage />
                                    <Card className="col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0">
                                        <div className="my-auto">
                                            <Card.Title className="text-center">
                                                <h4
                                                    className="p-0 my-2 main-heading mb-0"
                                                    style={{ color: typoColor, fontFamily: fontFamily }}
                                                >
                                                    Login
                                                </h4>
                                            </Card.Title>
                                            <Card.Body className="linearBgCard">
                                                <Form onSubmit={loginSubmit} style={{ fontFamily: fontFamily }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Username"
                                                            style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                            value={username}
                                                            onChange={handleUsernameChange}
                                                            autoComplete="off"
                                                        />
                                                        <small className="text-danger form-text">{usernameError}</small>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Control
                                                            type="password"
                                                            placeholder="Password"
                                                            style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                            value={password}
                                                            onChange={handlePasswordChange}
                                                        />
                                                        <small className="text-danger form-text">{passwordError}</small>
                                                    </Form.Group>
                                                    <StyledButton type="submit" className="w-100 btn_clr">
                                                        Login
                                                    </StyledButton>
                                                    <Form.Group className="mb-3 mt-2">
                                                        <Button variant="link" onClick={handleForgotPageShow}>
                                                            Forgot Password
                                                        </Button>
                                                        <Button
                                                            variant="link"
                                                            className="float-end"
                                                            onClick={handleRegistrationShow}
                                                        >
                                                            Register
                                                        </Button>
                                                    </Form.Group>
                                                </Form>
                                            </Card.Body>
                                        </div>
                                    </Card>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Container>
                </Modal.Body>
            </Modal>

            <SignUp show={registartionShow} onHide={() => setRegistartionShow(false)} fullscreen={fullscreen} />
            <ForgotPassword show={forgotPasswordShow} onHide={() => setForgotPasswordShow(false)} fullscreen={fullscreen} />
            <ValidateEmail show={validateemailShow} onHide={() => setValidateEmailShow(false)} fullscreen={fullscreen} />
        </>
    );
}

export default SignIn; 