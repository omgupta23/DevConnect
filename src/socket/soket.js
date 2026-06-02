const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected");

    socket.on("joinChat", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.receiverId).emit("receiveMessage", data);
    });
  });
};

module.exports = socketHandler;
