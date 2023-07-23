import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    transports: ["websocket"],
  };
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  return io(serverUrl, options);
};
