import React, { useRef, useEffect, useContext, useState } from 'react';
import 'ol/ol.css';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './OlMap.css';
import classNames from 'classnames';
import { OLMapContext } from '../../../../Context/OlMapContext.jsx';
import HumburgerMenu from '../../../utils/HumburgerMenu.jsx';
import { nodeServerUrl } from '../../../../appConfig.js';
import { useUtility } from '../../../../Context/UtilityContext.jsx';
import { useColor } from '../../../../Context/ColorContext.jsx';
import { mapLayers } from '../../../../Utils/layersDataConfig.js';
import { id, isBuilder, olMapHeight } from '../../../../Utils/AppDetails.jsx';

function OlMap() {

    const { projectId: routeProjectId } = useParams();

    const selectedProjectId = routeProjectId === undefined ? id : routeProjectId;

    const { olMap, mapHeight, ConfigWMSLayerToMap } = useContext(OLMapContext);

    const { isFeatureInfoSidebarVisible, isLayerSwitcherSidebarVisible,
        isProductFilterSidebarVisible, isNavWarningsSidebarVisible } = useUtility();

    const { fetchAndCreateProperty, getPropertyBasedOnProjectId } = useColor();

    const mapRef = useRef(null);

    const [layersData, setLayersData] = useState(null);

    useEffect(() => {
        if (olMap) {
            var view = new View({
                center: [0, 0],
                zoom: 1,
            });
            var lyr = new TileLayer({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new OSM(),
            });

            olMap.setView(view);
            olMap.addLayer(lyr);
            olMap.on('loadstart', function () { olMap.getTargetElement().classList.add('spinner'); });
            olMap.on('loadend', function () { olMap.getTargetElement().classList.remove('spinner'); });
            if (mapRef.current) {
                olMap.setTarget(mapRef.current);
            }
        }

    }, [olMap]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                if (isBuilder) {
                    const response = await axios.get(`${nodeServerUrl}/layers/${selectedProjectId}`);
                    if (response) {
                        setLayersData(response.data);
                    }
                }
                else {
                    if (mapLayers.length > 0) {
                        setLayersData(mapLayers);
                    }
                }
            } catch (error) {
                toast.warn('Error fetching layer data:', error);
            }
        };

        fetchData();
        setTimeout(async () => {
            if (isBuilder) {
                const propertices = await getPropertyBasedOnProjectId(selectedProjectId)
                if (propertices.length == 0) {
                    fetchAndCreateProperty(selectedProjectId);
                }
            }
        }, 200);

    }, [selectedProjectId]);

    useEffect(() => {
        if (layersData && olMap) {
            const selectedLayers = layersData.filter(layer =>
                layer.layer !== "S102 Bathy Raster" && layer.layer !== "BSH S102 Bathy Raster"
            );

            if (selectedLayers.length > 0) {
                selectedLayers.forEach((layerData) => {
                    ConfigWMSLayerToMap(olMap, layerData.url, layerData.workspace, layerData.layer);
                });
            }
        }
    }, [layersData, olMap]);


    return (
        <Container fluid className='main-content px-0'>
            <div
                ref={mapRef}
                id="map-container"
                style={{ height: `${mapHeight ? `${mapHeight}px` : `${olMapHeight}px`}` }}
                className={classNames('map-container', {
                    'active': isFeatureInfoSidebarVisible || isLayerSwitcherSidebarVisible || isNavWarningsSidebarVisible || isProductFilterSidebarVisible,
                    's124-nav-warning': isNavWarningsSidebarVisible,
                })}
            >
                <HumburgerMenu />
            </div>
            <div id='featureInfoSidebar' className={`sideBar ${isFeatureInfoSidebarVisible ? 'active' : ''}`} style={{ display: isFeatureInfoSidebarVisible ? 'block' : 'none' }} ></div>
            <div id='layerSwitcherInfoSidebar' className={`sideBar ${isLayerSwitcherSidebarVisible ? 'active' : ''}`} style={{ display: isLayerSwitcherSidebarVisible ? 'block' : 'none' }}></div>
            <div id='productFilterInfoSidebar' className={`sideBar ${isProductFilterSidebarVisible ? 'active' : ''}`} style={{ display: isProductFilterSidebarVisible ? 'block' : 'none' }}></div>
            <div id='navWarningsInfoSidebar' className={`sideBar ${isNavWarningsSidebarVisible ? 'active' : ''}`} style={{ display: isNavWarningsSidebarVisible ? 'block' : 'none' }}></div>
        </Container>
    )
}

export default OlMap;