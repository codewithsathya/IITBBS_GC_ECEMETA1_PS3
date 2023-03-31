const express = require("express");
const userRoute = require("./user.route");
const meetingRoute = require("./meeting.route");

const router = express.Router();

const routes = [
  { path: "/user", route: userRoute },
  {
    path: "/meeting",
    route: meetingRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
