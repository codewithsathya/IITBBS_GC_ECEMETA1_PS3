const { Server } = require("socket.io")
const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substring(2, 16);
const {ExpressPeerServer} = require("peer")
const config = require("../../client/src/config.json")
const connectConfig = config[config.env]


module.exports = function createSocket(server, app, options){
    const peerServer = ExpressPeerServer(server, {
        path: "/myapp",
        generateClientId: customGenerationFunction,
        ssl: config.https ? options : undefined
    });
    app.use("/peerjs", peerServer)

    let io = new Server(server, { pintTimeout: 60000, cors: { origin: connectConfig.frontend_url }})

    const { joinRoom } = require("./userHandler")(io)

    io.on("connection", (socket) => {
        socket.on("join-room", joinRoom)
        peerServer.on("connection", (client) => {
        })
    })
}