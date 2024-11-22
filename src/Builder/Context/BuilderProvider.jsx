import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {

    const [draggedComponents, setDraggedComponents] = useState([]);

    const [deletedComponent, setDeletedComponent] = useState(false);

    const [deletedLayer, setDeletedLayer] = useState(false);

    const deleteComponent = (value) => {
        setDeletedComponent(value);
    };

    const updateDeleteLayer = (value) => {
        setDeletedLayer(value);
    };

    const updateDraggedComponents = (newComponent) => {
        if (draggedComponents.includes(newComponent)) {
            toast.warn("This component has already been dragged");
            return;
        }
        if (draggedComponents.length === 0 && (newComponent !== 'Header' && newComponent !== 'OlMap')) {
            toast.warn("Please drag the header or map component first");
            return;
        }
        if (draggedComponents.length === 1 && draggedComponents[0] === 'Header' && newComponent !== 'OlMap') {
            toast.warn("Please drag the map component after the header");
            return;
        }

        setDraggedComponents((prevDraggedComponents) => [
            ...prevDraggedComponents,
            newComponent,
        ]);
    };


    const compareUpdateDraggedComponents = (newComponent) => {
        setDraggedComponents((prevDroppedComponents) => [
            ...prevDroppedComponents,
            newComponent,
        ]);
    };

    const clearDroppedComponents = () => {
        setDraggedComponents([]);
    }

    return (
        <BuilderContext.Provider value={{
            draggedComponents, updateDraggedComponents,
            clearDroppedComponents, compareUpdateDraggedComponents,
            deletedComponent, deleteComponent, deletedLayer, updateDeleteLayer
        }}>
            {children}
        </BuilderContext.Provider>
    );
};

export const useBuilderContext = () => {
    return useContext(BuilderContext);
};
