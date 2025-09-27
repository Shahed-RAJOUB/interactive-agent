let timerInterval = null;

export const createCommands = ({ setTime, addTodoFromVoice, stopListening }) => [
    // --- Zeit Command ---
    {
        command: "Zeit",
        callback: () => {
            if (timerInterval) clearInterval(timerInterval);

            let startTime = new Date();
            timerInterval = setInterval(() => {
                startTime = new Date(startTime.getTime() + 1000);
                const formatted = startTime.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
                setTime(formatted);
            }, 1000);
        },
    },
    {
        command: "Stopp Zeit",
        callback: () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        },
    },

    // --- ToDo Commands ---
    {
        command: "plan",
        callback: () => {
            addTodoFromVoice("start"); // tell ToDoList to start listening
        },
    },
    {
        command: "fertig",
        callback: () => {
            addTodoFromVoice("stop"); // tell ToDoList to stop listening & save
            stopListening();
        },
    },
];
