import React, { useContext, useEffect, useState, useRef } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Form, InputGroup, Row, Col, Table } from 'react-bootstrap';
import Overlay from 'ol/Overlay';
import Popover from 'react-bootstrap/Popover';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper, StyledPopover } from '../../../Reusable/StyledComponent';
import './AttributeQuery.css';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useColor } from '../../../../Context/ColorContext';
import { useUtility } from '../../../../Context/UtilityContext';
import axios from 'axios';
import { S124NavigationalwarningsAPIsV2 } from '../../../../appConfig';
import { s124_NavWarn_Apis } from '../config';
import BottomTable from '../utils/BottomTable';

function AttributeQuery() {

    const attributeQueryOverLay = document.getElementById('attributeQueryOverLayContainer');

    const { backgroundColor, borderColor, typoColor, textColor } = useColor();

    const { olMap, getAllVisibleLayers, hightLightSelectedFeature, clearMapVectorLayerSource, getMapClickFeatures } = useContext(OLMapContext);

    const { updateAttributeQueryOverLayVisible, updateS124NavWarningOverLayVisible } = useContext(OLMapContext);

    const { attributeQuerySelectedLayer, updateAttributeQuerySelectedLayer, attributeQueryFeatureSearchResults, updateAttributeQueryFeatureSearchResults,
        clearAttributeQueryFeatureSearchResults, searchInputloading, updateSearchInputloading, isAttributeQueryTypeaheadRef,
        updateSelectedAttributeQueryOption, selectedAttributeQueryOption
    } = useAttributeQueryContext();

    const { attributeQueryPanelVisible, updateAttributeQueryPanelVisible, toggleComponent, updateCollapsedQueryResultPanel,
        updateAttributeQueryBottomTablePanelVisible, isAttributeQueryButtonActive,
        registerFeatureInfoClickHandler, updateMapClickFeatureInfoLayerName,
        updateMapClickFeaturesGeometry, updateFeatureInfoRecords, updateS124edit, updateIsAttributeQueryButtonActive } = useUtility();

    const [loading, setLoading] = useState();
    const [olMapLayers, SetOlMapLayers] = useState([]);
    const formSearchRef = useRef(null);
    const [headers, setHeaders] = useState([]);
    const [selectedFeatureData, setSelectedFeatureData] = useState([]);

    useEffect(() => {
        if (olMap) {
            const mapContainer = document.getElementById('map-container');
            const attributeQueryTable = document.getElementById('attributeQueryTable');

            if (mapContainer && attributeQueryTable) {
                mapContainer.appendChild(attributeQueryTable);
            }
            const searchControl = document.getElementById('search-control');
            const attributeQueryButtonList = document.getElementById('attributeQueryButtonList');

            if (searchControl && attributeQueryButtonList) {
                attributeQueryButtonList.appendChild(searchControl);
            }
        }
    }, [olMap]);

    useEffect(() => {
        if (attributeQueryPanelVisible) {
            registerFeatureInfoClickHandler('click', handleMapClick, olMap);
        }
    }, [attributeQueryPanelVisible, attributeQuerySelectedLayer]);

    const handleMapClick = async (event) => {
        const coordinates = event.coordinate;
        if (attributeQueryPanelVisible) {
            const data = await getMapClickFeatures(event, "attributeQuery");
            if (attributeQueryOverLay) {
                const attribute_Query_OverLay = new Overlay({
                    element: attributeQueryOverLay,
                    positioning: 'bottom-center',
                    offset: [0, -20],
                    autoPan: true,
                    id: "AttributeQueryOverlay"

                });
                if (data.features.length > 0) {
                    updateAttributeQueryOverLayVisible(true);
                    olMap.addOverlay(attribute_Query_OverLay);
                    attribute_Query_OverLay.setPosition(coordinates);
                    updateMapClickFeaturesGeometry(data.geometry);
                    updateFeatureInfoRecords(data.features);
                    updateMapClickFeatureInfoLayerName(data?.features[0]?.layerName);
                    updateS124edit(false);
                    if (isAttributeQueryTypeaheadRef.current) {
                        isAttributeQueryTypeaheadRef.current.clear();
                        updateSelectedAttributeQueryOption(null);
                    }
                }
                else {
                    updateAttributeQueryOverLayVisible(false);
                    updateS124NavWarningOverLayVisible(false);
                    olMap.removeOverlay(attribute_Query_OverLay);
                }
            }
        }
    }

    useEffect(() => {
        if (attributeQuerySelectedLayer !== '') {
            setTimeout(async () => {
                updateSearchInputloading(true);
                const apiResponse = await axios.get(`${S124NavigationalwarningsAPIsV2.attributeQueryComboBoxList}`);
                updateSearchInputloading(false);
                if (apiResponse?.data) {
                    updateAttributeQueryFeatureSearchResults(apiResponse?.data);
                }
                updateAttributeQueryPanelVisible(false);
            }, 1000);
        }
    }, [attributeQuerySelectedLayer]);

    const handleComboBoxLayerSelectionChange = (event) => {
        const selectedLayer = event.target.value;
        if (selectedLayer === "select") {
            toast.info('Please select a product.');
            updateAttributeQuerySelectedLayer('')
            clearAttributeQueryFeatureSearchResults();
        } else {
            clear();
            updateAttributeQuerySelectedLayer(selectedLayer);
        }
    }

    const handleAttributeQuery = () => {
        setSelectedFeatureData([]);
        clearAttributeQueryFeatureSearchResults();
        setHeaders([]);
        toggleComponent('attributeQuery', olMap)
        SetOlMapLayers(getAllVisibleLayers());
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
    }

    const handlePopoverClose = () => {
        updateIsAttributeQueryButtonActive(false);
        updateAttributeQueryFeatureSearchResults();
        updateAttributeQuerySelectedLayer('')
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
        updateAttributeQueryPanelVisible(false);
    }

    const handleClear = () => {
        clear();
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
    }

    const clear = () => {
        clearMapVectorLayerSource();
        if (isAttributeQueryTypeaheadRef.current) {
            isAttributeQueryTypeaheadRef.current.clear();

        }
        updateSelectedAttributeQueryOption(null);
    }

    const handleSelect = async (selectedOptions) => {
        if (selectedOptions.length > 0) {
            const selectedOption = selectedOptions[0];
            updateSelectedAttributeQueryOption(selectedOption);
            clearMapVectorLayerSource();
            setSelectedFeatureData([]);

            axios.post(`${s124_NavWarn_Apis.attributeQuerySearch}`, selectedOption)
                .then(response => {
                    if (response.data) {
                        const geometry = response.data;
                        var coordinates;
                        var myGeometry;
                        const coordinateArray = geometry.coordinates.split(' ').map(Number);
                        const cleanedCoordinates = cleanArray(coordinateArray);

                        if (geometry.geometryType === 'Line') {
                            const coordinatesArr = [];
                            for (let i = 0; i < cleanedCoordinates.length; i += 2) {
                                coordinatesArr.push([cleanedCoordinates[i], cleanedCoordinates[i + 1]]);
                            }
                            const nestedCoordinates = coordinatesArr.filter(
                                (coord) => coord.every((val) => val !== 0)
                            );
                            coordinates = nestedCoordinates;
                            myGeometry = 'LineString';

                        } else if (geometry.geometryType === 'Polygon') {
                            const ringCoordinates = [];
                            for (let i = 0; i < cleanedCoordinates.length; i += 2) {
                                ringCoordinates.push([cleanedCoordinates[i], cleanedCoordinates[i + 1]]);
                            }

                            if (ringCoordinates.length > 0) {
                                if (!ringCoordinates[0].every((val, idx) => val === ringCoordinates[ringCoordinates.length - 1][idx])) {
                                    ringCoordinates.push(ringCoordinates[0]);
                                }
                            }
                            coordinates = [ringCoordinates];
                            myGeometry = 'Polygon';
                        } else {
                            myGeometry = 'Point';
                            coordinates = [cleanedCoordinates[0], cleanedCoordinates[1]];
                        }

                        const geojsonPoint = {
                            type: "Feature",
                            geometry: {
                                type: myGeometry,
                                coordinates: coordinates
                            },
                            properties: geometry
                        };
                        const targetOverlay = olMap.getOverlays().getArray()[0];
                        if (targetOverlay) {
                            targetOverlay.setPosition(undefined);
                        }

                        hightLightSelectedFeature(olMap, geojsonPoint);
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .custom-typeahead .rbt-menu {
          width: auto !important;
        }
      `;
    document.head.appendChild(style);

    return (
        <>
            <div id="search-control" className='ms-2 mt-2 position-absolute top-0 start-0' style={{ width: 'auto' }}>
                <Row>
                    <Col sm={2} className='pe-0'>
                        <div>
                            <OverlayTrigger trigger="click" key="bottom" placement="bottom" className="w-25 position-absolute" show={attributeQueryPanelVisible} rootClose={true} overlay={
                                <StyledPopover style={{ width: '400px', height: 'auto' }}>
                                    <Popover.Header as="h6" className='d-flex justify-content-between align-items-center pe-2'
                                        style={{ color: textColor, backgroundColor: backgroundColor, borderColor: borderColor }}>
                                        <i className="bi bi-filter me-2" style={{ fontSize: '20px' }}></i>
                                        IHO-Products
                                        <CloseButton onClick={handlePopoverClose} className='ms-auto'>
                                            <i className='bi bi-x'></i>
                                        </CloseButton>
                                    </Popover.Header>
                                    <Popover.Body className='pb-1' style={{ position: 'relative' }}>
                                        {loading && (
                                            <StyledLoaderWraper>
                                                <StyledLoaderInner />
                                            </StyledLoaderWraper>
                                        )}
                                        <select className='form-select mb-2' value={attributeQuerySelectedLayer}
                                            onChange={handleComboBoxLayerSelectionChange} style={{ color: typoColor, borderColor: borderColor }}>
                                            <option value="select">Select a Product</option>
                                            {olMapLayers && olMapLayers.map((item, index) => (
                                                <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </Popover.Body>
                                </StyledPopover>
                            }>
                                <StyledButton title='Attribute query tool' id='attributeQueryToggleBtn'
                                    className={`p-1 mb-1 ${isAttributeQueryButtonActive ? 'active' : ''}`}
                                    onClick={handleAttributeQuery} style={{ width: '42px', height: '54px' }}>
                                    <i className="bi bi-list"></i>
                                </StyledButton>
                            </OverlayTrigger >
                        </div>
                    </Col>
                    <Col sm={10} className='ps-1'>
                        <div>
                            {attributeQueryFeatureSearchResults && attributeQueryFeatureSearchResults.length > 0 &&
                                <Form ref={formSearchRef} className="w-100" id='attributeQuerySearch'>
                                    <InputGroup className="rounded shadow"
                                        style={{ padding: '6px', backgroundColor: backgroundColor, color: textColor, border: `1px solid ${borderColor}` }}
                                        title={'Data Set, Chart Number, Navwarn Id'}>
                                        <Typeahead
                                            id="searchBox"
                                            labelKey="combinedLabel"
                                            onChange={handleSelect}
                                            placeholder={'Data Set, Chart Number, Navwarn Id'}
                                            options={attributeQueryFeatureSearchResults}
                                            ref={isAttributeQueryTypeaheadRef}
                                            className="custom-typeahead"
                                            style={{ backgroundColor: 'transparent', color: typoColor, borderColor: borderColor }}
                                        />

                                        <InputGroup.Text style={{ backgroundColor: backgroundColor, color: textColor, borderColor: borderColor }}>
                                            {searchInputloading === true ? (
                                                <StyledLoaderInner style={{ top: 'unset', left: 'unset', width: '25px', height: '25px', borderWidth: '5px' }} />
                                            ) : selectedAttributeQueryOption ? (
                                                <i className="bi bi-x-lg clear-icon" onClick={handleClear}></i>
                                            ) : (
                                                <i className="bi bi-search"></i>
                                            )}
                                        </InputGroup.Text>
                                    </InputGroup>
                                    {selectedAttributeQueryOption !== null ? <p style={{ color: 'red' }}>Please select the feature to view details</p> : <></>}
                                </Form>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
            <div id='attributeQueryTable'>
                {selectedFeatureData.length > 0 && <BottomTable type="attributeQuery">
                    <Table responsive striped className="featureTable_attr mb-0 fixed_header" size='sm'>
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    header !== 'layername' && header !== 'time' && (
                                        <th key={header}>{header}</th>
                                    )
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {selectedFeatureData.length > 0 && Object.entries(selectedFeatureData[0]).map(([key, value]) => (
                                    key !== 'layername' && key !== 'time' && (
                                        <td key={key}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                    )
                                ))}
                            </tr>
                        </tbody>
                    </Table>
                </BottomTable>}
            </div>
        </>
    )
}

export default AttributeQuery;