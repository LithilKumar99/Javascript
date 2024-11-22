import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { nodeServerUrl } from '../appConfig';
import axios from 'axios';
import { properties } from '../Utils/propertiesConfig';
import { isBuilder } from '../Utils/AppDetails';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {

    // Initialize state with values from localStorage or default values
    const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || '#1E3A8A');
    const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || '#ffffff');
    const [borderColor, setBorderColor] = useState(localStorage.getItem('borderColor') || '#C7D5FF');
    const [typoColor, setTypoColor] = useState(localStorage.getItem('typoColor') || '#000000');
    const [cardbodyColor, setCardbodyColor] = useState(localStorage.getItem('cardbodyColor') || '#ffffff');
    const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue' sans-serif");

    const [fillColor, setFillColor] = useState(localStorage.getItem('fillColor') || '#64d2ed');
    const [strokeColor, setStrokeColor] = useState(localStorage.getItem('strokeColor') || '#3c36eb');
    const [circleColor, setCircleColor] = useState(localStorage.getItem('circleColor') || '#c1c983');

    // useEffect hook to update state if properties are passed (likely from parent or API)
    // It sets the component's properties from `properties` if it's not the builder mode.
    useEffect(() => {
        if (!isBuilder && properties.length != 0) {
            setBackgroundColor(properties[0].backgroundColor)
            setTextColor(properties[0].textColor)
            setBorderColor(properties[0].borderColor)
            setTypoColor(properties[0].TypographicColor)
            setCardbodyColor(properties[0].CardColor)
            setFontFamily(properties[0].FontFamily)
            setFillColor(properties[0].fillColor)
            setStrokeColor(properties[0].strokeColor)
            setCircleColor(properties[0].circleColor)
        }
    }, []);

    // Function to fetch properties from the server and update local state and localStorage
    const fetchAndCreateProperty = async (projectId) => {
        const propertiesData = {
            backgroundColor: '#1E3A8A',
            textColor: '#ffffff',
            borderColor: '#C7D5FF',
            TypographicColor: '#000000',
            CardColor: '#ffffff',
            FontFamily: fontFamily,
            fillColor: '#64d2ed',
            strokeColor: '#3c36eb',
            circleColor: '#c1c983',
            projectId: parseInt(projectId),
            componentId: 0
        };

        try {
            const response = await axios.post(`${nodeServerUrl}/properties`, propertiesData);
            if (response.data !== null) {
                console.log('Property created successfully.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === 'Unique constraint violation') {
                console.log('properties with the same projectId already exists.');
                return null;
            }
            throw new Error('Could not create property');
        }
    };

    // Function to fetch properties based on projectId and update local state and localStorage
    const getPropertyBasedOnProjectId = async (projectId) => {
        try {
            const response = await axios.get(`${nodeServerUrl}/properties/${projectId}`);

            if (response.data) {
                const properties = response.data;
                if (properties.length > 0) {
                    // Update state and localStorage with fetched properties
                    setBackgroundColor(properties[0].backgroundColor);
                    localStorage.setItem('backgroundColor', properties[0].backgroundColor);

                    localStorage.setItem('textColor', properties[0].textColor);
                    setTextColor(properties[0].textColor)

                    setBorderColor(properties[0].borderColor);
                    localStorage.setItem('borderColor', properties[0].borderColor);

                    setTypoColor(properties[0].TypographicColor);
                    localStorage.setItem('typoColor', properties[0].TypographicColor);

                    setCardbodyColor(properties[0].CardColor);
                    localStorage.setItem('cardbodyColor', properties[0].CardColor);

                    setFontFamily(properties[0].FontFamily);
                    localStorage.setItem('fontFamily', properties[0].FontFamily);

                    setFillColor(properties[0].fillColor);
                    localStorage.setItem('fillColor', properties[0].fillColor);

                    setStrokeColor(properties[0].strokeColor);
                    localStorage.setItem('strokeColor', properties[0].strokeColor);

                    setCircleColor(properties[0].circleColor);
                    localStorage.setItem('circleColor', properties[0].circleColor);
                }
                return properties;
            }

        } catch (error) {
            throw new Error('Could not fetch properties');
        }
    }

    // Function to update properties on the server, using localStorage values for each property
    const updateProperty = async (projectId) => {
        const id = parseInt(projectId);
        const propertiesData = {
            backgroundColor: localStorage.getItem('backgroundColor'),
            textColor: localStorage.getItem('textColor'),
            borderColor: localStorage.getItem('borderColor'),
            TypographicColor: localStorage.getItem('typoColor'),
            CardColor: localStorage.getItem('cardbodyColor'),
            FontFamily: localStorage.getItem('fontFamily'),
            fillColor: localStorage.getItem('fillColor'),
            strokeColor: localStorage.getItem('strokeColor'),
            circleColor: localStorage.getItem('circleColor'),
            projectId: id,
            componentId: 0
        };
        try {
            const response = await axios.put(`${nodeServerUrl}/properties/${id}`, propertiesData);
            if (response.data !== null) {
                console.log('Property updated successfully.');
            }
        } catch (error) {
            throw new Error('Could not update properties');
        }
    };

    // Handlers for each property change, updating both state and localStorage
    const handleBackgroundColorChange = (id, newColor) => {
        setBackgroundColor(newColor);
        localStorage.setItem('backgroundColor', newColor);
        updateProperty(id);
    };

    const handleTextColorChange = (id, newColor) => {
        localStorage.setItem('textColor', newColor);
        setTextColor(newColor);
        updateProperty(id);
    };

    const handleBorderColorChange = (id, newColor) => {
        setBorderColor(newColor);
        localStorage.setItem('borderColor', newColor);
        updateProperty(id);
    };

    const handleTypoColorChange = (id, newColor) => {
        setTypoColor(newColor);
        localStorage.setItem('typoColor', newColor);
        updateProperty(id);
    };

    const handlecardbodyColorChange = (id, newColor) => {
        setCardbodyColor(newColor);
        localStorage.setItem('cardbodyColor', newColor);
        updateProperty(id);
    };

    const handleFontFamilyChange = (id, family) => {
        localStorage.removeItem('fontFamily');
        setFontFamily(family);
        localStorage.setItem('fontFamily', family);
        updateProperty(id);
    };

    const handleFillColorChange = (id, newColor) => {
        setFillColor(newColor);
        localStorage.setItem('fillColor', newColor);
        updateProperty(id);
    };

    const handleStrokeColorChange = (id, newColor) => {
        setStrokeColor(newColor);
        localStorage.setItem('strokeColor', newColor);
        updateProperty(id);
    };

    const handleCircleColorChange = (id, newColor) => {
        setCircleColor(newColor);
        localStorage.setItem('circleColor', newColor);
        updateProperty(id);
    };

    // Function to clear all properties from localStorage and reset state to default values
    const clearLocalStorageData = () => {
        // Remove all custom properties from localStorage
        localStorage.removeItem('backgroundColor');
        localStorage.removeItem('textColor')
        localStorage.removeItem('borderColor');
        localStorage.removeItem('typoColor');
        localStorage.removeItem('cardbodyColor');
        localStorage.removeItem('fontFamily');
        localStorage.removeItem('fillColor');
        localStorage.removeItem('strokeColor');
        localStorage.removeItem('circleColor');

        // Reset localStorage to default values
        localStorage.setItem('backgroundColor', '#1E3A8A');
        localStorage.setItem('textColor', '#ffffff');
        localStorage.setItem('borderColor', '#C7D5FF');
        localStorage.setItem('typoColor', '#000000');
        localStorage.setItem('cardbodyColor', '#ffffff');
        localStorage.setItem('fontFamily', fontFamily);
        localStorage.setItem('fillColor', '#64d2ed');
        localStorage.setItem('strokeColor', '#3c36eb');
        localStorage.setItem('circleColor', '#c1c983');

        // Reset state to default values as well
        setBackgroundColor(localStorage.getItem('backgroundColor'));
        setTextColor(localStorage.getItem('textColor'));
        setBorderColor(localStorage.getItem('borderColor'));
        setCardbodyColor(localStorage.getItem('cardbodyColor'));
        setFontFamily(localStorage.getItem('fontFamily'));
        setTypoColor(localStorage.getItem('typographyColor'));
        setFillColor(localStorage.getItem('fillColor'));
        setStrokeColor(localStorage.getItem('strokeColor'));
        setCircleColor(localStorage.getItem('circleColor'));
    }

    const theme = {
        backgroundColor,
        textColor,
        borderColor,
        typoColor,
        cardbodyColor,
        fontFamily
    };

    return (
        <ColorContext.Provider
            value={{
                backgroundColor,
                handleBackgroundColorChange,
                textColor,
                handleTextColorChange,
                borderColor,
                handleBorderColorChange,
                typoColor,
                handleTypoColorChange,
                cardbodyColor,
                handlecardbodyColorChange,
                fontFamily,
                handleFontFamilyChange,
                fetchAndCreateProperty,
                getPropertyBasedOnProjectId,
                clearLocalStorageData,
                fillColor,
                handleFillColorChange,
                strokeColor,
                handleStrokeColorChange,
                circleColor,
                handleCircleColorChange
            }}
        >
            <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
        </ColorContext.Provider>
    );
};

export const useColor = () => {
    return useContext(ColorContext);
};
