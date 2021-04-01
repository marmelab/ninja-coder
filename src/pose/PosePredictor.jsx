import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
    useRef,
} from 'react';

import './Pose.css';

import { useNinjaContext } from '../NinjaContext';
import { useWebcam } from './Webcam';

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel

const width = 600;
const height = 600;

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

// eslint-disable-next-line react/display-name
const WebcamCanvas = React.memo(({ webcam }) => {
    return (
        <div
            className="Pose"
            ref={(ref) => ref && webcam && ref.appendChild(webcam.canvas)}
        ></div>
    );
});
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

    const loop = () => {
        setInterval(async () => {
            await webcam.update(); // update the webcam frame
            await predict();
        }, 16);
    };

    useEffect(async () => {
        if (!isRunning) {
            await startWebcam();
        }
    }, [isRunning]);

    useEffect(async () => {
        if (webcam) {
            loop();
        }
    }, [webcam]);

    return <WebcamCanvas webcam={webcam} />;
};
