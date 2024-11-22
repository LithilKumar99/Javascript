import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, Modal, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import AddExchangeSet from './AddExchangeSet';
import $ from 'jquery';
import { StyledButton, CloseButton } from '../../../../Reusable/StyledComponent';
import CustomConfirmModel from '../../../../Reusable/CustomConfirmModel';
import { nodeServerUrl } from '../../../../../appConfig';
import { useColor } from '../../../../../Context/ColorContext';
import { endpoints } from '../../config';

const ExchangeSet = () => {

    const [show, setShow] = useState(false);
    const { backgroundColor, textColor, borderColor, cardbodyColor, fontFamily } = useColor();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [deleteExchangesetId, setDeleteExchangesetid] = useState();
    const staticTableref = useRef(null);
    const dataTableRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        if (staticTableref.current && !dataTableRef.current) {
            const columns = [
                { title: 'Agency', className: 'text-center', data: 'agency' },
                { title: 'Stored', className: 'text-center', data: 'stored' },
                { title: 'Country', className: 'text-center', data: 'country' },
                { title: 'Created', className: 'text-center', data: 'created' },
                { title: 'Updated', className: 'text-center', data: 'updated' },
                {
                    title: 'Delete',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return generateexchangeDeleteButtonHTML(row.exchangeSet);
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

        getExchangeData();
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, []);

    const getExchangeData = async () => {
        try {

            const response = await axios.get(`${nodeServerUrl}/exchangeset`);

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
                console.error('Invalid exchnageset format:', response.data);
            }

        } catch (error) {
            console.error('Error fetching exchangeset:', error);
        }
    };

    const generateexchangeDeleteButtonHTML = (exchangeSet) => {
        return `<i class="bi bi-trash text-danger" style="cursor: pointer;" title="Delete" onclick="handleExchangeDeleteConfirmation('${exchangeSet}')"></i>`;
    };

    window.handleExchangeDeleteConfirmation = (exchnageid) => {
        setShowModal(true);
        setDeleteExchangesetid(exchnageid)
    }

    const handleDeleteExchangeset = async (e) => {
        try {

            const deleteresponse = await axios.delete(`${nodeServerUrl}/exchangeset/${deleteExchangesetId}`);
            const result = await deleteresponse.data;
            if (result.success === true) {
                toast.success(result.message);
                const dataTable = $(staticTableref.current).DataTable();
                const rowIndex = dataTable.rows().indexes().toArray().find(index => {
                    return dataTable.row(index).data().exchangeSet === deleteExchangesetId;
                });
                if (rowIndex !== undefined) {
                    const rowNode = dataTable.row(rowIndex).node();
                    $(rowNode).addClass('d-none');
                }
            } else {
                toast.error('Error deleting Exchange set: ' + deleteresponse.data.message);
            }
        } catch (error) {
            toast.error('Error deleting Exchange set: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Card className='mb-3' style={{ fontFamily: fontFamily, borderColor: borderColor, backgroundColor: cardbodyColor }}>
                <Card.Header className='p-2' style={{ backgroundColor: backgroundColor, color: textColor, borderColor: borderColor }}>
                    <Stack direction="horizontal" gap={3}>
                        <div><h5 className='mb-0'><i className="bi bi-arrow-left-right me-1"></i> Exchange Set</h5></div>
                        <div className="ms-auto">
                            <StyledButton variant="primary" onClick={handleShow}>
                                <i className="bi bi-file-earmark-plus me-1"></i>Add Exchangeset
                            </StyledButton>
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center'>Agency</th>
                                <th>Stored</th>
                                <th className='text-center'>Country</th>
                                <th className='text-center'>Created</th>
                                <th className='text-center'>Updated</th>
                                <th className='text-center'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal show={show}>
                <Modal.Header className='d-flex justify-content-between align-items-center py-2 pe-2' style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h6 className='mb-0'><i className="bi bi-file-earmark-plus me-2"></i>Add Exchangeset</h6></Modal.Title>
                    <CloseButton
                        onClick={handleClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <AddExchangeSet getExchangeData={getExchangeData} closeModal={handleClose} />
                </Modal.Body>
            </Modal>
            <CustomConfirmModel
                show={showModal} title="Exchangeset"
                content={'Are you sure you want to delete the Exchangeset ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteExchangeset} />
        </>
    );
};

export default ExchangeSet;
