const express = require("express");
const userRoute = require("./user.route");

const router = express.Router();

const routes = [{ path: "/user", route: userRoute }];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
