// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const socketIO = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server,{cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
// });

// // Enable CORS
// // app.use(cors());

// io.on('connection', (socket) => {
//     console.log(`A new socket connected ${socket.id}`);

//     // Handle events and communication with the connected socket here

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');

//       // Handle any necessary cleanup or logic when a socket disconnects
//     });
//   });
//   app.get('/', (req, res) => {
//     res.send('Hello World!');
//   });

//   const PORT = process.env.PORT || 8000;
//   server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//   });

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const io = new Server(server);
server.listen(8000, () => {
  console.log(`listening on port 8000`);
});
// const io = new Server(server,{cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//     return {
//       socketId,
//       username: userSocketMap[socketId],
//     };
//    });
//   }
function getAllConnectedClients(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) {
    return [];
  }

  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}
io.on("connection", (socket) => {
  console.log(`A new socket connected ${socket.id}`);
  socket.on("join-room", ({ roomId, username }) => {
    console.log(`User ${username} joined room ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("new-user", {
        clients,
        username,
        socketId: socket.id,
      });
    });
    socket.on("code-change", ({code , roomId }) => {
      socket.broadcast .emit("code-change", { code });
    });
    
       
    console.log(clients);
    socket.on("disconnect", () => {
      const rooms = [...(io.sockets.adapter.rooms.get(roomId) || [])];
      rooms.forEach((roomId) => {
        socket
          .in(roomId)
          .emit("user-disconnected", {
            socketId: socket.id,
            username: userSocketMap[socket.id],
          });
      });
      delete userSocketMap[socket.id];
      socket.leave();
    });
  });
});
