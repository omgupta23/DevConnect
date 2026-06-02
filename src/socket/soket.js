const { Socket } = require("socket.io");

const socketHandler = (io) => {
  io.on("connection", (Socket) => {
    console.log("Soket Connection Istablihed");
  });
};
module.exports = socketHandler;
