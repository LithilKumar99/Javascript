import React, { useState, createContext, useContext, useRef } from 'react';
import { OLMapContext } from './OlMapContext';
const UtilityContext = createContext(undefined);

export const useUtility = () => {
    return useContext(UtilityContext);
};

export const UtilityProvider = ({ children }) => {

    const { olMap, clearMapVectorLayerSource } = useContext(OLMapContext);

    const [isProductFilterSidebarVisible, setIsProductFilterSidebarVisible] = useState(false);

    const toggleProductFilterSidebar = (isVisible) => {
        setIsProductFilterSidebarVisible(isVisible);
    };

    const [isNavWarningsSidebarVisible, setIsNavWarningsSidebarVisible] = useState(false);

    const toggleNavWarningsSidebar = (isVisible) => {
        setIsNavWarningsSidebarVisible(isVisible);
    };

    /*------------------------------------------------------------------------------------
       Home component State variables
    ------------------------------------------------------------------------------------*/

    const [isHomeButtonActive, setIsHomeButtonActive] = useState(false);

    const toggleHomeButtonActive = (isValue) => {
        setIsHomeButtonActive(isValue);
    };

    /*------------------------------------------------------------------------------------
       Zoom-in component State variables
    ------------------------------------------------------------------------------------*/

    const [isZoomInButtonActive, setIsZoomInButtonActive] = useState(false);

    const toggleZoomInButtonActive = (isValue) => {
        setIsZoomInButtonActive(isValue);
    }

    /*------------------------------------------------------------------------------------
       Zoom-out component State variables
    ------------------------------------------------------------------------------------*/

    const [isZoomOutButtonActive, setIsZoomOutButtonActive] = useState(false);

    const toggleZoomOutButtonActive = (isValue) => {
        setIsZoomOutButtonActive(isValue);
    }

    /*------------------------------------------------------------------------------------
       Previous extend component State variables
    ------------------------------------------------------------------------------------*/

    const [isPreviousExtendButtonActive, setIsPreviousExtendButtonActive] = useState(false);

    const togglePreviousExtendButtonActive = (isVisible) => {
        setIsPreviousExtendButtonActive(isVisible);
    }

    /*------------------------------------------------------------------------------------
      Next extend component State variables
    ------------------------------------------------------------------------------------*/

    const [isNextExtendButtonActive, setIsNextExtendButtonActive] = useState(false);

    const toggleNextExtendButtonActive = (isVisible) => {
        setIsNextExtendButtonActive(isVisible);
    }

    /*------------------------------------------------------------------------------------
        Zoom Window component State variables----start
    ------------------------------------------------------------------------------------*/

    const [isZoomWindowButtonActive, setIsZoomWindowButtonActive] = useState(false);

    const toggleZoomWindowButtonActive = (value) => {
        setIsZoomWindowButtonActive(value)
    }

    const isZoomWindowDragBoxRef = useRef(null);

    const removeZoomWindowFunctionality = (olMap) => {
        if (isZoomWindowDragBoxRef.current) {
            olMap.removeInteraction(isZoomWindowDragBoxRef.current);
        }
    }

    const [isZoomWindowBtnFlag, setIsZoomWindowBtnFlag] = useState(true);

    const toggleZoomWindowBtnFlag = (isValue) => {
        setIsZoomWindowBtnFlag(isValue)
    }

    /*------------------------------------------------------------------------------------
        Zoom Window component State variables----end
    ------------------------------------------------------------------------------------*/

    /*------------------------------------------------------------------------------------
        Base maps component State variables----Start
    ------------------------------------------------------------------------------------*/

    const [isBaseMapWindowButtonVisible, setIsBaseMapWindowButtonVisible] = useState(false);

    const toggleBaseMapWindowButtonVisible = (isVisible) => {
        setIsBaseMapWindowButtonVisible(isVisible);
    }

    const [isBaseMapButtonActive, setIsBaseMapButtonActive] = useState(null);

    const toggleBaseMapButtonActive = (isActive) => {
        setIsBaseMapButtonActive(isActive);
    }

    /*------------------------------------------------------------------------------------
        Base maps component State variables----end
    ------------------------------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------
        Measure component State variables----Start
    ------------------------------------------------------------------------------------*/

    const [isMeasureAreaWindowVisible, setIsMeasureAreaWindowVisible] = useState(false);

    const toggleMeasureAreaWindowVisible = (isVisible) => {
        setIsMeasureAreaWindowVisible(isVisible);
    }

    /*------------------------------------------------------------------------------------
        Measure component State variables----end
    ------------------------------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------
        Feature Info component State variables----Start
    ------------------------------------------------------------------------------------*/

    const [isFeatureInfoSidebarVisible, setIsFeatureInfoSidebarVisible] = useState(false);

    const toggleFeatureInfoSidebar = (isVisible) => {
        setIsFeatureInfoSidebarVisible(isVisible);
    };

    const [isFeatureInfoButtonActiveFlag, setIsFeatureInfoButtonActiveFlag] = useState(false);

    const toggleFeatureInfoButtonActiveFlag = (isActive) => {
        setIsFeatureInfoButtonActiveFlag(isActive);
    };

    const [isFeatureInfoButtonActive, setIsFeatureInfoButtonActive] = useState(false);

    const toggleFeatureInfoButtonActive = (isActive) => {
        setIsFeatureInfoButtonActive(isActive);
    }

    const [mapClickFeatureInfoRecords, setMapClickFeatureInfoRecords] = useState([]);

    const updateMapClickFeatureInfoRecords = (records) => {
        setMapClickFeatureInfoRecords(records);
    }

    const [mapClickFeaturesGeometry, setMapClickFeaturesGeometry] = useState([]);

    const updateMapClickFeaturesGeometry = (isData) => {
        setMapClickFeaturesGeometry(isData);
    }

    const [mapClickFeatureInfoLayerName, setMapClickFeatureInfoLayerName] = useState(null);
    const updateMapClickFeatureInfoLayerName = (isValue) => {
        setMapClickFeatureInfoLayerName(isValue);
    }

    const [isMapClickHandlers, setIsMapClickHandlers] = useState([]);

    const registerFeatureInfoMapClickHandler = (type, handler, olMap) => {
        setIsMapClickHandlers((prevHandlers) => [...prevHandlers, { type, handler }]);
        olMap.on(type, handler);
    };

    const unRegisterFeatureInfoMapClickHandlers = (type, olMap) => {
        if (olMap) {
            olMap.getTargetElement().style.cursor = 'default';
            isMapClickHandlers.forEach(({ type, handler }) => {
                olMap.un(type, handler);
            });
            setIsMapClickHandlers([]);
        }
    }

    /*------------------------------------------------------------------------------------
       Feature Info component State variables----end
    ------------------------------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------
        Layer switcher component State variables----start
    ------------------------------------------------------------------------------------*/

    const [isLayerSwitcherSidebarVisible, setIsLayerSwitcherSidebarVisible] = useState(false);

    const toggleLayerSwitcherSidebar = (isVisible) => {
        setIsLayerSwitcherSidebarVisible(isVisible);
    };

    const [isLayerSwitcherButtonActive, setIsLayerSwitcherButtonActive] = useState(false);
    const toggleLayerSwitcherButtonActive = (isActive) => {
        setIsLayerSwitcherButtonActive(isActive);
    }

    const [isLayerSwitcherFlag, setIsLayerSwitcherFlag] = useState(false);
    const updateLayerSwitcherFlag = (isValue) => {
        setIsLayerSwitcherFlag(isValue);
    }

    const [isMapLayersList, setIsMapLayersList] = useState([]);

    const updateMapLayersLists = (layers) => {
        setIsMapLayersList(layers);
    }

    /*------------------------------------------------------------------------------------
        Layer switcher component State variables----end
    ------------------------------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------
        Depth Filter component State variables----Start
    ------------------------------------------------------------------------------------*/

    const [isDepthFileterSelectedlayerFlag, setIsDepthFileterSelectedlayerFlag] = useState(false);

    const updateDepthFileterSelectedlayerFlag = (layer) => {
        setIsDepthFileterSelectedlayerFlag(layer)
    }

    const [isDepthFileterSelectedlayer, setIsDepthFileterSelectedlayer] = useState(null);

    const updateDepthFileterSelectedlayer = (layer) => {
        setIsDepthFileterSelectedlayer(layer)
    }

    const [showDepthFilterPopUpContainer, setShowDepthFilterPopUpContainer] = useState(false);

    const updateDepthFilterPopUpContainer = (isValue) => {
        setShowDepthFilterPopUpContainer(isValue)
    }

    /*------------------------------------------------------------------------------------
       Depth Filter component State variables----end
    ------------------------------------------------------------------------------------*/

    /*------------------------------------------------------------------------------------
      OSC Attribute Query component State variables----Start
   ------------------------------------------------------------------------------------*/

    const [isAttributeQueryButtonActive, setIsAttributeQueryButtonActive] = useState(false);
    const toggleAttributeQueryButtonActive = (isValue) => {
        setIsAttributeQueryButtonActive(isValue);
    }

    const [collapsedQueryResultPanel, setCollapsedQueryResultPanel] = useState(false);
    const updateCollapsedQueryResultPanel = (value) => {
        setCollapsedQueryResultPanel(value);
    };
    const [attributeQueryBottomTablePanelVisible, setAttributeQueryBottomTablePanelVisible] = useState(false);
    const updateAttributeQueryBottomTablePanelVisible = (value) => {
        setAttributeQueryBottomTablePanelVisible(value);
    };
    const [attributeQueryPanelVisible, SetAttributeQueryPanelVisible] = useState(false);
    const updateAttributeQueryPanelVisible = (value) => {
        SetAttributeQueryPanelVisible(value);
    }

    /*------------------------------------------------------------------------------------
     OSC Attribute Query component State variables----end
    ------------------------------------------------------------------------------------*/

    /*------------------------------------------------------------------------------------
        OSC Product Filter  component State variables---- Start
    ------------------------------------------------------------------------------------*/

    const [isProductFilterButtonActive, setIsProductFilterButtonActive] = useState(false);

    const toggleProductFilterButtonActive = (isValue) => {
        setIsProductFilterButtonActive(isValue);
    }

    const [productFilterSideBarPanel, setProductFilterSideBarPanel] = useState(false);

    const toggleProductFilterSideBarPanel = (value) => {
        setProductFilterSideBarPanel(value);
    }

    const [productFilterBottomTablePanelVisible, setProductFilterBottomTablePanelVisible] = useState(false);

    const updateProductFilterBottomTablePanelvisible = (values) => {
        setProductFilterBottomTablePanelVisible(values)
    }

    /*------------------------------------------------------------------------------------
        OSC Product Filter component State variables----end
    ------------------------------------------------------------------------------------*/

    /*------------------------------------------------------------------------------------
      User profile component State variables----Start
    ------------------------------------------------------------------------------------*/

    const [logoFlag, setLogoFlag] = useState(false);

    const updateLogoFlagValue = (value) => {
        setLogoFlag(value);
    }

    /*------------------------------------------------------------------------------------
     User profile component State variables----end
    ------------------------------------------------------------------------------------*/

    const resetStates = () => {
        toggleFeatureInfoSidebar(false);
        toggleLayerSwitcherSidebar(false);
        toggleProductFilterSidebar(false);
        toggleNavWarningsSidebar(false);
        toggleHomeButtonActive(false);
        toggleZoomInButtonActive(false);
        toggleZoomOutButtonActive(false);
        togglePreviousExtendButtonActive(false);
        toggleNextExtendButtonActive(false);
        toggleZoomWindowButtonActive(false);
        toggleBaseMapWindowButtonVisible(false);
        toggleBaseMapButtonActive(null);
        toggleMeasureAreaWindowVisible(false);
        toggleFeatureInfoButtonActive(false);
        toggleLayerSwitcherButtonActive(false);
        updateDepthFilterPopUpContainer(false);
        toggleAttributeQueryButtonActive(false);
        updateAttributeQueryBottomTablePanelVisible(false);
        updateAttributeQueryPanelVisible(false);
        toggleProductFilterButtonActive(false);
        toggleProductFilterSideBarPanel(false);
        removeZoomWindowFunctionality(olMap);
        bottomTablePanelDisabled();
    }

    const closeS128AttributeQuerySearchButton = () => {
        const attributeQuerySearch = document.getElementById('attributeQuerySearch');
        if (attributeQuerySearch) {
            attributeQuerySearch.style.display = 'none';
        }
    }

    const toggleComponent = (component) => {
        const componentActions = {
            "Home": () => {
                resetStates();
                toggleHomeButtonActive(true);
                clearMapVectorLayerSource();
            },
            "ZoomIn": () => {
                resetStates();
                toggleZoomInButtonActive(true);
            },
            "ZoomOut": () => {
                resetStates();
                toggleZoomOutButtonActive(true);
            },
            "PreviousExtend": () => {
                resetStates();
                togglePreviousExtendButtonActive(true);
                clearMapVectorLayerSource();
            },
            "NextExtend": () => {
                resetStates();
                toggleNextExtendButtonActive(true);
                clearMapVectorLayerSource();
            },
            "ZoomWindow": () => {
                resetStates();
                toggleZoomWindowButtonActive(true);
                clearMapVectorLayerSource();
            },
            "BaseMaps": () => {
                resetStates();
                toggleBaseMapWindowButtonVisible(true);
                toggleBaseMapButtonActive(component);
                clearMapVectorLayerSource();
                closeS128AttributeQuerySearchButton();
            },
            "Measure": () => {
                resetStates();
                toggleMeasureAreaWindowVisible(true);
                clearMapVectorLayerSource();
                closeS128AttributeQuerySearchButton();
            },
            "FeatureInfo": () => {
                resetStates();
                toggleFeatureInfoButtonActive(true);
                toggleFeatureInfoSidebar(true);
                updateMapClickFeatureInfoRecords([]);
                updateMapClickFeaturesGeometry([]);
                clearMapVectorLayerSource();
            },
            "LayerSwitcher": () => {
                resetStates();
                toggleLayerSwitcherButtonActive(true);
                toggleLayerSwitcherSidebar(true);
            },
            "DepthFilter": () => {
                resetStates();
                updateDepthFilterPopUpContainer(true);
            },
            "OscAttributeQuery": () => {
                resetStates();
                toggleAttributeQueryButtonActive(true);
                updateAttributeQueryPanelVisible(true);
            },
            "OscProductFilter": () => {
                resetStates();
                toggleProductFilterSideBarPanel(true);
                toggleProductFilterSideBarPanel(true);
                toggleProductFilterSidebar(true);
                closeS128AttributeQuerySearchButton();
            },
            "OscCart": () => {
                resetStates();
                closeS128AttributeQuerySearchButton();
            },

            "default": () => {
                resetStates();
            },
        };

        (componentActions[component])();
    }

    const bottomTablePanelDisabled = () => {
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
        updateProductFilterBottomTablePanelvisible(false);
    }

    return (
        <>
            <UtilityContext.Provider value={{
                isFeatureInfoSidebarVisible, isLayerSwitcherSidebarVisible, isProductFilterSidebarVisible,
                isNavWarningsSidebarVisible, toggleComponent, isHomeButtonActive, isZoomInButtonActive,
                isZoomOutButtonActive, isPreviousExtendButtonActive, isNextExtendButtonActive, isZoomWindowButtonActive,
                isZoomWindowDragBoxRef, toggleZoomWindowBtnFlag, isZoomWindowBtnFlag, isBaseMapWindowButtonVisible,
                isBaseMapButtonActive, isMeasureAreaWindowVisible, isFeatureInfoButtonActiveFlag,
                toggleFeatureInfoButtonActiveFlag, registerFeatureInfoMapClickHandler, unRegisterFeatureInfoMapClickHandlers,
                mapClickFeatureInfoRecords, updateMapClickFeatureInfoRecords, mapClickFeaturesGeometry,
                updateMapClickFeaturesGeometry, mapClickFeatureInfoLayerName, updateMapClickFeatureInfoLayerName,
                isFeatureInfoButtonActive, isLayerSwitcherButtonActive, isLayerSwitcherFlag, updateLayerSwitcherFlag,
                isMapLayersList, updateMapLayersLists, isDepthFileterSelectedlayerFlag, updateDepthFileterSelectedlayerFlag,
                isDepthFileterSelectedlayer, updateDepthFileterSelectedlayer, showDepthFilterPopUpContainer,
                isAttributeQueryButtonActive, toggleAttributeQueryButtonActive, collapsedQueryResultPanel,
                updateCollapsedQueryResultPanel, attributeQueryBottomTablePanelVisible, updateAttributeQueryBottomTablePanelVisible,
                attributeQueryPanelVisible, updateAttributeQueryPanelVisible, productFilterSideBarPanel, toggleProductFilterSideBarPanel,
                isProductFilterButtonActive, updateProductFilterBottomTablePanelvisible, productFilterBottomTablePanelVisible, logoFlag, updateLogoFlagValue,

            }}>
                {children}
            </UtilityContext.Provider>
        </>
    )
}