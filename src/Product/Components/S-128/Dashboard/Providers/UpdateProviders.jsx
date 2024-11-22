import React, { useState } from 'react';
import { StyledButton, StyledLoaderInner, StyledLoaderWraper } from "../../../../Reusable/StyledComponent";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { nodeServerUrl } from '../../../../../appConfig';

const UpdateProviderForm = ({ details, fetchProviderData, closeModal }) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        agencyCode: details['Agency Codes'],
        agencyName: details['Agency Name'],
        agencyNumber: details['Agency Number'],
        countryName: details['Country Name'],
        countryCode: details['Country Code'],
        Members: details.Members,
    });

    const [errors, setErrors] = useState({
        agencyCode: '',
        agencyName: '',
        agencyNumber: '',
        countryName: '',
        countryCode: '',
        Members: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setErrors({
            ...errors,
            [name]: '',
        });
    };
    const handleValidation = () => {
        let formIsValid = true;
        const newErrors = { ...errors };
        const requiredFields = ['agencyCode', 'agencyName', 'agencyNumber', 'countryName', 'countryCode', 'Members'];
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${field} is required.`;
                formIsValid = false;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation()) {
            toast.error('Please fill in all required fields.');
            return;
        }
        let provideobj = {

            "id": '',
            "Agency Codes": formData.agencyCode,
            "Agency Name": formData.agencyName,
            "Agency Number": formData.agencyNumber,
            "Country Name": formData.countryName,
            "Country Code": formData.countryCode,
            "Members": formData.Members
        }

        try {
            setLoading(true);
            const response = await axios.put(`${nodeServerUrl}/providers/${details.id}`, provideobj, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success === true) {
                setLoading(false);
                toast.success('Provider updated successfully');
                fetchProviderData();
                closeModal();
            } else {
                setLoading(false);
                toast.error('Error updating provider: ' + response.data.message);
            }

        } catch (error) {
            setLoading(false);
            toast.error('Error updating provider: ' + error.message);
        }
    };

    return (
        <>
            {loading && (
                <StyledLoaderWraper>
                    <StyledLoaderInner />
                </StyledLoaderWraper>
            )}
            <Form onSubmit={handleSubmit}>

                <Form.Group className='mb-3' controlId='agencyCode'>
                    <Form.Control
                        type='text'
                        placeholder='Agency Code'
                        name='agencyCode'
                        value={formData.agencyCode}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='agencycodeHelp' className='text-danger form-text'>
                        {errors.agencyCode}
                    </small>
                </Form.Group>
                <Form.Group className='mb-3' controlId='agencyName'>
                    <Form.Control
                        type='text'
                        placeholder='Agency Name'
                        name='agencyName'
                        value={formData.agencyName}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='agencyNameHelp' className='text-danger form-text'>
                        {errors.agencyName}
                    </small>
                </Form.Group>
                <Form.Group className='mb-3' controlId='agencyNumber'>
                    <Form.Control
                        type='text'
                        placeholder='Agency Number'
                        name='agencyNumber'
                        value={formData.agencyNumber}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='agencyNumberHelp' className='text-danger form-text'>
                        {errors.agencyNumber}
                    </small>
                </Form.Group>
                <Form.Group className='mb-3' controlId='countryName'>
                    <Form.Control
                        type='text'
                        placeholder='Country Name'
                        name='countryName'
                        value={formData.countryName}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='countryNameHelp' className='text-danger form-text'>
                        {errors.countryName}
                    </small>
                </Form.Group>
                <Form.Group className='mb-3' controlId='countryCode'>
                    <Form.Control
                        type='text'
                        placeholder='Country Code'
                        name='countryCode'
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='countryCodeHelp' className='text-danger form-text'>
                        {errors.countryCode}
                    </small>
                </Form.Group>

                <Form.Group className='mb-3' controlId='Members'>
                    <Form.Control
                        type='text'
                        placeholder='Members'
                        name='Members'
                        value={formData.Members}
                        onChange={handleInputChange}
                        autoComplete='off'
                    />
                    <small id='MembersHelp' className='text-danger form-text'>
                        {errors.Members}
                    </small>
                </Form.Group>

                <StyledButton type='submit' className='w-100 btn_clr'>
                    Submit
                </StyledButton>
            </Form>
        </>
    );
};

export default UpdateProviderForm;