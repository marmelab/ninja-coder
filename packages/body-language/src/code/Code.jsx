import React from 'react';
import './Code.css';

import { useNinjaContext } from '../NinjaContext';
import { translate } from './translateToJS';

export function Code() {
    const { predictions, resetPredictions } = useNinjaContext();

    const convertedCode = translate(
        predictions.map(prediction => prediction.className)
    );

    const handleExecute = () => {
        console.log('Executing Ninja Code:');
        eval(convertedCode);
    };

    const handleClear = () => {
        resetPredictions();
    };

    return (
        <div className="Code">
            <code className="Code-code">{convertedCode}</code>
            <button className="Code-button-try" onClick={handleExecute}>
                Take the risk!
            </button>
            <button className="Code-button-reset" onClick={handleClear}>
                Reset
            </button>
        </div>
    );
}
