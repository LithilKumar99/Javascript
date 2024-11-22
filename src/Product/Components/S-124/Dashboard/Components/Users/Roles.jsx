import React, { useEffect, useRef, useState } from 'react'
import { Card, Table, Stack } from 'react-bootstrap'
import { StyledButton } from '../../../../../Reusable/StyledComponent';
import AddRole from './AddRole';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import axios from 'axios';
import { toast } from 'react-toastify';
import $ from 'jquery';
import { s124_NavWarn_Apis } from '../../../config';

function Roles() {

    const [showAddTemplateDialog, setShowTemplateDialog] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [deletedItem, setDeletedItem] = useState(null);

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [templateData, setTemplateData] = useState([]);
    const [updateItem, setUpdateItem] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchAllRoles();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'Role Name', className: 'text-start w-20', data: 'role' },
                { title: 'Description', className: 'text-start w-20', data: 'description' },
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
                console.log("getrowfor delete", rowData)
                if (rowData) {
                    setDeletedItem(rowData?.role_id);
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

    const fetchAllRoles = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllRoles}`);
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
            const deleteresponse = await axios.delete(`${s124_NavWarn_Apis.deleteRole}/${deletedItem}`);
            const result = await deleteresponse.data;

            if (result == 'Role Details Cannot Deleted Because The Existing Role Is assigned to 1 users') {
                toast.warn(result);
            } else {
                toast.success(result);
                fetchAllTemplateData();
            }
        } catch (error) {
            toast.error('Error deleting Provider: ' + error.message);
        }
    }

    return (
        <>
            <Card className='my-2'>
                <Card.Header>
                    <Stack direction="horizontal">
                        <h5 className='mb-0'>Roles</h5>
                        <StyledButton className='ms-auto' title='Add Role' onClick={handleOpenTemplateDialog}>
                            <i class="bi bi-plus"></i>
                        </StyledButton>
                    </Stack>
                </Card.Header>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center w-20'>Role Name</th>
                                <th className='text-center w-20'>Description</th>
                                <th className='text-center w-5'>Update</th>
                                <th className='text-center w-5'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <AddRole openModel={showAddTemplateDialog} closeModel={setShowTemplateDialog} onAdd={() => {
                fetchAllTemplateData();
            }} templateData={selectedTemplate} isEditMode={updateItem} />

            <CustomConfirmModel
                show={showConfirmDeleteModal} title="Role"
                content={'Are you sure you want to delete the Role ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteTemplate} />

        </>
    )
}

export default Roles;