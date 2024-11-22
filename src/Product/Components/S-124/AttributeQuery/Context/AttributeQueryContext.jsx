import React, { createContext, useContext, useState, useRef } from 'react';
const S124AttributeQueryContext = createContext();

export const S124AttributeQueryProvider = ({ children }) => {

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
        <S124AttributeQueryContext.Provider value={{
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
        </S124AttributeQueryContext.Provider>
    );
};

export const useS124AttributeQueryContext = () => {
    const context = useContext(S124AttributeQueryContext);
    if (!context) {
        throw new Error('useS124AttributeQueryContext must be used within an S124AttributeQueryProvider');
    }
    return context;
};
