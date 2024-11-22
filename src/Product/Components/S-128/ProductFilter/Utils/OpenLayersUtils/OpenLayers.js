import ImageLayer from "ol/layer/Image.js";
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Image as ImageSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon.js';
import { transform } from 'ol/proj';

var parser = new GeoJSON();

/**
 * Creates and returns a vector layer with custom styles applied.
 * 
 * @param {Array} styles - The style configurations to apply to the vector layer.
 * @returns {VectorLayer} - The vector layer with the applied styles.
 */

export const createStylingVectorLayerWithStyles = (styles) => {
    const vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: styles,
    });
    return vectorLayer;
};

/**
 * Renders and highlights features on a vector layer using the provided data.
 * This function creates a vector layer, applies predefined styles, and adds features 
 * from the parsed input data to the layer.
 * 
 * @param {Object} data - The data to be parsed into features and added to the vector layer.
 * @returns {VectorLayer} - The vector layer with the added features and styling applied.
 */

export const renderHighlightedFeatures = (data) => {
    const vectorLayer = createStylingVectorLayerWithStyles(featureInformationStyles);
    if (data) {
        const features = parser.readFeatures(data);
        vectorLayer.getSource().addFeatures(features);
    }
    return vectorLayer;
};

/**
 * Highlights the selected feature(s) on the map by creating a new vector layer,
 * adding the provided features, and adjusting the map view to fit the extent of the features.
 * 
 * @param {Object} olMap - The OpenLayers map instance where the features will be displayed.
 * @param {Object} _data - The raw data representing the features to be highlighted (e.g., GeoJSON).
 */

export const hightLight_SelectedFeature = (olMap, _data) => {

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

/**
 * Creates and returns a vector layer containing the provided features without any styling applied.
 * 
 * @param {Array} features - An array of OpenLayers features to be included in the vector layer.
 * @returns {VectorLayer} - A vector layer with the specified features and no styling applied.
 */

export const createVectorLayerWithFeatures = (features) => {
    const vectorSource = new VectorSource({
        features: features,
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: null,
    });
    return vectorLayer;
};


/**
 * Returns a set of styles for different types of geometries (point and line).
 * This function creates two styles: one for point features and one for line features.
 * 
 * @returns {Object} - An object containing the pointStyle and lineStringStyle.
 */
export const rtzWayGeometryStyles = () => {
    const pointStyle = new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 3 }),
        }),
    });

    const lineStringStyle = new Style({
        stroke: new Stroke({
            color: 'red',
            width: 3,
        }),
    });
    return { pointStyle, lineStringStyle };
}

/**
 * Defines the style for feature information visualization.
 * This style is applied to vector features to display them with a specific fill and stroke pattern.
 * 
 * @type {Style} - The style object to be applied to features.
 */

export const featureInformationStyles = new Style({
    fill: new Fill({
        color: 'red',
    }),
    stroke: new Stroke({
        color: 'blue',
        width: 3,
    }),
    image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
            color: 'green',
        }),
        fill: new Fill({
            color: 'yellow',
        }),
    }),
});

/**
 * Defines the style for highlighting geometries (e.g., features) on the map.
 * This style uses a semi-transparent red fill and a yellow border for geometries,
 * with a similar style applied to point geometries represented as circles.
 * 
 * @type {Style} - The style object used for highlighting geometries.
 */

export const rtzGeometryHighlightStyles = new Style({
    fill: new Fill({
        color: 'rgba(255, 0, 0, 0.1)',
    }),
    stroke: new Stroke({
        color: 'yellow',
        width: 2,
    }),
    image: new CircleStyle({
        radius: 6,
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)',
        }),
        stroke: new Stroke({
            color: 'yellow',
            width: 2,
        }),
    }),
});

/**
 * Clears all vector features and removes all vector layers from the map.
 * This function iterates through all layers on the map, checks for vector layers
 * with vector sources, clears their features, removes them from the map, and re-renders the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which vector layers will be removed.
 */

