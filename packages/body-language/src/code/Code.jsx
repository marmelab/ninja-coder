import React from 'react';
import './Code.css';

import { translate } from './translateToJS';

export function Code({ instructions }) {
    const convertedCode = translate(instructions);

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
