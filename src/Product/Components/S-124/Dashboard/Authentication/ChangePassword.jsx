import React, { useState } from 'react';
import { Card, Container, Form, Row, Modal } from 'react-bootstrap'
import { StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import CardLogoImage from './CardLogoImage';
import { useColor } from '../../../../../Context/ColorContext';
import { s124_NavWarn_Apis } from '../../config';

function ChangePassword({ show, onHide, fullscreen }) {

    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [usernameError, setusernameError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [newpasswordError, setNewPasswordError] = useState('');

    const handleValidation = (event) => {
        let formIsValid = true;
        if (!username) {
            setusernameError("Username should not be empty.");
            formIsValid = false;
        } else {
            setusernameError("");
        }

        if (!password) {
            setPasswordError("OldPassword should not be empty.");
            formIsValid = false;
        }
        else {
            setPasswordError("");
        }
        if (!newpassword) {
            setNewPasswordError("NewPassword should not be empty.");
            formIsValid = false;

        } else if (!newpassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%"^&*()_+=\-[\]{};:'",.<>?/\\|])(?=.*\d).{8,20}$/)) {
            setNewPasswordError("Password should be atleast 1 uppercase, lowercase, numbers, and symbols.");
            formIsValid = false;
        }
        else {
            setNewPasswordError("");
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

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
        if (event.target.value && newpasswordError) {
            setNewPasswordError("");
        }
    };

    const ClearForm = () => {
        var form = document.getElementById("loginform");
        form.reset();
        setUsername('');
        setPassword('');
        setNewPassword('');
    }
    const UpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {

            let updatepasswordobject = {
                'userName': username,
                'oldpassword': password,
                'newpassword': newpassword
            };
            const queryParams = new URLSearchParams(updatepasswordobject);
            try {
                setLoading(true);
                const apiUrl = `${s124_NavWarn_Apis.changePassword}?${queryParams.toString()}`;
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.text();

                if (result === "password changed") {
                    setLoading(false);
                    toast.success(result);
                    ClearForm();
                    onHide();

                } else {
                    ClearForm();
                    setLoading(false);
                    toast.warn(result);
                }
            } catch (error) {
                ClearForm();
                setLoading(false);
                toast.warn('Password update failed due to network error, Please try after some time.')
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
                <Modal.Header closeButton className='border-0 position-absolute' style={{ zIndex: '999', top: '10px', right: '10px' }}>

                </Modal.Header>
                <Modal.Body className='p-0 d-flex flex-wrap align-content-center align-items-center bblury'>
                    <Container>
                        <div className='d-flex align-items-center' style={{ height: '100vh' }}>
                            <Card className='col-sm-12 col-md-9 mx-auto bg-transparent border-0 px-0'>
                                <Card.Body className='p-4' style={{ position: 'relative' }}>
                                    <div className='bordermask_hz'></div>
                                    <div className='bordermask_hz_bottom'></div>
                                    <div className='bordermask_vr heigh_1'></div>
                                    <div className='bordermask_vr_end heigh_1'></div>
                                    <Row className='m-0 p-0'>
                                        <CardLogoImage />

                                        <Card className='col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0'>
                                            <div className='my-auto'>
                                                <Card.Title className='text-center'><h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>Change password</h4></Card.Title>
                                                <Card.Body className='linearBgCard'>
                                                    <Form id="loginform" onSubmit={UpdatePasswordSubmit} className='bgovelshaped' style={{ fontFamily: fontFamily }}>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                            <Form.Control type="text" placeholder="UserName"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={username}
                                                                onChange={handleUsernameChange} autoComplete='off' />
                                                            <small id="usernameHelp" className="text-danger form-text">
                                                                {usernameError}
                                                            </small>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                            <Form.Control type="password" placeholder="OldPassword"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={password}
                                                                onChange={handlePasswordChange} />
                                                            <small id="passwordHelp" className="text-danger form-text">
                                                                {passwordError}
                                                            </small>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                                            <Form.Control type="password" placeholder="NewPassword"
                                                                style={{ borderColor: borderColor, color: typoColor, fontFamily: fontFamily }}
                                                                value={newpassword}
                                                                onChange={handleNewPasswordChange} />
                                                            <small id="passwordHelp" className="text-danger form-text">
                                                                {newpasswordError}
                                                            </small>
                                                        </Form.Group>
                                                        <StyledButton type="submit" className="w-100 btn_clr">
                                                            UpdatePassword
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
