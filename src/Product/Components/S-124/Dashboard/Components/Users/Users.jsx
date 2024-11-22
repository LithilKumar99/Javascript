import React, { useEffect, useRef, useState } from 'react'
import { Card, Table, Stack } from 'react-bootstrap'
import { StyledButton } from '../../../../../Reusable/StyledComponent';
import AddUser from './AddUser';
import CustomConfirmModel from '../../../../../Reusable/CustomConfirmModel';
import axios from 'axios';
import { toast } from 'react-toastify';
import $ from 'jquery';
import { s124_NavWarn_Apis } from '../../../config';

function Users() {

    const [showAddTemplateDialog, setShowTemplateDialog] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [deletedItem, setDeletedItem] = useState(null);

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [userData, setUserData] = useState([]);
    const [updateItem, setUpdateItem] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchAllUserData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'User Name', className: 'text-start', data: 'username' },
                { title: 'First Name', className: 'text-start', data: 'first_name' },
                { title: 'Last Name', className: 'text-start', data: 'last_name' },
                { title: 'User Role', className: 'text-start', data: 'role' },
                { title: 'Email', className: 'text-start', data: 'email_id' },
                { title: 'Phone Number', className: 'text-center', data: 'phone_no' },
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
                data: userData,
                columns: columns,
                paging: true,
                lengthMenu: [5, 10, 25, 50],
                pageLength: 5,
                responsive: true,
            });

            dataTableRef.current = dataTable;

            $(staticTableref.current).on('click', 'i[title="Update"]', function () {
                const rowData = dataTable.row($(this).parents('tr')).data();
                console.log("rowData", rowData)
                if (rowData) {
                    setSelectedUser(rowData);
                    setUpdateItem(true);
                    setShowTemplateDialog(true);
                }

            });

            $(staticTableref.current).on('click', 'i[title="Delete"]', function () {
                const rowData = dataTable.row($(this).parents('tr')).data();
                console.log("rowData", rowData)
                if (rowData) {
                    setDeletedItem(rowData?.user_id);
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
    }, [userData]);

    const fetchAllUserData = async () => {
        try {
            const response = await axios.get(`${s124_NavWarn_Apis.getAllUsers}`);
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    setUserData(response.data);
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

    const handleDeleteUser = async () => {
        try {
            const deleteresponse = await axios.delete(`${s124_NavWarn_Apis.deleteUser}/${deletedItem}`);
            const result = await deleteresponse.data;
            console.log("deleteresponse", deleteresponse)
            if (result == 'User Deleted Successfully') {
                toast.success(result);
                fetchAllUserData();
            }
        } catch (error) {
            toast.error('Error deleting User: ' + error.message);
        }
    }

    return (
        <>
            <Card className='my-2'>
                <Card.Header>
                    <Stack direction="horizontal">
                        <h5 className='mb-0'>Users</h5>
                        <StyledButton className='ms-auto' title='Add User' onClick={handleOpenTemplateDialog}>
                            <i class="bi bi-plus"></i>
                        </StyledButton>
                    </Stack>
                </Card.Header>
                <Card.Body className='p-2'>

                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-start w-20'>User Name</th>
                                <th className='text-start w-10'>First Name</th>
                                <th className='text-start w-10'>Last Name</th>
                                <th className='text-start w-10'>User Role</th>
                                <th className='text-start w-20'>Email</th>
                                <th className='text-center w-10'>Phone Number</th>
                                <th className='text-center w-5'>Update</th>
                                <th className='text-center w-5'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <AddUser openModel={showAddTemplateDialog} closeModel={setShowTemplateDialog} onAdd={() => {
                fetchAllUserData();
            }} userData={selectedUser} isEditMode={updateItem} />

            <CustomConfirmModel
                show={showConfirmDeleteModal} title="user"
                content={'Are you sure you want to delete user ?'}
                onHide={handleCloseModal} onSaveChanges={handleDeleteUser} />

        </>
    )
}

export default Users;