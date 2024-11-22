import React, { useEffect, useState, useContext } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { deleteLayer } from '../../../api/layerApi';
import { useBuilderContext } from '../../../../Context/BuilderProvider';
import { OLMapContext } from "../../../../../Context/OlMapContext";
import ConfirmAlert from '../../../../../Product/Reusable/ConfirmAlert';
import { nodeServerUrl } from '../../../../../appConfig';

const LayerConfig = () => {

    const { projectId } = useParams();
    const { updateDeleteLayer, } = useBuilderContext();
    const [layersData, setLayersData] = useState([]);
    const { islayerAdded, updateIsLayerAdded } = useContext(OLMapContext);

    useEffect(() => {
        fetchLayerData();
        updateIsLayerAdded();
    }, [islayerAdded]);

    async function fetchLayerData() {
        try {
            const response = await axios.get(`${nodeServerUrl}/layers/${projectId}`);
            if (response.data) {
                setLayersData(response.data);
            }
            return response.data;

        } catch (error) {
            toast.error('An error occurred while fetching layers data');
            throw error; // Rethrow the error to be caught by the caller
        }
    }

    const handleDeleteLayer = async (layerId) => {
        try {
            await deleteLayer(projectId, layerId);
            updateDeleteLayer(true);
            fetchLayerData()
        } catch (error) {
            toast.error('An error occurred while deleting the layer');
        }
    };

    return (
        <>
            {layersData && layersData.length > 0 ? <Table responsive striped bordered hover className='text-center mb-0' size='sm' style={{ verticalAlign: 'middle', wordBreak: 'break-all' }}>
                <thead>
                    <tr>
                        <th style={{ width: '26%' }}>Workspace</th>
                        <th style={{ width: '16%' }}>Layer</th>
                        <th>Url</th>
                        <th style={{ width: '20%' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {layersData && layersData.map(item => (
                        <tr key={item.id} style={{ fontSize: "10px" }}>
                            <td>{item.workspace}</td>
                            <td>{item.layer}</td>
                            <td>{item.url}</td>
                            <td>
                                <ConfirmAlert
                                    message={`Are you sure you want to delete ${item.layer} ?`}
                                    handleDelete={() => { handleDeleteLayer(item.layer) }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table> : <p>There are no layer data available</p>
            }
        </>
    );
};

export default LayerConfig;
