import axios from "axios";
import { toast } from 'react-toastify';
import { nodeServerUrl } from "../../appConfig";

/**
 * Fetches a list of layers from a GeoServer by sending a GetCapabilities request.
 * This function retrieves the layers available from a WMS (Web Map Service) endpoint.
 * 
 * @param {string} url - The base URL of the GeoServer WMS service.
 * 
 * @returns {Array<string>} - A list of layer names fetched from the GetCapabilities response.
 * If an error occurs during the request or parsing, an empty array is returned.
 * 
 * @example
 * const layers = await getLayers('http://example.com/geoserver/ows');
 * console.log(layers); // ['layer1', 'layer2', 'layer3']
 */

export const getLayers = async (url) => {
    const geoserverUrl = `${url}?service=wms&version=1.3.0&request=GetCapabilities`;
    const queryParams = {
        param: geoserverUrl,
    };

    try {
        const response = await axios.get(`${nodeServerUrl}/getlayers`, { params: queryParams });
        const data = await response.data;
        return parseXmlToGetLayers(data);
    } catch (error) {
        toast.warn('Error retrieving data layers from the server');
        return [];
    }
};

/**
 * Parses an XML string containing GetCapabilities data and extracts the names of the layers.
 * 
 * @param {string} data - The XML string containing the GetCapabilities response.
 * 
 * @returns {Array<string>} - An array of layer names extracted from the XML data.
 */

const parseXmlToGetLayers = (data) => {
    const layers = [];

    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');

        const layerElements = xmlDoc.getElementsByTagName('Layer');

        for (let i = 0; i < layerElements.length; i++) {
            const nameElement = layerElements[i].getElementsByTagName('Name')[0];
            const lyrName = nameElement.innerHTML;

            if (lyrName && !layers.includes(lyrName)) {
                layers.push(lyrName);
            }
        }
    } catch (error) {
        toast.warn('Error parsing XML layer data');
    }

    return layers;
};
