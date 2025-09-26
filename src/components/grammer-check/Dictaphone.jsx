import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Dictaphone = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const [correctedText, setCorrectedText] = useState("");

    // Grammar correction
    const correctGrammar = async (text) => {
        if (!text.trim()) return;

        try {
            const response = await fetch("https://api.languagetool.org/v2/check", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    text,
                    language: "de-DE",
                }),
            });

            const result = await response.json();

            let fixed = text;
            result.matches.forEach((match) => {
                if (match.replacements && match.replacements.length > 0) {
                    fixed =
                        fixed.substring(0, match.offset) +
                        match.replacements[0].value +
                        fixed.substring(match.offset + match.length);
                }
            });

            setCorrectedText(fixed);
        } catch (error) {
            console.error("Grammar correction failed:", error);
        }
    };

    useEffect(() => {
        correctGrammar(transcript);
    }, [transcript]);

    // --- TTS ---
    const speak = (text, callback) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "de-DE";
        if (callback) {
            utterance.onend = callback; // run callback after speaking
        }
        window.speechSynthesis.speak(utterance);
    };

    // --- Start recording with announcement ---
    const handleStart = () => {
        speak("Starte Aufnahme", () => {
            SpeechRecognition.startListening({
                continuous: true,
                interimResults: true,
                language: "de-DE",
            });
        });
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <p>🎙️ Microphone: {listening ? "on" : "off"}</p>
            <button onClick={handleStart}>Start (Deutsch)</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>

            <h3>Raw Transcript:</h3>
            <p>{transcript}</p>

            <h3>✅ Corrected Grammar:</h3>
            <p>{correctedText}</p>

            <button onClick={() => speak(correctedText)}>🔊 Speak Corrected</button>
            <button onClick={() => speak(transcript)}>🔊 Speak Raw</button>
        </div>
    );
};

export default Dictaphone;
