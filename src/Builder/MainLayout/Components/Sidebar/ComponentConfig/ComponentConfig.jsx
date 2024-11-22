import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../../../../../appConfig.js';
import ConfirmAlert from '../../../../../Product/Reusable/ConfirmAlert.jsx';
import { useBuilderContext } from '../../../../Context/BuilderProvider.jsx';
import { S102WidgetsList, GeneralwidgetList, MapWidgetList, S124WidgetList, S128WidgetList } from '../../../../../DroppedComponents.jsx';

function ComponentConfig() {

    const { projectId } = useParams();
    const [components, setComponents] = useState([]);
    const { clearDroppedComponents, compareUpdateDraggedComponents,
        deleteComponent } = useBuilderContext();

    useEffect(() => {
        fetchComponents();
    }, []);

    const fetchComponents = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/components/${projectId}`);
            setComponents(response.data);
            if (response.data) {
                clearDroppedComponents();
                response.data.map((item) => {
                    compareUpdateDraggedComponents(item.component);
                });
            }
        } catch (error) {
            toast.warn('error fetching components in dashboard', error);
        }
    };

    const handledeleteComponent = async (component) => {
        try {

            if (component === 'OlMap' && components.length > 1) {
                toast.warn('You are not allowed to delete a Map component first.');
                return false;
            }
            else {
                await axios.delete(`${nodeServerUrl}/components/${component}`);
                fetchComponents();

                deleteComponent(true);
                return true;
            }

        } catch (error) {
            toast.warn('error deleting component in dashboard', error);
        }
    }

    const WidgetIcon = ({ widget }) => {
        const allWidgets = MapWidgetList.concat(...GeneralwidgetList, ...S102WidgetsList, ...S128WidgetList, ...S124WidgetList);
        const selectedWidget = allWidgets.find(item => item.widget === widget);
        if (selectedWidget) {
            return selectedWidget.icon;
        }
        return null;
    };

    const WidgetValue = ({ widget }) => {
        const allWidgets = MapWidgetList.concat(...GeneralwidgetList, ...S102WidgetsList, ...S128WidgetList, ...S124WidgetList);
        const selectedWidget = allWidgets.find(item => item.widget === widget);
        if (selectedWidget) {
            return selectedWidget.title;
        }
        return null;
    };

    return (
        <div style={{ minHeight: 'auto', maxHeight: '390px', height: 'auto', overflow: 'auto' }}>
            {components && components.length > 0 ? <Table striped bordered hover className='text-center mb-0' size='sm' style={{ verticalAlign: 'middle', wordBreak: 'break-all' }}>
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Component</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {components.map(component => (
                        <tr key={component.id}>
                            <td><Button className='p-1' variant='primary' style={{ width: '40px', height: '40px', fontSize: '20px', borderRadius: '0.5rem' }}><WidgetIcon widget={component.component} /></Button></td>
                            <td style={{ verticalAlign: 'middle' }}>
                                <span><WidgetValue widget={component.component} /></span>
                            </td>
                            <td>
                                <ConfirmAlert
                                    message={`Are you sure you want to delete ${component.component} ?`}
                                    handleDelete={() => { handledeleteComponent(component.component) }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table> : <p>
                There are no components are available
            </p>
            }
        </div>
    );
}

export default ComponentConfig;
