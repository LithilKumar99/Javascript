import axios from 'axios';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { nodeServerUrl } from '../../appConfig';

/**
 * Fetches workspaces from a list of GeoServer URLs by sending GetCapabilities requests to each GeoServer.
 * It processes the WMS capabilities response to extract workspace names and associated URLs.
 * 
 * @param {Array<string>} geoServerUrlList - An array of GeoServer base URLs to query.
 * @returns {Array<Object>} - A list of workspaces, each with a name and associated WMS URL.
 * Each object in the returned array contains:
 *    - workSpace: The name of the workspace (e.g., "myWorkspace").
 *    - workSpaceUrl: The URL pointing to the WMS service for the workspace.
 * 
 * @example
 * const workspaces = await getWorkSpacesFromGeoServer(['http://example.com/geoserver', 'http://another.com/geoserver']);
 * console.log(workspaces);
 */

export const getWorkSpacesFromGeoServer = async (geoServerUrlList) => {
    var workSpaces = [];

    await Promise.all(geoServerUrlList.map(async (geoServerUrl) => {
        if (geoServerUrl) {
            const url = `${geoServerUrl}/ows?service=WMS&version=1.3.0&request=GetCapabilities`;
            const queryParams = { param: url };

            try {
                const response = await axios.get(`${nodeServerUrl}/getWorkSpaces`, { params: queryParams });

                const parser = new WMSCapabilities();
                const result = parser.read(response.data);

                const layers = result?.Capability?.Layer?.Layer || [];

                if (layers.length > 0) {
                    layers.forEach(layer => {
                        const layerName = layer.Name;
                        if (layerName) {
                            const workSpaceName = layerName.split(':')[0];
                            const workSpaceUrl = `${geoServerUrl}/${workSpaceName}/wms`;
                            const workSpaceConfig = {
                                workSpace: workSpaceName,
                                workSpaceUrl: workSpaceUrl
                            };

                            if (!workSpaces.some(ws => ws.workSpace === workSpaceConfig.workSpace)) {
                                workSpaces.push(workSpaceConfig);
                            }
                        }
                    });
                } else {
                    return workSpaces;
                }
            } catch (error) {
                return workSpaces;
            }
        }
    }));
    return workSpaces;
};
