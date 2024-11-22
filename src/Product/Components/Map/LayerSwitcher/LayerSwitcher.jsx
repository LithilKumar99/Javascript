import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Card, Form, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import './LayerSwitcher.css';
import { CloseButton, StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { useUtility } from '../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useColor } from '../../../../Context/ColorContext';
import { nodeServerUrl } from '../../../../appConfig';

import { id, isBuilder } from '../../../../Utils/AppDetails';
import { mapLayers } from '../../../../Utils/layersDataConfig';
import { getLayerExtent } from './layerExtent';

function LayerSwitcher() {

    const title = 'LayerSwitcher';

    const excludedLayers = {
        layer1: "S102 Bathy Raster",
        layer2: "BSH S102 Bathy Raster"
    };

    const { projectId: routeProjectId } = useParams();

    const selectedProjectId = routeProjectId === undefined ? id : routeProjectId;

    const { olMap, ConfigWMSLayerToMap, clearMapVectorLayerSource } = useContext(OLMapContext);

    const { backgroundColor, textColor, borderColor, typoColor, fontFamily, cardbodyColor } = useColor();

    const { toggleComponent, isLayerSwitcherButtonActive, updateLayerSwitcherFlag,
        isMapLayersList, updateMapLayersLists, isDepthFileterSelectedlayerFlag, updateDepthFileterSelectedlayerFlag,
        isDepthFileterSelectedlayer, } = useUtility();

    const [layerOpacities, setLayerOpacities] = useState({});
    const [layersList, setLayersList] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false)

    const fetchData = async () => {
        try {

            updateMapLayersLists(null);

            if (isBuilder) {
                const response = await fetch(`${nodeServerUrl}/layers/${selectedProjectId}`);
                const data = await response.json();
                if (data) {
                    const newLayerList = data.map(item => item.layer);
                    setLayersList(newLayerList);
                    const filteredLayers = newLayerList.filter(layer => !Object.values(excludedLayers).includes(layer));
                    setSelectedItems(filteredLayers);
                    updateMapLayersLists(data);
                    updateLayerVisibility(filteredLayers);
                }
                else {
                    toast.warn('error fetching layer list');
                }
            }
            else {
                if (mapLayers.length > 0) {
                    const layers = mapLayers.map((obj) => {
                        return obj.layer;
                    });
                    updateMapLayersLists(mapLayers);
                    setLayersList(layers);
                    const filteredLayers = layers.filter(layer => !Object.values(excludedLayers).includes(layer));
                    setSelectedItems(filteredLayers);
                    updateLayerVisibility(filteredLayers);
                }
            }
        } catch (error) {
            toast.warn('Error fetching layer data:', error);
        }
    };

    useEffect(() => {

        if (isDepthFileterSelectedlayerFlag === true && isDepthFileterSelectedlayer !== null) {

            const allLayers = layersList.filter(layer => !Object.values(excludedLayers).includes(layer));
            const layerConfig = isMapLayersList.find(lyr => lyr.layer === isDepthFileterSelectedlayer);

            if (layerConfig) {
                const newLayer = getLayerByName(isDepthFileterSelectedlayer);
                if (!newLayer) {
                    ConfigWMSLayerToMap(olMap, layerConfig.url, layerConfig.workspace, layerConfig.layer);
                }
            }

            allLayers.forEach(layer => {
                if (layer !== isDepthFileterSelectedlayer) {
                    const newLayer = getLayerByName(layer);
                    if (newLayer !== null) {
                        olMap.removeLayer(newLayer);
                    }
                }
            });

            const checkedLayer = layersList.filter(layer => layer == isDepthFileterSelectedlayer);
            setSelectedItems(checkedLayer);
            updateDepthFileterSelectedlayerFlag(false);
        }
    }, [isDepthFileterSelectedlayer, isDepthFileterSelectedlayerFlag]);

    useEffect(() => {
        if (updateLayerSwitcherFlag === true) {
            fetchData();
        }
    }, [updateLayerSwitcherFlag]);

    useEffect(() => {
        if (olMap) {
            var layerswitcherButtonList = document.getElementById('layerswitcherButtonList');
            const layerSwitcherContainer = document.getElementById('layerSwitcherContainer');
            if (layerswitcherButtonList && layerSwitcherContainer != null) {
                if (!layerswitcherButtonList.contains(layerSwitcherContainer)) {
                    layerswitcherButtonList.append(layerSwitcherContainer);
                }
            }
            const layerSwitcherInfoSidebar = document.getElementById('layerSwitcherInfoSidebar');
            var layerSwitcherSidebarConatiner = document.getElementById('layerSwitcherSidebarConatiner');
            if (layerSwitcherInfoSidebar != null && layerSwitcherSidebarConatiner != null) {
                layerSwitcherInfoSidebar.appendChild(layerSwitcherSidebarConatiner);
            }
            fetchData();
        }
    }, [olMap]);

    useEffect(() => {
        const selectableLayers = layersList.filter(layer => !Object.values(excludedLayers).includes(layer));
        const allSelected = selectableLayers.length > 0 && selectableLayers.length === selectedItems.length;
        setSelectAll(allSelected);
    }, [selectedItems]);

    function updateLayerVisibility(layers) {
        const allMapLayers = olMap.getLayers().getArray();
        allMapLayers.forEach(function (lyr) {
            const isOsmLayer = lyr.get('title').includes('OSM');
            if (!isOsmLayer) {
                const isVisible = layers.includes(lyr.get('title'));
                lyr.setVisible(isVisible);
            }
        });
    }

    const handleLayerSwitcher = () => {
        toggleComponent('LayerSwitcher');
    }

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);

        if (isChecked) {
            const allLayers = layersList.filter(layer => !Object.values(excludedLayers).includes(layer));
            setSelectedItems(allLayers);
            const allMapLayers = olMap.getLayers().getArray();
            allMapLayers.forEach(lyr => {
                if (lyr.get('title') !== 'OSM') {
                    olMap.removeLayer(lyr);
                }
            });

            allLayers.forEach(layer => {
                const layerConfig = isMapLayersList.find(lyr => lyr.layer === layer);
                if (layerConfig) {
                    const newLayer = getLayerByName(layer);
                    if (!newLayer) {
                        ConfigWMSLayerToMap(olMap, layerConfig.url, layerConfig.workspace, layerConfig.layer);
                    } else {
                        newLayer.setVisible(true);
                    }
                }
            });

        } else {
            const allLayers = layersList.filter(layer => !Object.values(excludedLayers).includes(layer));
            allLayers.forEach(layer => {
                const layerToRemove = getLayerByName(layer);
                if (layerToRemove) {
                    olMap.removeLayer(layerToRemove);
                }
            });
            setSelectedItems([]);
        }
        clearMapVectorLayerSource();
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const layers = olMap.getLayers().getArray();

        setSelectedItems((prevSelected) => {
            if (checked) {
                const layerExists = layers.some(lyr => value === lyr.get('title'));
                if (!layerExists) {
                    const layerConfig = isMapLayersList.find(lyr => lyr.layer === value);
                    if (layerConfig) {
                        ConfigWMSLayerToMap(olMap, layerConfig.url, layerConfig.workspace, layerConfig.layer);
                        const newLayer = getLayerByName(value);
                        newLayer.setVisible(true);
                    }
                }
                return [...prevSelected, value];
            } else {
                layers.forEach(function (lyr) {
                    if (value === lyr.get('title')) {
                        olMap.removeLayer(lyr);
                    }
                });
                return prevSelected.filter(item => item !== value);
            }
        });
        clearMapVectorLayerSource();
    };

    const handleOpacityChange = (event, lyr) => {
        const newOpacity = parseFloat(event.target.value);
        setLayerOpacities((prevOpacities) => ({
            ...prevOpacities,
            [lyr]: newOpacity,
        }));
    };

    const updateMap = (lyr) => {
        const allLayers = olMap.getLayers().getArray();
        if (allLayers.length > 0) {
            allLayers.forEach(function (layer) {
                if (layer.getVisible() && layer.get('title') === lyr) {
                    const opacity = layerOpacities[lyr] || 0;
                    layer.setOpacity(opacity);
                }
            });
        }
    };

    const handleButtonClick = (lyr) => {
        var buttons = document.querySelectorAll('.ZoomextentBtn');
        buttons.forEach(function (button) {
            if (button.id === lyr) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        if (olMap) {
            const allLayers = olMap.getLayers().getArray();
            if (allLayers.length > 0) {
                allLayers.forEach((layer) => {
                    if (layer.get('title') === lyr) {
                        const source = layer.getSource();
                        const params = source.getParams();
                        console.log("params: ", params)
                        var wmsUrl = source.getUrl();
                        getLayerExtent(wmsUrl, params.LAYERS, olMap);
                    }
                });
            }
        }
    };

    const handleDragStart = (index, e) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index, e) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedLayers = [...layersList];
        const draggedLayer = updatedLayers[draggedIndex];

        updatedLayers.splice(draggedIndex, 1);
        updatedLayers.splice(index, 0, draggedLayer);
        setLayersList(updatedLayers);
        setDraggedIndex(index);
        const baseLayer = olMap.getLayers().getArray()[0];
        olMap.getLayers().clear();
        olMap.addLayer(baseLayer);

        updatedLayers.forEach((layerName) => {
            const layerConfig = isMapLayersList.find((lyr) => lyr.layer === layerName);
            if (layerConfig) {
                const isLayerFound = selectedItems.includes(layerName);
                if (isLayerFound) {
                    ConfigWMSLayerToMap(olMap, layerConfig.url, layerConfig.workspace, layerConfig.layer);
                    const layer = getLayerByName(layerName);
                    layer.setVisible(true);
                } else {
                    ConfigWMSLayerToMap(olMap, layerConfig.url, layerConfig.workspace, layerConfig.layer);
                    const layer = getLayerByName(layerName);
                    olMap.removeLayer(layer);
                }
            }
        });
        clearMapVectorLayerSource();
    };

    const getLayerByName = (layerName) => {
        const layers = olMap.getLayers().getArray();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer.get('title') === layerName) {
                return layer;
            }
        }
        return null;
    };

    const handleCloseSideBar = () => {
        toggleComponent("default")
    }

    return (
        <div>
            <div id='layerSwitcherContainer' style={{ position: "relative" }}>
                <StyledMapControlButton title={title} id={title}
                    className={`p-1 mb-1 ${isLayerSwitcherButtonActive ? 'active' : ''}`}
                    onClick={handleLayerSwitcher}
                >
                    <i className="bi bi-layers" />
                </StyledMapControlButton>
            </div>

            <div id='layerSwitcherSidebarConatiner'>
                <Card className='layersList' style={{ fontFamily: fontFamily, borderColor: borderColor, backgroundColor: cardbodyColor }}>
                    <Card.Header className="pe-1" style={{ backgroundColor: backgroundColor, color: textColor }}>
                        <Stack direction='horizontal'>
                            <div className='mb-0'>
                                <i className="bi bi-layers me-2"></i>
                                Layer Switcher
                            </div>
                            <CloseButton onClick={handleCloseSideBar} id='popup-closer' className='ms-auto'>
                                <i className='bi bi-x'></i>
                            </CloseButton>
                        </Stack>
                    </Card.Header>
                    <Card.Body label="Layer switcher p-1"
                        style={{ position: 'relative', height: 'auto', minHeight: '100px', overflow: 'auto' }}>
                        <Form.Check style={{ borderColor: borderColor }} className='no-drag'>
                            <Form.Check.Input
                                type="checkbox"
                                onChange={handleSelectAllChange}
                                onClick={(e) => e.stopPropagation()}
                                checked={selectAll}
                                className="me-2"
                                style={{
                                    backgroundColor: selectAll ? backgroundColor : 'transparent',
                                    color: textColor,
                                    borderColor: 'rgb(157 151 151)'
                                }}
                            />
                            <Form.Check.Label title="Select All" style={{ color: typoColor, cursor: 'pointer' }}>Select All</Form.Check.Label>
                        </Form.Check>
                        <Accordion defaultActiveKey="0" className='layerlistAccord'>
                            {layersList.map((lyr, index) => {
                                return (
                                    <Accordion.Item key={index} eventKey={index} className='p-0' >
                                        <Accordion.Header
                                            key={index}
                                            onDragStart={(e) => handleDragStart(index, e)}
                                            onDragOver={(e) => handleDragOver(index, e)}
                                            cancel=".no-drag"
                                            draggable
                                            className='p-0'
                                        >
                                            <Form.Check style={{ borderColor: borderColor }} className='no-drag'>
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    name={lyr}
                                                    onChange={(event) => handleCheckboxChange(event, lyr)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    checked={(selectedItems && selectedItems.includes(lyr)) || false}
                                                    className="me-2"
                                                    id={`checkbox- ${lyr}`}
                                                    value={lyr}
                                                    style={{
                                                        backgroundColor: selectedItems?.includes(lyr) ? backgroundColor : 'transparent',
                                                        color: textColor,
                                                        borderColor: 'rgb(157 151 151)'
                                                    }}
                                                />
                                                <Form.Check.Label title={lyr} style={{ color: typoColor, cursor: 'pointer' }}>{lyr}</Form.Check.Label>
                                            </Form.Check>
                                        </Accordion.Header>
                                        <Accordion.Body className='px-1 py-2'>
                                            <div className='d-flex align-content-center align-items-center'>
                                                <StyledMapControlButton
                                                    className='me-3 py-1 px-2'
                                                    title='layer zoom extent'
                                                    id={lyr}
                                                    onClick={() => handleButtonClick(lyr)}
                                                >
                                                    <i className="bi bi-arrows-fullscreen"></i>
                                                </StyledMapControlButton>
                                                <Form.Range id="opacity-input"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={layerOpacities[lyr] || 1}
                                                    title='opacity'
                                                    onChange={(e) => handleOpacityChange(e, lyr)}
                                                    onClick={() => updateMap(lyr)}
                                                    className="me-2"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        '--track-color': backgroundColor,
                                                        '--thumb-color': backgroundColor,
                                                    }}
                                                ></Form.Range>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })}
                        </Accordion>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

export default LayerSwitcher;