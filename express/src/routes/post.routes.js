//Routes to call post controller methods
//Adapted from week 8 lab post.routes.js

module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);

  // Create a new post.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/api/posts", router);
};