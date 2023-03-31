require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const routes = require("./routes");
const { ExpressPeerServer } = require("peer")
const createSocket = require('./socket')

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Cors
app.use(cors({ credentials: true, origin: `${process.env.FRONT_END_URL}` }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

let server;
const port = process.env.PORT || 3000;
const postMongoConnection = () => {
  server = app.listen(port, () => console.log(`Listening on port ${port}`))
  createSocket(server)
}

mongoose.set("strictQuery", true);
const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substring(2, 16);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    postMongoConnection()
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