import React, { useEffect, useState, createContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { useColor } from './ColorContext';
import { nodeServerUrl } from '../appConfig';
import { toast } from 'react-toastify';
import axios from 'axios';

var parser = new GeoJSON();
var allfeaturesList = [];
var featuresGeometry = [];

export const OLMapContext = createContext(undefined);

export const OLMapProvider = ({ children }) => {

    const { fillColor, strokeColor } = useColor();

    const [olMap, setOlMap] = useState(null);

    const [mapHeight, setMapHeight] = useState();

    const updateMapHeight = (value) => {
        setMapHeight(value);
    }

    const [inBuilder, setInBuilder] = useState();

    const updateInBuilder = (isValue) => {
        setInBuilder(isValue);
    }

    const [hamburgerMenuOpen, setHumburgerMenuOpen] = useState(true);

    const toggleHumburgerMenu = (value) => {
        setHumburgerMenuOpen(value)
    }

    const [islayerAdded, setLayerAdded] = useState(false);

    const updateIsLayerAdded = (value) => {
        setLayerAdded(value);
    }

    const [isFeatureInfoLoader, setIsFeatureInfoLoader] = useState(false);

    const updateFeatureInfoLoader = (isValue) => {
        setIsFeatureInfoLoader(isValue)
    }

    /**
        * Initializes the OpenLayers map instance and sets it to state.
        * This effect is run once when the component mounts. It creates an OpenLayers map (`olMap`) 
        * with customized interactions and controls:
        * 1. All default interactions are included, but double-click zoom is disabled.
        * 2. A custom pointer interaction is added to prevent the default zoom behavior on double-clicks.
        * 
        * The map instance (`olMap`) is then stored in the component state via `setOlMap` for further use.
    */
    useEffect(() => {
        const olMap = new Map({
            controls: [],
            interactions: defaultInteractions({ doubleClickZoom: false })
                .extend([
                    new PointerInteraction({
                        handleDoubleClickEvent: (event) => {
                            event.preventDefault();
                        },
                    }),
                ]),
        });

        setOlMap(olMap);

    }, []);

    /**
        * Configures and adds a WMS layer to the OpenLayers map.
        * This function creates a WMS source with the given parameters (WMS URL, workspace, and layer name), 
        * then creates a corresponding image layer and adds it to the map.
        * 
        * @param {Object} olMap - The OpenLayers map object where the layer will be added.
        * @param {string} wmsUrl - The base URL of the WMS service.
        * @param {string} workspace - The workspace (namespace) in the WMS service.
        * @param {string} layerName - The name of the layer to be loaded from the WMS service.
    */

    const ConfigWMSLayerToMap = (olMap, wmsUrl, workspace, layerName) => {

        const wmsSource = new ImageWMS({
            url: wmsUrl,
            params: {
                LAYERS: `${workspace}:${layerName}`,
                TILED: false,
            },
            serverType: "geoserver",
        });

        const wmsLayer = new ImageLayer({
            title: layerName,
            visible: true,
            source: wmsSource,
        });

        olMap.addLayer(wmsLayer);
    };

    /**
        * Updates the `isPreviousExtend` state with the current map extent.
        * This function calculates the current extent of the map's view, using the map size,
        * and adds the new extent to the state array `isPreviousExtend`.
     */
    const [isPreviousExtend, setIsPreviousExtend] = useState([]);

    const updatePreviousExtend = () => {
        if (olMap) {
            const isExtent = olMap.getView().calculateExtent(olMap.getSize());
            setIsPreviousExtend((prevExtent) => [
                ...prevExtent,
                isExtent,
            ]);
        }
    };

    /**
        * Updates the `isNextExtend` state with the current map extent.
        * This function retrieves the current extent of the map's view, calculates it using the map size, 
        * and adds the new extent to the state array `isNextExtend`.
    */

    const [isNextExtend, setIsNextExtend] = useState([]);

    const updateNextExtend = () => {
        if (olMap) {
            const isExtent = olMap.getView().calculateExtent(olMap.getSize());
            setIsNextExtend((prevExtent) => [
                ...prevExtent,
                isExtent,
            ]);
        }
    };

    /**
         * Stops and removes the drawing interaction from the OpenLayers map.
         * This function checks for an active `Draw` interaction, finishes the drawing if active,
         * deactivates it, and removes the interaction from the map.
    */

    const stopDrawAction = () => {
        if (olMap) {
            const interactions = olMap.getInteractions().getArray();
            interactions.forEach(interaction => {
                if (interaction instanceof Draw) {
                    if (interaction.getActive()) {
                        interaction.finishDrawing();
                        interaction.setActive(false);
                        olMap.removeInteraction(interaction);
                    }
                }
            });
        }
    };

    /**
         * Clears and removes all vector layers from the OpenLayers map.
         * This function checks for vector layers with a `VectorSource`, clears their data, 
         * removes the layers, and triggers a re-render of the map.
    */
    const clearMapVectorLayerSource = () => {

        if (!olMap) {
            console.warn("OpenLayers map instance not found");
            return;
        }

        const layers = olMap.getLayers().getArray();

        layers.forEach(layer => {
            if (layer instanceof VectorLayer && layer.getSource() instanceof VectorSource) {
                layer.getSource().clear();
                olMap.removeLayer(layer);
            }
        });
        olMap.render();
    }

    /**
        * Converts a hexadecimal color string to an RGBA color string with the specified alpha transparency.
        * 
        * @param {string} hex - The hexadecimal color code (e.g., '#FF5733').
        * @param {number} alpha - The alpha value (opacity) for the color (between 0 and 1).
        * @returns {string} - The RGBA color string (e.g., 'rgba(255, 87, 51, 0.5)').
    */

    const hexToRgba = (hex, alpha) => {
        const hexColor = hex.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    /**
        * Defines the style for highlighting features on the map.
        * This style includes a fill color, stroke color, and a custom circle style for the image.
        * The `hexToRgba` function is used to convert hex color values to RGBA format with specified opacity.
    */

    const featureInformationStyles = new Style({
        fill: new Fill({
            color: hexToRgba(fillColor, 0.1),
        }),
        stroke: new Stroke({
            color: hexToRgba(strokeColor, 0.5),
            width: 3,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: hexToRgba(strokeColor, 0.7),
            }),
            fill: new Fill({
                color: hexToRgba(fillColor, 0.7),
            }),
        }),
    });

    /**
        * create and returns a vector layer to highlight selected features on the map.
        * The function creates a new `VectorLayer`, applies the `featureInformationStyles` to it,
        * and adds features to the layer's source based on the provided `data`.
        *
        * @param {Object} data - The data containing the features to be highlighted.
        * @returns {VectorLayer} - The vector layer containing the highlighted features.
     */

    const createHighlightedFeaturesLayer = (data) => {
        //previous function name is renderHighlightedFeatures
        const vectorLayer = new VectorLayer({
            source: new VectorSource(),
            title: "Highlight-selected-Features",
            style: featureInformationStyles,
        });
        if (data) {
            try {
                const features = parser.readFeatures(data);
                vectorLayer.getSource().addFeatures(features);
            } catch (error) {
                console.error("Error parsing features:", error);
            }
        }

        return vectorLayer;
    };

    /**
        * Handles the click event on the map, retrieves features based on the click coordinates,
        * and highlights those features on the map.
        * 
        * @param {Object} event - The click event object from the map.
        * @param {string} componentType - The type of component triggering the feature info request (e.g., 'featureInfo').
        * @returns {Object} - An object containing the list of feature properties (`features`) and their geometries (`geometry`).
     */

    const getMapClickFeatures = async (event, componentType) => {
        clearMapVectorLayerSource();
        stopDrawAction();
        var layers = olMap.getLayers().getArray();
        featuresGeometry = [];
        allfeaturesList = [];
        updateFeatureInfoLoader(true);

        const promises = layers.map(async (lyr) => {
            if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                if (lyr.getVisible() === true && lyr.get('title') !== '124_NavAreas') {
                    var viewResolution = event.target.getView().getResolution();
                    var featureUrl = lyr
                        .getSource()
                        .getFeatureInfoUrl(event.coordinate, viewResolution, "EPSG:3857", {
                            INFO_FORMAT: "application/json",
                            FEATURE_COUNT: 20
                        });

                    if (featureUrl) {
                        const queryParams = { param: featureUrl };
                        try {

                            const res = await axios.get(`${nodeServerUrl}/getFeatures`, { params: queryParams });
                            // const res = await axios.get(featureUrl);

                            if (res.data.features) {
                                const lyrTitle = lyr.get('title');
                                if (Array.isArray(res.data.features) && res.data.features.length > 0) {
                                    featuresGeometry.push(res.data.features);
                                    for (let index = 0; index < res.data.features.length; index++) {
                                        let properties = res.data.features[index].properties;
                                        properties.layerName = lyrTitle;
                                        allfeaturesList.push(properties);
                                    }
                                }
                            }

                            if (allfeaturesList.length > 0) {
                                const vectorLayer = createHighlightedFeaturesLayer(res.data);

                                if (componentType === 'featureInfo') {
                                    const features = vectorLayer.getSource().getFeatures();
                                    if (features.length > 0) {
                                        const geometry = features[0].getGeometry();
                                        let center;

                                        switch (geometry.getType()) {
                                            case 'Point':
                                                center = geometry.getCoordinates();
                                                break;
                                            case 'LineString':
                                                center = geometry.getCoordinates()[Math.floor(geometry.getCoordinates().length / 2)];
                                                break;
                                            case 'Polygon':
                                                center = geometry.getInteriorPoint().getCoordinates();
                                                break;
                                            default:
                                                center = geometry.getCoordinates()[0];
                                                break;
                                        }

                                        olMap.getView().setCenter(center);
                                    }
                                }
                                olMap.addLayer(vectorLayer);
                            }

                        } catch (error) {
                            console.log(`Error while getting features based on given coordinates from ${componentType}`);
                            toast.info(`features are not available for this  coordinates from ${componentType}`);
                        }
                    }
                }
            }
        });

        await Promise.all(promises);
        updateFeatureInfoLoader(false);
        return { features: allfeaturesList, geometry: featuresGeometry };
    };

    /**
    * Retrieves all visible layers of type ImageLayer with an ImageWMS source from the OpenLayers map.
    * Filters out layers that are not visible or have a specific title (e.g., 'S124Navarea').
    * 
    * Steps:
    * 1. Get all layers from the OpenLayers map.
    * 2. Iterate over each layer and check if it's an ImageLayer with an ImageWMS source.
    * 3. Check if the layer is visible on the map.
    * 4. Skip the layer if its title matches a predefined value ('S124Navarea').
    * 5. Collect the titles of all visible layers in a Set (to ensure uniqueness).
    * 6. Return an array of unique titles of visible layers.
    * 
    * @returns {Array} - An array of titles for all visible ImageWMS layers on the map, excluding those with the title 'S124Navarea'.
    */
    const getAllVisibleLayers = () => {
        if (olMap) {
            const allLayers = olMap.getLayers().getArray();
            const visibleLayerTitles = new Set();

            for (let i = 0; i < allLayers.length; i++) {
                const layer = allLayers[i];
                if (layer instanceof ImageLayer && layer.getSource() instanceof ImageWMS) {
                    if (layer.getVisible() === true) {
                        const title = layer.get('title');
                        if (title !== 'S-124_NavAreas') {
                            visibleLayerTitles.add(title);
                        }
                    }
                }
            }

            return Array.from(visibleLayerTitles);
        }
    };

    /**
        * Highlights the selected feature on the OpenLayers map by adding it to a new vector layer.
        * The function parses the provided GeoJSON data, creates a vector layer, and adjusts the map view 
        * to focus on the extent of the highlighted feature.
        *
        * @param {Object} olMap - The OpenLayers map instance on which the feature will be highlighted.
        * @param {Object} _data - The GeoJSON data representing the feature to be highlighted.
        *                   This data is expected to be in the format that OpenLayers can parse.
        * 
        * @returns {void} - This function does not return any value, but modifies the map state.
    */

    const hightLightSelectedFeature = (olMap, _data) => {
        if (_data && olMap) {
            const vectorLayer = new VectorLayer({
                title: 'Highlight-Vector-Layer',
                source: new VectorSource(),
                style: featureInformationStyles,
            });
            var features = parser.readFeatures(_data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            vectorLayer.getSource().addFeatures(features);
            var extent = vectorLayer.getSource().getExtent();
            olMap.getView().fit(extent, {
                padding: [250, 250, 350, 250], minResolution: 10,
                duration: 1000
            });
            olMap.addLayer(vectorLayer);
        }
    }

    return (
        <>
            <OLMapContext.Provider value={{
                olMap, updateMapHeight, mapHeight, hamburgerMenuOpen, toggleHumburgerMenu,
                islayerAdded, updateIsLayerAdded, inBuilder, updateInBuilder, ConfigWMSLayerToMap,
                isPreviousExtend, updatePreviousExtend, isNextExtend, updateNextExtend, stopDrawAction,
                clearMapVectorLayerSource, createHighlightedFeaturesLayer, isFeatureInfoLoader, getMapClickFeatures,
                getAllVisibleLayers, hightLightSelectedFeature
            }}>
                {children}
            </OLMapContext.Provider>
        </>
    )
};

