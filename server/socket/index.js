let { Server } = require("socket.io")


const onConnection = (socket) => {
    socket.on("user:connect",);
    socket.on();
    socket.on();
}

module.exports = function createSocket(server){
    let io = new Server(server, { pintTimeout: 60000, cors: { origin: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL: process.env.DEV_API_URL }})
    io.on("connection", onConnection)
}