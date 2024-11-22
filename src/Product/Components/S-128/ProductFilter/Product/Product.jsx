import React, { useContext } from 'react';
import { Col, Form, Row, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../../../../../appConfig';
import { findImageLayerByTitle } from '../Utils/OpenLayersUtils/OpenLayers';
import { S1412windLayer } from '../../config';
import { useColor } from '../../../../../Context/ColorContext'
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { useProductFilter } from '../Context/ProductFilterContext';
import axios from 'axios';

function Product() {

    const { olMap, stopDrawAction } = useContext(OLMapContext);
    const { borderColor, typoColor } = useColor();

    const { selectedMapLayer, updateSelectedMapLayer, featureData,
        updateAgencyCodeList, mapLayers, updateIsLoading, setCalenderBtnVisible,
        getQueryLayerUrl, setShowCalendarDialog, updateCqlFilterString,
        toggleGeometryButtons, setCalenderSelectedInfoSucess, flag,
        setFlag, unableBtns, clearSomeFields, setShowGeometryClearDialog } = useProductFilter();

    const getAgencyCodes = async (layerName) => {

        if (layerName === S1412windLayer) {
            return
        }

        let agencyCodes = [];
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);
        const propertyName = 'producercode';
        const outputFormat = 'application/json';
        const baseUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&propertyName=${propertyName}`;
        const queryParams = { param: baseUrl };
        try {
            const fetchedAgencyCodes = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });
            const features = fetchedAgencyCodes.data;
            if (features && features.features) {
                const producerCodes = new Set(
                    features.features
                        .map(feature => feature.properties.producercode)
                        .filter(code => code !== null && code !== undefined && code !== '')
                );
                agencyCodes.push(...producerCodes);
            } else {
                toast.warn(`There are no agency codes available in code geoserver for this ${layerName}`);
            }
        } catch (error) {
            toast.warn(`Fetching error for agency codes from geoserver for this ${layerName}`);
        }

        return agencyCodes;
    };

    const handleChangeProduct = async (event) => {
        if (event.target.value !== 'select') {
            setShowCalendarDialog(false);
            const selectedLayer = event.target.value;
            var foundLayer = findImageLayerByTitle(olMap, selectedLayer);

            if (foundLayer) {
                var isVisible = foundLayer.getVisible();
                if (!isVisible) {
                    toast.warn(`Layer preview is not available.`);
                    return;
                }
            }

            if (flag && featureData.length > 0) {
                handleshowGeometryClearDialog();
                setFlag(false);
            }

            setCalenderSelectedInfoSucess(false);
            toggleGeometryButtons();
            unableBtns(selectedLayer);
            stopDrawAction();
            clearSomeFields();
            updateCqlFilterString('include');
            updateSelectedMapLayer(selectedLayer);

            updateIsLoading(true);
            const agencyCodes = await getAgencyCodes(selectedLayer);
            updateIsLoading(false);

            if (agencyCodes.length == 0) {
                if (selectedLayer !== S1412windLayer) {
                    toast.warn(`No agency codes are available for ${selectedMapLayer}`);
                }
                setCalenderBtnVisible(true);
            }
            else {
                updateAgencyCodeList([]);
                updateAgencyCodeList(agencyCodes);
            }
            updateIsLoading(false);
            setFlag(true);

        } else {
            toast.warn('Please select a product.');
        }
    }

    const handleshowGeometryClearDialog = () => {
        setShowGeometryClearDialog(true)
    }

    return (
        <Form>
            <Row className='mx-0 mt-3'>
                <Col sm={12} className='px-0'>
                    <Form.Group controlId='productSelection'>
                        <FloatingLabel label="Product" className='mb-2 mt-2'>
                            <Form.Select as='select' value={selectedMapLayer}
                                onChange={handleChangeProduct} style={{ color: typoColor, borderColor }}>
                                <option value='select'>Select a Product</option>
                                {mapLayers && mapLayers.map((item, index) => <option key={index} value={item}>{item}</option>)}
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    )
}

export default Product;