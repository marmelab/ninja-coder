import React, { useEffect } from 'react';
import Prism from 'prismjs';
import { ACTION_EXECUTE } from './symbolsJS';
import './Code.css';

import { useNinjaContext } from '../NinjaContext';
import { translate } from './translateToJS';

export function Code() {
    const { predictions, resetPredictions } = useNinjaContext();

    const convertedCode = translate(
        predictions.map((prediction) => prediction.className)
    );

    useEffect(() => {
        Prism.highlightAll();
    }, [predictions]);

    const handleExecute = () => {
        eval(convertedCode);
    };

    const handleClear = () => {
        resetPredictions();
    };

    useEffect(() => {
        if (
            predictions[predictions.length - 1] &&
            predictions[predictions.length - 1] === ACTION_EXECUTE
        ) {
            handleExecute();
            handleClear();
        }
    }, [predictions]);

    return (
        <div className="Code">
            <div className="Code-editor-container">
                <div className="Code-editor">
                    <span className="Code-editor-control"></span>
                    <span className="Code-editor-control"></span>
                    <span className="Code-editor-control"></span>
                    <pre className="Code-editor-line-numbers">
                        <code className="language-js">{convertedCode}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
