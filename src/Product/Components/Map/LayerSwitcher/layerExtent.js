import axios from 'axios';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { transformExtent } from 'ol/proj';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../../../../appConfig';

/**
 * Fetches the geographic extent (bounding box) of a WMS layer from a GeoServer instance and fits the map view to that extent.
 * 
 * This function constructs a WMS GetCapabilities request to retrieve metadata about the available layers
 * in a GeoServer service, searches for the layer with the specified title, and extracts its geographic 
 * bounding box (extent). The map view is then adjusted to fit the layer's extent, transforming the coordinates 
 * from EPSG:4326 (WGS84) to EPSG:3857 (Web Mercator) for display on the map.
 * 
 * @param {string} geoserverUrl - The base URL of the GeoServer instance, typically ending with '/geoserver'.
 * @param {string} title - The name (title) of the WMS layer for which the extent is to be fetched.
 * @param {ol.Map} olMap - The OpenLayers map object that will be updated to fit the layer's extent.
 * 
 * @returns {Promise<void>} - A promise that resolves when the layer's extent is retrieved and the map view is adjusted.
 * @throws {Error} - Throws an error if the request or parsing fails, and displays a warning.
 */

export const getLayerExtent = async (geoserverUrl, title, olMap) => {
    try {
        const endIndex = geoserverUrl.indexOf('/geoserver') + '/geoserver'.length;
        const updatedUrl = geoserverUrl.slice(0, endIndex);

        const url = `${updatedUrl}/ows?service=WMS&version=1.3.0&request=GetCapabilities`;
        const queryParams = { param: url };
        const response = await axios.get(`${nodeServerUrl}/getLayerExtent`, { params: queryParams });
        //const response = await axios.get(url);

        const parser = new WMSCapabilities();
        const result = parser.read(response.data);

        if (result && result.Capability && result.Capability.Layer) {
            const layers = result.Capability.Layer.Layer;
            const desiredLayerName = title;

            const selectedLayer = layers.find(layer => layer.Name === desiredLayerName);
            if (selectedLayer) {
                var extent = selectedLayer.EX_GeographicBoundingBox || selectedLayer.BoundingBox[0].extent;
                var layerExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
                olMap.getView().fit(layerExtent, { padding: [10, 10, 10, 0] });
            }
        } else {
            toast.warn('Error parsing GetCapabilities response');
        }
    } catch (error) {
        toast.warn('Error parsing GetCapabilities response');
    }
};

