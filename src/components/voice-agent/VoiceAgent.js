import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./VoiceAgent.css";
import { commands as voiceCommands } from "./VoiceCommands";
import Weather from "../weather/Weather";
import ToDoList from "../to-do-list/ToDoList";

const VoiceAgent = () => {
    const [time, setTime] = useState("");

    // Map commands to include state setter
    const commands = voiceCommands.map((cmd) => ({
        ...cmd,
        callback: () => cmd.callback(setTime),
    }));

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands });

    const speak = (text, callback) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "de-DE";
        if (callback) utterance.onend = callback;
        window.speechSynthesis.speak(utterance);
    };

    const handleStart = () => {
        speak("Starte Aufnahme", () => {
            SpeechRecognition.startListening({
                continuous: true,
                interimResults: true,
                language: "de-DE",
            });
        });
    };

    const handleStop = () => {
        SpeechRecognition.stopListening();
        speak("Aufnahme beendet");
    };

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="voice-agent">
                <span>Browser unterstützt keine Spracherkennung.</span>
            </div>
        );
    }

    return (
        <div className="voice-agent">
            {time && <div className="time-display">{time}</div>}

            {/* Weather Component */}
            <Weather city="Sankt Pölten" />

            <ToDoList />

            <p>🎙️ Mikrofon: {listening ? "an" : "aus"}</p>
            <div className="buttons">
                <button onClick={handleStart}>Start</button>
                <button onClick={handleStop}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
            </div>

            <h3>Gesprochen:</h3>
            <p className="transcript">{transcript}</p>
        </div>
    );
};

export default VoiceAgent;
