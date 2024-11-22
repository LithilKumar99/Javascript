import React, { useState } from 'react';
import { Card, Form, Container, Row, Modal } from 'react-bootstrap';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import CardLogoImage from './CardLogoImage';
import { useColor } from '../../../../../Context/ColorContext';
import { endpoints } from '../../config';
import axios from 'axios';

function SignUp({ show, onHide, fullscreen }) {
    const defaultRole = 0;
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [selectedValue, setSelectedValue] = useState(defaultRole);
    const [email, setEmail] = useState("");
    const [mobileno, setMobileno] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState("");
    const [firstnameError, setFirstnameError] = useState("");
    const [lastnameError, setLastnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [mobilenoError, setMobilenoError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [roleError, setRoleError] = useState('');
    const { borderColor, fontFamily, typoColor } = useColor();
    const [loading, setLoading] = useState(false);

    // Validation
    const handleValidation = () => {
        let formIsValid = true;
        setUsernameError('');
        setFirstnameError('');
        setLastnameError('');
        setEmailError('');
        setPasswordError('');
        setMobilenoError('');
        setConfirmPasswordError('');
        setRoleError('');

        // Username validation
        if (!username) {
            setUsernameError("Username should not be empty.");
            formIsValid = false;
        } else if (!username.match(/^[a-zA-Z0-9\-]{3,18}$/)) {
            setUsernameError("Username allows only 3 to 18 characters with alphabets and numbers.");
            formIsValid = false;
        }

        // Firstname validation
        if (!firstname) {
            setFirstnameError("Firstname should not be empty.");
            formIsValid = false;
        } else if (!firstname.match(/^[a-zA-Z\-]{3,18}$/)) {
            setFirstnameError("Firstname allows only 3 to 18 characters with alphabets.");
            formIsValid = false;
        }

        // Lastname validation
        if (!lastname) {
            setLastnameError("Lastname should not be empty.");
            formIsValid = false;
        } else if (!lastname.match(/^[a-zA-Z\-]{3,18}$/)) {
            setLastnameError("Lastname allows only 3 to 18 characters with alphabets.");
            formIsValid = false;
        }

        // Email validation
        if (!email) {
            setEmailError("Email should not be empty.");
            formIsValid = false;
        } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            setEmailError("Invalid EmailId (abc@xxx.yy)");
            formIsValid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError("Password should not be empty.");
            formIsValid = false;
        } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%"^&*()_+=\-[\]{};:'",.<>?/\\|])(?=.*\d).{8,20}$/)) {
            setPasswordError("Password should have at least 1 uppercase, lowercase, numbers, and symbols.");
            formIsValid = false;
        }

        // Phone Number validation
        if (!mobileno) {
            setMobilenoError("Phone number should not be empty.");
            formIsValid = false;
        } else if (!mobileno.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)) {
            setMobilenoError("Phone number allows only numbers.");
            formIsValid = false;
        }

        // Confirm Password validation
        if (!confirmPassword) {
            setConfirmPasswordError("Confirm Password should not be empty.");
            formIsValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            formIsValid = false;
        }

        // Role validation
        if (selectedValue === "") {
            setRoleError("Please select a role.");
            formIsValid = false;
        }

        return formIsValid;
    }

    // Handler functions
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleClose = () => {
        onHide();
        clearForm();
    };

    const clearForm = () => {
        setUsername('');
        setFirstname('');
        setLastname('');
        setEmail('');
        setMobileno('');
        setPassword('');
        setConfirmPassword('');
        setSelectedValue(defaultRole);
        setUsernameError('');
        setFirstnameError('');
        setLastnameError('');
        setEmailError('');
        setPasswordError('');
        setMobilenoError('');
        setConfirmPasswordError('');
        setRoleError('');
    };

    const signupSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            const signupData = {
                "user_id": 0,
                "username": username,
                "first_name": firstname,
                "last_name": lastname,
                "email_id": email,
                "password": password,
                "phone_no": mobileno,
                "role": selectedValue === 0 ? "ADMINISTRATOR" : "GUEST",
            };

            try {
                setLoading(true);
                const response = await axios.post(endpoints.signup, signupData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.text();
                if (result === 'User registered successfully') {
                    toast.success('Registration successful! Please check your email to verify your account.');
                    clearForm();
                    setLoading(false);
                    onHide();
                } else {
                    toast.warn(result);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                toast.error('Registration failed due to a network error. Please try again later.');
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} fullscreen={fullscreen} className="userModal">
            {loading && (
                <StyledLoaderWraper>
                    <StyledLoaderInner />
                </StyledLoaderWraper>
            )}
            <Modal.Header className='border-0 position-absolute' style={{ zIndex: '999', top: '10px', right: '10px' }}>
                <CloseButton onClick={handleClose} className='ms-auto'><i className='bi bi-x'></i></CloseButton>
            </Modal.Header>
            <Modal.Body className='p-0 d-flex flex-wrap align-content-center align-items-center bblury'>
                <Container>
                    <Card className='col-sm-12 col-md-9 mx-auto bg-transparent border-0 px-0'>
                        <Card.Body className='p-4' style={{ position: 'relative' }}>
                            <Row className='m-0 p-0'>
                                <CardLogoImage />
                                <Card className='col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0'>
                                    <Card.Body>
                                        <Card.Title className='text-center'>
                                            <h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>Register</h4>
                                        </Card.Title>
                                        <Form id="signupform" onSubmit={signupSubmit} style={{ fontFamily: fontFamily }}>
                                            <Form.Group className="mb-3" controlId="username">
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={handleChange(setUsername)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                    autoComplete="off"
                                                />
                                                <small className="text-danger">{usernameError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="firstname">
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    placeholder="First Name"
                                                    value={firstname}
                                                    onChange={handleChange(setFirstname)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                    autoComplete="off"
                                                />
                                                <small className="text-danger">{firstnameError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="lastname">
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Last Name"
                                                    value={lastname}
                                                    onChange={handleChange(setLastname)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                    autoComplete="off"
                                                />
                                                <small className="text-danger">{lastnameError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="role">
                                                <Form.Select
                                                    size="sm"
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                >
                                                    <option value={0}>ADMINISTRATOR</option>
                                                    <option value={1}>GUEST</option>
                                                </Form.Select>
                                                <small className="text-danger">{roleError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Control
                                                    type="email"
                                                    size="sm"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={handleChange(setEmail)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                    autoComplete="off"
                                                />
                                                <small className="text-danger">{emailError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="mobileno">
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Phone Number"
                                                    value={mobileno}
                                                    onChange={handleChange(setMobileno)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                    autoComplete="off"
                                                />
                                                <small className="text-danger">{mobilenoError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Control
                                                    type="password"
                                                    size="sm"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={handleChange(setPassword)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                />
                                                <small className="text-danger">{passwordError}</small>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="confirmPassword">
                                                <Form.Control
                                                    type="password"
                                                    size="sm"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={handleChange(setConfirmPassword)}
                                                    style={{ color: typoColor, borderColor: borderColor }}
                                                />
                                                <small className="text-danger">{confirmPasswordError}</small>
                                            </Form.Group>

                                            <StyledButton type="submit" className="w-100">
                                                Register
                                            </StyledButton>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default SignUp;
