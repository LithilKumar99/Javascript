import React, { useEffect, useState, useRef } from 'react';
import { Card, Table, Stack, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddDataSet from './AddDataSet';
import $ from 'jquery';
import { CloseButton, StyledButton } from '../../../../Reusable/StyledComponent';
import CustomConfirmModel from '../../../../Reusable/CustomConfirmModel';
import { useColor } from '../../../../../Context/ColorContext';
import { nodeServerUrl } from '../../../../../appConfig';

const DataSet = () => {

    const { backgroundColor, textColor, borderColor, cardbodyColor, fontFamily } = useColor();
    const [deletedItem, setDeletedItem] = useState(null);
    const [importModalShow, setImportModalShow] = useState(false);
    const handleImportModalClose = () => setImportModalShow(false);
    const [getImportId, setGetImportId] = useState(null);
    const staticTableref = useRef(null);
    const dataTableRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (staticTableref.current && !dataTableRef.current) {
            const columns = [
                { title: 'Dataset ID', className: 'text-center', data: 'dataset_id' },
                { title: 'Created', className: 'text-center', data: 'created' },
                { title: 'Dataset Name', data: 'dataset_name' },
                { title: 'Dataset Type', className: 'text-center', data: 'dataset_type' },
                { title: 'File Format', className: 'text-center', data: 'file_format' },
                { title: 'Product', className: 'text-center', data: 'product' },
                { title: 'Updated', className: 'text-center', data: 'updated' },
                { title: 'Exchange Set ID', data: 'exchange_set_id' },
                {
                    title: 'Delete',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return generateDeleteButtonHTML(row.dataset_id);
                    }
                }
            ];
            const dataTable = $(staticTableref.current).DataTable({
                paging: true,
                lengthMenu: [5, 10, 25, 50],
                pageLength: 5,
                columns: columns,
                React: true,
            });

            dataTableRef.current = dataTable;
        }
        getDataSet();
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, []);

    const getDataSet = async () => {
        try {

            const response = await axios.get(`${nodeServerUrl}/dataset`);

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                if (dataTableRef.current) {
                    const dataTable = dataTableRef.current;
                    dataTable.clear();
                    response.data.forEach(row => {
                        dataTable.row.add(row);
                    });

                    dataTable.draw();
                }
            } else {
                console.error('Invalid dataset format:', response.data);
            }

        } catch (error) {
            console.error('Error fetching dataset:', error);
        }
    };

    const generateDeleteButtonHTML = (datasetId) => {
        return `<i class="bi bi-trash text-danger" style="cursor: pointer;" title="Delete" onclick="handledatasetDeleteConfirmation('${datasetId}')"></i>`;
    };

    window.handledatasetDeleteConfirmation = async (dataset_id) => {
        setShowModal(true);
        setDeletedItem(dataset_id);
    }

    const handleDeleteProvider = async () => {

        try {
            const deleteResponse = await axios.delete(`${nodeServerUrl}/dataset/${deletedItem}`);
            if (deleteResponse.data.success === true) {
                toast.success('Dataset deleted successfully');
                const dataTable = $(staticTableref.current).DataTable();
                const rowIndex = dataTable.rows().indexes().toArray().find(index => {
                    const rowData = dataTable.row(index).data();
                    const datasetId = rowData.dataset_id;
                    return datasetId == deletedItem;
                });
                if (rowIndex !== undefined) {
                    const rowNode = dataTable.row(rowIndex).node();
                    $(rowNode).addClass('d-none');
                }
            } else {
                toast.error('Error deleting Dataset: ', deleteResponse.data.message);
            }
        } catch (error) {
            toast.error('Error deleting Dataset: ' + error.message);
        }

    };

    const handleExchangeSetProvider = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/exchangeset`);
            const exchangeSetId = response.data.map(obj => obj.exchangeSet);
            setGetImportId(exchangeSetId);
            setImportModalShow(true);
        } catch (error) {
            toast.error('Error getting Dataset: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <Card className='mb-3' style={{ fontFamily: fontFamily, borderColor: borderColor, backgroundColor: cardbodyColor }}>
                <Card.Header className='p-2' style={{ backgroundColor: backgroundColor, color: textColor, borderColor: borderColor }}>
                    <Stack direction="horizontal" gap={3}>
                        <div><h5 className='mb-0'><i className="bi bi-clipboard-data me-1"></i> Data Set</h5></div>
                        <div className="ms-auto">
                            <StyledButton variant="primary" onClick={handleExchangeSetProvider}>
                                <i className="bi bi-file-earmark-plus me-2"></i>Add Dataset
                            </StyledButton>
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center'>Dataset ID</th>
                                <th className='text-center'>Created</th>
                                <th>Dataset Name</th>
                                <th className='text-center'>Dataset Type</th>
                                <th className='text-center'>File Format</th>
                                <th className='text-center'>Product</th>
                                <th className='text-center'>Updated</th>
                                <th>Exchange Set ID</th>
                                <th className='text-center'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>

                </Card.Body>
            </Card>
            <Modal show={importModalShow} onHide={handleImportModalClose}>
                <Modal.Header className='d-flex justify-content-between align-items-center py-2 pe-2' style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h6 className='mb-0'><i className="bi bi-file-earmark-plus me-2"></i>Add Dataset</h6></Modal.Title>
                    <CloseButton
                        onClick={handleImportModalClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body>
                    {getImportId && <AddDataSet getImportId={getImportId} closeModal={handleImportModalClose} getDataSet={getDataSet} />}
                </Modal.Body>
            </Modal>

            <CustomConfirmModel
                show={showModal} title="Dataset"
                content={'Are you sure you want to delete the Dataset ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteProvider} />
        </>
    );
};


export default DataSet;
