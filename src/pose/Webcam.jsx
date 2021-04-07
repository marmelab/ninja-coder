import React, { useState } from 'react';
import * as tmPose from '@teachablemachine/pose';

const Webcam = ({ webcam }) => {
    return (
        <div
            className="Pose"
            ref={(ref) => ref && webcam && ref.appendChild(webcam.canvas)}
        />
    );
};

export default React.memo(Webcam);

export const useWebcam = ({ width = 640, height = 640, flip = true } = {}) => {
    const [webcam, setWebcam] = useState(null);

    const startWebcam = async () => {
        const tmPoseWebcam = new tmPose.Webcam(width, height, flip); // width, height, flip
        await tmPoseWebcam.setup(); // request access to the webcam
        await tmPoseWebcam.play();
        setWebcam(tmPoseWebcam);
    };

    const stopWebcam = async () => {
        if (!webcam) {
            return;
        }
        await webcam.stop();
        setWebcam(null);
    };

    return { webcam, isRunning: !!webcam, startWebcam, stopWebcam };
};
