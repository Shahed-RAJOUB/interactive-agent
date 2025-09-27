import React, { useRef, useEffect, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import { exportToExcel } from "./DataExporter";
import "./VisualAgent.css";

const VisualAgent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);

    const [movementData, setMovementData] = useState([]);
    const isRecordingRef = useRef(false);

    useEffect(() => {
        const faceDetection = new FaceDetection({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
            model: "short",
            minDetectionConfidence: 0.5,
        });

        faceDetection.onResults((results) => {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext("2d");

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            if (results.detections && results.detections.length > 0) {
                results.detections.forEach((detection) => {
                    drawLandmarks(canvasCtx, detection.landmarks, {
                        color: "#FFCC00",
                        lineWidth: 2,
                    });

                    if (isRecordingRef.current && detection.landmarks.length >= 3) {
                        const timestamp = new Date().toISOString();
                        const nose = detection.landmarks[0];
                        const leftEye = detection.landmarks[1];
                        const rightEye = detection.landmarks[2];

                        setMovementData((prev) => [
                            ...prev,
                            {
                                time: timestamp,
                                nose_x: nose.x.toFixed(4),
                                nose_y: nose.y.toFixed(4),
                                leftEye_x: leftEye.x.toFixed(4),
                                leftEye_y: leftEye.y.toFixed(4),
                                rightEye_x: rightEye.x.toFixed(4),
                                rightEye_y: rightEye.y.toFixed(4),
                            },
                        ]);
                    }
                });
            }

            canvasCtx.restore();
        });

        if (videoRef.current) {
            cameraRef.current = new Camera(videoRef.current, {
                onFrame: async () => {
                    await faceDetection.send({ image: videoRef.current });
                },
                width: 640,
                height: 480,
            });
        }
    }, []);

    const handleStartRecording = () => {
        setMovementData([]);
        isRecordingRef.current = true;
        cameraRef.current?.start();
    };

    const handleStopRecording = () => {
        isRecordingRef.current = false;
        cameraRef.current?.stop();
    };

    const handleExportExcel = () => {
        exportToExcel(movementData, "head_movement.xlsx");
    };

    return (
        <div className="visual-agent">
            <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
            <canvas ref={canvasRef} className="output-canvas" width="640" height="480" />

            <div className="controls">
                <button onClick={handleStartRecording}>Start Recording</button>
                <button onClick={handleStopRecording}>Stop Recording</button>
                <button onClick={handleExportExcel}>Export Excel</button>
            </div>
        </div>
    );
};

export default VisualAgent;
