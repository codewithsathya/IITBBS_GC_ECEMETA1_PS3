const fs = require("fs");
const { Server } = require("socket.io");
const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substring(2, 16);
const { ExpressPeerServer } = require("peer");
const config = require("../../client/src/config.json");
const connectConfig = config[config.env];

module.exports = function createSocket(server, app, options) {
  const peerServer = ExpressPeerServer(server, {
    path: "/myapp",
    generateClientId: customGenerationFunction,
    ssl: config.https ? options : undefined,
  });
  app.use("/peerjs", peerServer);

  let io = new Server(server, {
    pintTimeout: 60000,
    cors: { origin: connectConfig.frontend_url },
  });
  io.on("connection", (socket) => onConnection(socket, peerServer));

  const onConnection = (socket, peerServer) => {
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-diconnected", userId);
      });
    });

    peerServer.on("connection", (client) => {});
  };
};
