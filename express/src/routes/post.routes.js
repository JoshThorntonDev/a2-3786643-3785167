//Routes to call post controller methods
//Adapted from week 8 lab post.routes.js

module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);

  // Select all posts.
  router.get("/user/:id", controller.allByUser);

  // Select all replies to post.
  router.get("/replies/:id", controller.repliesTo);

  // Create a new post.
  router.post("/", controller.create);

  // Update a post with id.
  router.put("/", controller.update)

  // Add routes to server.
  app.use("/api/posts", router);
};
