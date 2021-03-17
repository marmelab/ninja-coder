import React from 'react';
import './App.css';

import { NinjaContextProvider } from './NinjaContext';

import { PosePredictor } from './pose/PosePredictor';
import { Code } from './code/Code';
import {
    KEYWORD_CONSOLE,
    KEYWORD_LOG,
    SYNTAX_DOT,
    SYNTAX_LEFT_BRACKET,
    SYNTAX_RIGHT_BRACKET,
    SYNTAX_STRING,
    SYNTAX_SEMICOLON,
    TEXT_COUCOU,
} from './code/symbolsJS';

// console.log('Hello World!');
const instructions = [
    KEYWORD_CONSOLE,
    SYNTAX_DOT,
    KEYWORD_LOG,
    SYNTAX_LEFT_BRACKET,
    SYNTAX_STRING,
    TEXT_COUCOU,
    SYNTAX_STRING,
    SYNTAX_RIGHT_BRACKET,
    SYNTAX_SEMICOLON,
];

function App() {
    return (
        <div className="App">
            <NinjaContextProvider initialValue={[]}>
                <PosePredictor />
                <Code />
            </NinjaContextProvider>
        </div>
    );
}

export default App;
