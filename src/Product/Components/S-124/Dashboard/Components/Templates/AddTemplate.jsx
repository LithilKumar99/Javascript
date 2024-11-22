import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Stack } from 'react-bootstrap';
import { CloseButton } from '../../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../../Context/ColorContext';
import TypeaheadField from './TypeaheadField';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import { s124_NavWarn_Apis } from '../../../config';

function AddTemplate({ openModel, closeModel, onAdd, templateData, isEditMode }) {

    const { backgroundColor, textColor } = useColor();
    const [s124NavWarnTypeGeneralList, setS124NavWarnTypeGeneralList] = useState([]);
    const [s124navWarnCategoryList, setS124navWarnCategoryList] = useState([]);
    const [s124NavWarnTypeDetailsList, setS124NavWarnTypeDetailsList] = useState([]);
    const [allTemplateRecords, setAllTemplateRecords] = useState([]);
    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [isCreateTemplate, setIsCreateTemplate] = useState(false);

    const templateFields = {
        general_type: '',
        category: '',
        type_details: '',
        custom_definition: ''
    }

    const [formData, setFormData] = useState(templateFields);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        getInitialData();
        fetchAllTemplateData();
    }, []);

    useEffect(() => {
        if (isCreateTemplate) {
            getInitialData();
            fetchAllTemplateData();
            setIsCreateTemplate(false);
        }

    }, [isCreateTemplate]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                general_type: templateData['general_type'],
                category: templateData['category'],
                type_details: templateData['type_details'],
                custom_definition: templateData['custom_definition']
            });
            getInitialData();
            fetchAllTemplateData();
        } else {
            setFormData(templateFields);
        }
    }, [isEditMode, templateData]);

    const fetchAllTemplateData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllTemplates}`);
            if (response.data && Array.isArray(response.data)) {
                setAllTemplateRecords(response.data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const getInitialData = async () => {
        try {
            const apiResponse = await axios.get(`${s124_NavWarn_Apis.navWarning_Enums}`);
            if (apiResponse?.data) {
                const apiResponseData = apiResponse.data;
                setS124NavWarnTypeGeneralList(apiResponseData['navwarnTypeGeneral'] || []);
            }
        } catch (error) {
            console.log('Error while fetching Nav warn Type General in template', error);
        }
    }

    const getNavWarnCategory = async (typeGeneral) => {
        try {
            const apiResponse = await axios.get(`${s124_NavWarn_Apis.S124NavWarnRelation}`, {
                params: {
                    value: 'type_general',
                    attribute: typeGeneral,
                }
            });
            if (apiResponse?.data && apiResponse?.data?.length > 0) {
                setS124navWarnCategoryList(apiResponse.data);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    category: '',
                    type_details: '',
                }));
            } else {
                toast.info('No Nav warn categories are available');
            }
        } catch (error) {
            console.log('Error while fetching S124 nav warning category', error);
        }
    }

    const getNavWarnTypeDetails = async (category) => {
        try {
            const apiResponse = await axios.get(`${s124_NavWarn_Apis.S124NavWarnRelation}`, {
                params: {
                    value: 'category',
                    attribute: category,
                }
            });
            if (apiResponse?.data && apiResponse?.data?.length > 0) {
                setS124NavWarnTypeDetailsList(apiResponse.data);
            } else {
                toast.info('No Nav warn type details are available');
            }
        } catch (error) {
            console.log('Error while fetching S124 nav warning type details', error);
        }
    }

    const handleClose = () => {
        closeModel(false);
        setShowConfirmUpdateModal(false);
        refreshData();
    }

    const handleChange = async (label, value) => {
        setFormData(prevData => {
            const newFormData = { ...prevData, [label]: value };
            const { errors } = validateForm(newFormData);
            setValidationErrors(errors);
            return newFormData;
        });
        if (label === 'general_type' && value) {
            await getNavWarnCategory(value);
        }
        if (label === 'category' && value) {
            await getNavWarnTypeDetails(value);
        }
    };

    const validateForm = (formData) => {
        const errors = {};
        const requiredFields = [
            'general_type',
            'category',
            'type_details',
            'custom_definition',
        ];

        let isFormValid = true;
        requiredFields.forEach(field => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                errors[field] = `${field.replace(/_/g, ' ')} is required.`;
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
                    const response = await axios.post(`${s124_NavWarn_Apis.createTemplate}`, formData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.data === 'Created Custom Template Successfully') {
                        toast.success('Template created successfully.');
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

    const handleUpdateTemplate = async () => {
        try {
            // Update existing template
            const response = await axios.put(`${s124_NavWarn_Apis.updateTemplate}/${templateData.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200) {
                toast.success('Template updated successfully.');
                refreshData();
            }
        } catch (error) {
            console.log("Error updating the template.");
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
            <Modal show={openModel} onHide={handleClose} size='md' centered>
                <Modal.Header className={`d-flex justify-content-between align-items-center py-2 pe-2`}
                    style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h5 className='mb-0'>Template</h5></Modal.Title>
                    <CloseButton onClick={handleClose} className='ms-auto'><i className='bi bi-x'></i></CloseButton>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <Form onSubmit={handleSubmit}>
                        <Card className='rounded-bottom rounded-0 border-0'>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <TypeaheadField
                                            id="typeHeadGeneralType"
                                            label="General Type"
                                            options={s124NavWarnTypeGeneralList?.sort((a, b) => a.localeCompare(b))}
                                            selected={formData.general_type ? [formData.general_type] : []}
                                            onChange={(selected) => handleChange('general_type', selected[0] || '')}
                                            placeholder="Select General Type"
                                            className='mb-3'
                                            isInvalid={isSubmitted && (!!validationErrors.general_type || !formData.general_type)}
                                            isValid={isSubmitted && !validationErrors.general_type && !!formData.general_type}
                                            disabled={isEditMode}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <TypeaheadField
                                            id="typeHeadCategory"
                                            label="Category"
                                            options={s124navWarnCategoryList?.sort((a, b) => a.localeCompare(b))}
                                            selected={formData.category ? [formData.category] : []}
                                            onChange={(selected) => handleChange('category', selected[0] || '')}
                                            placeholder="Select Category"
                                            className='mb-3'
                                            isInvalid={isSubmitted && (!!validationErrors.category || !formData.category)}
                                            isValid={isSubmitted && !validationErrors.category && !!formData.category}
                                            disabled={isEditMode}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <TypeaheadField
                                            id="typeHeadTypeDetails"
                                            label="Type Details"
                                            options={s124NavWarnTypeDetailsList?.sort((a, b) => a.localeCompare(b))}
                                            selected={formData.type_details ? [formData.type_details] : []}
                                            onChange={(selected) => handleChange('type_details', selected[0] || '')}
                                            placeholder="Select Type Details"
                                            className='mb-3'
                                            isInvalid={isSubmitted && (!!validationErrors.type_details || !formData.type_details)}
                                            isValid={isSubmitted && !validationErrors.type_details && !!formData.type_details}
                                            disabled={isEditMode}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Floating>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Custom Details"
                                                id="CustomDetails"
                                                value={formData.custom_definition}
                                                onChange={(e) => handleChange('custom_definition', e.target.value)}
                                                isInvalid={isSubmitted && (!!validationErrors.custom_definition || !formData.custom_definition)}
                                                isValid={isSubmitted && !validationErrors.custom_definition && !!formData.custom_definition}
                                            />
                                            <label htmlFor="CustomDetails">
                                                <Stack direction="horizontal">
                                                    <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        Custom Details
                                                    </label>
                                                    <span className="text-danger"> *</span>
                                                </Stack>
                                            </label>
                                        </Form.Floating>
                                    </Col>
                                </Row>
                            </Card.Body>

                            <Card.Footer>
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
                            </Card.Footer>
                        </Card>
                    </Form>
                </Modal.Body>
            </Modal>

            <CustomConfirmModel
                show={showConfirmUpdateModal} title="Template"
                content={'Are you sure you want to update the template ?'}
                onHide={handleCloseModal} onSaveChanges={handleUpdateTemplate} />
        </>
    )
}

export default AddTemplate;
