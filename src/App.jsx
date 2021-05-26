import React from 'react';
import './App.css';

import { NinjaContextProvider } from './NinjaContext';

import { PosePredictor } from './pose/PosePredictor';
import { Code } from './code/Code';
import { Letter } from './code/Letter';
// import { Debug } from './debug/Debug';

function App() {
    return (
        <NinjaContextProvider
            modelPath="models/model.json"
            metadataPath="models/metadata.json"
        >
            <div className="App">
                <div className="App-layout">
                    <div className="App-content">
                        <PosePredictor />
                        <Code />
                        {/* <Debug /> */}
                    </div>
                </div>
                <Letter />
            </div>
        </NinjaContextProvider>
    );
}

export default App;
