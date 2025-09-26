let timerInterval = null;

export const commands = [
    {
        command: "Zeit",
        callback: (setTime) => {
            // Clear previous interval if any
            if (timerInterval) clearInterval(timerInterval);

            // Initialize start time as current time
            let startTime = new Date();

            // Update time every second
            timerInterval = setInterval(() => {
                startTime = new Date(startTime.getTime() + 1000); // increment 1 sec
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
];
