import * as olStyle from 'ol/style';
import * as olSource from 'ol/source';
import * as olFormat from 'ol/format';
import { bbox as loadingStrategyBbox } from 'ol/loadingstrategy';
import { toast } from 'react-toastify';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import axios from 'axios';
import { nodeServerUrl } from '../../../../../../appConfig';

/**
 * Fetches wind data from the Sail Timer API based on bounding box coordinates and timestamp.
 * Converts the data to GeoJSON format and adds it to the provided OpenLayers map.
 * 
 * @param {number} left - The left (west) longitude of the bounding box.
 * @param {number} top - The top (north) latitude of the bounding box.
 * @param {number} right - The right (east) longitude of the bounding box.
 * @param {number} bottom - The bottom (south) latitude of the bounding box.
 * @param {Date} timeStampDate - The date and time for which to fetch wind data.
 * @param {Object} map - The OpenLayers map object to which the wind data will be added.
 * @param {string} type - The type of operation ("productFilter" or other).
 * @returns {Promise} - Resolves with the response from the API if `type` is "productFilter", or adds data to the map otherwise.
 */
export const RunSailTimerApi = async (left, top, right, bottom, timeStampDate, map, type) => {
    try {

        let stLeft = 180 + parseFloat(left);
        let stTop = top;
        let stRight = 180 + parseFloat(right);
        let stBottom = bottom;
        const year = timeStampDate.getFullYear();
        const month = String(timeStampDate.getMonth() + 1).padStart(2, '0');
        const day = String(timeStampDate.getDate()).padStart(2, '0');
        const hour = String(timeStampDate.getHours()).padStart(2, '0');

        const baseUrl = nodeServerUrl;
        console.log(nodeServerUrl)
        const url = `${baseUrl}/api/sailtimer?year=${year}&month=${month}&hour=${hour}&day=${day}&toplat=${stTop}&leftlon=${stLeft}&rightlon=${stRight}&bottomlat=${stBottom}`;

        const response = await axios.get(url);
        if (response) {
            if (type == "productFilter") {
                return response;
            } else {
                convertToGeoJSon(response.data, map);
            }
        }

    } catch (error) {
        console.error('Error fetching sail timer data:', error);
        toast.warn('Error fetching sail timer data');
        throw error;
    }
};

/**
 * Converts wind data to GeoJSON format and adds it to the OpenLayers map.
 * 
 * @param {Object} jsonData - The raw data from the Sail Timer API.
 * @param {Object} map - The OpenLayers map to which the data will be added.
 */
const convertToGeoJSon = async (jsonData, map) => {
    let geojson = {
        type: "FeatureCollection",
        features: [],
    }

    let d1 = jsonData;

    for (let i = 0; i < d1['NOAA GFS'].data.length; i++) {
        let ft = d1['NOAA GFS'].metadata.forecast_time
        let rt = d1['NOAA GFS'].metadata.reference_time;
        let lon = d1['NOAA GFS'].data[i].longitude - 180;
        let lat = d1['NOAA GFS'].data[i].latitude;
        let ws = d1['NOAA GFS'].data[i].windSpeed;
        let wd = d1['NOAA GFS'].data[i].windDirection;

        geojson.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "forecast_time": ft,
                "referreference_time": rt,
                "windSpeed": ws,
                "windDirection": wd
            }
        })
    }

    if (geojson) {
        addToMap(JSON.stringify(geojson), map);
    }
}

/**
 * Adds the GeoJSON data to the OpenLayers map with specific styles for wind direction and speed.
 * 
 * @param {string} geoJsonData - The GeoJSON string representing the wind data.
 * @param {Object} map - The OpenLayers map to which the data will be added.
 */
function addToMap(geoJsonData, map) {

    const shaftred = new olStyle.RegularShape({
        points: 2,
        radius: 12,
        stroke: new olStyle.Stroke({
            width: 2,
            color: 'red',
        }),
        rotateWithView: true,
    });

    const headred = new olStyle.RegularShape({
        points: 3,
        radius: 10,
        fill: new olStyle.Fill({
            color: 'red',
        }),
        rotateWithView: true,
    });

    const shaftgreen = new olStyle.RegularShape({
        points: 2,
        radius: 12,
        stroke: new olStyle.Stroke({
            width: 2,
            color: 'green',
        }),
        rotateWithView: true,
    });

    const headgreen = new olStyle.RegularShape({
        points: 3,
        radius: 10,
        fill: new olStyle.Fill({
            color: 'green',
        }),
        rotateWithView: true,
    });

    // Define style functions
    const stylered = [new olStyle.Style({ image: shaftred }), new olStyle.Style({ image: headred })];
    const stylegreen = [new olStyle.Style({ image: shaftgreen }), new olStyle.Style({ image: headgreen })];

    const boxString1 = geoJsonData; // Assuming geoJsonData is available
    const myBlob = new Blob([`${boxString1}`], {
        type: "text/plain"
    });
    const url = window.URL.createObjectURL(myBlob);

    // Create vector source
    const wmjsonsc = new olSource.Vector({
        crossOrigin: "Anonymous",
        format: new olFormat.GeoJSON(),
        url: url,
        strategy: loadingStrategyBbox
    });

    // Create vector layer
    const wmjson = new VectorLayer({
        title: "WindData",
        source: wmjsonsc,
        style: function (feature) {
            const angle = feature.get('windDirection');
            const speed = feature.get('windSpeed');

            if (parseFloat(speed) > 12) {
                shaftred.setRotation(angle);
                headred.setRotation(angle);
                return stylered;
            }
            if (parseFloat(speed) < 12) {
                shaftgreen.setRotation(angle);
                headgreen.setRotation(angle);
                return stylegreen;
            }
        },
    });
    clearSailTimerVectorData(map);
    map.addLayer(wmjson);
}

/**
 * Clears the existing wind data layer (if any) from the map.
 * 
 * @param {Object} olMap - The OpenLayers map instance from which the layer will be removed.
 */

const clearSailTimerVectorData = (olMap) => {
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
