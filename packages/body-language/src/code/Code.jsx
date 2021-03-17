import React from 'react';
import './Code.css';

import { translate } from './translateToJS';

export function Code({ instructions }) {
    const convertedCode = translate(instructions);
    return (
        <div className="Code">
            <code>{convertedCode}</code>
        </div>
    );
}
