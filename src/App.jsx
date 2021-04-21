import React from 'react';
import './App.css';

import { NinjaContextProvider } from './NinjaContext';

import { PosePredictor } from './pose/PosePredictor';
import { Code } from './code/Code';
import { Letter } from './code/Letter';

function App() {
    return (
        <NinjaContextProvider
            modelPath="models/v3/model.json"
            metadataPath="models/v3/metadata.json"
        >
            <div className="App">
                <div className="App-layout">
                    <div className="App-content">
                        <PosePredictor />
                        <Code />
                    </div>
                </div>
                <Letter />
            </div>
        </NinjaContextProvider>
    );
}

export default App;
