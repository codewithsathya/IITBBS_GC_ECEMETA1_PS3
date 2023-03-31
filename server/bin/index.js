require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");
const { ExpressPeerServer } = require("peer")

const port = process.env.PORT || 3000;

let server;
mongoose.set("strictQuery", true);

const customGenerationFunction = () =>
	(Math.random().toString(36) + "0000000000000000000").substr(2, 16);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server = app.listen(port, () => console.log(`Listening to port ${port}`));
    const peerServer = ExpressPeerServer(server, {
      path: "/myapp",
      generateClientId: customGenerationFunction
    });
    app.use("/peerjs", peerServer);
    peerServer.on('connection', (client) => {
      console.log(client)
    })
  })
  .catch((err) => {
    throw err;
  });
