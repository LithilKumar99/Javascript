import React, { useEffect, useState, createContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction';

export const OlMapPreviewContext = createContext(undefined);

const OlMapPreviewProvider = ({ children }) => {
    const [map, setMap] = useState();

    useEffect(() => {
        const olMapPreview = new Map({
            controls: [],
            interactions: defaultInteractions({ doubleClickZoom: false })
                .extend([
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
            <OlMapPreviewContext.Provider value={{ map }}>
                {children}
            </OlMapPreviewContext.Provider>
        </>
    )
};

export default OlMapPreviewProvider;
