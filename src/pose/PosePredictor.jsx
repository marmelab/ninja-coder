import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import * as tmPose from '@teachablemachine/pose';

import { useNinjaContext } from '../NinjaContext';
import { Canvas, useCanvas } from './Canvas';
import { useWebcam } from './Webcam';

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel

const width = 800;
const height = 800;

const getBestPrediction = (predictions) => {
    return predictions.sort((prediction2, prediction1) => {
        return prediction1.probability - prediction2.probability;
    })[0];
};

const usePredictions = () => {
    const { pushPrediction } = useNinjaContext();

    const [loading, setLoading] = useState(false);
    const previousPredictionRef = useRef();

    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        if (
            prediction == null ||
            (loading && prediction != previousPredictionRef.current)
        ) {
            return;
        }
        setLoading(true);

        setTimeout(() => {
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

    return {
        currentPrediction: prediction,
        saveCurrentPrediction: setPrediction,
    };
};

export const PosePredictor = () => {
    const { model } = useNinjaContext();
    const { prediction, saveCurrentPrediction } = usePredictions();

    const [pose, setPose] = useState(null);

    const animationFrameIdRef = useRef();
    const { canvasRef, canvasCtx, canvasDraw } = useCanvas();
    const { webcam, isRunning, startWebcam, stopWebcam } = useWebcam({
        width,
        height,
    });

    const predict = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const predictions = await model.predict(posenetOutput);
        const bestPrediction = getBestPrediction(predictions);
        saveCurrentPrediction(bestPrediction);
        setPose(pose);
    };

    const loop = async () => {
        await webcam.update(); // update the webcam frame
        await predict();

        if (!animationFrameIdRef.current) {
            return;
        }
        animationFrameIdRef.current = window.requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (!model) {
            return;
        }

        if (isRunning) {
            animationFrameIdRef.current = requestAnimationFrame(loop);
        } else {
            window.cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        return () => {
            window.cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        };
    }, [model, isRunning]);

    const draw = (pose) => {
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

    useLayoutEffect(() => {
        draw(pose);
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
                <Canvas ref={canvasRef} width={width} height={height} />
            </div>
            <div id="label-container">
                {prediction
                    ? `${prediction.className}(${prediction.probability})`
                    : ''}
            </div>
        </div>
    );
};
