import React, { useState } from 'react';
import { Card, Form, Modal, Container, Row } from 'react-bootstrap';
import logoimg from '../../../../../assets/images/logo.png';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import { useColor } from '../../../../../Context/ColorContext';
import { endpoints } from '../../config';
import axios from 'axios';

function ValidateEmail({ show, onHide, fullscreen }) {

    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [userkeyError, setUserkeyError] = useState("");
    const [userkey, setUserkey] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        if (event.target.value && usernameError) {
            setUsernameError("");
        }
    };

    const handleUserkeyChange = (event) => {
        setUserkey(event.target.value);
        if (event.target.value && userkeyError) {
            setUserkeyError("");
        }
    };

    const handleValidate = () => {
        let formIsValid = true;
        if (!username) {
            setUsernameError("Username should not be empty.");
            formIsValid = false;
        }
        if (!userkey) {
            setUserkeyError("Userkey should not be empty.");
            formIsValid = false;
        }
        return formIsValid;
    };

    const validateSubmit = async (e) => {
        e.preventDefault();
        if (handleValidate()) {
            try {
                setLoading(true);

                const url = `${endpoints.validate}?username=${encodeURIComponent(username)}&key=${encodeURIComponent(userkey)}`;
                const response = await axios.post(url, null, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.data === 'user validated') {
                    toast.success(response.data);
                    onHide();
                } else {
                    toast.success(response.data);
                }

            } catch (error) {
                toast.warn('Login failed due to network error, Please try after some time.');
            } finally {
                setLoading(false);
                ClearForm();
            }
        }
    };

    const ClearForm = () => {
        setUsername('');
        setUserkey('');
        setUsernameError('');
        setUserkeyError('');
    }

    const handleClose = () => {
        ClearForm();
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} fullscreen={fullscreen} className="userModal">
            {loading && (
                <StyledLoaderWraper>
                    <StyledLoaderInner />
                </StyledLoaderWraper>
            )}
            <Modal.Header className='border-0 position-absolute' style={{ zIndex: '999', top: '10px', right: '10px' }}>
                <CloseButton onClick={handleClose} className='ms-auto'>
                    <i className='bi bi-x'></i>
                </CloseButton>
            </Modal.Header>
            <Modal.Body className='p-0 d-flex flex-wrap align-content-center align-items-center bblury'>
                <Container>
                    <Card className='col-sm-12 col-md-9 mx-auto bg-transparent border-0 px-0'>
                        <Card.Body className='p-4' style={{ position: 'relative' }}>
                            <div className='bordermask_hz'></div>
                            <div className='bordermask_hz_bottom'></div>
                            <div className='bordermask_vr'></div>
                            <div className='bordermask_vr_end'></div>
                            <Row className='m-0 p-0'>
                                <Card className='col-sm-12 col-md-6 shadow rounded-start rounded-0 bgsvg text-white'>
                                    <Card.Body className='d-flex align-items-center text-center'>
                                        <div className='text-center w-100'>
                                            <Card.Img src={logoimg} style={{ width: '200px' }} />
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card className='col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0'>
                                    <Card.Title className='text-center'>
                                        <h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>Email Validate</h4>
                                    </Card.Title>
                                    <Card.Body className='linearBgCard'>
                                        <Form id="forgotform" onSubmit={validateSubmit} className='bgovelshaped' style={{ fontFamily: fontFamily }}>
                                            <Form.Group className="mb-3" controlId="usernameInput">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Username"
                                                    style={{ borderColor: borderColor }}
                                                    value={username}
                                                    onChange={handleUsernameChange}
                                                />
                                                <small className="text-danger form-text">
                                                    {usernameError}
                                                </small>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="userkeyInput">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter UserKey from Email"
                                                    style={{ borderColor: borderColor }}
                                                    value={userkey}
                                                    onChange={handleUserkeyChange}
                                                />
                                                <small className="text-danger form-text">
                                                    {userkeyError}
                                                </small>
                                            </Form.Group>
                                            <StyledButton type="submit" className="w-100 btn_clr">
                                                Validate
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

export default ValidateEmail;
