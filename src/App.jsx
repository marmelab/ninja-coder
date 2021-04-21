import React from 'react';
import './App.css';

import { NinjaContextProvider } from './NinjaContext';

import { PosePredictor } from './pose/PosePredictor';
import { Code } from './code/Code';
import { Letter } from './code/Letter';

function App() {
    return (
        <div className="App">
            <NinjaContextProvider
                modelPath="models/model.json"
                metadataPath="models/metadata.json"
            >
                <div className="App-content">
                    <PosePredictor />
                    <Code />
                    <Letter />
                </div>
            </NinjaContextProvider>
        </div>
    );
}

export default App;
