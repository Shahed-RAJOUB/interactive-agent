import React, { useState } from "react";
import "./ToDoList.css";

const ToDoList = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");

    const addTask = () => {
        if (!input.trim()) return;
        setTasks([...tasks, { text: input, done: false }]);
        setInput("");
    };

    const toggleDone = (index) => {
        const newTasks = tasks.map((task, i) =>
            i === index ? { ...task, done: !task.done } : task
        );
        setTasks(newTasks);
    };

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") addTask();
    };

    return (
        <div className="todo-container">
            <h3>To-Do</h3>
            <div className="todo-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Neue Aufgabe..."
                />
                <button onClick={addTask}>+</button>
            </div>
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
