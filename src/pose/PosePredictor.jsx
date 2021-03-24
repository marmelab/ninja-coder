import React, { useEffect, useState, useRef } from 'react';

import { useNinjaContext } from '../NinjaContext';
import { Canvas, useCanvas } from './Canvas';

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel

import * as tmPose from '@teachablemachine/pose';
const size = 500;

const getBestPrediction = (predictions) => {
    return predictions.sort((prediction2, prediction1) => {
        return prediction1.probability - prediction2.probability;
    })[0];
};

export const PosePredictor = () => {
    const { pushPrediction } = useNinjaContext();

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [webcam, setWebcam] = useState(null);
    const [model, setModel] = useState(null);

    const previousPredictionRef = useRef();
    const { canvasRef, canvasCtx, canvasDraw } = useCanvas();

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

    const init = async () => {
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        const tmPoseModel = await tmPose.load(
            'public/models/model.json',
            'public/models/metadata.json'
        );
        setModel(tmPoseModel);

        const flip = true; // whether to flip the webcam

        const tmPoseWebcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await tmPoseWebcam.setup(); // request access to the webcam
        await tmPoseWebcam.play();

        setWebcam(tmPoseWebcam);
    };

    const loop = async () => {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (webcam !== null) {
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
        // finally draw the poses
        drawPose(pose);
    };

    const drawPose = (pose) => {
        if (webcam.canvas) {
            // Draw the webcam
            canvasDraw(webcam.canvas, 0, 0);
            // Draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(
                    pose.keypoints,
                    minPartConfidence,
                    canvasCtx
                );
                tmPose.drawSkeleton(
                    pose.keypoints,
                    minPartConfidence,
                    canvasCtx
                );
            }
        }
    };

    const handleStart = () => {
        init();
    };

    return (
        <div>
            <button type="button" onClick={handleStart}>
                Start
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
