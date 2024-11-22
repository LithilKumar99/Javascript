import React, { useContext } from 'react'
import { ListGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image.js';
import { useColor } from '../../../../../Context/ColorContext';
import { useProductFilter } from '../Context/ProductFilterContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { S1412windLayer } from '../../config';

function UsageBands() {

    const { olMap } = useContext(OLMapContext);
    const { borderColor, backgroundColor, typoColor, fontFamily, textColor } = useColor();

    const { bands, updateCqlFilterString, setbands, selectedMapLayer,
        selectedAgencyCode, selectedProductTypes } = useProductFilter();

    const usgabandbox = {
        maxHeight: '170px',
        height: 'auto',
        overflow: 'auto',
    }

    const handleOnChange = (event) => {
        const layersList = olMap.getLayers().getArray();
        const { name, checked } = event.target;
        const layerTitle = selectedMapLayer;
        const agencyCode = selectedAgencyCode;

        const seletedBands = bands.map(opt => ({
            ...opt,
            selected: opt.band === name ? !opt.selected : opt.selected,
        }));

        const filterString = seletedBands
            .filter(opt => opt.selected)
            .map(opt => `navusage IN ('${opt.band}') AND producercode='${agencyCode}'`)
            .join(' OR ');

        const finalFilterString = `(${filterString})`;

        for (const lyr of layersList) {
            if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                if (layerTitle === lyr.get('title')) {
                    lyr.setVisible(true);
                    const params = lyr.getSource().getParams();
                    params.cql_filter = finalFilterString;
                    lyr.getSource().updateParams(params);
                }
            }
        }
        setbands(seletedBands);
        updateCqlFilterString(filterString);
    };

    const handleOnSelectAll = (e) => {
        const { checked } = e.target;
        activeBands(checked);
    };

    const activeBands = (checked) => {
        const layersList = olMap.getLayers().getArray();
        let filterString = '';
        let updatedBands = bands.map(band => ({ ...band, selected: checked }));

        if (!checked) {
            layersList.forEach(layer => {
                if (layer instanceof ImageLayer && layer.getSource() instanceof ImageWMS) {
                    if (selectedMapLayer === layer.get('title')) {
                        layer.setVisible(false);
                    }
                }
            });
            filterString = 'UnSelectedAll';
        } else {
            VisibleAllData(selectedMapLayer);
            const filterConditions = updatedBands
                .map(band => `navusage='${band.band}' AND producercode='${selectedAgencyCode}'`)
                .join(' OR ');
            filterString = `(${filterConditions})`;
        }

        setbands(updatedBands);
        updateCqlFilterString(filterString);
    };


    const VisibleAllData = (selectedMapLayer = "") => {
        if (olMap) {
            const layersList = olMap.getLayers().getArray();
            layersList.forEach(layer => {
                if (layer instanceof ImageLayer && layer.getSource() instanceof ImageWMS) {
                    if (selectedMapLayer) {
                        if (selectedMapLayer === layer.get('title')) {
                            layer.setVisible(true);
                            const params = layer.getSource().getParams();
                            params.cql_filter = null;
                            layer.getSource().updateParams(params);
                        }
                    } else {
                        layer.setVisible(true);
                        const params = layer.getSource().getParams();
                        params.cql_filter = null;
                        layer.getSource().updateParams(params);
                    }
                }
            });
        }
    }

    const renderCheckboxList = () => {
        return (
            <>
                {bands && bands.map(opt => (
                    <ListGroup.Item key={opt.value} style={{ borderColor: borderColor }} className='px-2'>
                        <Form.Check type="switch" style={{ borderColor: borderColor }}>
                            <Form.Check.Input
                                type="checkbox"
                                name={opt.band}
                                onChange={e => handleOnChange(e)}
                                checked={opt.selected}
                                className="me-2 d-flex"
                                style={{ backgroundColor: opt.selected ? backgroundColor : 'transparent', borderColor: borderColor }}
                                id={opt.band}
                            />
                            <Form.Check.Label className="ms-auto" style={{ color: typoColor }}>{opt.value}</Form.Check.Label>
                        </Form.Check>
                    </ListGroup.Item>
                ))}
            </>
        );
    }

    const renderSelectAllCheckbox = () => {
        return (
            <>
                {
                    bands && <ListGroup.Item style={{ borderColor: borderColor }} className='px-2'>
                        <Form.Check type="switch" style={{ borderColor: borderColor }}>
                            <Form.Check.Input
                                className="me-1"
                                type="checkbox"
                                onChange={e => handleOnSelectAll(e)}
                                checked={bands.every(opt => opt.selected)}
                                style={{ backgroundColor: bands.every(opt => opt.selected) ? backgroundColor : 'transparent', borderColor: borderColor }}
                            />
                            <Form.Check.Label style={{ color: typoColor, borderColor: borderColor }}>{`Select All`}</Form.Check.Label>
                        </Form.Check>
                    </ListGroup.Item>
                }
            </>
        )
    }

    return (
        <>
            {selectedMapLayer !== S1412windLayer &&
                selectedProductTypes.length > 0 &&
                selectedProductTypes.map(type => (
                    <>
                        <div className='mt-3' style={{ fontFamily: fontFamily }}>
                            <h6 className="rounded-top p-2 mb-0 border-bottom-0"
                                style={{ color: textColor, backgroundColor: backgroundColor, border: `1px solid ${borderColor}` }}>{`${type} Usage Bands`}</h6>
                            <ListGroup className='linearBgCard' style={usgabandbox}>
                                {renderSelectAllCheckbox()}
                                {renderCheckboxList()}
                            </ListGroup>
                        </div>
                    </>
                ))}
        </>
    )
}

export default UsageBands;