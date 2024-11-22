import React, { useEffect, useRef, useContext, useImperativeHandle, useState } from 'react';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Zoom, Control } from 'ol/control';
import { Draw } from 'ol/interaction';
import './MapPreview.css';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat } from 'ol/proj';
import { transform } from 'ol/proj';
import { LocalAreaMapPreviewContext } from './MapPreviewContext';

class DrawPolygonButton extends Control {
    constructor(options) {
        const button = document.createElement('button');
        button.innerHTML = '<i class="bi bi-pentagon"></i>';
        button.onclick = options.handleClick;
        button.setAttribute('aria-label', 'Draw Polygon');
        const element = document.createElement('div');
        element.className = 'draw-polygon-button';
        element.style.cursor = 'pointer';
        element.appendChild(button);
        super({ element: element });
    }
}

const MapPreview = React.forwardRef(({ mapHeight, isLocalArea, localAreaCoordinates, isEditMode }, ref) => {

    const { map, updateDrawCoordinates, updateMapHeightFlag, mapHeightFlag } = useContext(LocalAreaMapPreviewContext);

    const [mapPreviewHeight, setMapPreviewHeight] = useState('');

    const mapRef = useRef();
    const draw = useRef(null);

    const vectorSource = useRef(new VectorSource());
    const vectorLayer = useRef(new VectorLayer({ source: vectorSource.current }));
    const [isDrawingActive, setIsDrawingActive] = useState(false);
    const dragCleanupRef = useRef(null);

    useEffect(() => {
        if (mapHeightFlag === true) {
            setMapPreviewHeight("540px");
        } else {
            setMapPreviewHeight(mapHeight);
        }
    }, [updateMapHeightFlag]);

    const deleteFeatureFromMap = (coordinatesToDelete) => {

        if (mapRef.current) {
            const features = vectorSource.current.getFeatures();

            coordinatesToDelete.forEach(coordinateToDelete => {
                const { lat, lon } = coordinateToDelete;
                const transformedCoordToDelete = fromLonLat([lon, lat]);

                features.forEach(feature => {
                    const geometry = feature.getGeometry();
                    const featureCoords = geometry.getCoordinates();

                    if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
                        const newCoords = featureCoords.map(coordArray => {
                            const filteredCoords = coordArray.filter(([lonFeature, latFeature]) => {
                                return !(
                                    Math.abs(lonFeature - transformedCoordToDelete[0]) < 0.00001 &&
                                    Math.abs(latFeature - transformedCoordToDelete[1]) < 0.00001
                                );
                            });

                            if (filteredCoords.length > 0 && filteredCoords.length >= 3) {
                                filteredCoords.push(filteredCoords[0]);
                            }

                            return filteredCoords;
                        });

                        const isPolygonInvalid = newCoords.some(coordArray => coordArray.length < 4);

                        if (isPolygonInvalid) {
                            vectorSource.current.removeFeature(feature);
                        }
                        else if (JSON.stringify(newCoords) !== JSON.stringify(featureCoords)) {
                            geometry.setCoordinates(newCoords);
                        } else {
                            console.log("No matching coordinates to remove for feature:", feature);
                        }
                    }
                });
            });
        }
    };

    useImperativeHandle(ref, () => ({
        clearVectorSource: () => {
            vectorSource.current.clear();
        },
        deleteFeatureFromMap,
        stopDrag: () => {
            if (dragCleanupRef.current) {
                dragCleanupRef.current();
                dragCleanupRef.current = null;

            }
        },
        startDrag: (feature) => enableDrag(feature),
    }));


    const autoPopulatePolygon = (coordinates) => {
        if (!coordinates || coordinates.length === 0) return;

        if (typeof coordinates === 'string') {

            coordinates = coordinates.trim().replace(/ +/g, ',');

            const coordinateArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));

            const formattedCoordinates = [];

            for (let i = 0; i < coordinateArray.length; i += 2) {
                if (!isNaN(coordinateArray[i]) && !isNaN(coordinateArray[i + 1])) {
                    const coordPair = [coordinateArray[i], coordinateArray[i + 1]];

                    let formattedCoordPair;
                    if (Math.abs(coordPair[0]) <= 90 && Math.abs(coordPair[1]) <= 180) {
                        formattedCoordPair = [coordPair[1], coordPair[0]]; // Reverse to lon-lat
                    } else {
                        formattedCoordPair = coordPair;
                    }

                    const transformedCoordPair = transform(formattedCoordPair, 'EPSG:4326', 'EPSG:3857');
                    formattedCoordinates.push(transformedCoordPair);
                }
            }

            const firstCoordinate = formattedCoordinates[0];
            const lastCoordinate = formattedCoordinates[formattedCoordinates.length - 1];
            if (firstCoordinate && lastCoordinate && (firstCoordinate[0] !== lastCoordinate[0] || firstCoordinate[1] !== lastCoordinate[1])) {
                formattedCoordinates.push([...firstCoordinate]);
            }

            if (formattedCoordinates.length < 3) {
                console.error('A valid polygon must have at least 3 coordinate pairs.');
                return;
            }

            const polygon = new Polygon([formattedCoordinates]);
            const extent = polygon.getExtent();
            if (extent.some(val => val === Infinity || val === -Infinity)) {
                console.error('Invalid polygon geometry or extent.');
                return;
            }

            const feature = new Feature({ geometry: polygon });
            vectorSource.current.clear();
            vectorSource.current.addFeature(feature);

            enableDrag(feature, true);

            map.getView().fit(polygon.getExtent(), { padding: [20, 20, 20, 20] });
        }
    };

    useEffect(() => {

        if (map) {
            const center = isLocalArea ? fromLonLat([-130.1207, 47.2827]) : fromLonLat([0, 0]);
            const view = new View({
                center: center,
                zoom: isLocalArea ? 4 : 2,
            });

            const lyr = new TileLayer({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new OSM(),
            });

            map.setView(view);
            map.addLayer(lyr);
            map.setTarget(mapRef.current);

            if (isLocalArea) {
                map.addLayer(vectorLayer.current);
                const zoomControl = new Zoom({
                    className: 'zoom-control',
                    zoomInLabel: '+',
                    zoomOutLabel: '-',
                });
                map.addControl(zoomControl);

                const drawPolygonButton = new DrawPolygonButton({
                    handleClick: () => {
                        vectorSource.current.clear();
                        if (draw.current) {
                            map.removeInteraction(draw.current);
                        }

                        draw.current = new Draw({
                            source: vectorSource.current,
                            type: 'Polygon',
                        });

                        map.addInteraction(draw.current);
                        setIsDrawingActive(true);
                        draw.current.on('drawend', (event) => {
                            const feature = event.feature;
                            const drawGeometry = feature.getGeometry();
                            const coordinates = drawGeometry.getCoordinates();
                            const transformedCoordinates = coordinates[0].map(coordinate => transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

                            // Flatten the array and join to a string
                            const flatCoordinates = transformedCoordinates.flat().join(' ');
                            console.log(flatCoordinates);
                            updateDrawCoordinates(flatCoordinates);
                            map.removeInteraction(draw.current);
                            enableDrag(feature, true);
                            updateMapHeightFlag(true);
                        });
                    },
                });

                map.addControl(drawPolygonButton);
            }

            map.on('loadstart', function () {
                map.getTargetElement().classList.add('spinner');
            });
            map.on('loadend', function () {
                map.getTargetElement().classList.remove('spinner');
            });
        }
    }, [map, isLocalArea, isEditMode]);

    const enableDrag = (feature, shouldUpdateCoordinates) => {

        let isDragging = false;
        let initialCoordinate = null;
        const originalInteractions = map.getInteractions().getArray().filter(interaction => interaction.getActive());

        const dragStartHandler = (event) => {

            isDragging = true;
            initialCoordinate = map.getEventCoordinate(event.originalEvent);

            map.getTargetElement().style.cursor = 'move';
            originalInteractions.forEach(interaction => {
                interaction.setActive(false);
            });
        };

        const dragMoveHandler = (event) => {
            if (!isDragging) return;

            const currentCoordinate = map.getEventCoordinate(event.originalEvent);
            const deltaX = currentCoordinate[0] - initialCoordinate[0];
            const deltaY = currentCoordinate[1] - initialCoordinate[1];

            const geometry = feature.getGeometry();
            const coordinates = geometry.getCoordinates();
            const newCoordinates = coordinates[0].map((coordinate) => [
                coordinate[0] + deltaX,
                coordinate[1] + deltaY,
            ]);

            geometry.setCoordinates([newCoordinates]);
            initialCoordinate = currentCoordinate;
        };

        const dragEndHandler = () => {

            if (!isDragging) return;
            isDragging = false;
            map.getTargetElement().style.cursor = 'unset';
            if (shouldUpdateCoordinates) {
                const geometry = feature.getGeometry();
                const coordinates = geometry.getCoordinates();
                const newCoordinatesLonLat = coordinates[0].map(coord => toLonLat(coord));

                const flatCoordinates = newCoordinatesLonLat.flat().join(' ');
                updateDrawCoordinates(flatCoordinates);
            }

        };

        dragCleanupRef.current = () => {
            map.un('pointerdown', dragStartHandler);
            map.un('pointermove', dragMoveHandler);
            map.un('pointerup', dragEndHandler);
            map.getTargetElement().style.cursor = '';
        };

        map.on('pointerdown', dragStartHandler);
        map.on('pointermove', dragMoveHandler);
        map.on('pointerup', dragEndHandler);
    };

    useEffect(() => {
        if ((!isDrawingActive && localAreaCoordinates && localAreaCoordinates.length > 0) || isEditMode) {
            autoPopulatePolygon(localAreaCoordinates);

        }
    }, [localAreaCoordinates, isDrawingActive, isEditMode]);

    return (
        <>
            <div ref={mapRef} id="mapPreviewcontainer" className="mapPreviewcontainer shadow border" style={{ height: mapPreviewHeight }}></div>
        </>
    );
});

export default MapPreview;
