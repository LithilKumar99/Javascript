import React, { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as olExtent from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON.js';
import { nodeServerUrl } from '../../../../../appConfig';
import { useColor } from '../../../../../Context/ColorContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { useProductFilter } from '../Context/ProductFilterContext';

function Countries() {

    const { olMap } = useContext(OLMapContext);
    const { borderColor, typoColor } = useColor();

    const { countryList, updateSelectedCountry, selectedCountry,
        selectedMapLayer, updateProductTypes, selectedAgencyCode,
        updateIsLoading, getQueryLayerUrl, enableGeomertyContainer,
        SetEnableGeomertyContainer, enableGeomertyButtonsOnCountrySelection }
        = useProductFilter();

    const parser = new GeoJSON();

    const handleChangeCountry = async (event) => {

        if (event.target.value === 'select') {
            toast.warn('Please select a country code');
            SetEnableGeomertyContainer(enableGeomertyContainer);
        } else {
            updateSelectedCountry('select');
            enableGeomertyButtonsOnCountrySelection('select');
            updateProductTypes([]);
            const countryCode = event.target.value;
            updateSelectedCountry(countryCode);
            const layerName = selectedMapLayer;
            updateIsLoading(true);
            const producttypes = await getProductTypes(layerName, selectedAgencyCode, countryCode)
            if (producttypes.length > 0) {
                setTimeout(() => {
                    enableGeomertyButtonsOnCountrySelection(countryCode);
                    updateProductTypes(producttypes);
                }, 1500);
            }
            else {
                toast.warn(`No product types are available for ${countryCode}`)
            }
            SetEnableGeomertyContainer(!enableGeomertyContainer);
            updateIsLoading(false);
        }
    }

    const getProductTypes = async (layerName, agencyCode, countryCode) => {

        let productTypes = [];
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);
        const propertyName = 'producttype';
        const outputFormat = 'application/json';
        const cqlFilter = `producercode='${agencyCode}' AND country_code='${countryCode}'`;
        const baseUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0
        &request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&cql_filter=${encodeURIComponent(cqlFilter)}&propertyName=${propertyName}`;

        const queryParams = { param: baseUrl };
        try {
            const fetchedAgencyCodes = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });
            const features = fetchedAgencyCodes.data;
            if (features && features.features) {
                const _productTypes = new Set(features.features.map(feature => feature.properties.producttype));
                productTypes.push(..._productTypes);
            } else {
                toast.warn(`There are no product types available in code geoserver for this ${layerName}`);
            }
        } catch (error) {
            toast.warn(`Fetching error for product types from geoserver for this ${layerName}`);
        }

        fitLayerExtentToMap(layerName, countryCode);

        return productTypes;
    };

    const fitLayerExtentToMap = async (layerName, countryCode) => {

        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);
        const cqlFilter = `country_code='${countryCode}'`;
        const outputFormat = 'application/json';
        const baseUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&cql_filter=${encodeURIComponent(cqlFilter)}`;

        const queryParams = { param: baseUrl };
        try {
            const resultData = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });

            var features = parser.readFeatures(resultData.data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            const extent = features.reduce((acc, feature) => {
                const featureExtent = feature.getGeometry().getExtent();
                return acc ? olExtent.extend(acc, featureExtent) : featureExtent;
            }, null);

            olMap.getView().fit(extent, {
                padding: [250, 250, 350, 250], minResolution: 10,
                duration: 1000
            });

        } catch (error) {
            toast.warn('Error fetching layer extent');
        }
    };

    return (
        <div>
            {countryList.length > 0 && (<Form>
                <Row className='mx-0 mt-3'>
                    <Col sm={12} className='px-0'>
                        <Form.Select title='Country' value={selectedCountry}
                            style={{ borderColor, color: typoColor }} onChange={e => handleChangeCountry(e)}>
                            <option key='default' value='select'>Select a Country</option>
                            {countryList && countryList.map(option => <option key={option} value={option}>{option}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            </Form>)}
        </div>
    )
}

export default Countries;