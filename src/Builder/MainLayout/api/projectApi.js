import axios from 'axios';
import { nodeServerUrl } from '../../../appConfig';

export async function fetchProjects() {
    try {
        const response = await axios.get(`${nodeServerUrl}/projects`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to fetch projects');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Postgres Server error');
            }
            throw new Error('Failed to fetch projects');
        }
        throw new Error('Failed to fetch projects');
    }
}

export async function updateProjectById({ id, formdata }) {
    try {
        const response = await axios.put(`${nodeServerUrl}/projects/${id}`, formdata);

        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to update project');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Postgres Server error');
            }
            throw new Error('Failed to update project');
        }
        throw new Error('Failed to update project');
    }
}


export async function deleteProjectById(id) {
    try {
        const response = await axios.delete(`${nodeServerUrl}/projects/${id}`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to delete project');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Postgres Server error');
            }
            throw new Error('Failed to delete project');
        }
        throw new Error('Failed to delete project');
    }
}

export async function createProject(projectData) {
    try {
        const response = await axios.post(`${nodeServerUrl}/project`, projectData);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to create project');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Postgres Server error');
            }
            throw new Error('Failed to create project');
        }
        throw new Error('Failed to create project');
    }
}
