const { createServer } = require("http")
const { Server } = require("socket.io")

const httpServer = createServer();

const io = new Server(httpServer);


module.exports = io;