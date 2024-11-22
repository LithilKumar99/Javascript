import React from 'react';
import { Card } from 'react-bootstrap';
import logoimg from '../../../../../assets/images/logo.png';
import { useColor } from '../../../../../Context/ColorContext';

const CardLogoImage = () => {

    const { fontFamily, typoColor } = useColor();

    return (
        <Card className='col-sm-12 col-md-6 shadow rounded-start rounded-0 bgsvg text-white'>
            <Card.Body className='d-flex align-items-center text-center'>
                <div className='text-center w-100'>
                    <Card.Img
                        src={logoimg}
                        style={{ width: '200px', height: '200px' }}
                    />
                </div>
            </Card.Body>
            <div className='text-center mb-5'>
                <div className="p-0 my-2" style={{ color: typoColor, fontFamily: fontFamily }}>
                    <h4 className="p-0 main-heading mb-3"> Nautilus Cloud S-100</h4>
                    <h5 className='mb-3'> S-124 Navigational Warnings </h5>
                    <span className='mb-3'>Version 0.5.0</span>
                </div>
            </div>
        </Card >
    )
}

export default CardLogoImage;