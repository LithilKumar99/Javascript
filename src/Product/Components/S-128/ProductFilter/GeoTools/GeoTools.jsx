import React, { useContext, useRef, useState } from 'react';
import { Stack, Overlay, Popover, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import GeoJSON from 'ol/format/GeoJSON.js';
import { toast } from 'react-toastify';
import Calendar from '../Utils/Calender';
import { initializeDrawAndVectorLayers } from '../Utils/OpenLayersUtils/OpenLayers';
import { StyledButton } from '../../../../Reusable/StyledComponent';
import { useColor } from '../../../../../Context/ColorContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { useProductFilter } from '../Context/ProductFilterContext';
import { useUtility } from '../../../../../Context/UtilityContext';
import { RunSailTimerApi } from '../Utils/Geoserver/SailTimer';
import { getDatesOFS1412 } from '../Utils/Geoserver/GetDatesOfS1412';
import { RTZFileContext } from '../Context/RTZFileContext';
import { nodeServerUrl } from '../../../../../appConfig';
import { S1412windLayer } from '../../config';

var wfsUrl;

function GeoTools() {

    const { backgroundColor, textColor, borderColor } = useColor();

    const { processRTZFile } = useContext(RTZFileContext);

    const { updateProductFilterBottomTablePanelvisible, updateCollapsedQueryResultPanel } = useUtility();

    const {
        selectedCalenderDate, updateSelectedCalenderDate, selectedMapLayer, selectedAgencyCode, selectedCountry,
        cqlFilterString, updateIsLoading, getQueryLayerUrl, lineButtonActive, setLineButtonActive,
        polygonButtonActive, setPolygonButtonActive,
        pointButtonActive, setPointButtonActive, rtzButtonActive, setRtzButtonActive, lineButtonVisible, setlineButtonVisible,
        polygonButtonVisible, setPolygonButtonVisible, pointButtonVisible, setPointButtonVisible,
        rtzButtonVisible, setRtzButtonVisible, calenderBtnVisible, setShowCalendarDialog,
        showCalendarDialog, updateFeatureData, updateHeader, setFlag, setCalenderSelectedInfoSucess } = useProductFilter();

    const overlayCalenderRef = useRef(null);
    const fileInputRef = useRef(null);
    const { olMap, stopDrawAction } = useContext(OLMapContext);

    const [S1412DataSetDates, setS1412DataSetDates] = useState([]);

    const initialCoordinates = {
        left: -124.5,
        top: 52.5,
        right: -124,
        bottom: 52,
        ID: 'WM-1'
    };

    const handleDrawLine = () => {
        setLineButtonActive(true);
        setPolygonButtonActive(false);
        setPointButtonActive(false);
        setRtzButtonActive(false);

        selectGeometryFeature('LineString',
            {
                color: 'rgba(0, 0, 255, 0.3)',
                // Blue color for vector layer fill
            },
            {
                color: 'rgba(0, 0, 0, 1)',
                // Black stroke color for vector layer
                width: 2,
            }
        );
    };

    /* ---------------------------------------------------
    This function sets up the map for drawing Polygon geometry and updates button states
    --------------------------------------------------- */

    const handleDrawPolygon = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(true);
        setPointButtonActive(false);
        setRtzButtonActive(false);
        selectGeometryFeature('Polygon',
            {
                color: 'rgba(14, 183, 142, 0.3)',
                // Green color for vector layer fill
            },
            {
                color: 'rgba(0, 0, 0, 0.7)',
                // Black stroke color for vector layer
                width: 3,
            }
        );
    };

    /* ---------------------------------------------------
    This function sets up the map for drawing Point geometry and updates button states
    --------------------------------------------------- */

    const handleDrawPoint = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(false);
        setPointButtonActive(true);
        setRtzButtonActive(false);

        selectGeometryFeature('Point',
            {
                color: 'rgba(255, 0, 0, 0.1)',
                // Red color for vector layer fill
            },
            {
                color: 'rgba(0, 0, 0, 1)',
                // Black stroke color for vector layer
                width: 3,
            }
        );
    };

    /* ---------------------------------------------------
    This function initializes the drawing and vector layers, and sets up interactions for drawing features on the map
    --------------------------------------------------- */
    const selectGeometryFeature = async (drawType, vectorFillStyle, vectorStrokeStyle) => {

        if (cqlFilterString === 'UnSelectedAll') {
            toast.warn('Kindly select the usage band.');
            return;
        }

        const layerName = selectedMapLayer;

        const customCursorStyle = 'crosshair';
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);

        const dynamicUrl = `${nodeServerUrl}/getDetails`;

        if (selectedMapLayer !== S1412windLayer) {
            const propertyName = 'producercode,country_code,producttype,featurename,chartnumber,compilationscale,polygon';
            const outputFormat = 'application/json';
            wfsUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&cql_filter=${encodeURIComponent(cqlFilterString)}&propertyName=${propertyName}`;

        } else {
            wfsUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json&cql_filter=${encodeURIComponent(
                cqlFilterString
            )}`;
        }

        const queryParams = { param: wfsUrl };

        try {
            stopDrawAction();
            updateIsLoading(true);
            const res = await axios.get(dynamicUrl, { params: queryParams });

            const { drawLayer, drawInteraction, vectorLayer, sourceProjection, destinationProjection } =
                initializeDrawAndVectorLayers(drawType, vectorFillStyle, vectorStrokeStyle);

            olMap.addLayer(vectorLayer);
            olMap.addLayer(drawLayer);
            olMap.addInteraction(drawInteraction);
            updateIsLoading(false);

            drawInteraction.on('drawstart', function (event) {
                olMap.getViewport().style.cursor = customCursorStyle;
            });

            drawInteraction.on('drawend', event => {

                const feature = event.feature;
                const drawGeometry = feature.getGeometry();
                const geoJSONData = res.data.features;

                if (selectedMapLayer === S1412windLayer) {
                    //updateGeometryCollection(geoJSONData);
                }

                const drawGeometryEPSG4326 = drawGeometry.clone().transform(destinationProjection, sourceProjection);

                setTimeout(() => {

                    const features = geoJSONData.filter(geoJSONFeature => {

                        if (geoJSONFeature.geometry) {
                            const geoJSONGeometry = new GeoJSON().readGeometry(
                                geoJSONFeature.geometry
                            );
                            return drawGeometryEPSG4326.intersectsExtent(
                                geoJSONGeometry.getExtent()
                            );
                        } else {
                            toast.error(geoJSONFeature);
                            return false;
                        }
                    });

                    if (features.length > 0) {

                        const geoJsonFormat = new GeoJSON();
                        const featureslist = geoJsonFormat.readFeatures(
                            {
                                type: 'FeatureCollection',
                                features: features,
                            },
                            {
                                dataProjection: 'EPSG:4326',
                                featureProjection: 'EPSG:3857',
                            }
                        );

                        if (selectedMapLayer !== S1412windLayer) {
                            if (features[0].properties.producercode !== selectedAgencyCode && features[0].properties.country_code !== selectedCountry) {
                                toast.warn('No results found.');
                                olMap.removeInteraction(drawInteraction);
                                olMap.getViewport().style.cursor = 'auto';
                                toggleGeometryButtons();
                                return;
                            }
                        }

                        vectorLayer.getSource().addFeatures(featureslist);

                        const uniqueChartData = features
                            .map(feature => {
                                feature.properties.layername = layerName;
                                if (selectedMapLayer === S1412windLayer) {
                                    const formatdate = new Date(selectedCalenderDate);
                                    const day = ('0' + formatdate.getDate()).slice(-2);
                                    const month = ('0' + (formatdate.getMonth() + 1)).slice(-2);
                                    const year = formatdate.getFullYear();
                                    const formattedDateString = `${day}-${month}-${year}`;
                                    feature.properties.Date = formattedDateString;
                                }
                                return feature.properties;
                            });
                        updateFeatureData(uniqueChartData, selectedMapLayer);
                        const headings = Object.keys(uniqueChartData[0]);
                        updateHeader(headings)
                        updateProductFilterBottomTablePanelvisible(true);
                        updateCollapsedQueryResultPanel(true);
                    }
                    else {
                        toast.warn('No results found.');
                    }
                    olMap.removeInteraction(drawInteraction);
                    olMap.getViewport().style.cursor = 'auto';
                    toggleGeometryButtons();
                }, 500);
            });

        } catch (error) {
            toast.warn(error);
        }
    };

    const handleRtzFileClick = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(false);
        setPointButtonActive(false);
        setRtzButtonActive(true);
        updateIsLoading(true);

        if (fileInputRef.current !== null) {
            stopDrawAction();
            fileInputRef.current.click();
        }
        updateIsLoading(false);
    };

    /* ---------------------------------------------------
    This function handles the change event when a user selects an RTZ file.
    --------------------------------------------------- */
    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (cqlFilterString === 'UnSelectedAll') {
            toast.warn('Kindly select the usage band.')
            updateIsLoading(false);
            return;
        }
        event.target.value = null;
        setTimeout(async () => {
            updateIsLoading(true);
            const data = await processRTZFile(file);
            updateIsLoading(false);
            if (data.length > 0) {
                if (selectedMapLayer != S1412windLayer) {
                    const firstObject = data[0];
                    const agencyCode = firstObject.producercode;
                    const countryCode = firstObject.country_code;

                    if (agencyCode === selectedAgencyCode && countryCode === selectedCountry) {
                        updateRtZFileFeaturesData(data);
                    }
                    else {
                        toast.warn(`Selected RTZ file coordinates are not available at ${selectedCountry} location.`)
                    }
                } else {
                    updateRtZFileFeaturesData(data);
                }
            }
        }, 3500);

        updateIsLoading(false);
    };

    const updateRtZFileFeaturesData = (data) => {
        updateFeatureData(data, selectedMapLayer);
        const headings = Object.keys(data[0]);
        updateHeader(headings)
        setRtzButtonActive(false);
        setTimeout(() => {
            updateProductFilterBottomTablePanelvisible(true);
            updateCollapsedQueryResultPanel(true);
        }, 1000);
        setFlag(true);
    }

    const handleOpenCalendar = async (event) => {
        event.preventDefault();
        overlayCalenderRef.current = event.target;
        setShowCalendarDialog(true);
        const attributeValue = 'time';
        const layerName = selectedMapLayer;
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);

        updateIsLoading(true);
        const dates = await getDatesOFS1412(olMap, geoserverQueryLayerUrl, layerName, attributeValue);
        if (dates.length > 0) {
            setS1412DataSetDates(dates);
        }
        updateIsLoading(false);
    };

    const handleCalendarChange = async (selectedDate) => {

        if (selectedDate instanceof Date && !isNaN(selectedDate)) {

            const isSlectedDate = selectedDate;
            updateIsLoading(true);
            updateSelectedCalenderDate(isSlectedDate);

            const response = await RunSailTimerApi(initialCoordinates.left, initialCoordinates.top, initialCoordinates.right,
                initialCoordinates.bottom, isSlectedDate, olMap, 'productFilter');
            updateIsLoading(false);

            if (response.data === 'Datetime of request is in the past') {
                toast.warn('No sail timer data available for selected date.')
                setlineButtonVisible(false);
                setPolygonButtonVisible(false);
                setPointButtonVisible(false);
                setRtzButtonVisible(false);
                setCalenderSelectedInfoSucess(false);
            }
            else if (response.status === 200) {
                setCalenderSelectedInfoSucess(true);
                setlineButtonVisible(true);
                setPolygonButtonVisible(true);
                setPointButtonVisible(true);
                setRtzButtonVisible(true);
            }
            setShowCalendarDialog(false);
            updateIsLoading(false);
        } else {
            toast.error('Invalid date:', selectedDate);
        }
    };

    const toggleGeometryButtons = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(false);
        setPointButtonActive(false);
        setRtzButtonActive(false);
    }

    return (
        <div>
            <Stack direction="horizontal" className='mt-3'>
                <div className="p-0">
                    <ButtonGroup className='mt-0'>
                        <StyledButton title='Line' id="btn-LineString" onClick={handleDrawLine} active={lineButtonActive} className={`drawBtn ${lineButtonActive ? 'active' : ''} ${lineButtonVisible ? '' : 'disabled'}`} disabled={!lineButtonVisible}>
                            <i className="bi bi-activity"></i>
                        </StyledButton>
                        <StyledButton title='Polygon' id="btn-Polygon" onClick={handleDrawPolygon} active={polygonButtonActive} className={`drawBtn ${polygonButtonActive ? 'active' : ''} ${polygonButtonVisible ? '' : 'disabled'}`} disabled={!polygonButtonVisible}>
                            <i className="bi bi-pentagon"></i>
                        </StyledButton>
                        <StyledButton title='Point' id="btn-Point" onClick={handleDrawPoint} active={pointButtonActive} className={`drawBtn ${pointButtonActive ? 'active' : ''} ${pointButtonVisible ? '' : 'disabled'}`} disabled={!pointButtonVisible}>
                            <i className="bi bi-geo-fill"></i>
                        </StyledButton>
                        <input ref={fileInputRef} type='file' accept='.rtz' onChange={handleFileChange} style={{ display: 'none' }} />
                        <StyledButton title='rtz' id='btn-Rtz' onClick={handleRtzFileClick} active={rtzButtonActive} className={`drawBtn ${rtzButtonActive ? 'active' : ''} ${rtzButtonVisible ? '' : 'disabled'}`} disabled={!rtzButtonVisible}>
                            <i className='bi bi-upload' />
                        </StyledButton>
                    </ButtonGroup>
                </div>

                <div className="p-0 ms-auto">
                    <StyledButton title='Calendar' className={`${calenderBtnVisible ? '' : 'disabled'}`} disabled={!calenderBtnVisible}
                        id="btn-Calender" onClick={handleOpenCalendar} ref={overlayCalenderRef} style={{ backgroundColor, color: textColor, borderColor }}>
                        <i className='bi bi-calendar'></i>
                    </StyledButton>
                    <Overlay show={showCalendarDialog} target={overlayCalenderRef.current} placement='bottom'>
                        <Popover id='popover-contained'>
                            <Popover.Body className='p-0'>
                                <Calendar selectedDate={selectedCalenderDate} dynamicDates={S1412DataSetDates} handleCalendarChange={handleCalendarChange} />
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </div>
            </Stack>
        </div>
    )
}

export default GeoTools;