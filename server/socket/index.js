const fs = require('fs')
const { Server } = require("socket.io")
const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substring(2, 16);
const {ExpressPeerServer} = require("peer")
const config = require("../../client/src/config.json")
const connectConfig = config[config.env]

let connectedPeers = {}
const onConnection = (socket, peerServer) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        console.log(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-diconnected', userId)
        })
    })

    peerServer.on("connection", (client) => {
        connectedPeers[client.id] = 1
    })
}

// const key = fs.readFileSync("../cert/key.pem")
// const cert = fs.readFileSync("../cert/certificate.pem")

module.exports = function createSocket(server, app, options){
    const peerServer = ExpressPeerServer(server, {
        path: "/myapp",
        generateClientId: customGenerationFunction,
        ssl: config.https ? options : undefined
    });
    app.use("/peerjs", peerServer)

    let io = new Server(server, { pintTimeout: 60000, cors: { origin: connectConfig.frontend_url }})
    io.on("connection", (socket) => {
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            console.log(roomId)
            socket.to(roomId).emit('user-connected', userId)
            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-diconnected', userId)
                connectedPeers[userId] = 0
            })
        })
    
        peerServer.on("connection", (client) => {
            socket.emit("connected-peers", JSON.stringify(connectedPeers))
            connectedPeers[client.id] = 1
        })
    })
}