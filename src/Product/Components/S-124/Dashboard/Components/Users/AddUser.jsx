import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Stack, CardBody, CardFooter, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CloseButton, StyledLoaderInner, StyledLoaderWraper } from '../../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../../Context/ColorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomConfirmModel from './../../../../Reusable/CustomConfirmModel';
import TypeaheadField from './TypeaheadField';
import { s124_NavWarn_Apis } from '../../../config';

function AddUser({ openModel, closeModel, onAdd, userData, isEditMode }) {

    const { backgroundColor, textColor } = useColor();
    const [allUserRecords, setAllUserRecords] = useState([]);
    const [roleRecords, setRoleRecords] = useState([]);
    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [isCreateUser, setIsCreateUser] = useState(false);
    const [loading, setLoading] = useState(false);

    const templateFields = {
        user_id: 0,
        username: '',
        first_name: '',
        last_name: '',
        email_id: '',
        password: '',
        phone_no: '',
        role: ''
    };

    const [formData, setFormData] = useState(templateFields);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        fetchAllUserData();
        getAllRoles();
    }, []);

    useEffect(() => {
        if (isCreateUser) {
            fetchAllUserData();

            setIsCreateUser(false);
        }
    }, [isCreateUser]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                user_id: userData['user_id'],
                username: userData['username'],
                first_name: userData['first_name'],
                last_name: userData['last_name'],
                email_id: userData['email_id'],
                password: userData['password'] || '',
                phone_no: userData['phone_no'],
                role: userData['role'],
            });
        } else {
            setFormData(templateFields);
        }
    }, [isEditMode, userData]);

    const fetchAllUserData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllUsers}`);
            if (response.data && Array.isArray(response.data)) {
                console.log(response.data);
                setAllUserRecords(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getAllRoles = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllRoles}`);
            if (response.data && Array.isArray(response.data)) {
                const filteredRoles = response.data
                    .filter(user => user.role.toUpperCase())
                    .map(user => user.role);
                setRoleRecords(filteredRoles);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleClose = () => {
        closeModel(false);
        setShowConfirmUpdateModal(false);
        setValidationErrors({});
        setIsSubmitted(false);
        setFormData({
            username: '',
            first_name: '',
            last_name: '',
            email_id: '',
            password: '',
            phone_no: '',
            role: ''
        });
    };

    const handleChange = (label, value) => {
        setFormData(prevData => {
            const newFormData = { ...prevData, [label]: value };
            const fieldError = validateField(label, value);
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [label]: fieldError[label]
            }));

            return newFormData;
        });
    };


    const validateField = (field, value) => {
        const errors = {};
        const regexPatterns = {
            username: /^[a-zA-Z0-9\-]{3,18}$/,
            first_name: /^[a-zA-Z\-]{3,18}$/,
            last_name: /^[a-zA-Z\-]{3,18}$/,
            email_id: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%"^&*()_+=\-[\]{};:'",.<>?/\\|])(?=.*\d).{8,20}$/,
            phone_no: /^\d{10}$/
        };

        if (!value) {
            errors[field] = `${field.replace(/_/g, ' ')} is required.`;
        } else if (regexPatterns[field] && !regexPatterns[field].test(value)) {
            errors[field] = `${field.replace(/_/g, ' ')} is invalid.`;
        }

        return errors;
    };

    const validateForm = (formData) => {
        const errors = {};
        const regexPatterns = {
            username: /^[a-zA-Z0-9\-]{3,18}$/,
            first_name: /^[a-zA-Z\-]{3,18}$/,
            last_name: /^[a-zA-Z\-]{3,18}$/,
            email_id: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%"^&*()_+=\-[\]{};:'",.<>?/\\|])(?=.*\d).{8,20}$/,
            phone_no: /^\d{10}$/,
            role: /^[A-Za-z\s]+$/
        };

        const requiredFields = Object.keys(regexPatterns);
        let isFormValid = true;

        // Check for required fields and validate using regex
        requiredFields.forEach(field => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                errors[field] = `${field.replace(/_/g, ' ')} is required.`;
                isFormValid = false;
            } else if (regexPatterns[field] && !regexPatterns[field].test(formData[field])) {
                errors[field] = `${field.replace(/_/g, ' ')} is invalid.`;
                isFormValid = false;
            }
        });

        return { errors, isFormValid };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const { errors, isFormValid } = validateForm(formData);
        setValidationErrors(errors);

        if (isFormValid) {

            try {
                if (isEditMode) {
                    setShowConfirmUpdateModal(true);
                } else {
                    const UserFormData = {
                        "user_id": formData.user_id,
                        "username": formData.username,
                        "first_name": formData.first_name,
                        "last_name": formData.last_name,
                        "email_id": formData.email_id,
                        "password": formData.password,
                        "phone_no": formData.phone_no,
                        "role": formData.role
                    };
                    setLoading(true);
                    const response = await fetch(`${s124_NavWarn_Apis.registerUser}`, {
                        method: 'POST',
                        body: JSON.stringify(UserFormData),
                        headers: {
                            'Content-Type': 'application/json'
                        }

                    });
                    const result = await response.text();
                    if (result === 'User registered successfully') {
                        toast.success('User created successfully.');
                        setLoading(false);
                        refreshData();
                        setIsCreateUser(true);
                    } else {
                        toast.warn(result);
                        setLoading(false);
                    }
                }
            } catch (error) {
                setLoading(false);
                console.error('There was an error making the request:', error);
            }
        } else {
            setValidationErrors(errors);
        }
    };

    const refreshData = () => {
        onAdd();
        setFormData(templateFields);
        setIsSubmitted(false);
        closeModel(false);
    };

    const handleCloseModal = () => {
        setShowConfirmUpdateModal(false);

    };

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${s124_NavWarn_Apis.updateUser}/${formData.user_id}`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                toast.success('User updated successfully.');
                refreshData();
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("Error updating the user.");
        }
    };

    const handleReset = () => {
        setFormData(isEditMode ? { ...formData, password: '' } : templateFields);
        setValidationErrors({});
        setIsSubmitted(false);
    };

    return (
        <>
            <style>
                {`
                    #userForm .form-control.is-invalid,
                    #userForm .was-validated .form-control:invalid {
                        background-image: none;
                        padding-right: 12px;
                    }
                `}
            </style>

            <Modal show={openModel} onHide={handleClose} size='md' centered>
                {loading && (
                    <StyledLoaderWraper>
                        <StyledLoaderInner />
                    </StyledLoaderWraper>
                )}
                <Modal.Header className={`d-flex justify-content-between align-items-center py-2 pe-2`}
                    style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h5 className='mb-0'>User</h5></Modal.Title>
                    <CloseButton onClick={handleClose} className='ms-auto'><i className='bi bi-x'></i></CloseButton>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <Form onSubmit={handleSubmit} id='userForm'>
                        <Card className='rounded-bottom rounded-0 border-0'>
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Username"
                                                id="username"
                                                value={formData.username}
                                                onChange={(e) => handleChange('username', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.username || !formData.username)}
                                                isValid={isSubmitted && !validationErrors.username && !!formData.username}
                                                readOnly={isEditMode}
                                                autoComplete="off"
                                            />
                                            <label htmlFor="username">
                                                <Stack direction="horizontal">
                                                    <label>User Name</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>

                                            {isSubmitted && validationErrors.username && !validationErrors.username.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">Username allows only 3 to 18 characters with alphabets and numbers</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="First Name"
                                                id="firstName"
                                                autoComplete="off"
                                                value={formData.first_name}
                                                onChange={(e) => handleChange('first_name', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.first_name || !formData.first_name)}
                                                isValid={isSubmitted && !validationErrors.first_name && !!formData.first_name}
                                            />
                                            <label htmlFor="firstName">
                                                <Stack direction="horizontal">
                                                    <label>First Name</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.first_name && !validationErrors.first_name.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">Firstname allows only 3 to 18 characters with alphabets.</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Last Name"
                                                id="lastName"
                                                autoComplete="off"
                                                value={formData.last_name}
                                                onChange={(e) => handleChange('last_name', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.last_name || !formData.last_name)}
                                                isValid={isSubmitted && !validationErrors.last_name && !!formData.last_name}
                                            />
                                            <label htmlFor="lastName">
                                                <Stack direction="horizontal">
                                                    <label>Last Name</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.last_name && !validationErrors.last_name.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">Lasttname allows only 3 to 18 characters with alphabets.</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <TypeaheadField
                                            id="role"
                                            label="Role"
                                            options={roleRecords?.sort((a, b) => a.localeCompare(b))}
                                            labelKey="role"
                                            className='mb-3'
                                            selected={formData.role ? [formData.role] : []}
                                            onChange={(selected) => handleChange('role', selected[0] || '')}
                                            placeholder="Select Role"
                                            isInvalid={isSubmitted && (!!validationErrors.role || !formData.role)}
                                            isValid={isSubmitted && !validationErrors.role && !!formData.role}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Email"
                                                id="email"
                                                autoComplete="off"
                                                value={formData.email_id}
                                                onChange={(e) => handleChange('email_id', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.email_id || !formData.email_id)}
                                                isValid={isSubmitted && !validationErrors.email_id && !!formData.email_id}
                                            />
                                            <label htmlFor="email">
                                                <Stack direction="horizontal">
                                                    <label>Email</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.email_id && !validationErrors.email_id.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">Invalid EmailId(abc@xxx.yy)</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                id="password"
                                                value={formData.password}
                                                onChange={(e) => handleChange('password', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.password || !formData.password)}
                                                isValid={isSubmitted && !validationErrors.password && !!formData.password}
                                            />
                                            <label htmlFor="password">
                                                <Stack direction="horizontal">
                                                    <label>Password</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.password && !validationErrors.password.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">Password should be atleast 1 uppercase, lowercase, numbers, and symbols.</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Phone Number"
                                                id="phoneNumber"
                                                autoComplete="off"
                                                value={formData.phone_no}
                                                onChange={(e) => handleChange('phone_no', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.phone_no || !formData.phone_no)}
                                                isValid={isSubmitted && !validationErrors.phone_no && !!formData.phone_no}
                                            />
                                            <label htmlFor="phoneNumber">
                                                <Stack direction="horizontal">
                                                    <label>Phone Number</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.phone_no && !validationErrors.phone_no.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">phonenumber allows only numbers & it should be only 10 digits</Tooltip>}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger ms-2" style={{ cursor: 'pointer', position: 'absolute', top: '4px', right: '11px' }}></i>
                                                </OverlayTrigger>
                                            )}
                                        </Form.Floating>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <Stack direction="horizontal" gap={1}>
                                    <Button
                                        variant="outline-secondary"
                                        type="submit"
                                        title='Save'
                                        className="ms-auto"
                                    >
                                        <i className="bi bi-floppy"></i>
                                    </Button>
                                    <Button variant="outline-secondary" onClick={handleReset} title='Reset'>
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </Button>
                                </Stack>
                            </CardFooter>
                        </Card>
                    </Form>
                </Modal.Body>
            </Modal>

            <CustomConfirmModel
                show={showConfirmUpdateModal}
                title="User"
                content={'Are you sure you want to update the user?'}
                onHide={handleCloseModal}
                onSaveChanges={handleUpdateUser}
            />
        </>
    );
}

export default AddUser;
