import React from 'react';
import './App.css';
import { init } from './PoseModel';

function App() {
    const handleClick = () => {
        init();
    };
    return (
        <div className="App">
            <button type="button" onClick={handleClick}>
                Start
            </button>
            <div>
                <canvas id="canvas"></canvas>
            </div>
            <div id="label-container"></div>
        </div>
    );
}

export default App;
