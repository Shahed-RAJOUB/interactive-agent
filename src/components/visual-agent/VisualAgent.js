import React, { useRef, useEffect } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import "./VisualAgent.css";

const VisualAgent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const faceDetection = new FaceDetection({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
            model: "short", // or "full"
            minDetectionConfidence: 0.5,
        });

        faceDetection.onResults((results) => {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext("2d");

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // Draw the video frame
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            // Draw detections
            if (results.detections) {
                results.detections.forEach((detection) => {
                    drawLandmarks(canvasCtx, detection.landmarks, {
                        color: "#FFCC00",
                        lineWidth: 2,
                    });
                });
            }

            canvasCtx.restore();
        });

        if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await faceDetection.send({ image: videoRef.current });
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }
    }, []);

    return (
        <div className="visual-agent">
            <video
                ref={videoRef}
                className="input-video"
                autoPlay
                playsInline
                muted
            />
            <canvas ref={canvasRef} className="output-canvas" width="640" height="480" />
        </div>
    );
};

export default VisualAgent;
