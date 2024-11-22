import React, { useRef, useState, useEffect } from "react";
import { Container, Button, Stack, Row, Col, Form, Card, Table } from "react-bootstrap";
import $ from 'jquery';
import axios from "axios";
import './FeatureCatalogue.css';
import { toast } from "react-toastify";
import CustomConfirmModel from "../../../../../Reusable/CustomConfirmModel";
import { s124_NavWarn_Apis } from "../../../config";

function FeatureCatalogue() {

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [templateData, setTemplateData] = useState([]);

    const initialData = {
        formData: '',
        fileName: '',
        isShowModel: false
    }

    const [isConfirmOverWriteObj, setIsConfirmOverWriteObj] = useState(initialData)

    useEffect(() => {
        fetchAllTemplateData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'Id', className: 'text-center w-5', data: 'id' },
                { title: 'File Name', className: 'text-start w-40', data: 'fileName' },
                { title: 'Version', className: 'text-start w-5', data: 'version' },
                {
                    title: 'Import Date',
                    className: 'text-start w-30',
                    data: 'importDate',
                    render: function (data) {
                        return formatDate(data);
                    }
                },
                {
                    title: 'Update Date',
                    className: 'text-start w-30',
                    data: 'updateDate',
                    render: function (data) {
                        return data ? formatDate(data) : '';
                    }
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
            const response = await axios.get(`${s124_NavWarn_Apis.getAllfeatureCatalogueLogs}`);
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    console.log(response.data);
                    setTemplateData(response.data);
                } else {
                    console.warn('Unexpected data format: response.data is not an array.');
                }
            } else {
                console.warn('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Error fetching general types:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const time = date.toTimeString().split(' ')[0];
        return `${day}-${month}-${year}T${time}`;
    };

    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension !== 'xml') {
                toast.info('Please upload a valid .xml file.');
                fileInputRef.current.value = null;
            } else {
                setSelectedFile(event.target.files[0]);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            toast.warn("Please upload Feature catalogue file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(`${s124_NavWarn_Apis.importFeatureCatalogue}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                if (String(response.data).includes('Already Imported')) {
                    setIsConfirmOverWriteObj({
                        formData: formData,
                        fileName: selectedFile,
                        isShowModel: true
                    });
                } else {
                    toast.success(response.data);
                    fetchAllTemplateData();
                    fileInputRef.current.value = null;
                    setSelectedFile(null);
                }
            }
        } catch (error) {
            toast.error("Error uploading file");
        }
    };

    const handleReset = () => {
        fileInputRef.current.value = null;
        setSelectedFile(null);
    };

    const handleCloseModel = () => {
        setIsConfirmOverWriteObj(initialData);
    }

    const handleOverWriteFeatureCatalogue = async () => {

        try {

            const response = await axios.put(`${s124_NavWarn_Apis.updateFeatureCatalogue}`, isConfirmOverWriteObj.formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data) {
                toast.success(response.data);
                fetchAllTemplateData();
                fileInputRef.current.value = null;
                setSelectedFile(null);
                setIsConfirmOverWriteObj(initialData);
            }
        } catch (error) {
            console.log("Error while overwriting the file", error);
        }
    }

    return (
        <>
            <Container className="b_border">
                <Row className="h-100">
                    <Col md={3}></Col>
                    <Col md={6} className="d-flex flex-column align-items-center align-content-center justify-content-center">
                        <Card className="w-100" variant="secondary">
                            <Card.Header>S124 Feature Catalogue</Card.Header>
                            <Card.Body>
                                <div className="input-group customerFileBtn mb-3">
                                    <Form.Control
                                        type="file"
                                        className="form-control"
                                        id="inputGroupFile"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        accept=".xml"
                                    />
                                    <label className="input-group-text btn btn-secondary" style={{ cursor: 'pointer' }} htmlFor="inputGroupFile">
                                        Browse
                                    </label>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex justify-content-center w-100">
                                    <Stack direction="horizontal" gap={1}>
                                        <Button
                                            variant="outline-secondary"
                                            title="Save"
                                            onClick={handleSubmit}
                                        >
                                            <i className="bi bi-upload"></i>
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleReset}
                                            title="Reset"
                                        >
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </Button>
                                    </Stack>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={3}></Col>
                </Row>
                <Card className="mt-2">
                    <Card.Body className='p-2'>
                        <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                            <thead>
                                <tr>
                                    <th className='text-center w-5'>id</th>
                                    <th className='text-center w-40'>fileName</th>
                                    <th className='text-center w-5'>version</th>
                                    <th className='text-center w-30'>importDate</th>
                                    <th className='text-center w-30'>updateDate</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>

            <CustomConfirmModel
                show={isConfirmOverWriteObj.isShowModel} title="S-124 Feature Catalogue"
                content={`Are you sure you want to overwrite selected feature catalogue ?`}
                onHide={handleCloseModel} onSaveChanges={handleOverWriteFeatureCatalogue} />
        </>

    );
}
export default FeatureCatalogue;
