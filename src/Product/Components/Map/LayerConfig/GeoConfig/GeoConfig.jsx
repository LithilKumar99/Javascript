import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmAlert from '../../../../Reusable/ConfirmAlert';
import { getWorkSpacesFromGeoServer } from '../../../../../Builder/GeoServer/WorkSpaces';
import { StyledLoaderInner, StyledLoaderWraper } from '../../../../Reusable/StyledComponent';
import { nodeServerUrl } from '../../../../../appConfig';
import { getWorkSpaces } from '../getWorkSpaces';

const GeoConfig = ({ updateGeoServerWorkSpaceList }) => {

    const [geoConfigs, setGeoConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const fetchGeoConfigs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${nodeServerUrl}/geoConfigs`);
            if (response) {
                setGeoConfigs(response.data);
            }
        } catch (err) {
            setError(err);
            toast.error('Failed to fetch geo configurations');
        } finally {
            setIsLoading(false);
        }
    };

    const addGeoConfig = async () => {
        try {
            const newGeoConfig = { url: '' };
            await axios.post(`${nodeServerUrl}/geoConfig`, newGeoConfig, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchGeoConfigs();
            toast.success('GeoConfig added successfully');
        } catch (err) {
            setError(err);
            toast.error('Failed to add GeoConfig');
        }
    };

    const updateGeoConfig = async (updatedGeoConfig) => {
        try {
            await axios.put(`${nodeServerUrl}/geoConfigs/${updatedGeoConfig.id}`, updatedGeoConfig, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchGeoConfigs();
            const workSpaces = await getWorkSpaces();
            if (workSpaces) {
                updateGeoServerWorkSpaceList(workSpaces);
            }
            else {
                updateGeoServerWorkSpaceList([]);
            }
            toast.success('GeoConfig updated successfully');
        } catch (err) {
            setError(err);
            toast.error('Failed to update GeoConfig');
        }
    };

    const deleteGeoConfig = async (id) => {
        try {
            await axios.delete(`${nodeServerUrl}/geoConfigs/${id}`);
            fetchGeoConfigs();
            const workSpaces = await getWorkSpaces();
            if (workSpaces) {
                updateGeoServerWorkSpaceList(workSpaces);
            }
            else {
                updateGeoServerWorkSpaceList([]);
            }
            toast.success('GeoConfig deleted successfully');
        } catch (err) {
            setError(err);
            toast.error('Failed to delete GeoConfig');
        }
    };

    const handleEdit = (id, url) => {
        setEditRowId(id);
        setEditedData({ ...editedData, [id]: url });
    };

    const handleSave = async (id, _url) => {
        const url = _url.trim();
        setIsLoading(true);
        const data = await getWorkSpacesFromGeoServer([url]);
        setIsLoading(false);
        if (data.length > 0) {
            await updateGeoConfig({ id, url });
            setEditRowId(null);
            setEditedData((prevState) => ({ ...prevState, [id]: '' }));
        } else {
            toast.warn('The specified geoserver url is not valid Url: ' + url);
        }
    };

    const handleInputChange = (event, id) => {
        const { value } = event.target;
        setEditedData({ ...editedData, [id]: value });
    };

    useEffect(() => {
        fetchGeoConfigs();
    }, []);

    return (
        <div className="table-responsive">
            {isLoading && (
                <StyledLoaderWraper>
                    <StyledLoaderInner />
                </StyledLoaderWraper>
            )}
            <Table striped bordered hover className='mt-2 text-center'>
                <thead>
                    <tr>
                        <th>Url</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {geoConfigs.length > 0 && geoConfigs.map((record) => (
                        <tr key={record.id}>
                            <td>
                                {editRowId === record.id ? (
                                    <Form.Control
                                        type="text"
                                        value={editedData[record.id] || record.url}
                                        onChange={(event) => handleInputChange(event, record.id)}
                                    />
                                ) : (
                                    record.url
                                )}
                            </td>
                            <td>
                                {editRowId === record.id ? (
                                    <>
                                        <Button size='md me-2'
                                            variant="success" title='Save'
                                            onClick={() => handleSave(record.id, editedData[record.id] || record.url)}
                                        >
                                            <i className='bi bi-save'></i>
                                        </Button>
                                        <Button size='md me-2'
                                            variant="secondary" title='Clear'
                                            onClick={() => {
                                                setEditRowId(null);
                                                setEditedData((prevState) => ({ ...prevState, [record.id]: '' }));
                                            }}
                                            className='ms-2'
                                        >
                                            <i className='bi bi-x-circle'></i>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size='md me-2'
                                            variant="primary" title='Edit'
                                            onClick={() => handleEdit(record.id, record.url)}
                                        >
                                            <i className='bi bi-pencil'></i>
                                        </Button>
                                        <ConfirmAlert
                                            message={`Are you sure you want to delete ${record.url} ?`}
                                            handleDelete={() => { deleteGeoConfig(record.id) }} />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className='mb-2 ms-2'>
                <Button className='text-center' title='Add' variant="success" onClick={addGeoConfig}>
                    <i className="bi bi-plus-circle"></i>
                </Button>
            </div>
        </div>
    );
};

export default GeoConfig;
