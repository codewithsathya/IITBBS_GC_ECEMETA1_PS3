let allMeetingsDetails = {};

module.exports = (io) => {
  const joinRoom = function (userData) {
    const { roomId, userId } = userData;
    const socket = this;
    socket.join(roomId);

    socket.to(roomId).emit("new-user-connected", userData);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
    socket.on("broadcast-message", (message) => {
      socket.to(roomId).emit("new-broadcast-message", { ...message, userData });
    });

    socket.on("display-media", (value) => {
      socket.to(roomId).emit("display-media", { userId, value });
    });
    socket.on("user-video-off", (value) => {
      socket.to(roomId).emit("user-video-off", value);
    });

    socket.on("screenshare-started", () => {
      socket.to(roomId).emit("new-screenshare-started", { userData });
    });
  };
  return {
    joinRoom,
  };
};
