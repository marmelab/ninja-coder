import React, { useState } from 'react';
import { createContext, useContext } from 'react';

export const NinjaContext = createContext(undefined);

export const NinjaContextProvider = ({ children, initialValue = [] }) => {
    const [predictions, setPredictions] = useState(initialValue);

    const pushPrediction = prediction => {
        setPredictions([...predictions, { ...prediction }]);
    };

    const resetPredictions = () => {
        setPredictions(initialValue);
    };

    const value = { predictions, pushPrediction, resetPredictions };

    return (
        <NinjaContext.Provider value={value}>{children}</NinjaContext.Provider>
    );
};

export const useNinjaContext = () => {
    const context = useContext(NinjaContext);
    if (context === undefined) {
        throw new Error(
            'useNinjaContext must be used within a <NinjaContextProvider>'
        );
    }
    return context;
};
