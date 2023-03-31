require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

let server;
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server = app.listen(port, () => console.log(`Listening to port ${port}`));
  })
  .catch((err) => {
    throw err;
  });
