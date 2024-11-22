import axios from 'axios';
import { nodeServerUrl } from '../../../appConfig';

export const createComponent = async (componentData) => {
    try {
        const response = await axios.post(`${nodeServerUrl}/component`, componentData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to save components');
    }
};

export async function getComponentsBasedOnProjectId(projectId) {
    try {
        const response = await axios.get(`${nodeServerUrl}/components/${projectId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching components based on project ID: ${error.message}`);
    }
}





