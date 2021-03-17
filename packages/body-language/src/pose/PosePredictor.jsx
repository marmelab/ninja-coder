import React, { useEffect, useState } from 'react';
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
let model, webcam, ctx, labelContainer, maxPredictions;

import * as tmPose from '@teachablemachine/pose';
const size = 200;

const getBestPrediction = predictions => {
    return predictions.sort(
        (prediction2, prediction1) =>
            prediction1.probability - prediction2.probability
    )[0];
};

export const PosePredictor = () => {
    const [prediction, setPrediction] = useState(null);
    const [afterPrediction, setAfterPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedPredictions, setSavedPredictions] = useState([]);

    useEffect(() => {
        if (prediction == null || loading) {
            return;
        }
        setLoading(true);

        setTimeout(() => {
            console.log('Checking Prediction', prediction);
            console.log('Checking Picked Prediction', afterPrediction);

            if (
                prediction != null &&
                afterPrediction != null &&
                prediction.probability > 0.9 &&
                afterPrediction.probability > 0.9 &&
                prediction.className === afterPrediction.className
            ) {
                setSavedPredictions([
                    ...savedPredictions,
                    { ...afterPrediction },
                ]);
            }

            setLoading(false);
        }, 2000);
    }, [prediction]);

    useEffect(() => {
        if (loading === true) {
            setAfterPrediction({ ...prediction });
        } else {
            setAfterPrediction(null);
        }
    }, [loading]);

    const init = async () => {
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(
            'public/models/model.json',
            'public/models/metadata.json'
        );

        const flip = true; // whether to flip the webcam

        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById('canvas');
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext('2d');
        labelContainer = document.getElementById('label-container');
    };

    const loop = async () => {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    };

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

    const drawPose = pose => {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
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
                <canvas width={size} height={size} id="canvas"></canvas>
            </div>
            <div id="label-container">
                {prediction
                    ? `${prediction.className}(${prediction.probability})`
                    : ''}
            </div>
            <ul>
                {savedPredictions.map((savedPrediction, index) => {
                    return <li key={index}>{savedPrediction.className}</li>;
                })}
            </ul>
        </div>
    );
};