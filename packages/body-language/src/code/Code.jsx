import React from 'react';
import './Code.css';

import { useNinjaContext } from '../NinjaContext';
import { translate } from './translateToJS';

export function Code() {
    const { predictions } = useNinjaContext();

    const convertedCode = translate(
        predictions.map(prediction => prediction.className)
    );

    const handleExecute = () => {
        console.log('Executing Ninja Code:');
        eval(convertedCode);
    };

    return (
        <div className="Code">
            <code className="Code-code">{convertedCode}</code>
            <button className="Code-button-try" onClick={handleExecute}>
                Take the risk!
            </button>
        </div>
    );
}
