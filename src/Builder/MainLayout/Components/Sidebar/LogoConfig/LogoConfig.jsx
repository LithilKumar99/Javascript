import React, { useState, useEffect, useRef } from 'react';
import { Table, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { nodeServerUrl } from '../../../../../appConfig';
import { useUtility } from '../../../Contexts/UtilityContext';
import ConfirmAlert from '../../../Components/Reusable/ConfirmAlert';

function LogoConfig() {

    const { updateLogoFlagValue } = useUtility();
    const [flag, setFlag] = useState(true);
    const { projectId, projectName } = useParams();
    const fileInputRef = useRef();
    const [data, setData] = useState([]);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [base64Image, setBase64Image] = useState('');
    const [filePath, setFilePath] = useState('');

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/logo/${projectId}`);
            if (response.data) {
                setData([response.data]);
            }
            if ([response.data].length > 0) {
                setFlag(false);
            }
            else {
                setFlag(true);
            }
        } catch (err) {
            setData([]);
            setFlag(true);
        }
    };

    const handleClick = async (e) => {
        const newLogoConfig = {
            projectId: projectId,
            image: ''
        };

        try {
            await axios.post(`${nodeServerUrl}/logo`, newLogoConfig, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success('Created a empty record for upload logo.');
            fetchData();
        } catch (error) {
            toast.warn(`An error occurred while addding logo `)
        }
    }

    const handleEdit = (id) => {
        setSelectedRecordId(id);
        if (projectId) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${nodeServerUrl}/logo/${projectId}`);
            toast.success('Logo configuration deleted successfully');
            updateLogoFlagValue(true);
            setTimeout(() => {
                fetchData();
            }, 1500);
        } catch (error) {
            toast.warn(`An error occurred while deleting logo image.`)
        }
    };

    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            setFilePath(file.name);
            const reader = new FileReader();
            reader.onload = async () => {
                const image = reader.result;
                setBase64Image(image);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {

        if (base64Image) {
            const newLogoConfig = {
                image: base64Image
            };

            try {
                await axios.put(`${nodeServerUrl}/logo/${projectId}`, newLogoConfig, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Image was updated successfully');
                fetchData();
                setSelectedRecordId(null);
                updateLogoFlagValue(true);
                setFilePath('');
            } catch (error) {
                toast.warn(`An error occurred while fetching logo configurations.`)
            }
        }
    }

    return (
        <>
            <div>
                {filePath && <span> Selected logo location:{filePath}</span>}
                <Table responsive striped bordered hover className='mt-2 text-center'>
                    <thead>
                        <tr>
                            <th>Project Id</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((record) => (
                            <tr key={record.id}>
                                <td>
                                    {record.projectId}
                                </td>
                                <td>
                                    {
                                        <img src={record.image} width={'50px'} height='auto' />
                                    }
                                </td>
                                <td>
                                    {selectedRecordId === record.id ? (
                                        <Button size='sm'
                                            variant="success" title='Save'
                                            onClick={() => handleSave()}
                                        >
                                            <i className='bi bi-save'></i>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button size='sm me-2'
                                                variant="primary" title='Edit'
                                                onClick={() => handleEdit(record.id)}
                                            >
                                                <i className='bi bi-pencil'></i>
                                            </Button>
                                            <ConfirmAlert message={`Are you sure you want to delete this logo ?`}
                                                handleDelete={() => { handleDelete() }} />

                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : <tr><td colspan='3'><span>No records for {projectName}</span></td></tr>}
                    </tbody>
                </Table>
            </div >
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e)}
                id="fileInput"
                ref={fileInputRef}
            />
            {
                flag == true && <div className='mb-2 ms-2'>
                    <Button className='text-center' title='add' variant="success" onClick={handleClick}>
                        <i className="bi bi-plus-circle"></i>
                    </Button>
                </div>
            }
        </>
    )
}

export default LogoConfig;


