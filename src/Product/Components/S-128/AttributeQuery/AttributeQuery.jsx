import React, { useContext, useEffect, useState, useRef } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Form, InputGroup, Row, Col, Table } from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import { OLMapContext } from '../../../../Context/OlMapContext';
import { CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper, StyledPopover } from '../../../Reusable/StyledComponent';
import { useColor } from '../../../../Context/ColorContext';
import { useUtility } from '../../../../Context/UtilityContext';
import BottomTable from '../utils/BottomTable';
import './AttributeQuery.css';
import { attributeQueryByOption, getAttributeQueryValues } from './utils';
import { S1412windLayer } from '../config';
import { useS128_AttributeQuery_Context } from './Context/AttributeQueryContext';

function AttributeQuery() {

    const { backgroundColor, borderColor, typoColor, textColor } = useColor();

    const { olMap, getAllVisibleLayers, hightLightSelectedFeature, clearMapVectorLayerSource } = useContext(OLMapContext);

    const { attributeQuerySelectedLayer, updateAttributeQuerySelectedLayer, attributeQueryFeatureSearchResults, updateAttributeQueryFeatureSearchResults,
        clearAttributeQueryFeatureSearchResults, searchInputloading, updateSearchInputloading, isAttributeQueryTypeaheadRef,
        updateSelectedAttributeQueryOption, selectedAttributeQueryOption
    } = useS128_AttributeQuery_Context();

    const { toggleComponent, updateCollapsedQueryResultPanel, toggleAttributeQueryButtonActive, attributeQueryPanelVisible,
        updateAttributeQueryPanelVisible, updateAttributeQueryBottomTablePanelVisible, isAttributeQueryButtonActive, } = useUtility();

    const [loading, setLoading] = useState();
    const [olMapLayers, SetOlMapLayers] = useState([]);
    const [targetUrl, setTargetUrl] = useState(null);
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
        if (attributeQuerySelectedLayer !== '') {
            setTimeout(async () => {
                updateSearchInputloading(true);
                setLoading(true);
                const arributesData = await getAttributeQueryValues(targetUrl, attributeQuerySelectedLayer);
                setLoading(false);
                updateSearchInputloading(false);
                if (arributesData.length > 0) {
                    updateAttributeQueryFeatureSearchResults(arributesData);
                }
                updateAttributeQueryPanelVisible(false);

            }, 1000);
        }
    }, [attributeQuerySelectedLayer]);

    const getTargetLayer = (selectedLayer) => {
        const layersList = olMap.getLayers().getArray();
        const targetLayer = layersList.find((lyr) =>
            lyr instanceof ImageLayer &&
            lyr.getSource() instanceof ImageWMS &&
            selectedLayer === lyr.get('title') &&
            lyr.getVisible()
        );
        return targetLayer;
    }

    const handleComboBoxLayerSelectionChange = (event) => {
        const selectedLayer = event.target.value;
        if (selectedLayer === "select") {
            toast.info('Please select a product.');
            updateAttributeQuerySelectedLayer('');
            clearAttributeQueryFeatureSearchResults();
        } else {
            clear();
            const targetLayer = getTargetLayer(selectedLayer);
            if (targetLayer) {
                const selectedLayerName = targetLayer.get('title');
                updateAttributeQuerySelectedLayer(selectedLayerName);
                const wmsUrl = targetLayer.getSource().getUrl();
                if (wmsUrl !== null && wmsUrl !== undefined) {
                    setTargetUrl(wmsUrl);
                }
            } else {
                toast.info('The selected layer is not visible.');
            }
        }
    }

    const handleAttributeQuery = () => {
        updateAttributeQuerySelectedLayer('');
        setSelectedFeatureData([]);
        clearAttributeQueryFeatureSearchResults();
        setHeaders([]);
        toggleComponent('OscAttributeQuery', olMap)
        SetOlMapLayers(getAllVisibleLayers());
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
    }

    const handlePopoverClose = () => {
        toggleAttributeQueryButtonActive(false)
        clearAttributeQueryFeatureSearchResults();
        updateAttributeQuerySelectedLayer('')
        updateCollapsedQueryResultPanel(false);
        toggleComponent('default')
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

        const lyrName = attributeQuerySelectedLayer;

        if (selectedOptions.length > 0) {
            const selectedOption = selectedOptions[0];
            updateSelectedAttributeQueryOption(selectedOption);
            clearMapVectorLayerSource();
            setSelectedFeatureData([]);
            const data = await attributeQueryByOption(olMap, targetUrl, lyrName, selectedOption, hightLightSelectedFeature);
            if (data.length > 0) {
                setSelectedFeatureData(data);
                const headings = Object.keys(data[0]);
                setHeaders(headings);
                updateCollapsedQueryResultPanel(true);
                updateAttributeQueryBottomTablePanelVisible(true);
            }
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
                                        title={attributeQuerySelectedLayer !== S1412windLayer ? `Product Id, Feature Name, Chart Number, Country or Location` : 'Id'}>
                                        <Typeahead
                                            id="searchBox"
                                            labelKey="combinedLabel"
                                            onChange={handleSelect}
                                            placeholder={
                                                attributeQuerySelectedLayer !== S1412windLayer
                                                    ? 'Product Id, Feature Name, Chart Number, Country or Location'
                                                    : 'Id'
                                            }
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