let { Server } = require("socket.io")
const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substring(2, 16);
const {ExpressPeerServer} = require("peer")

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

module.exports = function createSocket(server, app){
    const peerServer = ExpressPeerServer(server, {
        path: "/myapp",
        generateClientId: customGenerationFunction
    });
    app.use("/peerjs", peerServer)
    let origin;
    if(process.env.NODE_ENV === 'production'){
        origin = process.env.PROD_FRONTEND_URL
    }else if(process.env.NODE_ENV === 'development'){
        origin = process.env.DEV_FRONTEND_URL
    }else if(process.env.NODE_ENV === 'lan'){
        origin = process.env.LAN_FRONTEND_URL
    }
    let io = new Server(server, { pintTimeout: 60000, cors: { origin }})
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