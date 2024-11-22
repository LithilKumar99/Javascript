import React, { useState } from 'react';
import { Card, Form, Modal, Container, Row } from 'react-bootstrap'
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { toast } from 'react-toastify';
import CardLogoImage from './CardLogoImage';
import { s124_NavWarn_Apis } from '../../config';
import { useColor } from '../../../../../Context/ColorContext';

function ForgotPassword({ show, onHide, fullscreen }) {

    const { borderColor, fontFamily, typoColor } = useColor();
    const [username, setUsername] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleValidation = () => {
        let formIsValid = true;
        if (!username) {
            setusernameError("Username should not be empty.");
            formIsValid = false;
        } else {
            setusernameError("");
        }
        return formIsValid;
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        if (event.target.value && usernameError) {
            setusernameError("");
        }
    };
    const ClearForm = () => {
        setUsername('');
        setusernameError('');
    }
    const handleClose = () => {
        ClearForm();
        onHide();
    };
    const forgotSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const formData = new FormData();
            formData.append('userName', username);
            try {
                setLoading(true);
                const response = await fetch(`${s124_NavWarn_Apis.forgotPassword}`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                console.log(result);
                if (result === 'MAIL SENT TO REGISTERED EMAIL') {
                    setLoading(false);
                    toast.success(result.toLowerCase());
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                } else {
                    ClearForm();
                    setLoading(false);
                    toast.warn(result);
                }
            } catch (error) {
                ClearForm();
                setLoading(false);
                toast.warn('Failed due to network error, Please try after some time.')
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
                                <div className='bordermask_vr'></div>
                                <div className='bordermask_vr_end'></div>
                                <Row className='m-0 p-0'>
                                    <CardLogoImage />
                                    <Card className='col-sm-12 col-md-6 shadow rounded-end rounded-0 px-0 border-0'>
                                        <div className='my-auto'>
                                            <Card.Title className='text-center'><h4 className="p-0 my-2 main-heading mb-0" style={{ color: typoColor, fontFamily: fontFamily }}>Forgot Password</h4></Card.Title>
                                            <Card.Body className='linearBgCard'>
                                                <Form id="forgotform" onSubmit={forgotSubmit} className='bgovelshaped' style={{ fontFamily: fontFamily }}>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        {/*  <Form.Label style={{ color: typoColor }}>User Name</Form.Label> */}
                                                        <Form.Control type="text" placeholder="Username"
                                                            style={{ borderColor: borderColor }}
                                                            value={username}
                                                            onChange={handleUsernameChange}
                                                            autoComplete='off' />
                                                        <small id="usernameHelp" className="text-danger form-text">
                                                            {usernameError}
                                                        </small>
                                                    </Form.Group>
                                                    <StyledButton type="submit" className="w-100 btn_clr">
                                                        Submit
                                                    </StyledButton>
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
        </>
    );
}

export default ForgotPassword;
