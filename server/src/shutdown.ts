/** Whether the process is in the middle of a graceful shutdown (SIGTERM received). */
let shuttingDown = false;

export const isShuttingDown = () => shuttingDown;

export const setShuttingDown = () => {
  shuttingDown = true;
};
