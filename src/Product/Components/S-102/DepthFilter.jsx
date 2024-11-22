import React, { useState, useContext, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Form, Row, Col, Stack, Button } from 'react-bootstrap';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import { toast } from 'react-toastify';
import { CloseButton, StyledButton, StyledPopover } from '../../Reusable/StyledComponent';
import { useUtility } from '../../../Context/UtilityContext';
import TypeaheadComboxField from './TypeaheadComboxField';
import { mapLayers } from '../../../Utils/layersDataConfig';
import { useColor } from '../../../Context/ColorContext';
import { OLMapContext } from '../../../Context/OlMapContext';
import { getLayerExtent } from './layerExtent';

function DepthFilter() {

    const { olMap, clearMapVectorLayerSource } = useContext(OLMapContext);
    const { textColor, backgroundColor, borderColor } = useColor();
    const { showDepthFilterPopUpContainer, toggleComponent, isMapLayersList,
        updateDepthFileterSelectedlayer, updateDepthFileterSelectedlayerFlag } = useUtility();

    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [thresholdValue, setThresholdValue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [olMapLayers, setOlMapLayers] = useState([]);
    const [selectedLayerItem, setSelectedLayerItem] = useState(null);
    const [lastSelectedLayerItem, setLastSelectedLayerItem] = useState(null);

    useEffect(() => {
        if (olMap) {
            const depthFilterSearchControl = document.getElementById('depthFilter-search-control');
            const depthFilterButtonList = document.getElementById('depthFilterButtonList');
            if (depthFilterSearchControl && depthFilterButtonList) {
                depthFilterButtonList.appendChild(depthFilterSearchControl);
            }
        }
    }, [olMap]);

    const handleMinValueChange = (e) => { setMinValue(e.target.value) };
    const handleMaxValueChange = (e) => { setMaxValue(e.target.value) };
    const handleThresholdValueChange = (e) => {
        setThresholdValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const { errors, isFormValid } = validateDepthFilter({
            minValue,
            maxValue,
            thresholdValue,
            selectedLayerItem
        });

        setValidationErrors(errors);

        if (!isFormValid) {
            Object.values(errors).forEach(error => toast.info(error));
            return;
        }

        if (olMap) {
            const layersList = olMap.getLayers().getArray();
            for (const lyr of layersList) {
                if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                    const params = lyr.getSource().getParams();
                    const layerTitle = lyr.get('title');

                    if (selectedLayerItem === layerTitle) {
                        const depthConditions = {
                            'S57 VALSOU mismatch': 'S102Depth',
                            'S-57 Other areas with DRVAL1 mismatch': 'S57Depth',
                            'S-57 Sounding mismatch': 'S57Depth',
                            'S-57 Depth areas mismatch': 'S57Depth',
                            'S-101 VALSOU mismatch': 'S101Depth',
                            'S-101 Sounding mismatch': 'S101Depth',
                            'S-101 Depth areas mismatch': 'S101Depth',
                        };

                        if (lyr.getVisible()) {
                            const depthField = depthConditions[layerTitle];
                            if (depthField) {
                                params.cql_filter = `${depthField} > ${minValue} AND ${depthField} < ${maxValue} AND DepthMismatch > ${thresholdValue}`;
                            }
                        }
                        lyr.getSource().updateParams(params);
                    }
                }
            }
            gotoLayerExtend();
            updateDepthFileterSelectedlayer(selectedLayerItem);
            updateDepthFileterSelectedlayerFlag(true);
            toast.success('Depths have been filtered successfully. For better performance, other layers are not being visualized.');
            handlePopoverClose();
        }
    };

    const gotoLayerExtend = async () => {
        if (selectedLayerItem != lastSelectedLayerItem) {
            const layerObject = mapLayers.find(layer => layer.layer === selectedLayerItem);
            var wmsUrl = layerObject.url;
            var layerName = `${layerObject.workspace}:${layerObject.layer}`;
            setLastSelectedLayerItem(selectedLayerItem);
            await getLayerExtent(wmsUrl, layerName, olMap);
        }
    }

    const handleListClear = () => {
        setMaxValue('');
        setMinValue('');
        setThresholdValue('');
        setIsSubmitted(false);
        setValidationErrors({});
        updateDepthFileterSelectedlayer(null);
        setSelectedLayerItem(null);
    };

    const handlePopoverClose = () => {
        toggleComponent("default");
    };

    const validateDepthFilter = (formData) => {
        const errors = {};
        let isFormValid = true;

        const floatRegExp = /^-?\d*(\.\d+)?$/;

        if (!formData.minValue || !floatRegExp.test(formData.minValue)) {
            errors.minValue = 'Minimum Depth must be a valid number.';
            isFormValid = false;
        }

        if (!formData.maxValue || !floatRegExp.test(formData.maxValue)) {
            errors.maxValue = 'Maximum Depth must be a valid number.';
            isFormValid = false;
        }

        if (!formData.thresholdValue || !floatRegExp.test(formData.thresholdValue)) {
            errors.thresholdValue = 'Depth Mismatch Threshold must be a valid number.';
            isFormValid = false;
        }

        if (!formData.selectedLayerItem) {
            errors.selectedLayerItem = 'Please select a layer.';
            isFormValid = false;
        }

        return { errors, isFormValid };
    };

    return (
        <div id="depthFilter-search-control" className='mt-2 position-absolute top-0 start-0' style={{ width: 'auto' }}>
            <Row>
                <Col sm={2} className='pe-0'>
                    <div>
                        <OverlayTrigger trigger="click" key="bottom" placement="bottom" className="w-25 position-absolute" show={showDepthFilterPopUpContainer} rootClose={true} overlay={
                            <StyledPopover style={{ width: '400px', height: 'auto' }}>
                                <Popover.Header as="h6" className='d-flex justify-content-between align-items-center pe-2'
                                    style={{ color: textColor, backgroundColor: backgroundColor, borderColor: borderColor }}>
                                    <i className="bi bi-filter me-2" style={{ fontSize: '20px' }}></i>
                                    Depth Filter
                                    <CloseButton onClick={handlePopoverClose} className='ms-auto'>
                                        <i className='bi bi-x'></i>
                                    </CloseButton>
                                </Popover.Header>
                                <Popover.Body className='pb-3' style={{ position: 'relative' }}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={12} title='Minimum Depth'>
                                                <Form.Floating className='mb-3'>
                                                    <Form.Control
                                                        type="number"
                                                        id="minDepth"
                                                        value={minValue}
                                                        onChange={handleMinValueChange}
                                                        step="any"
                                                        required
                                                        placeholder="Minimum Depth"
                                                        isInvalid={isSubmitted && (!!validationErrors.minValue || !minValue)}
                                                        isValid={isSubmitted && !validationErrors.minValue && !!minValue}
                                                    />
                                                    <label htmlFor="minDepth">Minimum Depth</label>
                                                </Form.Floating>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} title='Maximum Depth'>
                                                <Form.Floating className='mb-3'>
                                                    <Form.Control
                                                        type="number"
                                                        id="maxDepth"
                                                        value={maxValue}
                                                        onChange={handleMaxValueChange}
                                                        step="any"
                                                        required
                                                        placeholder="Maximum Depth"
                                                        isInvalid={isSubmitted && (!!validationErrors.maxValue || !maxValue)}
                                                        isValid={isSubmitted && !validationErrors.maxValue && !!maxValue}
                                                    />
                                                    <label htmlFor="maxDepth">Maximum Depth</label>
                                                </Form.Floating>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} title='Depth Mismatch Threshold'>
                                                <Form.Floating className='mb-3'>
                                                    <Form.Control
                                                        type="number"
                                                        id="threshold"
                                                        value={thresholdValue}
                                                        onChange={handleThresholdValueChange}
                                                        step="any"
                                                        required
                                                        placeholder="Depth Mismatch Threshold"
                                                        isInvalid={isSubmitted && (!!validationErrors.thresholdValue || !thresholdValue)}
                                                        isValid={isSubmitted && !validationErrors.thresholdValue && !!thresholdValue}
                                                    />
                                                    <label htmlFor="threshold">Depth Mismatch Threshold</label>
                                                </Form.Floating>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} title='Layers'>
                                                <TypeaheadComboxField
                                                    className="mb-3"
                                                    id="layer-selector"
                                                    label="Select Layer"
                                                    options={olMapLayers}
                                                    selected={selectedLayerItem ? [selectedLayerItem] : []}
                                                    onChange={(item) => {
                                                        setSelectedLayerItem(item.length ? item[0] : null);
                                                        setIsSubmitted(false);
                                                    }}
                                                    placeholder="Select Layer"
                                                    isInvalid={isSubmitted && !!validationErrors.selectedLayerItem}
                                                    isValid={isSubmitted && !validationErrors.selectedLayerItem}
                                                    singleSelect
                                                />
                                            </Col>
                                        </Row>
                                        <Stack direction="horizontal" gap={1}>
                                            <Button
                                                variant="outline-secondary"
                                                title='Filter'
                                                className="ms-auto"
                                                type="submit"
                                            >
                                                <i class="bi bi-funnel"></i>
                                            </Button>
                                            <Button variant="outline-secondary" onClick={handleListClear} title='Reset'>
                                                <i className="bi bi-arrow-clockwise"></i>
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Popover.Body>
                            </StyledPopover>
                        }>
                            <StyledButton title='Depth Filter' id='attributeQueryToggleBtn'
                                className={`p-1 mb-1`}
                                onClick={() => {
                                    toggleComponent("DepthFilter");
                                    handleListClear();
                                    clearMapVectorLayerSource();
                                    if (isMapLayersList) {
                                        const mismatchItems = isMapLayersList.filter(item =>
                                            item.layer.toLowerCase().includes("mismatch")
                                        );
                                        setOlMapLayers(mismatchItems.map(item => item.layer));
                                    }
                                }} style={{ width: '42px', height: '54px' }}>
                                <i className="bi bi-list"></i>
                            </StyledButton>
                        </OverlayTrigger>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default DepthFilter;
