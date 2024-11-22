import React, { useEffect, useRef, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import axios from 'axios';
import $ from 'jquery';
import { s124_NavWarn_Apis } from '../../../config';

function Relation() {

    const dataTableRef = useRef(null);
    const staticTableref = useRef(null);
    const [templateData, setTemplateData] = useState([]);

    useEffect(() => {
        fetchAllTemplateData();
    }, []);

    useEffect(() => {
        if (staticTableref.current) {
            const columns = [
                { title: 'Id', className: 'text-center w-10', data: 'id' },
                { title: 'General Type', className: 'text-start w-30', data: 'general_type' },
                { title: 'Category', className: 'text-start w-30', data: 'category' },
                { title: 'Type Details', className: 'text-start w-30', data: 'type_details' },
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
            const response = await axios.get(`${s124_NavWarn_Apis.getRelations}`);
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
            console.error('Error fetching relations:', error);
        }
    };
    return (
        <>
            <Card>
                <Card.Body className='p-2'>
                    <Table responsive bordered striped className='mb-0 w-100' ref={staticTableref}>
                        <thead>
                            <tr>
                                <th className='text-center w-10'>id</th>
                                <th className='text-start w-30'>General Type</th>
                                <th className='text-start w-30'>Category</th>
                                <th className='text-start w-30'>Type Details</th>
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

export default Relation;