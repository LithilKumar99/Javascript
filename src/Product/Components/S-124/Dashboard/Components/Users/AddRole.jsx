import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Stack, CardBody, CardFooter, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CloseButton } from '../../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../../Context/ColorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import { s124_NavWarn_Apis } from '../../../config';

function AddRole({ openModel, closeModel, onAdd, templateData, isEditMode }) {

    const { backgroundColor, textColor } = useColor();
    const [allTemplateRecords, setAllTemplateRecords] = useState([]);
    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [isCreateTemplate, setIsCreateTemplate] = useState(false);

    const templateFields = {
        role: '',
        description: '',
    }

    const [formData, setFormData] = useState(templateFields);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        getAllRoles();
    }, []);

    useEffect(() => {
        if (isCreateTemplate) {
            getAllRoles();
            setIsCreateTemplate(false);
        }

    }, [isCreateTemplate]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                role: templateData['role'],
                description: templateData['description'],
            });
            getAllRoles();
        } else {
            setFormData(templateFields);
        }
    }, [isEditMode, templateData]);

    const getAllRoles = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllRoles}`);
            if (response.data && Array.isArray(response.data)) {
                setAllTemplateRecords(response.data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleClose = () => {
        closeModel(false);
        setShowConfirmUpdateModal(false);
        setValidationErrors({});
        setIsSubmitted(false);
        setFormData({
            role: '',
            description: '',

        });
    }

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
            role: /^[a-zA-Z\-]{1,18}$/,
            description: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?\s]{1,500}$/,
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
            role: /^[a-zA-Z\-]{1,18}$/,
            description: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?\s]{1,500}$/,
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
                    // Create new template
                    const response = await axios.post(`${s124_NavWarn_Apis.createRole}`, formData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data);
                    if (response.data === 'Role Details have been added Successfully') {
                        toast.success(response.data);
                        refreshData();
                        setIsCreateTemplate(true);
                    } else {
                        toast.warn(response.data);

                    }
                }

            } catch (error) {
                console.error('There was an error making the request:', error);
            }
        } else {
            setValidationErrors(errors);
        }
    }

    const refreshData = () => {
        onAdd();
        setFormData(templateFields);
        setIsSubmitted(false);
        closeModel(false);
    }

    const handleCloseModal = () => {
        setShowConfirmUpdateModal(false);

    }

    const handleUpdateRole = async () => {
        try {
            const response = await axios.put(`${s124_NavWarn_Apis.updateRole}/${templateData.role_id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data == 'Role Details have been Updated Successfully') {
                toast.success(response.data);
                refreshData();
            } else {
                toast.warn(response.data);
                refreshData();
            }
        } catch (error) {
            console.log("Error updating the Role.");
        }
    }

    const handleReset = () => {
        if (isEditMode) {
            setFormData(prevFormData => ({
                ...prevFormData,
                custom_definition: '',
            }));
        } else {
            setValidationErrors({});
            setFormData(templateFields);
            setIsSubmitted(false);
        }
    }

    return (
        <>
            <style>
                {`
                    #roleForm .form-control.is-invalid,
                    #roleForm .was-validated .form-control:invalid {
                        background-image: none;
                        padding-right: 12px;
                    }
                `}
            </style>
            <Modal show={openModel} onHide={handleClose} size='md' centered>
                <Modal.Header className={`d-flex justify-content-between align-items-center py-2 pe-2`}
                    style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h5 className='mb-0'>Role</h5></Modal.Title>
                    <CloseButton onClick={handleClose} className='ms-auto'><i className='bi bi-x'></i></CloseButton>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <Form onSubmit={handleSubmit} id="roleForm">
                        <Card className='rounded-bottom rounded-0 border-0'>
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="role"
                                                id="role"
                                                value={formData.role}
                                                onChange={(e) => handleChange('role', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.role || !formData.role)}
                                                isValid={isSubmitted && !validationErrors.role && !!formData.role}
                                                autoComplete='off'
                                            />
                                            <label htmlFor="role">
                                                <Stack direction="horizontal">
                                                    <label>Role</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.role && !validationErrors.role.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">role allows alphabets only</Tooltip>}
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
                                                placeholder="description"
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.description || !formData.description)}
                                                isValid={isSubmitted && !validationErrors.description && !!formData.description}
                                                autoComplete="off"
                                            />
                                            <label htmlFor="description">
                                                <Stack direction="horizontal">
                                                    <label>Description</label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                            {isSubmitted && validationErrors.description && !validationErrors.description.includes('required') && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-information">description allows beyond 500 characters only </Tooltip>}
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
                show={showConfirmUpdateModal} title="Role"
                content={'Are you sure you want to update the Role ?'}
                onHide={handleCloseModal} onSaveChanges={handleUpdateRole} />
        </>
    )
}

export default AddRole;
