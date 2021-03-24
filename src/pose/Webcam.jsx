import { useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';

export const useWebcam = ({ width = 500, height = 500, flip = true } = {}) => {
    const [webcam, setWebcam] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const initWebcam = async () => {
        const tmPoseWebcam = new tmPose.Webcam(width, height, flip); // width, height, flip
        await tmPoseWebcam.setup(); // request access to the webcam

        setWebcam(tmPoseWebcam);
    };

    useEffect(() => {
        initWebcam();
    }, []);

    const startWebcam = async () => {
        if (!webcam) {
            return;
        }
        setIsRunning(true);
        await webcam.play();
    };

    const pauseWebcam = async () => {
        if (!webcam) {
            return;
        }
        setIsRunning(false);
        await webcam.pause();
    };

    const stopWebcam = async () => {
        if (!webcam) {
            return;
        }
        setIsRunning(false);
        await webcam.stop();
    };

    return { webcam, isRunning, startWebcam, pauseWebcam, stopWebcam };
};