export const clearVectorSource = (olMap) => {

    if (olMap) {
        var layers = olMap.getLayers().getArray();
        layers.map((lyr) => {
            if (lyr instanceof VectorLayer && lyr.getSource() instanceof VectorSource) {
                lyr.getSource().clear();
                olMap.removeLayer(lyr);
                olMap.render();
            }
        })
    }
}

/**
 * Removes all image layers from the OpenLayers map.
 * This function iterates over all layers in the map, checks for image layers with image sources,
 * and removes them from the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which image layers will be removed.
 */

export const clearImageSource = (olMap) => {

    if (olMap) {
        var layers = olMap.getLayers().getArray();
        layers.map((lyr) => {
            if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageSource) {
                olMap.removeLayer(lyr);
                olMap.render();
            }
        })
    }
}

/**
 * Stops and removes any active drawing interaction on the map.
 * This function checks for active `Draw` interactions on the map, finishes any ongoing drawing actions,
 * deactivates the interaction, and removes it from the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which the drawing interaction will be removed.
 */

export const stopDrawAction = (olMap) => {
    const interactions = olMap.getInteractions();
    interactions.forEach(interaction => {
        if (interaction instanceof Draw) {
            if (interaction.getActive()) {
                interaction.finishDrawing();
                interaction.setActive(false);
                olMap.removeInteraction(interaction);
            }
        }
    });
};

/**
 * Clears and removes the vector layer containing the SailTimer wind data from the map.
 * This function searches for the vector layer with the title "WindData", clears its features,
 * removes the layer from the map, and re-renders the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which the wind data layer will be removed.
 */

export const clearSailTimerVectorData = (olMap) => {
    if (olMap) {
        var layers = olMap.getLayers().getArray();
        layers.map((lyr) => {
            if (lyr instanceof VectorLayer && lyr.getSource() instanceof VectorSource) {
                if (lyr.get('title') == 'WindData') {
                    lyr.getSource().clear();
                    olMap.removeLayer(lyr);
                    olMap.render();
                }
            }
        })
    }
}

/**
 * Clears and removes the vector layer used for highlighting features on the map.
 * This function searches for the vector layer with the title "Highlight-Vector-Layer", clears its features,
 * removes the layer from the map, and re-renders the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which the highlight vector layer will be removed.
 */

export const clearHighLightVectorData = (olMap) => {
    if (olMap) {
        var layers = olMap.getLayers().getArray();
        layers.map((lyr) => {
            if (lyr instanceof VectorLayer && lyr.getSource() instanceof VectorSource) {
                if (lyr.get('title') == 'Highlight-Vector-Layer') {
                    lyr.getSource().clear();
                    olMap.removeLayer(lyr);
                    olMap.render();
                }
            }
        })
    }
}

/**
 * Finds an image layer by its title in the OpenLayers map.
 * This function searches through all layers of the map, looks for layers that are instances of
 * `ImageLayer` with an `ImageSource`, and returns the first layer that matches the given title.
 * 
 * @param {Object} olMap - The OpenLayers map instance where the image layer will be searched.
 * @param {string} layerName - The title of the image layer to search for.
 * @returns {ImageLayer|null} - The image layer with the matching title, or `null` if not found.
 */

export function findImageLayerByTitle(olMap, layerName) {
    var layers = olMap.getLayers().getArray();
    var foundLayer = null;

    layers.forEach((lyr) => {
        if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageSource) {
            if (lyr.get('title') === layerName) {
                foundLayer = lyr;
            }
        }
    });

    return foundLayer;
}

/**
 * Finds a vector layer by its title in the OpenLayers map.
 * This function searches through all layers of the map, looks for layers that are instances of
 * `VectorLayer` with a `VectorSource`, and returns the first layer that matches the given title.
 * 
 * @param {Object} olMap - The OpenLayers map instance where the vector layer will be searched.
 * @param {string} layerName - The title of the vector layer to search for.
 * @returns {VectorLayer|null} - The vector layer with the matching title, or `null` if not found.
 */

