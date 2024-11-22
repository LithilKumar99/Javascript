import { toast } from "react-toastify";
import { nodeServerUrl } from "../../../appConfig";

export const createLayer = async (layerData) => {
    try {
        const response = await fetch(`${nodeServerUrl}/layer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: layerData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        toast.error('Error saving layer data: ' + error.message);
        throw error;
    }
}

export const deleteLayer = (projectId, layer) => {
    fetch(`${nodeServerUrl}/layer/${projectId}/${layer}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        toast.success(data.message);
    }).catch(error => {
        toast.error('An error occurred while deleting the layer');
    });
}