import React, { useEffect, useState, useRef } from 'react';
import * as tmPose from '@teachablemachine/pose';

import { useNinjaContext } from '../NinjaContext';
import { Canvas, useCanvas } from './Canvas';
import { useWebcam } from './Webcam';

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel

const size = 500;

const getBestPrediction = (predictions) => {
    return predictions.sort((prediction2, prediction1) => {
        return prediction1.probability - prediction2.probability;
    })[0];
};

export const PosePredictor = () => {
    const { model, pushPrediction } = useNinjaContext();

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [pose, setPose] = useState(null);

    const previousPredictionRef = useRef();
    const { canvasRef, canvasCtx, canvasDraw } = useCanvas();
    const { webcam, isRunning, startWebcam, stopWebcam } = useWebcam();

    useEffect(() => {
        if (
            prediction == null ||
            (loading && prediction != previousPredictionRef.current)
        ) {
            return;
        }
        setLoading(true);

        setTimeout(() => {
            console.log('Checking Prediction', prediction);
            console.log(
                'Checking Picked Prediction',
                previousPredictionRef.current
            );

            if (
                prediction != null &&
                previousPredictionRef.current != null &&
                prediction.className === previousPredictionRef.current.className
            ) {
                pushPrediction({ ...previousPredictionRef.current });
            }

            setLoading(false);
        }, 2000);
    }, [prediction]);

    useEffect(() => {
        previousPredictionRef.current = prediction;
    }, [prediction]);

    const loop = async () => {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (webcam !== null) {
            if (!isRunning) {
                startWebcam();
            }
            window.requestAnimationFrame(loop);
        }
    }, [webcam]);

    const predict = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const predictions = await model.predict(posenetOutput);
        setPrediction(getBestPrediction(predictions));
        setPose(pose);
    };

    const drawPose = (pose) => {
        if (!webcam || !webcam.canvas) {
            return;
        }
        // Draw the webcam
        canvasDraw(webcam.canvas, 0, 0);
        // Draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, canvasCtx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, canvasCtx);
        }
    };

    useEffect(() => {
        // Draw the poses
        drawPose(pose);
    }, [pose]);

    const handleToggleWebcam = async () => {
        if (isRunning) {
            await stopWebcam();
        } else {
            await startWebcam();
        }
    };

    return (
        <div>
            <button type="button" onClick={handleToggleWebcam}>
                {!isRunning ? 'Start' : 'Stop'}
            </button>
            <div>
                <Canvas ref={canvasRef} width={size} height={size} />
            </div>
            <div id="label-container">
                {prediction
                    ? `${prediction.className}(${prediction.probability})`
                    : ''}
            </div>
        </div>
    );
};
