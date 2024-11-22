import { useState } from 'react';
import axios from 'axios';
import { nodeServerUrl } from '../../../../appConfig';

export const useGlobalData = () => {

    const [providerData, setProviderData] = useState([]);
    const [exchangeData, setexchangeData] = useState([]);
    const [dataSet, setDataSet] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/providers`);
            if (response.data) {
                setProviderData(response.data);
                console.log("response:", response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchExchangeData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/exchangeset`);
            if (response.data) {
                setexchangeData(response.data);
                console.log("response:", response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDataSet = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/dataset`);
            if (response.data) {
                setDataSet(response.data);
                console.log("response:", response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return { providerData, fetchData, fetchExchangeData, exchangeData, fetchDataSet, dataSet };
};
