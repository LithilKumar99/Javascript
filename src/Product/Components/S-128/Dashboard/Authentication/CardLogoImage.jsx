import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import logoimg from '../../../../../assets/images/OSCLogo.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { name } from '../../../../../Utils/AppDetails';
import { useColor } from '../../../../../Context/ColorContext';
import { useUtility } from '../../../../../Context/UtilityContext';
import { nodeServerUrl } from '../../../../../appConfig';

const CardLogoImage = () => {

    const { fontFamily, typoColor } = useColor();
    const { logoFlag, updateLogoFlagValue } = useUtility();
    const [data, setData] = useState([]);
    const { projectId } = useParams();
    const [imageSrc, setImageSrc] = useState(null);
    const { projectName: routerProjectName } = useParams();

    const selectedProjectName = routerProjectName === undefined ? name : routerProjectName;

    const fetchprojectLogoData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/logo/${projectId}`);
            if (response.data) {
                setData([response.data]);
            }
        } catch (err) {
            setData([]);
        }
    };

    useEffect(() => {
        fetchprojectLogoData();
        updateLogoFlagValue(false);
    }, [projectId, logoFlag]);

    if (!imageSrc) {
        setImageSrc(logoimg);
    }
    return (
        <Card className='col-sm-12 col-md-6 shadow rounded-start rounded-0 bgsvg text-white'>
            <Card.Body className='d-flex align-items-center text-center'>
                <div className='text-center w-100'>
                    {data.length > 0 ? <Card.Img
                        src={data[0].image || logoimg}
                        style={{ width: '200px', height: '200px' }}
                    /> : <Card.Img
                        src={logoimg}
                        style={{ width: '200px', height: '200px' }}
                    />}

                </div>
            </Card.Body>
            <div className='text-center mb-5'>
                <div className="p-0 my-2" style={{ color: typoColor, fontFamily: fontFamily }}>
                    {selectedProjectName == 'NC_S100_S124-App-V2' ? <>
                        <h4 className="p-0 main-heading mb-3"> Nautilus Cloud S-100</h4>
                        <h5 className='mb-3'> S-124 Navigational Warnings </h5>
                        <span className='mb-3'>Version 0.4.0</span></>
                        : <></>}
                </div>
            </div>
        </Card>
    )
}

export default CardLogoImage