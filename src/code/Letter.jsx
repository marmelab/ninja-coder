import React, { useState, useEffect } from 'react';

import './Letter.css';

import { useNinjaContext } from '../NinjaContext';
import { IDLE } from './symbolsJS';
import { translateOneIntruction } from './translateToJS';

export function Letter() {
    const { predictions } = useNinjaContext();

    const hasPredictions =
        predictions && Array.isArray(predictions) && predictions.length > 0;

    const lastPrediction = hasPredictions
        ? predictions[predictions.length - 1]
        : { className: IDLE };

    const [isLetterVisible, showLetter] = useDisplayLetter();

    useEffect(() => {
        if (lastPrediction.className !== IDLE) {
            showLetter();
        }
    }, [lastPrediction]);

    if (!isLetterVisible) {
        return null;
    }

    return (
        <div className="Letter">
            {translateOneIntruction(lastPrediction.className)}
        </div>
    );
}

const useDisplayLetter = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!visible) {
            return;
        }
        setTimeout(() => {
            setVisible(false);
        }, 1000);
    }, [visible]);

    const show = () => {
        setVisible(true);
    };

    return [visible, show];
};
