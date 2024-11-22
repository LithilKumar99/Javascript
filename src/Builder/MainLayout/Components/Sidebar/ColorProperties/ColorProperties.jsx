import React from 'react';
import { Accordion, Form, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useColor } from '../../../../../Context/ColorContext';

function ColorProperties() {

    const { projectId } = useParams();

    const { backgroundColor, textColor, borderColor, typoColor, cardbodyColor,
        fontFamily, handleBackgroundColorChange, handleTextColorChange,
        handleBorderColorChange, handleTypoColorChange,
        handlecardbodyColorChange, handleFontFamilyChange, fillColor, handleFillColorChange,
        strokeColor, handleStrokeColorChange, circleColor, handleCircleColorChange } = useColor();

    let defaultfont = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue' sans - serif`;

    const fontOptions = [
        'Select',
        defaultfont,
        'Arial, sans-serif',
        'Times New Roman, serif',
        'Courier New, monospace',
        'Verdana, Geneva, sans-serif',
    ];
    return (
        <>
            <Accordion defaultActiveKey="0" className='BuilderSidebarAccordion'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Component Styles</Accordion.Header>
                    <Accordion.Body className='p-2 rounded-4'>
                        <Table responsive >
                            <tbody>
                                <tr>
                                    <td className="w-50">Background-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={backgroundColor}
                                            onChange={(e) => handleBackgroundColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Text-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={textColor}
                                            onChange={(e) => handleTextColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Border-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={borderColor}
                                            onChange={(e) => handleBorderColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Typographic Tag</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={typoColor}
                                            onChange={(e) => handleTypoColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Input type and Cards</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={cardbodyColor}
                                            onChange={(e) => handlecardbodyColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Font-Family</td>
                                    <td>
                                        <Form.Select
                                            value={fontFamily}
                                            onChange={(e) => {
                                                if (e.target.value === 'Select') {
                                                    return
                                                }
                                                handleFontFamilyChange(projectId, e.target.value)
                                            }}
                                        >
                                            {fontOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Vector Styles</Accordion.Header>
                    <Accordion.Body className='p-2 rounded-4'>
                        <Table responsive >
                            <tbody>
                                <tr>
                                    <td className="w-50">Fill-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={fillColor}
                                            onChange={(e) => handleFillColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Stroke-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={strokeColor}
                                            onChange={(e) => handleStrokeColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Circle-Color</td>
                                    <td>
                                        <Form.Control
                                            size='sm'
                                            type='color'
                                            value={circleColor}
                                            onChange={(e) => handleCircleColorChange(projectId, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default ColorProperties;
