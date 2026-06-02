const { Socket } = require("socket.io");

const socketHandler = (io) => {
  io.on("connection", (soket) => {
    console.log("Soket Connection Istablihed");
  });
};
module.exports = socketHandler;
