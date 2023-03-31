require("dotenv").config();
const express = require("express");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const routes = require("./routes");
const createSocket = require('./socket')
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

app.enable("trust proxy");

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Cors
const config = require("../client/src/config.json")
const connectConfig = config[config.env]
app.use(cors({ credentials: true, origin: connectConfig.frontend_url }));
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

const dirname = path.resolve("..")
app.use(express.static(path.join(dirname, "/client/build")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "client", "build", "index.html"))
})

let server;
const port = process.env.PORT || 3000;

let options;
const postMongoConnection = () => {
  options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/certificate.pem')
  };
  if(config.https){
    server = https.createServer(options, app)
  }else
    server = http.createServer(app)
  server.listen(port)
  createSocket(server, app, options)
}

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    postMongoConnection()
  })
  .catch((err) => {
    throw err;
  });