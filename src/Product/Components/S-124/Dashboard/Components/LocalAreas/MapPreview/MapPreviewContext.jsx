import React, { useEffect, useState, createContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction';

export const LocalAreaMapPreviewContext = createContext(undefined);

const LocalAreaMapPreviewProvider = ({ children }) => {

    const [map, setMap] = useState();

    const [mapHeightFlag, setMapHeightFlag] = useState(false);

    const updateMapHeightFlag = (isvalue) => {
        setMapHeightFlag(isvalue)
    }

    const [drawCoordinates, setDrawCoordinates] = useState('');

    const updateDrawCoordinates = (coordinates) => {
        setDrawCoordinates(coordinates);
    }

    useEffect(() => {
        const olMapPreview = new Map({
            controls: [],
            interactions: defaultInteractions({ doubleClickZoom: false }).extend([
                new PointerInteraction({
                    handleDoubleClickEvent: (event) => {
                        event.preventDefault();
                    },
                }),
            ]),
        });
        setMap(olMapPreview);
    }, []);

    return (
        <>
            <LocalAreaMapPreviewContext.Provider value={{
                map, updateDrawCoordinates, drawCoordinates, updateMapHeightFlag, mapHeightFlag
            }}>
                {children}
            </LocalAreaMapPreviewContext.Provider>
        </>
    )
};

export default LocalAreaMapPreviewProvider;
