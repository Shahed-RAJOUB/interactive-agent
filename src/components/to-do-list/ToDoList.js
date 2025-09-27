import React, { useState } from "react";
import "./ToDoList.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ToDoList = ({ voiceControl }) => {
    const [tasks, setTasks] = useState([]);
    const [listeningForTodo, setListeningForTodo] = useState(false);

    const { transcript, resetTranscript } = useSpeechRecognition();

    const addTask = (text) => {
        if (!text.trim()) return;
        setTasks((prev) => [...prev, { text, done: false }]);
    };

    const toggleDone = (index) => {
        setTasks((prev) =>
            prev.map((task, i) =>
                i === index ? { ...task, done: !task.done } : task
            )
        );
    };

    const deleteTask = (index) => {
        setTasks((prev) => prev.filter((_, i) => i !== index));
    };

    // --- Function triggered from VoiceCommands.js ---
    const addTodoFromVoice = (mode) => {
        if (mode === "start") {
            resetTranscript();
            setListeningForTodo(true);
            SpeechRecognition.startListening({
                continuous: true,
                language: "de-DE",
            });
        } else if (mode === "stop") {
            setListeningForTodo(false);
            // Extract text between "Plan" and "fertig"
            const match = transcript.match(/Plan\s+(.*?)\s+fertig/i);
            if (match && match[1]) {
                addTask(match[1].trim());
            }

            resetTranscript();
        }
    };

    // Expose control to parent
    if (voiceControl) {
        voiceControl.current = addTodoFromVoice;
    }

    return (
        <div className="todo-container">
            <h3>To-Do</h3>
            <hr/>
            <hr/>
            {listeningForTodo && <p>🎤 Spreche deine Aufgabe...</p>}
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} className={task.done ? "done" : ""}>
                        <span onClick={() => toggleDone(index)}>{task.text}</span>
                        <button onClick={() => deleteTask(index)}>x</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
