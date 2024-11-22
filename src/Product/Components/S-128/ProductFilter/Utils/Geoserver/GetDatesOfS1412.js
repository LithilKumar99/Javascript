import axios from "axios";
import { toast } from 'react-toastify';
import { nodeServerUrl } from "../../../../../../appConfig";

/**
 * Fetches unique attribute values (or dates) from a GeoServer layer based on a specified attribute.
 * The function makes a request to a Node.js server endpoint, retrieves features from the specified GeoServer layer,
 * and extracts unique values from a given attribute (or dates from a 'time' attribute).
 * 
 * @param {Object} olMap - The OpenLayers map instance. If it's not provided, the function returns immediately.
 * @param {string} geoServerUrl - The base URL of the GeoServer from which to request the data.
 * @param {string} lyrName - The name of the layer to query from GeoServer.
 * @param {string} attributeValue - The name of the attribute whose values (or dates) need to be extracted.
 * @returns {Promise<Array>} - A promise that resolves with an array of unique attribute values (or dates).
 */

export const getDatesOFS1412 = async (olMap, geoServerUrl, lyrName, attributeValue) => {
    var data = [];

    if (!olMap) {
        return;
    }

    const baseUrl = `${geoServerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${lyrName}&outputFormat=application/json`;

    const queryParams = { param: baseUrl };

    try {
        const res = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });
        const features = res.data.features;
        if (features) {
            features.forEach((feature) => {
                const _attributeValue = feature.properties[attributeValue];
                if (_attributeValue !== undefined && !data.includes(_attributeValue) && _attributeValue !== null) {
                    feature.properties.layername = lyrName;
                    if (attributeValue === 'time') {
                        const dateString = _attributeValue;
                        const dateObject = new Date(dateString);
                        if (!data.some((date) => date.getTime() === dateObject.getTime())) {
                            data.push(dateObject);
                        }
                    } else {
                        data.push(_attributeValue);
                    }
                }
            });
        }
    } catch (error) {
        toast.warn('Error fetching data from GeoServer');
    }
    return data;
};