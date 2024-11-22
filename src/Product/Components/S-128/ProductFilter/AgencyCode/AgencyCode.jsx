import React, { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useColor } from '../../../../../Context/ColorContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { nodeServerUrl } from '../../../../../appConfig';
import { useProductFilter } from '../Context/ProductFilterContext';

function AgencyCodes() {

    const { olMap } = useContext(OLMapContext);
    const { borderColor, typoColor } = useColor();
    const { agencyCodeList, updateSelectedAgencyCode, selectedAgencyCode,
        selectedMapLayer, updateCountryList, updateIsLoading,
        getQueryLayerUrl, updateSelectedCountry, updateProductTypes,
        enableGeomertyButtonsOnCountrySelection } = useProductFilter();

    const handleChangeAgencyCode = async (e) => {

        if (e.target.value === 'select') {
            toast.warn('Please select an agency code.');
        } else {
            updateSelectedAgencyCode('select');
            updateSelectedCountry('select');
            updateCountryList([]);
            updateProductTypes([]);
            enableGeomertyButtonsOnCountrySelection('select');
            const agencyCode = e.target.value;
            updateSelectedAgencyCode(agencyCode);
            updateIsLoading(true);
            const countrycodes = await getCountryCodes(selectedMapLayer, agencyCode);
            if (countrycodes.length === 0) {
                enableGeomertyButtonsOnCountrySelection(agencyCode)
                toast.warn(`No country codes are available for ${agencyCode}`)
            }
            else {
                updateCountryList(countrycodes);
            }
            updateIsLoading(false);
        }
    }

    const getCountryCodes = async (layerName, agencyCode) => {

        let countryCodes = [];
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);
        const propertyName = 'country_code';
        const outputFormat = 'application/json';
        const cqlFilter = `producercode='${agencyCode}'`;

        const baseUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0
        &request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&
        cql_filter=${encodeURIComponent(cqlFilter)}&propertyName=${propertyName}`;

        const queryParams = { param: baseUrl };
        try {
            const fetchedAgencyCodes = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });
            const features = fetchedAgencyCodes.data;
            if (features && features.features) {
                const codes = new Set(features.features.map(feature => feature.properties.country_code));
                countryCodes.push(...codes);
            } else {
                toast.warn(`There are no country codes available in code geoserver for this ${layerName}`);
            }
        } catch (error) {
            toast.warn(`Fetching error for counry codes from geoserver for this ${layerName}`);
        }
        return countryCodes;
    };

    return (
        <div>
            {agencyCodeList.length > 0 && (
                <Form>
                    <Row className='mx-0 mt-3'>
                        <Col sm={12} className='px-0'>
                            <Form.Group>
                                <Form.Select title='Agency Code' value={selectedAgencyCode}
                                    style={{ borderColor, color: typoColor }}
                                    onChange={e => handleChangeAgencyCode(e)}>
                                    <option key='default' value='select'>Select a Agency code</option>
                                    {agencyCodeList && agencyCodeList.map(option => <option key={option} value={option}>{option}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            )}
        </div>
    )
}

export default AgencyCodes;