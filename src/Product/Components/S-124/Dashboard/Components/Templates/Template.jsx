import React, { useEffect, useRef, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import AddTemplate from './AddTemplate';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import { StyledButton } from '../../../../../Reusable/StyledComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import $ from 'jquery';
import { s124_NavWarn_Apis } from '../../../config';

function Template() {

    const [showAddTemplateDialog, setShowTemplateDialog] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [deletedItem, setDeletedItem] = useState(null);

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [templateData, setTemplateData] = useState([]);
    const [updateItem, setUpdateItem] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchAllTemplateData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'General Type', className: 'text-start w-20', data: 'general_type' },
                { title: 'Category', className: 'text-start w-20', data: 'category' },
                { title: 'Type Details', className: 'text-start w-20', data: 'type_details' },
                { title: 'Custom Details', className: 'text-start w-20', data: 'custom_definition' },
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
                data: templateData,
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
                    setSelectedTemplate(rowData);
                    setUpdateItem(true);
                    setShowTemplateDialog(true);
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
    }, [templateData]);

    const fetchAllTemplateData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllTemplates}`);
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    setTemplateData(response.data);
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
        setShowTemplateDialog(true);
        setUpdateItem(false);
    }

    const handleCloseModal = () => {
        setShowConfirmDeleteModal(false);
    }

    const handleDeleteTemplate = async () => {
        try {
            const deleteresponse = await axios.delete(`${s124_NavWarn_Apis.deleteTemplate}/${deletedItem}`);
            const result = await deleteresponse.data;
            if (result == 'Template Deleted Successfully') {
                toast.success(result);
                fetchAllTemplateData();
            }
        } catch (error) {
            toast.error('Error deleting Provider: ' + error.message);
        }
    }

    return (
        <>
            <Card>
                <Card.Body className='p-2'>
                    <StyledButton className='m-2' title='Add template' onClick={handleOpenTemplateDialog}>
                        <i class="bi bi-plus"></i>
                    </StyledButton>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center w-20'>General Type</th>
                                <th className='text-center w-20'>Category</th>
                                <th className='text-center w-20'>Type Details</th>
                                <th className='text-center w-20'>Custom Details</th>
                                <th className='text-center w-5'>Update</th>
                                <th className='text-center w-5'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <AddTemplate openModel={showAddTemplateDialog} closeModel={setShowTemplateDialog} onAdd={() => {
                fetchAllTemplateData();
            }} templateData={selectedTemplate} isEditMode={updateItem} />

            <CustomConfirmModel
                show={showConfirmDeleteModal} title="Template"
                content={'Are you sure you want to delete the template ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteTemplate} />

        </>
    )
}

export default Template;