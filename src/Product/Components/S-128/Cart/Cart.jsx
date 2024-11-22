import React, { useEffect, useState, useContext } from 'react'
import { Modal, Accordion, ListGroup, Stack } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    CloseButton, StyledButton, StyledLoaderInner, StyledLoaderWraper, StyledMapControlButton
} from '../../../Reusable/StyledComponent';
import { nodeServerUrl } from '../../../../appConfig';
import './Cart.css';
import { useProductFilter } from '../ProductFilter/Context/ProductFilterContext';
import { s128ApiUrl, S1412windLayer } from '../config';
import { useColor } from '../../../../Context/ColorContext';
import { useUtility } from '../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../Context/OlMapContext'

function Cart() {

    const [title] = useState('OscCart');
    const { olMap } = useContext(OLMapContext);
    const { toggleComponent } = useUtility();
    const { checkedItems, removeItem, setCheckedItems, selectedCalenderDate } = useProductFilter();
    const { backgroundColor, textColor, fontFamily } = useColor();
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); setIsLoading(false); };
    const handleShow = () => setShow(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        var cartButtonList = document.getElementById('cartButtonList');

        if (cartButtonList) {
            const cartContainer = document.getElementById('cartContainer');
            if (cartButtonList && olMap && cartContainer != null) {
                cartButtonList.append(cartContainer);
            }
        }
        const registeredUser = sessionStorage.getItem('username');
        const cartDisable = document.getElementById(title);
        if (registeredUser) {
            if (cartDisable) {
                cartDisable.disabled = false;
            }
        } else if (cartDisable) {
            cartDisable.disabled = true;
        }

    }, [olMap]);

    const handleDeleteClick = (item, e) => {
        e.stopPropagation()
        removeItem(item)
    };

    const handleCart = () => {
        toggleComponent(title)
        handleShow();
    }

    const downloadMap = async (checkedItems) => {

        const uniqueItems = checkedItems.filter((item, index, self) =>
            index === self.findIndex(i => i.ID === item.ID && i.chartnumber === item.chartnumber)
        );

        const spatialquery = uniqueItems;
        const dataArray = spatialquery.length > 0 ? spatialquery : [];
        const itemsS1412 = dataArray.filter(item => item.layername === S1412windLayer || item.ID);
        const otherItems = dataArray.filter(item => item.layername !== S1412windLayer);

        const selecteddate = selectedCalenderDate;
        const day = ('0' + selecteddate.getDate()).slice(-2);
        const month = ('0' + (selecteddate.getMonth() + 1)).slice(-2);
        const year = selecteddate.getFullYear();
        const finalDate = `${year}-${month}-${day}`;
        const [yearStr, monthStr, dayStr] = finalDate.split('-');
        const finalmonth = parseInt(monthStr, 10);
        const finalday = parseInt(dayStr, 10);
        const finalyear = parseInt(yearStr, 10);
        const windPoints = [];

        itemsS1412.forEach(item => {

            const numWindpoints = item.ID !== undefined
            for (let i = 0; i < numWindpoints; i++) {
                windPoints.push({
                    year: finalyear,
                    month: finalmonth,
                    hour: 0,
                    day: finalday,
                    leftlon: item.left || '',
                    toplat: item.top || '',
                    rightlon: item.right || '',
                    bottomlat: item.bottom || '',
                });
            }
        });

        const dynamicUrl = `${nodeServerUrl}/windpointsfromsail?`;

        try {

            let listArray = [];
            setIsLoading(true);
            const apiResponses = await Promise.all(windPoints.map(async (queryParamsObject) => {
                const response = await axios.get(dynamicUrl + new URLSearchParams(queryParamsObject).toString());
                const sailtimerobj = response.data;
                const firstObject = Object.values(sailtimerobj)[0];
                if (firstObject === 'Datetime of request is in the past.') {
                    toast.warn(firstObject);
                    return firstObject;
                }
                const obj = JSON.parse(response.data);
                const windpointsfromsail = obj["NOAA GFS"]["data"]
                return windpointsfromsail
            }));

            listArray = listArray.concat(...apiResponses);

            const chunkSize = 9;
            const chunkedArrays = [];
            for (let i = 0; i < listArray.length; i += chunkSize) {
                chunkedArrays.push(listArray.slice(i, i + chunkSize));
            }

            const windgridData = itemsS1412.map((item, index) => ({
                gridId: item.ID !== undefined ? item.ID : '',
                date: finalDate,
                bottomlat: item.bottom || '',
                leftlon: item.left || '',
                rightlon: item.right || '',
                toplat: item.top || '',

                windPoints: chunkedArrays[index].map(chunkItem => ({
                    latitude: chunkItem.latitude || 0,
                    longitude: chunkItem.longitude || 0,
                    windSpeed: chunkItem.windSpeed || 0,
                    windDirection: chunkItem.windDirection || 0
                }))
            }));

            const storedItems = spatialquery.map(item => item.chartnumber || '');
            const nonEmptyFiles = storedItems.filter(item => item !== '');
            const countryCode = otherItems.length > 0 && otherItems[0].country_code ? otherItems[0].country_code : 'CA';
            const producerCode = otherItems.length > 0 && otherItems[0].producercode ? otherItems[0].producercode : 'CCG';

            const requestBody = {
                files: nonEmptyFiles.length > 0 ? nonEmptyFiles : [],
                countryname: countryCode,
                agencycode: producerCode,
                windgrid: windgridData
            };

            try {
                const response = await fetch(`${s128ApiUrl}/exchangeset/download`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const contentDisposition = response.headers.get('content-disposition');
                    const filenameMatch = contentDisposition && contentDisposition.match(/filename=(.+)$/);

                    const filename = filenameMatch ? filenameMatch[1] : 'download.zip';

                    const blob = await response.blob();
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                setIsLoading(false);

            } catch (error) {
                toast.warn(error);
                setIsLoading(false);
            }

        } catch (error) {
            toast.warn(error);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const storedCheckedItemsString = sessionStorage.getItem('checkedItems');
        const storedCheckedItems = JSON.parse(storedCheckedItemsString);
        if (storedCheckedItems && storedCheckedItems.length > 0) {
            setCheckedItems(storedCheckedItems);
        }
    }, []);

    useEffect(() => {
        sessionStorage.removeItem('checkedItems');
        if (sessionStorage.getItem('sessionId')) {
            sessionStorage.setItem('checkedItems', JSON.stringify(checkedItems));
            console.log("checkedItems stored in sessionStorage:", checkedItems);
        }
    }, [checkedItems, setCheckedItems]);

    return (
        <>
            <div id='cartContainer' style={{ position: "relative" }}>
                <StyledMapControlButton title={title} id={title} className='p-1 mb-1'
                    onClick={handleCart}
                >
                    <i className="bi bi-cart3" />
                    <span className="px-1 py-0 bg-danger rounded-circle cartcount">{checkedItems.reduce((count, item, index, self) => {
                        if (self.findIndex(i => i.ID === item.ID && i.chartnumber === item.chartnumber) === index) {
                            count++;
                        }
                        return count;
                    }, 0)}
                    </span>
                </StyledMapControlButton>
            </div>

            <Modal show={show} onHide={handleClose} centered id="CartModalBox" size='xl' style={{ fontFamily: fontFamily }}>
                <Modal.Header className='d-flex justify-content-between align-items-center py-2 pe-2' style={{ backgroundColor: backgroundColor, color: textColor }}>
                    <Modal.Title><h6 className='mb-0'><i className='bi bi-cart3 me-2'></i>Cart Products</h6></Modal.Title>
                    <CloseButton
                        onClick={handleClose}
                        className='ms-auto'
                    ><i className='bi bi-x'></i>
                    </CloseButton>
                </Modal.Header>
                <Modal.Body>
                    {isLoading === true ? (
                        <StyledLoaderWraper>
                            <StyledLoaderInner />
                        </StyledLoaderWraper>
                    ) : null}
                    {checkedItems.length === 0 && (
                        <h4 className='mx-auto text-center text-secondary'>No items are added into cart</h4>
                    )}
                    <Accordion defaultActiveKey="0" style={{ maxHeight: '500px', overflowY: 'auto' }} className="cartListAccord">
                        {checkedItems.map((item, index) => {
                            const isDuplicate = checkedItems.slice(0, index).some(prevItem =>
                                prevItem.ID === item.ID && prevItem.chartnumber === item.chartnumber
                            );
                            if (!isDuplicate) {
                                return (
                                    <Accordion.Item key={index} eventKey={index.toString()}>
                                        <Accordion.Header className="w-100">
                                            <Stack direction="horizontal" className='w-100 me-5'>
                                                <div className="p-2">
                                                    {item.ID}
                                                    {item.chartnumber}
                                                </div>
                                                <div className="p-2 ms-auto">

                                                    <i className="bi bi-trash text-danger" title="Delete" onClick={(e) => handleDeleteClick(item, e)}></i>
                                                </div>
                                            </Stack>
                                        </Accordion.Header>
                                        <Accordion.Body style={{ maxHeight: '200px', overflowY: 'auto' }} className='p-1'>
                                            <ListGroup>
                                                {Object.entries(item).map(([key, value]) => (
                                                    key !== 'layername' && (
                                                        <ListGroup.Item key={key} className='py-1'>
                                                            <strong>{key}:</strong> {value}
                                                        </ListGroup.Item>
                                                    )
                                                ))}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    {checkedItems.length !== 0 && (
                        <StyledButton onClick={() => downloadMap(checkedItems)} id="downloadBtn">Download</StyledButton>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Cart;
