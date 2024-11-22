import React, { createContext, useContext, useState, useRef } from 'react';
const S128_AttributeQuery_Context = createContext();

export const S128_AttributeQuery_Provider = ({ children }) => {

    const [attributeQuerySelectedLayer, setAttributeQuerySelectedLayer] = useState('');
    const updateAttributeQuerySelectedLayer = (layerName) => {
        setAttributeQuerySelectedLayer(layerName);
    };

    const [attributeQueryFeatureSearchResults, setAttributeQueryFeatureSearchResults] = useState([]);
    const updateAttributeQueryFeatureSearchResults = (data) => {
        setAttributeQueryFeatureSearchResults(data);
    };

    const clearAttributeQueryFeatureSearchResults = () => {
        setAttributeQueryFeatureSearchResults([]);
    };

    const [searchInputloading, setSearchInputloading] = useState(false);
    const updateSearchInputloading = (value) => {
        setSearchInputloading(value);
    };

    const isAttributeQueryTypeaheadRef = useRef(null);

    const [selectedAttributeQueryOption, setSelectedAttributeQueryOption] = useState(null);
    const updateSelectedAttributeQueryOption = (option) => {
        setSelectedAttributeQueryOption(option);
    };

    return (
        <S128_AttributeQuery_Context.Provider value={{
            attributeQuerySelectedLayer,
            updateAttributeQuerySelectedLayer,
            attributeQueryFeatureSearchResults,
            updateAttributeQueryFeatureSearchResults,
            clearAttributeQueryFeatureSearchResults,
            searchInputloading,
            updateSearchInputloading,
            isAttributeQueryTypeaheadRef,
            selectedAttributeQueryOption,
            updateSelectedAttributeQueryOption,
        }}>
            {children}
        </S128_AttributeQuery_Context.Provider>
    );
};

export const useS128_AttributeQuery_Context = () => {
    const context = useContext(S128_AttributeQuery_Context);
    if (!context) {
        throw new Error('useS128_AttributeQuery_Context must be used within an S128_AttributeQuery_Provider');
    }
    return context;
};
