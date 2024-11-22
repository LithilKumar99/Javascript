import React, { useEffect, useRef, useState, useContext } from 'react'
import { Card, Table } from 'react-bootstrap'
import { StyledButton } from '../../../../../Reusable/StyledComponent';
import AddLocalArea from './AddLocalArea';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import axios from 'axios';
import { toast } from 'react-toastify';
import $ from 'jquery';
import { LocalAreaMapPreviewContext } from './MapPreview/MapPreviewContext';
import './LocalArea.css';
import { s124_NavWarn_Apis } from '../../../config';

function LocalArea() {

    const [showAddLocalAreaDialog, setShowLocalAreaDialog] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);
    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [localAreaData, setLocalAreaData] = useState([]);
    const [updateItem, setUpdateItem] = useState(false);
    const [selectedLocalArea, setSelectedLocalArea] = useState(null);
    const [showFormCoordinates, setShowFormCoordinates] = useState(false);
    const { updateDrawCoordinates, updateMapHeightFlag } = useContext(LocalAreaMapPreviewContext);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchAllLocalAreasData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'Name', className: 'text-start w-20', data: 'name' },
                { title: 'Description', className: 'text-start w-20', data: 'description' },
                { title: 'Area Type', className: 'text-start w-20', data: 'areaType' },
                { title: 'Message Type', className: 'text-start w-20', data: 'messageType' },
                {
                    title: 'Update',
                    className: 'text-center w-5',
                    data: null,
                    defaultContent: '<i class="bi bi-pencil text-danger" style="cursor: pointer;" title="Update"></i>',
                    orderable: false,
                },
                {
                    title: 'Delete',
                    className: 'text-center w-5',
                    data: null,
                    defaultContent: '<i class="bi bi-trash text-danger" style="cursor: pointer;" title="Delete"></i>',
                    orderable: false,
                },
            ];

            if (dataTableRef.current) {
                dataTableRef.current.destroy();
            }

            const dataTable = $(staticTableref.current).DataTable({
                data: localAreaData,
                columns: columns,
                paging: true,
                lengthMenu: [5, 10, 25, 50],
                pageLength: 5,
                responsive: true,
            });

            dataTableRef.current = dataTable;

            $(staticTableref.current).on('click', 'i[title="Update"]', function () {
                const rowData = dataTable.row($(this).parents('tr')).data();
                if (rowData) {
                    setSelectedLocalArea(rowData);
                    setUpdateItem(true);
                    setShowLocalAreaDialog(true);
                    updateDrawCoordinates('');
                    updateMapHeightFlag(true);
                }
            });

            $(staticTableref.current).on('click', 'i[title="Delete"]', function () {
                const rowData = dataTable.row($(this).parents('tr')).data();
                if (rowData) {
                    setDeletedItem(rowData?.id);
                    setShowConfirmDeleteModal(true);

                }
            });
        }

        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [localAreaData]);

    const fetchAllLocalAreasData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllLocalAreas}`);
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    setLocalAreaData(response.data);
                } else {
                    console.warn('Unexpected data format: response.data is not an array.', response.data);
                }
            } else {
                console.warn('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleOpenTemplateDialog = () => {
        setShowLocalAreaDialog(true);
        setUpdateItem(false);
        setShowFormCoordinates(true);
        updateMapHeightFlag(false);
    }

    const handleCloseModal = () => {
        setShowConfirmDeleteModal(false);
        setShowFormCoordinates(true);
    }

    const handleDeleteLocalArea = async () => {

        try {
            const deleteresponse = await axios.delete(`${getAllLocalAreas.deleteLocalArea}/${deletedItem}`);
            const result = await deleteresponse.data;
            if (result == 'Local Area Details Have Been Deleted Successfully') {
                toast.success(result);
                fetchAllLocalAreasData();
                setShowFormCoordinates(false);
            } else {
                toast.warn(result);
            }
        } catch (error) {
            toast.error('Error deleting Provider: ' + error.message);
        }
    }

    const handleUpload = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();

            const allowedExtensions = ['gml', 'yaml', 'yml', 'csv', 'json', 'xlsx'];

            if (!allowedExtensions.includes(fileExtension)) {
                toast.warn('Please upload a valid file (gml, yaml, yml, csv, json, or xlsx).');
                fileInputRef.current.value = null;
            } else {
                setSelectedFile(file);

                const formData = new FormData();
                formData.append("file", file);

                console.log("File Extension:", fileExtension);
                console.log("FormData contents:");
                formData.forEach((value, key) => {
                    console.log(key, value);
                });

                try {
                    const response = await axios.post(
                        `${S124NavigationalwarningsAPIs.importLocalAreas(fileExtension)}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    if (response.status === 200) {
                        const result = await response.data;

                        if (result === 'LocalAreas Have Been Imported SuccessFully') {
                            toast.success(result);
                            fileInputRef.current.value = null;
                            setSelectedFile(null);
                            fetchAllLocalAreasData();
                        } else if (result === 'Local Areas Details Already Existed') {
                            toast.warn(result);
                            fileInputRef.current.value = null;
                            setSelectedFile(null);
                        }
                    } else {
                        toast.error("Unexpected response status");
                    }
                } catch (error) {
                    toast.error("Error uploading file");
                }
            }
        }
    };

    return (
        <>
            <Card>
                <Card.Body className='p-2'>
                    <StyledButton className='my-2 me-1 ms-2' title='Add Local Area' onClick={handleOpenTemplateDialog}>
                        <i class="bi bi-plus"></i>
                    </StyledButton>

                    <input
                        type="file"
                        name='fileName'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".yaml, .yml, .csv, .gml, .json, .xlsx"
                        onChange={handleFileChange}
                    />
                    <StyledButton className='ms-1' onClick={handleUpload} title='Import YAML/GML/CSV/JSON/XLSX'><i className="bi bi-upload"></i></StyledButton>


                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center w-20'>Name</th>
                                <th className='text-center w-20'>Description</th>
                                <th className='text-center w-20'>Area Type</th>
                                <th className='text-center w-20'>Message Type</th>
                                <th className='text-center w-5'>Update</th>
                                <th className='text-center w-5'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <AddLocalArea openModel={showAddLocalAreaDialog} closeModel={setShowLocalAreaDialog} onAdd={() => {
                fetchAllLocalAreasData();
            }} localAreaData={selectedLocalArea} isEditMode={updateItem} showFormCoordinates={showFormCoordinates}
                setShowFormCoordinates={setShowFormCoordinates} />

            <CustomConfirmModel
                show={showConfirmDeleteModal} title="Local Area"
                content={'Are you sure you want to delete  LocalArea ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteLocalArea} />

        </>
    )
}

export default LocalArea;