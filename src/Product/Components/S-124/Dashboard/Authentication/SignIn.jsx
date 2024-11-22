import React, { useState } from 'react';
import { Button, Card, Container, Form, Row, Modal } from 'react-bootstrap'
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import ValidateEmail from './ValidateEmail';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import CardLogoImage from './CardLogoImage';
import { useColor } from '../../../../../Context/ColorContext';
import { s124_NavWarn_Apis } from '../../config';


function SignIn({ show, onHide, fullscreen }) {

    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [usernameError, setusernameError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [logincard, setLogincardshow] = useState(true);
    const [Loginshow, setLoginshow] = useState(false);
    const handleLoginClose = () => setLoginshow(false);
    const [RegistartionShow, setRegistartionShow] = useState(false);
    const [forgotPasswordShow, setForgotPasswordShow] = useState(false);
    const [validateemailShow, setValidateEmailShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegistartionClose = () => setRegistartionShow(false);
    const handleForgotPageClose = () => setForgotPasswordShow(false);
    const handlevalidateclose = () => setValidateEmailShow(false);

    const handleRegistrationShow = () => {
        setRegistartionShow(true);
        handleLoginClose();
    }

    const handleForgotPageShow = () => {
        setForgotPasswordShow(true);
        handleLoginClose();
    }

    const handlevalidateemail = () => {
        setValidateEmailShow(true);
        handleLoginClose();
    }

    const handleValidation = (event) => {

        let formIsValid = true;
        if (!username) {
            setusernameError("Username should not be empty.");
            formIsValid = false;
        } else {
            setusernameError("");
        }

        if (!password) {
            setPasswordError("Password should not be empty.");
            formIsValid = false;

        }
        else {
            setPasswordError("");
        }
        return formIsValid;
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        if (event.target.value && usernameError) {
            setusernameError("");
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value && passwordError) {
            setPasswordError("");
        }
    };

    const ClearForm = () => {
        var form = document.getElementById("loginform");
        form.reset();
        setUsername('');
        setusernameError('');
        setPassword('');
        setPasswordError('');
    }

    const handleClose = () => {
        ClearForm();
        onHide();
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {

            let signinobject = {
                'username': username,
                'password': password,
            }
            try {

                setLoading(true);
                const response = await fetch(`${s124_NavWarn_Apis.LoginUser}`, {
                    method: 'POST',
                    body: JSON.stringify(signinobject),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                if (result && !(result.role == null)) {
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('role', result.role);
                    setLoading(false);
                    const sessionId = generateSessionId();
                    sessionStorage.setItem('sessionId', sessionId);
                    window.location.reload();
                } else if (result.token === 'user not validated') {
                    ClearForm();
                    setLoading(false);
                    toast.success(result.token);
                    handlevalidateemail();
                } else {
                    ClearForm();
                    setLoading(false);
                    toast.warn('Invalid Credentials.')
                }
            } catch (error) {
                ClearForm();
                toast.error('Login failed due to network error, Please try after some time.')
            }
        }
    };

    const generateSessionId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen={fullscreen} className="userModal">
                {loading && (
                    <StyledLoaderWraper>
                        <StyledLoaderInner />
                    </StyledLoaderWraper>
                )}
                <Modal.Header className='border-0 position-absolute' style={{ zIndex: '999', top: '10px', right: '10px' }}>
                    <CloseButton
                        onClick={handleClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body className='p-0 d-flex flex-wrap align-content-center align-items-center bblury'>
                    <Container>
                        <Card className='col-sm-12 col-md-9 mx-auto bg-transparent border-0 px-0'>
                            <Card.Body className='p-4' style={{ position: 'relative' }}>
                                <div className='bordermask_hz'></div>
                                <div className='bordermask_hz_bottom'></div>
                                <div className='bordermask_vr heigh_1'></div>
                                <div className='bordermask_vr_end heigh_1'></div>
                                <Row className='m-0 p-0'>

                                    <CardLogoImage />
                                    {logincard &&
                                        <Card className='col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0'>
                                            <div className='my-auto'>
                                                <Card.Title className='text-center'><h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>Login</h4></Card.Title>
                                                <Card.Body className='linearBgCard'>
                                                    <Form id="loginform" onSubmit={loginSubmit} className='bgovelshaped' style={{ fontFamily: fontFamily }}>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                            <Form.Control type="text" placeholder="UserName"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={username}
                                                                onChange={handleUsernameChange}
                                                                autoComplete='off' />
                                                            <small id="usernameHelp" className="text-danger form-text">
                                                                {usernameError}
                                                            </small>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                            <Form.Control type="password" placeholder="Password"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={password}
                                                                onChange={handlePasswordChange} />
                                                            <small id="passwordHelp" className="text-danger form-text">
                                                                {passwordError}
                                                            </small>
                                                        </Form.Group>
                                                        <StyledButton type="submit" className="w-100 btn_clr">
                                                            Login
                                                        </StyledButton>
                                                        <Form.Group className="mb-3 mt-2">
                                                            <Button variant="link" onClick={handleForgotPageShow}>Forgot Password</Button>
                                                            <Button variant="link" className="float-end" onClick={handleRegistrationShow}>Register</Button>
                                                        </Form.Group>
                                                    </Form>
                                                </Card.Body>
                                            </div>
                                        </Card>
                                    }
                                </Row>
                            </Card.Body>
                        </Card>
                    </Container>
                </Modal.Body>
            </Modal>
            <SignUp
                show={RegistartionShow}
                onHide={handleRegistartionClose}
                fullscreen={fullscreen}
            />
            <ForgotPassword
                show={forgotPasswordShow}
                onHide={handleForgotPageClose}
                fullscreen={fullscreen}
            />
            <ValidateEmail
                show={validateemailShow}
                onHide={handlevalidateclose}
                fullscreen={fullscreen}
            />
        </>
    );
}

export default SignIn;
