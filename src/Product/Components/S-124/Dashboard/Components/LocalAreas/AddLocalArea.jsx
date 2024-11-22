import React, { useContext, useEffect, useState, useRef } from 'react';
import { Modal, Button, Card, Form, Row, Col, Stack, Table } from 'react-bootstrap';
import { CloseButton } from '../../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../../Context/ColorContext';
import TypeaheadField from './TypeaheadField';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import { Local_Areas, s124_NavWarn_Apis } from '../../../config';
import { MapPreview } from './MapPreview/MapPreview';
import { LocalAreaMapPreviewContext } from './MapPreview/MapPreviewContext';

function AddLocalArea({ openModel, closeModel, onAdd, localAreaData, isEditMode, showFormCoordinates, setShowFormCoordinates }) {

    const { backgroundColor, textColor } = useColor();
    const [s124NavWarnTypeMessageList, setS124NavWarnTypeMessageList] = useState([]);
    const [s124NavWarningLocalArealist, setS124NavWarningLocalArealist] = useState([]);
    const [allLocalAreaRecords, setAllLocalAreaRecords] = useState([]);
    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [isCreateLocalArea, setIsCreateLocalArea] = useState(false);
    const { drawCoordinates, updateDrawCoordinates, updateMapHeightFlag } = useContext(LocalAreaMapPreviewContext);
    const [convertCoordinates, setConvertCoordinates] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const mapPreviewRef = useRef();
    const [showConfirmCoordinatesModal, setshowConfirmCoordinatesModal] = useState(false);

    const [deleteIndex, setDeleteIndex] = useState(null);

    const [modifiedCoordinates, setModifiedCoordinates] = useState([]);

    const localAreaFields = {
        id: '',
        name: '',
        description: '',
        areaType: '',
        messageType: '',
        coordinates: ''
    }

    const [formData, setFormData] = useState(localAreaFields);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        getInitialData();
        fetchAllLocalAreaData();

    }, []);

    useEffect(() => {

        if (drawCoordinates && drawCoordinates.length > 0) {
            coordinatesConverstion(drawCoordinates);

        }
        else if (formData.coordinates && formData.coordinates.length > 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                coordinates: formData.coordinates
            }));

            coordinatesConverstion(formData.coordinates);
        }

    }, [drawCoordinates, formData.coordinates, isEditMode])

    useEffect(() => {
        if (isCreateLocalArea) {
            getInitialData();
            fetchAllLocalAreaData();
            setIsCreateLocalArea(false);
        }

    }, [isCreateLocalArea]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                id: localAreaData['id'],
                name: localAreaData['name'],
                description: localAreaData['description'],
                areaType: localAreaData['areaType'],
                messageType: localAreaData['messageType'],
                coordinates: localAreaData['areaGeom']
            });
            getInitialData();
            fetchAllLocalAreaData();
        } else {
            setFormData(localAreaFields);
        }
    }, [isEditMode, localAreaData]);

    useEffect(() => {
        if (convertCoordinates && validationErrors.coordinates) {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                coordinates: undefined,
            }));
        }
    }, [convertCoordinates, validationErrors.coordinates]);

    const coordinatesConverstion = (objCoordinates) => {
        const coordinateArray = objCoordinates.trim().split(/\s+/).map((val) => {
            const num = Number(val);
            if (isNaN(num)) {
                console.error(`Invalid coordinate value detected: ${val}`);
            }

            return num;
        });

        const coordinatePairs = [];

        for (let i = 0; i < coordinateArray.length; i += 2) {
            if (i + 1 < coordinateArray.length) {

                const lon = coordinateArray[i];
                const lat = coordinateArray[i + 1];

                if (isNaN(lon) || isNaN(lat)) {
                    console.error(`Invalid coordinate pair: [${lon}, ${lat}]`);
                    return;
                }

                coordinatePairs.push({ lon, lat });
            } else {
                console.warn(`Incomplete coordinate pair at index ${i}: [${coordinateArray[i]}]`);
            }
        }

        if (coordinatePairs.length < 3) {
            toast.warn("Area required minimum three coordinates pair!");
            setShowFormCoordinates(true);
            return;
        }
        setConvertCoordinates(coordinatePairs);
        setIsReadOnly(true);
        setShowFormCoordinates(false);

        const requiredCoordinates = convertingtoDMSCoordinates(coordinatePairs);
        setModifiedCoordinates(requiredCoordinates);

    };

    const convertingtoDMSCoordinates = (coordinatePairs) => {
        return coordinatePairs.map(pair => ({
            lat: convertToDMS(pair.lat, true),  // Convert latitude to DMS
            lon: convertToDMS(pair.lon, false)  // Convert longitude to DMS
        }));
    };

    const convertToDMS = (decimal, isLat) => {
        const absolute = Math.abs(decimal);
        const degrees = Math.floor(absolute);
        const minutes = Math.floor((absolute - degrees) * 60);
        const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);

        const direction = decimal >= 0
            ? (isLat ? 'N' : 'E')
            : (isLat ? 'S' : 'W');

        return `${degrees}-${minutes}-${seconds}${direction}`;
    };


    const fetchAllLocalAreaData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllLocalAreas}`);
            if (response.data && Array.isArray(response.data)) {
                setAllLocalAreaRecords(response.data);
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

                setS124NavWarnTypeMessageList(apiResponseData['warningType'] || []);
                setS124NavWarningLocalArealist(Local_Areas);
            }
        } catch (error) {
            console.log('Error while fetching Nav warn Type General in template', error);
        }
    }


    const handleClose = () => {
        closeModel(false);
        setShowConfirmUpdateModal(false);
        refreshData();
        if (mapPreviewRef.current) {
            mapPreviewRef.current.clearVectorSource();
            mapPreviewRef.current.stopDrag();
            updateDrawCoordinates('');
            setModifiedCoordinates([]);
        }
    }

    const handleChange = async (label, value) => {
        setFormData(prevData => {
            const newFormData = { ...prevData, [label]: value };
            const { errors } = validateForm(newFormData);
            setValidationErrors(errors);
            return newFormData;
        });

        if (label === "coordinates") {
            const coordinatesArray = value.split(' ')
                .map(Number)
                .reduce((acc, curr, index) => {
                    if (index % 2 === 0) {
                        acc.push([curr]);
                    } else {
                        acc[acc.length - 1].push(curr);
                    }
                    return acc;
                }, []);

            if (coordinatesArray.length >= 3) {
                updateMapHeightFlag(true);
            }
        }
    };

    const validateForm = (formData) => {
        const errors = {};
        const requiredFields = [
            'name',
            'description',
            'areaType',
            'messageType',
        ];

        let isFormValid = true;

        const namePattern = /^[A-Za-z0-9\s]+$/;
        const descriptionPattern = /^.{5,}$/;

        requiredFields.forEach(field => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                errors[field] = `${field.replace(/_/g, ' ')} is required.`;
                isFormValid = false;
            }
        });

        // Validate name with regex
        if (formData.name && !namePattern.test(formData.name)) {
            errors.name = "Name must only contain letters and spaces.";
            isFormValid = false;
        }

        // Validate description with regex
        if (formData.description && !descriptionPattern.test(formData.description)) {
            errors.description = "Description must be at least 5 characters long.";
            isFormValid = false;
        }
        // Validate convertCoordinates
        if (Array.isArray(convertCoordinates) && convertCoordinates.length > 0) {
            convertCoordinates.forEach((coord, index) => {
                const { lon, lat } = coord;
                // Check for empty lat or lon values
                if (lon === undefined || lon === '') {
                    errors[`lon_${index}`] = `Longitude at index ${index} is required.`;
                    isFormValid = false;
                }

                if (lat === undefined || lat === '') {
                    errors[`lat_${index}`] = `Latitude at index ${index} is required.`;
                    isFormValid = false;
                }

                if (typeof lon === 'number' && (lon < -180 || lon > 180)) {
                    errors[`lon_${index}`] = `Invalid longitude at index ${index}: ${lon}. Longitude must be between -180 and 180.`;
                    isFormValid = false;
                }

                if (typeof lat === 'number' && (lat < -90 || lat > 90)) {
                    errors[`lat_${index}`] = `Invalid latitude at index ${index}: ${lat}. Latitude must be between -90 and 90.`;
                    isFormValid = false;
                }
            });
        } else {
            errors.coordinates = "Coordinates are required.";
            isFormValid = false;
        }
        return { errors, isFormValid };
    };


    const isDuplicate = (newRecord) => {
        if (!Array.isArray(allLocalAreaRecords) || allLocalAreaRecords.length === 0) {
            return false;
        }

        return allLocalAreaRecords.some(record => {
            const areaNameMatch = record.name.trim().toLowerCase() === newRecord.name.trim().toLowerCase();
            return areaNameMatch;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const { errors, isFormValid } = validateForm(formData);
        setValidationErrors(errors);
        if (convertCoordinates.length === 0) {
            toast.warn('Please enter coordinates or  draw area');
            return;
        }
        if (isFormValid) {

            try {
                if (isDuplicate(formData) && !isEditMode) {
                    toast.info('Record already existed.');
                    updateDrawCoordinates('');

                    return;
                }
                if (isEditMode) {

                    setShowConfirmUpdateModal(true);
                } else {
                    const formattedCoordinates = convertCoordinates.map(coord => `${coord.lat} ${coord.lon}`).join(' ');
                    const localareaformdata = {
                        "id": 0,
                        "name": formData.name,
                        "description": formData.description,
                        "areaType": formData.areaType,
                        "messageType": formData.messageType,
                        "geometry_type": "Polygon",
                        "areaGeom": formattedCoordinates
                    }

                    const response = await axios.post(`${s124_NavWarn_Apis.addLocalArea}`, localareaformdata, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.data === 'Local Area Details have been saved Successfully') {
                        toast.success(response.data);
                        refreshData();
                        setIsCreateLocalArea(true);
                        updateDrawCoordinates('');
                        setModifiedCoordinates([]);
                        setShowFormCoordinates(true);
                        mapPreviewRef.current.stopDrag();
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
        setFormData(localAreaFields);
        setIsSubmitted(false);
        closeModel(false);
    }

    const handleCloseModal = () => {
        setShowConfirmUpdateModal(false);
        if (!isEditMode) {
            if (mapPreviewRef.current) {
                mapPreviewRef.current.clearVectorSource();
                mapPreviewRef.current.stopDrag();
                updateDrawCoordinates('');
                setModifiedCoordinates([]);
            }
        }
    }

    const handleUpdateTemplate = async () => {
        const formattedCoordinates = convertCoordinates.map(coord => `${coord.lat} ${coord.lon}`).join(' ');
        const updatelocalarea = {
            "id": formData.id,
            "name": formData.name,
            "description": formData.description,
            "areaType": formData.areaType,
            "messageType": formData.messageType,
            "geometry_type": "Polygon",
            "areaGeom": formattedCoordinates
        }
        try {
            const response = await axios.put(`${s124_NavWarn_Apis.updateLocalArea}/${localAreaData.id}`, updatelocalarea, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data === 'Local Areas Details Have Been Updated SUccessfully') {
                toast.success(response.data);
                refreshData();
                updateDrawCoordinates('');
                setModifiedCoordinates([]);
                setShowFormCoordinates(true);
                mapPreviewRef.current.stopDrag();
            }
        } catch (error) {
            console.log("Error updating the template.");
        }
    }

    const handleReset = () => {

        if (isEditMode) {
            setFormData(localAreaFields);
        } else {
            setValidationErrors({});
            setFormData(localAreaFields);
            setIsSubmitted(false);
            setShowFormCoordinates(true);
        }
        if (mapPreviewRef.current) {
            mapPreviewRef.current.clearVectorSource();
            mapPreviewRef.current.stopDrag();
            updateDrawCoordinates('');
            setModifiedCoordinates([]);
        }
        updateMapHeightFlag(false);
    }

    const cancelgeometry = () => {
        if (mapPreviewRef.current) {
            mapPreviewRef.current.clearVectorSource();
            setConvertCoordinates('');
        }
        setFormData((prevData) => ({
            ...prevData,
            coordinates: ''
        }));
    };

    const deleteCoordinateFromMap = (coordinatesToDelete) => {
        if (mapPreviewRef.current) {

            if (!Array.isArray(coordinatesToDelete)) {
                coordinatesToDelete = [coordinatesToDelete];
            }
            mapPreviewRef.current.deleteFeatureFromMap(coordinatesToDelete);

        }
    };

    const handleDeleteRow = (index) => {
        const remainingConvertCoordinates = convertCoordinates.filter((_, i) => i !== index);
        const remainingModifiedCoordinates = modifiedCoordinates.filter((_, i) => i !== index);
        if (remainingConvertCoordinates.length === 3) {
            setDeleteIndex(index);
            setshowConfirmCoordinatesModal(true);
            return;
        }

        setConvertCoordinates(remainingConvertCoordinates);
        setModifiedCoordinates(remainingModifiedCoordinates);
        const coordinatesToDelete = convertCoordinates[index];
        deleteCoordinateFromMap(coordinatesToDelete);
    };

    const handleDeletePolygon = () => {
        if (deleteIndex !== null) {
            const coordinatesToDelete = convertCoordinates[deleteIndex];
            setConvertCoordinates([]);
            setFormData(prevFormData => ({
                ...prevFormData,
                coordinates: []
            }));
            deleteCoordinateFromMap(coordinatesToDelete);
            setDeleteIndex(null);
            setshowConfirmCoordinatesModal(false);
            setShowFormCoordinates(true);
            setValidationErrors({});
            setModifiedCoordinates([]);
            updateDrawCoordinates('');

            if (mapPreviewRef.current) {
                mapPreviewRef.current.clearVectorSource();
                mapPreviewRef.current.stopDrag();
            }
            updateMapHeightFlag(false);
        }
    };

    const handleCoordinatesCloseModal = () => {
        setshowConfirmCoordinatesModal(false);
    }

    return (
        <>
            <Modal show={openModel} onHide={handleClose} size='lg' centered>
                <Modal.Header className={`d-flex justify-content-between align-items-center py-2 pe-2`}
                    style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h5 className='mb-0'>Local Area</h5></Modal.Title>
                    <CloseButton onClick={handleClose} className='ms-auto'><i className='bi bi-x'></i></CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6} className='pe-2'>
                            <Form onSubmit={handleSubmit}>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Floating className='mb-3'>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Name"
                                                        id="Name"
                                                        value={formData.name}
                                                        onChange={(e) => handleChange('name', e.target.value)}
                                                        isInvalid={isSubmitted && (!!validationErrors.name || !formData.name)}
                                                        isValid={isSubmitted && !validationErrors.name && !!formData.name}
                                                        autoComplete="off"
                                                        readOnly={isEditMode}
                                                    />
                                                    <label htmlFor="Name">
                                                        <Stack direction="horizontal">
                                                            <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                Name
                                                            </label>
                                                            <span className="text-danger"> *</span>
                                                        </Stack>
                                                    </label>
                                                </Form.Floating>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Floating className='mb-3'>
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Description"
                                                        id="Description"
                                                        value={formData.description}
                                                        onChange={(e) => handleChange('description', e.target.value)}
                                                        isInvalid={isSubmitted && (!!validationErrors.description || !formData.description)}
                                                        isValid={isSubmitted && !validationErrors.description && !!formData.description}
                                                    />
                                                    <label htmlFor="Description">
                                                        <Stack direction="horizontal">
                                                            <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                Description
                                                            </label>
                                                            <span className="text-danger"> *</span>
                                                        </Stack>
                                                    </label>
                                                </Form.Floating>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <TypeaheadField
                                                    id="typeHeadAreaType"
                                                    label="Area Type"
                                                    options={s124NavWarningLocalArealist?.sort((a, b) => a.localeCompare(b))}
                                                    selected={formData.areaType ? [formData.areaType] : []}
                                                    onChange={(selected) => handleChange('areaType', selected[0] || '')}
                                                    placeholder="Select Area Type"
                                                    className='mb-3'
                                                    isInvalid={isSubmitted && (!!validationErrors.areaType || !formData.areaType)}
                                                    isValid={isSubmitted && !validationErrors.areaType && !!formData.areaType}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <TypeaheadField
                                                    id="typeHeadMessageType"
                                                    label="Message Type"
                                                    options={s124NavWarnTypeMessageList?.sort((a, b) => a.localeCompare(b))}
                                                    selected={formData.messageType ? [formData.messageType] : []}
                                                    onChange={(selected) => handleChange('messageType', selected[0] || '')}
                                                    placeholder="Select Message Type"
                                                    className='mb-3'
                                                    isInvalid={isSubmitted && (!!validationErrors.messageType || !formData.messageType)}
                                                    isValid={isSubmitted && !validationErrors.messageType && !!formData.messageType}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                {showFormCoordinates && (
                                                    <Form.Floating className='mb-0'>
                                                        <Form.Control
                                                            as="textarea"
                                                            placeholder="Coordinates"
                                                            id="coordinates"
                                                            value={formData.coordinates}
                                                            onChange={(e) => handleChange('coordinates', e.target.value)}
                                                            isInvalid={isSubmitted && (!!validationErrors.coordinates || !!validationErrors.drawCoordinates || !formData.coordinates.length)}
                                                            isValid={isSubmitted && !validationErrors.coordinates && formData.coordinates.length > 0}
                                                        />
                                                        <label htmlFor="coordinates">
                                                            <Stack direction="horizontal">
                                                                <label style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    Coordinates
                                                                </label>
                                                                <span className="text-danger"> *</span>
                                                            </Stack>
                                                        </label>
                                                        {drawCoordinates &&
                                                            <i className='bi bi-x' onClick={cancelgeometry} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '14px', fontSize: '24px' }}></i>
                                                        }
                                                    </Form.Floating>
                                                )}

                                                {modifiedCoordinates.length > 0 && (
                                                    <Table striped bordered hover responsive className='fixTableHead mb-0'>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '41.5%' }}>Longitude</th>
                                                                <th style={{ width: '41.5%' }}>Latitude</th>
                                                                <th style={{ width: '80px' }}>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.isArray(modifiedCoordinates) && modifiedCoordinates.length > 1 && modifiedCoordinates.slice(0, -1).map((coord, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ width: '41.5%' }}>
                                                                        {coord.lon}
                                                                    </td>
                                                                    <td style={{ width: '41.5%' }}>
                                                                        {coord.lat}
                                                                    </td>
                                                                    <td className='text-center' style={{ width: '80px' }}>
                                                                        <i style={{ cursor: 'pointer' }} className="bi bi-trash" onClick={() => handleDeleteRow(index)}></i>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                )}

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
                                            {!isEditMode && (
                                                <Button variant="outline-secondary" onClick={handleReset} title='Reset' >
                                                    <i className="bi bi-arrow-clockwise"></i>
                                                </Button>
                                            )}
                                        </Stack>
                                    </Card.Footer>
                                </Card>
                            </Form>
                        </Col>
                        <Col md={6} className='ps-2'>
                            <Card>
                                <MapPreview ref={mapPreviewRef} deleteCoordinateFromMap={deleteCoordinateFromMap} localAreaCoordinates={formData.coordinates} mapHeight={'440px'} isLocalArea={true} isEditMode={true}></MapPreview>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <CustomConfirmModel
                show={showConfirmUpdateModal} title="Local Area"
                content={'Are you sure you want to update LocalArea ?'}
                onHide={handleCloseModal} onSaveChanges={handleUpdateTemplate} />
            <CustomConfirmModel
                show={showConfirmCoordinatesModal} title="Local Area"
                content={'Area required minimum three coordinates pair! Are you sure you want to delete?'}
                onHide={handleCoordinatesCloseModal} onSaveChanges={handleDeletePolygon} />
        </>
    )
}

export default AddLocalArea;