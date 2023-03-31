let { Server } = require("socket.io")
const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substring(2, 16);
const {ExpressPeerServer} = require("peer")

let connectedPeers = []

const onConnection = (socket, peerServer) => {
    socket.on("test", () => {
        console.log("Hello world")
    })

    peerServer.on("connection", (client) => {
        let peerId = client.id
        connectedPeers.push(peerId)
        socket.emit("connected", ...connectedPeers)
    })

    
}

module.exports = function createSocket(server, app){
    const peerServer = ExpressPeerServer(server, {
        path: "/myapp",
        generateClientId: customGenerationFunction
    });
    app.use("/peerjs", peerServer)

    let io = new Server(server, { pintTimeout: 60000, cors: { origin: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL: process.env.DEV_API_URL }})
    io.on("connection", (socket) => onConnection(socket, peerServer))
}