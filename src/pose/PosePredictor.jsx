import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
    useRef,
} from 'react';

import './Pose.css';

import { useNinjaContext } from '../NinjaContext';
import Webcam, { useWebcam } from './Webcam';

const width = 600;
const height = 600;

export const PosePredictor = () => {
    const { model } = useNinjaContext();
    const { saveCurrentPrediction } = usePredictions();

    const { webcam, isRunning, startWebcam } = useWebcam({
        width,
        height,
    });

    const predict = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const predictions = await model.predict(posenetOutput);
        const bestPrediction = getBestPrediction(predictions);
        saveCurrentPrediction(bestPrediction);
    };

    useEffect(async () => {
        if (!isRunning) {
            await startWebcam();
        }
    }, [isRunning]);

    useEffect(async () => {
        if (!webcam) {
            return;
        }
        setInterval(async () => {
            await webcam.update(); // Update the webcam frame
        }, 16);
    }, [webcam]);

    useEffect(() => {
        if (!model) {
            return;
        }

        setInterval(async () => {
            await predict();
        }, 500);
    }, [model]);

    return <Webcam webcam={webcam} />;
};

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
                prediction.probability > 0.9 &&
                previousPredictionRef.current != null &&
                prediction.className === previousPredictionRef.current.className
            ) {
                pushPrediction({ ...previousPredictionRef.current });
            }

            setLoading(false);
        }, 2000);
    }, [prediction]);

    useLayoutEffect(() => {
        previousPredictionRef.current = prediction;
    }, [prediction]);

    const saveCurrentPrediction = useCallback((prediction) => {
        setPrediction(prediction);
    });

    return {
        currentPrediction: prediction,
        saveCurrentPrediction,
    };
};
