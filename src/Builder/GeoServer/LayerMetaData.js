import axios from 'axios';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../../appConfig';

/**
 * Fetches metadata for a specific layer from a GeoServer's GetCapabilities response.
 * It extracts information such as the layer's name, title, abstract, projection, and associated GeoServer URL.
 * 
 * @param {string} geoserverUrl - The base URL of the GeoServer instance to query.
 * @param {string} workSpaceName - The name of the workspace containing the layer.
 * @param {string} layerName - The name of the layer for which metadata is being requested.
 * 
 * @returns {Array<Object>} - A list containing metadata for the specified layer, or an empty array if the layer is not found.
 * Each object in the returned array contains the following properties:
 *    - Name: The name of the layer.
 *    - Title: The title of the layer.
 *    - Abstract: A brief description of the layer.
 *    - Projection: The projection system used by the layer (e.g., EPSG:4326).
 *    - GeoserverUrl: The URL for the WMS service for the specified layer.
 * 
 * @example
 * const layerMetadata = await getLayerMetaData('http://example.com/geoserver', 'myWorkspace', 'myLayer');
 * console.log(layerMetadata);
 */

export const getLayerMetaData = async (geoserverUrl, workSpaceName, layerName) => {

    const layerMetadata = [];
    var layerInfoObject = {};

    try {
        const endIndex = geoserverUrl.indexOf('/geoserver') + '/geoserver'.length;
        const geoserverBaseUrl = geoserverUrl.slice(0, endIndex);

        const wmsCapabilitiesUrl = `${geoserverBaseUrl}/ows?service=WMS&version=1.3.0&request=GetCapabilities`;

        const response = await axios.get(`${nodeServerUrl}/getLayerMetaData`, { params: { param: wmsCapabilitiesUrl } });

        const parser = new WMSCapabilities();
        const capabilities = parser.read(response.data);

        if (capabilities && capabilities.Capability && capabilities.Capability.Layer) {
            const layers = capabilities.Capability.Layer.Layer;
            const desiredLayerName = `${workSpaceName}:${layerName}`;

            const selectedLayer = layers.find(layer => layer.Name === desiredLayerName);

            if (selectedLayer) {
                layerInfoObject['Name'] = selectedLayer.Name;
                layerInfoObject['Title'] = selectedLayer.Title;
                layerInfoObject['Abstract'] = selectedLayer.Abstract;
                layerInfoObject['Projection'] = selectedLayer.CRS[0];
                layerInfoObject['GeoserverUrl'] = `${geoserverBaseUrl}/${selectedLayer.Name}`;
                layerMetadata.push(layerInfoObject);
            } else {
                toast.warn('Desired layer not found in GetCapabilities response');
            }
        } else {
            toast.warn('Error parsing GetCapabilities response for metadata');
        }
    } catch (error) {
        toast.error('Error fetching GetCapabilities for layer metadata');
    }

    return layerMetadata;
};
