import React, { forwardRef, useRef } from 'react';

export const Canvas = forwardRef((props, ref) => {
    return <canvas ref={ref} {...props}></canvas>;
});

Canvas.displayName = 'Canvas';

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
