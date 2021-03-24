import { useRef } from 'react';

export const useCanvas = (options = {}) => {
    const canvasRef = useRef(null);

    const canvas = canvasRef.current;
    const canvasCtx = canvas
        ? canvas.getContext(options.context || '2d')
        : null;

    const canvasDraw = (image, dx, dy) => {
        canvasCtx?.drawImage(image, dx, dy);
    };

    return { canvasRef, canvasCtx, canvasDraw };
};
