import React, { createContext, useContext, useState } from 'react';
import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image.js';
import { toast } from 'react-toastify';

export const ProductFilterContext = createContext();

export const useProductFilter = () => {
    return useContext(ProductFilterContext);
};

export const ProductFilterProvider = ({ children }) => {

    const [selectedMapLayer, setSelectedMapLayer] = useState('select');

    const updateSelectedMapLayer = (layer) => {
        setSelectedMapLayer(layer)
    }

    const [productTypeFlag, setProductTypeFlag] = useState(true);

    const updateProductTypeFlag = (isValue) => {
        setProductTypeFlag(isValue)
    }

    const [mapLayers, setMapLayers] = useState([]);

    const updateMapLayers = (allVisibleLayers) => {
        setMapLayers((prevList) => {
            const uniqueTitles = [...new Set([...prevList, ...allVisibleLayers])];
            return uniqueTitles;
        });
    }
    const [agencyCodeList, setAgencyCodeList] = useState([]);

    const updateAgencyCodeList = (list) => {
        setAgencyCodeList(list);
    }

    const [selectedAgencyCode, setSelectedAgencyCode] = useState('select');

    const updateSelectedAgencyCode = (isValue) => {
        setSelectedAgencyCode(isValue);
    }

    const [countryList, setCountryList] = useState([]);

    const updateCountryList = (list) => {
        setCountryList(list);
    }

    const [selectedCountry, setSelectedCountry] = useState('select');

    const updateSelectedCountry = (country) => {
        setSelectedCountry(country);
    }

    const [productTypes, setProductTypes] = useState([]);

    const updateProductTypes = (list) => {
        setProductTypes(list);
    }
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);

    const updateSelectedProductTypes = (isValue) => {
        setSelectedProductTypes(isValue);
    }

    const [cqlFilterString, setCqlFilterString] = useState('include');

    const updateCqlFilterString = (isValue) => {
        setCqlFilterString(isValue)
    }

    const [isLoading, setIsLoading] = useState(false);

    const updateIsLoading = (isLoading) => {
        setIsLoading(isLoading)
    }

    const [bands, setbands] = useState([
        { band: '1', value: 'Overview', selected: true },
        { band: '2', value: 'General', selected: true },
        { band: '3', value: 'Coastal', selected: true },
        { band: '4', value: 'Approach', selected: true },
        { band: '5', value: 'Harbor', selected: true },
        { band: '6', value: 'Berthing', selected: true },
    ]);

    const activeUsageBandsCheckBox = () => {
        setbands(prevBands =>
            prevBands.map(band => ({
                ...band,
                selected: true,
            }))
        );
    };

    const updateBands = (isbands) => {
        setbands(isbands)
    }

    const [selectedCalenderDate, setSelectedCalenderDate] = useState(new Date());

    const updateSelectedCalenderDate = (newDate) => {
        setSelectedCalenderDate(newDate);
    }

    const [lineButtonActive, setLineButtonActive] = useState(false);
    const [polygonButtonActive, setPolygonButtonActive] = useState(false);
    const [pointButtonActive, setPointButtonActive] = useState(false);
    const [rtzButtonActive, setRtzButtonActive] = useState(false);

    const [lineButtonVisible, setlineButtonVisible] = useState(false);
    const [polygonButtonVisible, setPolygonButtonVisible] = useState(false);
    const [pointButtonVisible, setPointButtonVisible] = useState(false);
    const [rtzButtonVisible, setRtzButtonVisible] = useState(false);
    const [calenderBtnVisible, setCalenderBtnVisible] = useState(false);
    const [calenderSelectedInfoSucess, setCalenderSelectedInfoSucess] = useState(false);
    const [showCalendarDialog, setShowCalendarDialog] = useState(false);

    const toggleGeometryButtons = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(false);
        setPointButtonActive(false);
        setRtzButtonActive(false);
    }

    const [flag, setFlag] = useState(false);

    const unableBtns = (lyrName) => {
        if (lyrName === 'S-101') {
            setlineButtonVisible(false);
            setPolygonButtonVisible(false);
            setPointButtonVisible(false);
            setRtzButtonVisible(false);
            setCalenderBtnVisible(false);
        } else {
            setCalenderBtnVisible(true);
            setlineButtonVisible(false);
            setPolygonButtonVisible(false);
            setPointButtonVisible(false);
            setRtzButtonVisible(false);
        }
    }

    const clearSomeFields = () => {
        setSelectedAgencyCode('select');
        setSelectedCountry('select');
        setProductTypes([]);
        setSelectedProductTypes([]);
        setAgencyCodeList([]);
        setCountryList([]);
    }

    const [enableGeomertyContainer, SetEnableGeomertyContainer] = useState(false);
    const [showGeometryClearDialog, setShowGeometryClearDialog] = useState(false);

    const enableGeomertyButtonsOnCountrySelection = (value) => {
        if (value === 'select') {
            setlineButtonVisible(false);
            setPolygonButtonVisible(false);
            setPointButtonVisible(false);
            setRtzButtonVisible(false);
        }
        else {
            setlineButtonVisible(true);
            setPolygonButtonVisible(true);
            setPointButtonVisible(true);
            setRtzButtonVisible(true);
            setCalenderBtnVisible(false);
        }
    }

    const deactiveGeometryBtns = () => {
        setLineButtonActive(false);
        setPolygonButtonActive(false);
        setPointButtonActive(false);
        setRtzButtonActive(false);
    }

    const [featureData, setFeatureData] = useState([]);

    const updateFeatureData = (data, layerName) => {

        setFeatureData((prevFeatureData) => {
            const existingIndex = prevFeatureData.findIndex(item => item.layerName === layerName);

            if (existingIndex !== -1) {
                const updatedFeatureData = [...prevFeatureData];
                updatedFeatureData[existingIndex] = {
                    ...updatedFeatureData[existingIndex],
                    data: [...updatedFeatureData[existingIndex].data, ...data],
                };
                return updatedFeatureData;
            } else {
                return [
                    ...prevFeatureData,
                    {
                        layerName: layerName,
                        data: data,
                    },
                ];
            }
        });
    };

    const clearFeatureData = () => {
        setFeatureData([]);
    }

    const [headers, setHeaders] = useState([]);

    const updateHeader = (data) => {
        setHeaders(data)
    }

    const [checkedItems, setCheckedItems] = useState([]);

    const toggleCheckedItem = (itemId) => {

        setCheckedItems((prevItems) => {
            if (prevItems.includes(itemId)) {
                return prevItems.filter((checkedItem) => checkedItem !== itemId);
            } else {
                return [...prevItems, itemId];
            }
        });

    };

    const removeItem = (itemToRemove) => {
        setCheckedItems((prevItems) => prevItems.filter((item) => item !== itemToRemove));
    };

    const getQueryLayerUrl = (lyrName, olMap) => {
        let layerUrl;
        if (olMap) {
            const layersList = olMap.getLayers().getArray();
            const targetLayer = layersList.find(lyr =>
                lyr instanceof ImageLayer &&
                lyr.getSource() instanceof ImageWMS &&
                lyrName === lyr.get('title') &&
                lyr.getVisible() === true
            );

            if (targetLayer) {
                layerUrl = targetLayer.getSource().getUrl();
                if (layerUrl !== null && layerUrl !== undefined) {
                    return layerUrl;
                }
            } else {
                toast.warn('Target layer not found or is not visible.');
            }
        }
        return layerUrl;
    }

    const makeInitialState = () => {
        updateSelectedMapLayer('select');
        setSelectedCountry('select');
        setSelectedAgencyCode('select');
        setCountryList([]);
        setProductTypes([]);
        setSelectedProductTypes([]);
        setAgencyCodeList([]);
        deactiveGeometryBtns();
        clearFeatureData();
        enableGeomertyButtonsOnCountrySelection('select');
        setlineButtonVisible(false);
        setPolygonButtonVisible(false);
        setPointButtonVisible(false);
        setRtzButtonVisible(false);
        setCalenderBtnVisible(false);
    }

    return (
        <ProductFilterContext.Provider value={{
            selectedMapLayer, updateSelectedMapLayer,
            checkedItems, toggleCheckedItem, removeItem, setCheckedItems,
            updateProductTypeFlag, productTypeFlag, updateMapLayers, mapLayers,
            updateAgencyCodeList, agencyCodeList, updateSelectedAgencyCode, selectedAgencyCode,
            updateCountryList, countryList, updateSelectedCountry, selectedCountry, updateProductTypes, productTypes,
            updateSelectedProductTypes, selectedProductTypes, updateCqlFilterString, cqlFilterString,
            updateIsLoading, isLoading, bands, activeUsageBandsCheckBox, updateBands, setbands, getQueryLayerUrl,
            selectedCalenderDate, updateSelectedCalenderDate, lineButtonVisible, setlineButtonVisible,
            polygonButtonVisible, setPolygonButtonVisible, pointButtonVisible, setPointButtonVisible,
            rtzButtonVisible, setRtzButtonVisible, calenderBtnVisible, setCalenderBtnVisible,
            calenderSelectedInfoSucess, setCalenderSelectedInfoSucess, showCalendarDialog, setShowCalendarDialog,
            lineButtonActive, setLineButtonActive, polygonButtonActive, setPolygonButtonActive,
            pointButtonActive, setPointButtonActive, rtzButtonActive, setRtzButtonActive, toggleGeometryButtons,
            flag, setFlag, unableBtns, clearSomeFields, enableGeomertyContainer, SetEnableGeomertyContainer,
            enableGeomertyButtonsOnCountrySelection, deactiveGeometryBtns, updateFeatureData, featureData, clearFeatureData,
            headers, updateHeader, makeInitialState, showGeometryClearDialog, setShowGeometryClearDialog,
        }}>
            {children}
        </ProductFilterContext.Provider>
    );
};