export function findVectorLayerByTitle(olMap, layerName) {
    var layers = olMap.getLayers().getArray();
    var foundLayer = null;

    layers.forEach((lyr) => {
        if (lyr instanceof VectorLayer && lyr.getSource() instanceof VectorSource) {
            if (lyr.get('title') === layerName) {
                foundLayer = lyr;
            }
        }
    });

    return foundLayer;
}

/**
 * Highlights a rectangular area on the map by creating a polygon feature using coordinates in EPSG:4326.
 * The function transforms the coordinates to EPSG:3857, creates a polygon with those coordinates,
 * and adds it to a new vector layer. The map's view is then adjusted to fit the extent of the highlighted area.
 * 
 * @param {number} left - The left (west) coordinate of the rectangle in EPSG:4326 (longitude).
 * @param {number} top - The top (north) coordinate of the rectangle in EPSG:4326 (latitude).
 * @param {number} right - The right (east) coordinate of the rectangle in EPSG:4326 (longitude).
 * @param {number} bottom - The bottom (south) coordinate of the rectangle in EPSG:4326 (latitude).
 * @param {Object} olMap - The OpenLayers map instance to which the highlighted area will be added.
 */

export function rtzfeatureGeometryhighLight(left, top, right, bottom, olMap) {

    const topLeft3857 = transform([left, top], 'EPSG:4326', 'EPSG:3857');
    const topRight3857 = transform([right, top], 'EPSG:4326', 'EPSG:3857');
    const bottomRight3857 = transform([right, bottom], 'EPSG:4326', 'EPSG:3857');
    const bottomLeft3857 = transform([left, bottom], 'EPSG:4326', 'EPSG:3857');

    const rectangleFeature = new Feature({
        geometry: new Polygon([[topLeft3857, topRight3857, bottomRight3857, bottomLeft3857, topLeft3857]])
    });

    const vectorSource = new VectorSource({
        features: [rectangleFeature]
    });

    const vectorLayer = new VectorLayer({
        title: 'Highlight-Vector-Layer',
        source: vectorSource,
        style: featureInformationStyles,
    });

    var extent = vectorLayer.getSource().getExtent();
    olMap.getView().fit(extent, {
        padding: [40, 40, 40, 40], minResolution: 10,
        duration: 1000
    });
    olMap.addLayer(vectorLayer);
}

/**
 * Initializes the drawing interaction and the vector layer for drawing features on the map.
 * This function creates a draw layer with a specified style, a draw interaction to allow drawing features
 * (such as points, lines, or polygons), and an empty vector layer for other vector data.
 * 
 * @param {string} drawType - The type of drawing interaction (e.g., 'Point', 'LineString', 'Polygon').
 * @param {Object} vectorFillStyle - The style for filling vector features (e.g., color).
 * @param {Object} vectorStrokeStyle - The style for the stroke of vector features (e.g., color, width).
 * @returns {Object} - An object containing the draw layer, draw interaction, vector layer, and projection information.
 */

export function initializeDrawAndVectorLayers(drawType, vectorFillStyle, vectorStrokeStyle) {

    const sourceProjection = 'EPSG:4326';
    const destinationProjection = 'EPSG:3857';

    const drawStrokeStyle = {
        color: 'rgba(14, 183, 142, 0.8)',
        width: 3,
    };

    const drawLayerStyle = new Style({
        stroke: new Stroke(drawStrokeStyle),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 1)',
                width: 1,
            }),
            fill: new Fill({
                color: 'rgba(14, 183, 142, 1)',
            }),
        }),
    });

    const drawSource = new VectorSource({ projection: destinationProjection });

    const DrawLayer = new VectorLayer({
        source: drawSource,
        style: drawLayerStyle,
    });

    const draw = new Draw({
        source: drawSource,
        type: drawType,
    });

    const vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            fill: new Fill(vectorFillStyle),
            stroke: new Stroke(vectorStrokeStyle),
        }),
    });

    return {
        drawLayer: DrawLayer,
        drawInteraction: draw,
        vectorLayer: vectorLayer,
        sourceProjection: sourceProjection,
        destinationProjection: destinationProjection
    };
}











