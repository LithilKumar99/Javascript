import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import './Sidebar.css';
import { useBuilderContext } from '../../../Context/BuilderProvider';

function WidgetList({ widgetList }) {

    const { updateDraggedComponents } = useBuilderContext();

    const handleDragStart = (dragComponent) => {
        updateDraggedComponents(dragComponent);
    };

    return (
        <Row className='mt-2'>
            {widgetList.map((widget, index) => (
                <Col xs={3} key={index} className="text-center">
                    <Button
                        id='standard-button'
                        className='standard-button'
                        variant='primary'
                        draggable
                        onDragStart={() => handleDragStart(widget.widget)}
                        title={widget.title}
                    >
                        {widget.icon}
                    </Button>
                    <p
                        className='my-2'
                        style={{
                            fontSize: "10px",
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            textAlign: 'center',
                        }}
                    >
                        {widget.title}
                    </p>
                </Col>
            ))}
        </Row>
    );
}

export default WidgetList;
