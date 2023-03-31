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
  createSocket(server, app)
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