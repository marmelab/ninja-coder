import React from 'react';
import { useNinjaContext } from '../NinjaContext';
import './Debug.css';

export const Debug = () => {
    const { currentPrediction } = useNinjaContext();

    return (
        <div className="Debug">
            {currentPrediction ? currentPrediction.className : 'No prediction'}
        </div>
    );
};
