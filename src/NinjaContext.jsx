import React, { useEffect, useState, createContext, useContext } from 'react';
import * as tmPose from '@teachablemachine/pose';

export const NinjaContext = createContext(undefined);

export const NinjaContextProvider = ({
    children,
    initialPredictions = [],
    modelPath = 'models/model.json',
    metadataPath = 'models/metadata.json',
}) => {
    const [predictions, setPredictions] = useState(initialPredictions);
    const [model, setModel] = useState(null);

    const pushPrediction = (prediction) => {
        if (!prediction) {
            return;
        }
        if (
            predictions[predictions.length - 1] &&
            predictions[predictions.length - 1].className ===
                prediction.className
        )
            return;
        setPredictions([...predictions, { ...prediction }]);
    };

    const resetPredictions = () => {
        setPredictions(initialPredictions);
    };

    useEffect(() => {
        (async function () {
            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // Note: the pose library adds a tmPose object to your window (window.tmPose)
            const tmPoseModel = await tmPose.load(modelPath, metadataPath);

            setModel(tmPoseModel);
        })();
    }, []);

    const value = { model, predictions, pushPrediction, resetPredictions };

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
