import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, Modal, Stack } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import $ from 'jquery';
import UpdateProviderForm from './UpdateProviders';
import RegisterProvider from './RegisterProviders';
import { CloseButton, StyledLoaderWraper, StyledLoaderInner, StyledButton } from '../../../../Reusable/StyledComponent';
import CustomConfirmModel from '../../../../Reusable/CustomConfirmModel';
import { nodeServerUrl } from '../../../../../appConfig';
import { useColor } from '../../../../../Context/ColorContext';

const Providers = () => {

    const [details, setDetails] = useState(null);
    const { backgroundColor, textColor, borderColor, cardbodyColor, fontFamily } = useColor();
    const [show, setShow] = useState(false);
    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);
    const handleUpdateModalClose = () => setUpdateModalShow(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const staticTableref = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {

        if (staticTableref.current && !dataTableRef.current) {
            const columns = [
                { title: 'Agency Codes', className: 'text-center', data: 'Agency Codes' },
                { title: 'Agency Name', className: 'text-center', data: 'Agency Name' },
                { title: 'Agency Number', className: 'text-center', data: 'Agency Number' },
                { title: 'Country Name', className: 'text-center', data: 'Country Name' },
                { title: 'Country Code', className: 'text-center', data: 'Country Code' },
                { title: 'Members', className: 'text-center', data: 'Members' },
                {
                    title: 'Update',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return generateUpdateButtonHTML(row.id);
                    }
                },
                {
                    title: 'Delete',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return generateDeleteButtonHTML(row.id);
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
        fetchProviderData();
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, []);

    const fetchProviderData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/providers`);
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
                console.error('Invalid provider format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const generateDeleteButtonHTML = (providerid) => {
        return `<i class="bi bi-trash text-danger" style="cursor: pointer;" title="Delete" onclick="handleproviderDeleteConfirmation('${providerid}')"></i>`;
    };
    const generateUpdateButtonHTML = (providerid) => {
        return `<i class="bi bi-pencil text-danger" style="cursor: pointer;" title="Update" onclick="handleProviderDetails('${providerid}')"></i>`;
    };

    window.handleproviderDeleteConfirmation = async (id) => {
        setDeletedItem(id);
        setShowModal(true);
    }

    window.handleProviderDetails = async (id) => {
        try {
            const response = await axios.get(`${nodeServerUrl}/providers/${id}`);
            setDetails(response.data);
            setUpdateModalShow(true);
        } catch (error) {
            console.error('Error fetching provider details:', error);
        }
    };

    const handleDeleteProvider = async () => {
        try {
            const deleteResponse = await axios.delete(`${nodeServerUrl}/providers/${deletedItem}}`);
            const result = await deleteResponse.data;
            if (result.success === true) {
                toast.success(deleteResponse.data.message);
                const dataTable = $(staticTableref.current).DataTable();
                const rowIndex = dataTable.rows().indexes().toArray().find(index => {
                    return dataTable.row(index).data().id === deletedItem;
                });
                if (rowIndex !== undefined) {
                    const rowNode = dataTable.row(rowIndex).node();
                    $(rowNode).addClass('d-none');
                }
            }
        } catch (error) {
            toast.error('Error deleting Provider: ', error.message);
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
                        <div><h5 className='mb-0'><i className="bi bi-person-lines-fill me-1"></i> Providers</h5></div>
                        <div className="ms-auto">
                            <StyledButton variant="primary" onClick={handleShow}>
                                <i className="bi bi-person-add me-1"></i> Add Provider
                            </StyledButton>
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center'>Agency Codes</th>
                                <th className='text-center'>Agency Name</th>
                                <th className='text-center'>Agency Number</th>
                                <th className='text-center'>Country Name</th>
                                <th className='text-center'>Country Code</th>
                                <th className='text-center'>Members</th>
                                <th className='text-center'>Update</th>
                                <th className='text-center'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='d-flex justify-content-between align-items-center py-2 pe-2' style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h6 className='mb-0'><i className='bi bi-file-plus me-2'></i>Add Provider</h6></Modal.Title>
                    <CloseButton
                        onClick={handleClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body>
                    {loading && (
                        <StyledLoaderWraper>
                            <StyledLoaderInner />
                        </StyledLoaderWraper>
                    )}
                    <RegisterProvider fetchProviderData={fetchProviderData} closeModal={handleClose} />
                </Modal.Body>
            </Modal>
            <Modal show={updateModalShow} onHide={handleUpdateModalClose}>
                <Modal.Header className='d-flex justify-content-between align-items-center py-2 pe-2' style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h6 className='mb-0'><i className='bi bi-pencil-square me-2'></i>Update Provider</h6></Modal.Title>
                    <CloseButton
                        onClick={handleUpdateModalClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body>
                    {details && <UpdateProviderForm details={details} fetchProviderData={fetchProviderData} closeModal={handleUpdateModalClose} />}
                </Modal.Body>
            </Modal>

            <CustomConfirmModel
                show={showModal} title="Provider"
                content={'Are you sure you want to delete the Provider ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteProvider} />
        </>
    );
};

export default Providers;
