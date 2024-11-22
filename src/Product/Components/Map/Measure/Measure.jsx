import React, { useEffect, useState, useContext, useRef } from 'react'
import { Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { LineString, Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
import { TbRulerMeasure } from "react-icons/tb";
import { toast } from 'react-toastify';
import PopoverFooterWrapper, { StyledButton, StyledPopover, StyledMapControlButton, CloseButton } from '../../../Reusable/StyledComponent.jsx';
import { OLMapContext } from '../../../../Context/OlMapContext.jsx';
import { useUtility } from '../../../../Context/UtilityContext.jsx';
import { useColor } from '../../../../Context/ColorContext.jsx';

let draw, sketch;
let helpTooltipElement, helpTooltip, measureTooltipElement, measureTooltip;
var drawCount = 0;

function Measure() {

    const { isMeasureAreaWindowVisible, toggleComponent } = useUtility();
    const [title] = useState('Measure');
    const { backgroundColor, textColor, borderColor } = useColor();

    const { olMap, stopDrawAction, clearMapVectorLayerSource } = useContext(OLMapContext);
    const measureRefButton = useRef(null);

    const [selectedType, setSelectedType] = useState('length');
    const [selectedUnits, setSelectedUnits] = useState('Select');

    useEffect(() => {
        var measureButtonList = document.getElementById('measureButtonList');
        const measureAreaToolContainer = document.getElementById('measureAreaToolContainer');
        if (measureButtonList && measureAreaToolContainer) {
            measureButtonList.append(measureAreaToolContainer);
        }

    }, [olMap]);

    const formatLength = function (line) {
        const length = line.getLength();
        const conversionFactor = getConversionFactor(selectedUnits);
        const unitAbbreviation = (selectedUnits === 'meters') ? ' meters' : (selectedUnits === 'km') ? ' km' : (selectedUnits === 'miles') ? ' miles' : (selectedUnits === 'feet') ? ' feet' : '';

        const output = (Math.round(length * conversionFactor * 100) / 100).toFixed(2) + unitAbbreviation;
        return output;
    };

    const formatArea = function (polygon) {
        const area = polygon.getArea();
        const conversionFactor = getConversionFactor(selectedUnits);
        const unitAbbreviation = (selectedUnits === 'meters') ? ' meters²' : (selectedUnits === 'km') ? ' km²' : (selectedUnits === 'miles') ? ' miles²' : (selectedUnits === 'feet') ? ' feet²' : '';

        const output = (Math.round(area * conversionFactor * 100) / 100).toFixed(2) + unitAbbreviation;
        return output;
    };

    const getConversionFactor = (unit) => {
        switch (unit) {
            case 'km':
                return 0.001;
            case 'miles':
                return 0.000621371;
            case 'feet':
                return 3.28084;
            case 'meters':
                return 1;
            default:
                return 1;
        }
    };

    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        olMap.addOverlay(helpTooltip);
    }

    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        olMap.addOverlay(measureTooltip);
    }

    const style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
        }),
    })

    function addInteraction(source, measureBtn) {

        if ((selectedType === "Select" && selectedUnits === "Select") ||
            (selectedType === "Select Type" && selectedUnits === "Select Unit")) {

            toast.warn("Please select valid measure type and unit.");
        } else if (selectedType === "Select Type" || selectedType === "Select") {

            toast.warn("Please select valid measure type.");
        } else if (selectedUnits === "Select Unit" || selectedUnits === "Select") {
            toast.warn("Please select valid measure unit.");
        } else {
            const type = selectedType === 'area' ? 'Polygon' : 'LineString';
            draw = new Draw({
                source: source,
                type: type,
                style: function (feature) {
                    const geometryType = feature.getGeometry().getType();
                    if (geometryType === type || geometryType === 'Point') {
                        return style;
                    }
                },
            });
            olMap.addInteraction(draw);

            createMeasureTooltip();
            createHelpTooltip();

            let listener;

            draw.on('drawstart', function (evt) {
                sketch = evt.feature;

                let tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function (evt) {
                    const geom = evt.target;
                    let output;
                    if (geom instanceof Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });

            draw.on('drawend', function () {
                drawCount++;
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                sketch = null;
                measureTooltipElement = null;
                createMeasureTooltip();
                unByKey(listener);
                stopDrawAction();
                measureBtn.classList.remove('active');
            });
        }
    }

    const handleMeasureArea = () => {
        toggleComponent(title);
    }

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleUnitsChange = (event) => {
        setSelectedUnits(event.target.value);
    };

    const handleListClear = () => {
        if (measureTooltipElement) {
            stopDrawAction();
            measureTooltipElement.innerHTML = "";
            const tooltips = document.querySelectorAll(".ol-tooltip");
            measureTooltip.setPosition(undefined);

            if (tooltips && helpTooltip) {
                tooltips.forEach(tooltip => {
                    tooltip.style.display = "none";
                });

                helpTooltip.setPosition(undefined);
                olMap.removeOverlay(helpTooltip);
            }

            const tooltipStatic = document.querySelectorAll(".ol-tooltip-static");

            if (tooltipStatic) {
                tooltipStatic.forEach(tooltip => {
                    tooltip.style.display = "none";
                });
            }

            for (let index = 0; index <= drawCount; index++) {
                clearMapVectorLayerSource();
            }
            drawCount = 0;
            clearComboxFileds();
            const measureBtn = document.getElementById('measureBtn');
            if (measureBtn) {
                measureBtn.classList.remove('active');
            }
        } else {
            clearComboxFileds();
        }
    };

    const clearComboxFileds = () => {
        setSelectedType("");
        setSelectedUnits("");
        setSelectedType("Select Type");
        setSelectedUnits("Select Unit");
    };

    const handleDraw = () => {
        const measureBtn = document.getElementById('measureBtn');
        if (measureBtn) {
            measureBtn.classList.add('active');

            const vectorSource = new VectorSource();
            const vectorLayer = new VectorLayer({
                source: vectorSource,
                style: new Style({
                    fill: new Fill({
                        color: "rgba(255, 255, 255, 0.2)",
                    }),
                    stroke: new Stroke({
                        color: "#ffcc33",
                        width: 2,
                    }),
                }),
            });
            addInteraction(vectorSource, measureBtn);
            olMap.addLayer(vectorLayer);
        }
    };

    const handleClose = () => {
        clearComboxFileds();
        toggleComponent("default")
        handleListClear();
    }

    return (
        <div id='measureAreaToolContainer' style={{ position: "relative" }}>
            <OverlayTrigger
                trigger="click"
                key="bottom"
                placement="auto"
                className="w-75 position-absolute"
                show={isMeasureAreaWindowVisible}
                overlay={
                    <StyledPopover style={{
                        width: '400px',
                        height: 'auto',

                    }}>
                        <Popover.Header as="h6" className='d-flex justify-content-between align-items-center pe-2'
                            style={{ color: textColor, backgroundColor: backgroundColor, borderColor: borderColor }}>
                            <TbRulerMeasure className="me-2" style={{ width: '24px', height: '24px', position: 'relative', bottom: '3px' }} />
                            Measure
                            <CloseButton
                                className='ms-auto'
                                onClick={handleClose}
                            ><i className='bi bi-x'></i>
                            </CloseButton>
                        </Popover.Header>
                        <Popover.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Select value={selectedType} onChange={handleTypeChange} id="type"
                                        style={{ borderColor: borderColor }}>
                                        <option value="Select">Select Type</option>
                                        <option value="length">Distance</option>
                                        <option value="area">Area</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Select value={selectedUnits} onChange={handleUnitsChange} id="units"
                                        style={{ borderColor: borderColor }}>
                                        <option value="Select">Select Unit</option>
                                        <option value="meters">Meters</option>
                                        <option value="km">Kilometers</option>
                                        <option value="miles">Miles</option>
                                        <option value="feet">Feet</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </Popover.Body>
                        <PopoverFooterWrapper>
                            <StyledButton ref={measureRefButton} onClick={handleDraw} id="measureBtn">Measure</StyledButton>
                            <StyledButton
                                className="ms-2" id="btn-Clear" onClick={handleListClear}>
                                Clear
                            </StyledButton>
                        </PopoverFooterWrapper>
                    </StyledPopover>
                }
            >
                <StyledMapControlButton title={title} id={title} className='p-1 mb-1' onClick={(e) => handleMeasureArea(e)}>
                    <TbRulerMeasure style={{ width: '24px', height: '24px', position: 'relative', bottom: '3px' }} />
                </StyledMapControlButton>
            </OverlayTrigger >

        </div>
    );
}

export default Measure;