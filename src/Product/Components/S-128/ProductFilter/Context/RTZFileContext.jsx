import React, { createContext, useContext, useState } from 'react';
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image.js';
import axios from 'axios';
import GeoJSON from 'ol/format/GeoJSON.js';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import { get as getProjection } from 'ol/proj';
import { transform } from 'ol/proj';
import { toast } from 'react-toastify';

import {
    createStylingVectorLayerWithStyles, createVectorLayerWithFeatures,
    findVectorLayerByTitle, rtzGeometryHighlightStyles, rtzWayGeometryStyles
}
    from '../Utils/OpenLayersUtils/OpenLayers.js';

import { S1412windLayer } from '../../config.js';
import { OLMapContext } from '../../../../../Context/OlMapContext.jsx';
import { useProductFilter } from './ProductFilterContext.jsx';
import { nodeServerUrl } from '../../../../../appConfig.js';

export const RTZFileContext = createContext();

export const RTZFileProvider = ({ children }) => {

    const { olMap } = useContext(OLMapContext);

    const { selectedMapLayer, cqlFilterString, selectedCalenderDate } = useProductFilter();

    const [rtzFileCoordinates, setRTZFileCoordinates] = useState([]);

    const clearRtZFileCoordinates = () => {
        setRTZFileCoordinates([]);
    }

    const getQueryLayerUrl = (lyrName) => {
        let layerUrl;
        const layersList = olMap.getLayers().getArray();

        const targetLayer = layersList.find(lyr =>
            lyr instanceof ImageLayer &&
            lyr.getSource() instanceof ImageWMS &&
            lyrName === lyr.get('title') &&
            lyr.getVisible() === true
        );

        if (targetLayer) {
            layerUrl = targetLayer.getSource().getUrl();
            if (layerUrl !== null && layerUrl !== undefined) {
                return layerUrl;
            }
        } else {
            toast.warn('Target layer not found or is not visible.');
        }

        return layerUrl;
    }


    const processWaypointFeatures = async (waypointFeatures) => {

        const lineStringFeatures = createLineStringFeatures(waypointFeatures);
        const { pointStyle, lineStringStyle } = rtzWayGeometryStyles();

        waypointFeatures.forEach(feature => feature.setStyle(pointStyle));
        lineStringFeatures.forEach(feature => feature.setStyle(lineStringStyle));

        const vectorLayer = createVectorLayerWithFeatures([...lineStringFeatures, ...waypointFeatures]);
        vectorLayer.set('name', 'RTZLayer');
        vectorLayer.set('title', 'RTZFileLayer');

        olMap.addLayer(vectorLayer);
        const extent = vectorLayer.getSource().getExtent();
        olMap.getView().fit(extent, { padding: [200, 200, 200, 200] });

        const rztGeometryHighLightVector = createStylingVectorLayerWithStyles(rtzGeometryHighlightStyles);
        olMap.addLayer(rztGeometryHighLightVector);

        try {
            const data = await processIntersectingFeatures(vectorLayer, rztGeometryHighLightVector);

            return data;
        } catch (error) {
            throw error;
        }
    };

    const processRTZFile = async (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                toast.warn('No file selected.')
                return resolve([]);
            }

            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const rtzData = event.target.result;
                    const result = parseRTZXML(rtzData);
                    const waypointFeatures = result.features;
                    setRTZFileCoordinates(result.coordinates);

                    if (rtzFileCoordinates.length > 0) {
                        const foundLayer = findVectorLayerByTitle(olMap, 'RTZFileLayer');
                        if (foundLayer) {
                            foundLayer.getSource().clear();
                            olMap.removeLayer(foundLayer);
                            olMap.render();
                            setTimeout(async () => {
                                try {
                                    const data = await processWaypointFeatures(waypointFeatures);
                                    resolve(data);
                                } catch (error) {
                                    reject(error);
                                }
                            }, 1500);
                        }

                    } else {
                        if (waypointFeatures.length > 0) {
                            const data = await processWaypointFeatures(waypointFeatures);
                            resolve(data);
                        } else {
                            toast.warn('No Results found.');
                            resolve([]);
                        }
                    }
                } catch (error) {
                    toast.warn('Error processing RTZ file.');
                    reject(error);
                }
            };

            reader.onerror = (event) => {
                toast.warn('Error reading RTZ file.');
                reject(event.target.error);
            };

            reader.readAsText(file);
        });
    };

    const processIntersectingFeatures = async (vectorLayer, highLightVectorLayer) => {

        var wfsUrl;
        var featureslist;
        try {
            if (cqlFilterString === 'UnSelectedAll') {
                toast.warn('Kindly select the usage band..');
                return [];
            }

            const layerName = selectedMapLayer;

            const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);

            const propertyName = 'producercode,country_code,producttype,featurename,chartnumber,compilationscale,polygon';

            if (layerName === S1412windLayer) {
                wfsUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json&cql_filter=${encodeURIComponent(cqlFilterString)}`;
            }
            else {
                wfsUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json&cql_filter=${encodeURIComponent(cqlFilterString)}&propertyName=${propertyName}`;
            }

            const queryParams = { param: wfsUrl };

            const res = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });

            const geoJSONData = res.data.features;

            const features = vectorLayer.getSource().getFeatures();
            const sourceProjection = vectorLayer.getSource().getProjection() || getProjection('EPSG:3857');

            const intersectingFeatures = features.flatMap(vectorFeature => {
                const vectorGeometry = vectorFeature.getGeometry();
                const intersectingFeaturesForVector = [];

                geoJSONData.forEach(geoJSONFeature => {
                    if (geoJSONFeature.geometry) {
                        const geoJSONGeometry = new GeoJSON().readGeometry(geoJSONFeature.geometry);
                        const transformedVectorGeometry = vectorGeometry.clone().transform(sourceProjection, 'EPSG:4326');

                        if (transformedVectorGeometry.intersectsExtent(geoJSONGeometry.getExtent())) {
                            intersectingFeaturesForVector.push(geoJSONFeature);
                        }
                    } else {
                        console.warn('Invalid GeoJSON feature:', geoJSONFeature);
                    }
                });

                return intersectingFeaturesForVector;
            });

            const geometryFeaturesData = intersectingFeatures.map(feature => {
                const properties = { ...feature.properties };
                if (layerName === S1412windLayer) {

                    const formatdate = new Date(selectedCalenderDate);
                    const day = ('0' + formatdate.getDate()).slice(-2);
                    const month = ('0' + (formatdate.getMonth() + 1)).slice(-2);
                    const year = formatdate.getFullYear();
                    const formattedDateString = `${day}-${month}-${year}`;
                    properties.Date = formattedDateString;
                }
                return properties;
            });

            if (geometryFeaturesData.length > 0) {
                const geoJsonFormat = new GeoJSON();
                featureslist = geoJsonFormat.readFeatures(
                    {
                        type: 'FeatureCollection',
                        features: intersectingFeatures,
                    },
                    {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857',
                    }
                );
                highLightVectorLayer.getSource().addFeatures(featureslist);
            } else {
                showAlert('warning', 'Product filter', 'No results found..!');
            }

            return geometryFeaturesData;

        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    };

    const createLineStringFeatures = (waypointFeatures) => {
        const lineStringFeatures = [];

        for (let i = 0; i < waypointFeatures.length - 1; i++) {
            const currentPoint = waypointFeatures[i].getGeometry().getCoordinates();
            const nextPoint = waypointFeatures[i + 1].getGeometry().getCoordinates();
            const lineString = new LineString([currentPoint, nextPoint]);

            const lineStringFeature = new Feature({
                geometry: lineString,
            });

            lineStringFeatures.push(lineStringFeature);
        }

        return lineStringFeatures;
    };

    function parseRTZXML(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const waypoints = xmlDoc.getElementsByTagName('waypoint');
        const features = [];
        const coordinates = []

        for (let i = 0; i < waypoints.length; i++) {
            const waypoint = waypoints[i];
            const name = waypoint.getAttribute('name');
            const position = waypoint.getElementsByTagName('position')[0];

            if (position) {
                const lat = parseFloat(position.getAttribute('lat'));
                const lon = parseFloat(position.getAttribute('lon'));

                if (!isNaN(lat) && !isNaN(lon)) {

                    coordinates.push({
                        lat: lat,
                        lon: lon,
                    })
                    const transformedCoordinates = transform(
                        [lon, lat],
                        'EPSG:4326',
                        'EPSG:3857'
                    );

                    const feature = new Feature({
                        geometry: new Point(transformedCoordinates),
                        name: name || 'Unnamed Waypoint',
                    });

                    features.push(feature);
                }
            }
        }
        return { features: features, coordinates: coordinates };
    }

    return (
        <RTZFileContext.Provider
            value={{
                processRTZFile,
                clearRtZFileCoordinates
            }}
        >
            {children}
        </RTZFileContext.Provider>
    );
};









