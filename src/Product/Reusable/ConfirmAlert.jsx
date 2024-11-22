import React from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './ConfirmAlert.css';

const ConfirmAlert = ({ message, handleDelete }) => {

    const handleClick = () => {
        const options = {
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        };

        Swal.fire(options).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
                Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    timer: 3000
                });
            }
        });
    };

    return (
        <>
            <Button className='ms-2' variant='danger' title='Delete' onClick={handleClick}> <i className='bi bi-trash'></i></Button>
        </>
    );
};

export default ConfirmAlert;
