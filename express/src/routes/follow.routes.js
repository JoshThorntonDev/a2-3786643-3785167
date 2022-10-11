//Routes to call follow controller methods
//Adapted from week 8 lab post.routes.js

module.exports = (express, app) => {
  const controller = require("../controllers/follow.controller.js");
  const router = express.Router();

  // Select all follow relations.
  router.get("/", controller.all);

  // Select all users a specific user is following.
  router.get("/user/:id", controller.allByUser);

  // Create a follow relation.
  router.post("/", controller.create);

  // Delete a single follow relation with id.
  router.delete("/:id", controller.delete);

  // Add routes to server.
  app.use("/api/follow", router);
};
