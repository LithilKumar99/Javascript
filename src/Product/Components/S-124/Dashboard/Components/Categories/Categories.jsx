import React, { useEffect, useRef, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import axios from 'axios';
import $ from 'jquery';
import { s124_NavWarn_Apis } from '../../../config';

function Categories() {

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [templateData, setTemplateData] = useState([]);

    useEffect(() => {
        fetchAllTemplateData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'Code', className: 'text-center w-10', data: 'code' },
                { title: 'Category', className: 'text-start w-90', data: 'category' },
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
            const response = await axios.get(`${s124_NavWarn_Apis.getCategories}`);
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
            console.error('Error fetching Categories:', error);
        }
    };
    return (
        <>
            <Card>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center w-10'>Code</th>
                                <th className='text-start w-90'>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}

export default Categories;