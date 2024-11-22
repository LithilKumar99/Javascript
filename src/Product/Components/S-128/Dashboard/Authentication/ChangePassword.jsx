import React, { useState } from 'react';
import { Card, Container, Form, Row, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import CardLogoImage from './CardLogoImage';
import { StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../Context/ColorContext';
import { endpoints } from '../../config';

function ChangePassword({ show, onHide, fullscreen }) {
    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [newpasswordError, setNewPasswordError] = useState('');

    const handleValidation = () => {
        let formIsValid = true;
        if (!username) {
            setUsernameError('Username should not be empty.');
            formIsValid = false;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('Old password should not be empty.');
            formIsValid = false;
        } else {
            setPasswordError('');
        }

        if (!newpassword) {
            setNewPasswordError('New password should not be empty.');
            formIsValid = false;
        } else if (!newpassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%"^&*()_+=\-[\]{};:'",.<>?/\\|])(?=.*\d).{8,20}$/)) {
            setNewPasswordError('Password should be at least 1 uppercase, lowercase, numbers, and symbols.');
            formIsValid = false;
        } else {
            setNewPasswordError('');
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

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
        if (event.target.value && newpasswordError) {
            setNewPasswordError('');
        }
    };

    const clearForm = () => {
        setUsername('');
        setPassword('');
        setNewPassword('');
    };

    const updatePasswordSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            const updatePasswordObject = {
                userName: username,
                oldpassword: password,
                newpassword: newpassword,
            };

            const queryParams = new URLSearchParams(updatePasswordObject);

            try {
                setLoading(true);
                const response = await axios.post(endpoints.changePassword(queryParams));
                const result = await response.text();

                if (result === 'password changed') {
                    setLoading(false);
                    toast.success(result);
                    clearForm();
                    onHide();
                } else {
                    setLoading(false);
                    toast.error(result);
                    clearForm();
                }

            } catch (error) {
                setLoading(false);
                toast.error('Password update failed due to network error. Please try again later.');
                clearForm();
            }
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen={fullscreen} className="userModal">
                {loading && (
                    <StyledLoaderWraper>
                        <StyledLoaderInner />
                    </StyledLoaderWraper>
                )}
                <Modal.Header closeButton className="border-0 position-absolute" style={{ zIndex: '999', top: '10px', right: '10px' }}>
                </Modal.Header>
                <Modal.Body className="p-0 d-flex flex-wrap align-content-center align-items-center bblury">
                    <Container>
                        <div className="d-flex align-items-center" style={{ height: '100vh' }}>
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
                                                    <h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>
                                                        Change password
                                                    </h4>
                                                </Card.Title>
                                                <Card.Body className="linearBgCard">
                                                    <Form id="loginform" onSubmit={updatePasswordSubmit} className="bgovelshaped" style={{ fontFamily: fontFamily }}>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="UserName"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={username}
                                                                onChange={handleUsernameChange}
                                                                autoComplete="off"
                                                            />
                                                            <small id="usernameHelp" className="text-danger form-text">
                                                                {usernameError}
                                                            </small>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="OldPassword"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={password}
                                                                onChange={handlePasswordChange}
                                                            />
                                                            <small id="passwordHelp" className="text-danger form-text">
                                                                {passwordError}
                                                            </small>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="NewPassword"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={newpassword}
                                                                onChange={handleNewPasswordChange}
                                                            />
                                                            <small id="newPasswordHelp" className="text-danger form-text">
                                                                {newpasswordError}
                                                            </small>
                                                        </Form.Group>
                                                        <StyledButton type="submit" className="w-100 btn_clr">
                                                            Update Password
                                                        </StyledButton>
                                                    </Form>
                                                </Card.Body>
                                            </div>
                                        </Card>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ChangePassword;
