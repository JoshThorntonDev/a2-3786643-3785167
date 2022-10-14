//Routes to call follow controller methods
//Adapted from week 8 lab post.routes.js

module.exports = (express, app) => {
  const controller = require("../controllers/follow.controller.js");
  const router = express.Router();

  // Select all follow relations.
  router.get("/", controller.all);

  // Select all follow relations.
  router.get("/one", controller.all);

  // Select the ids of every user a specific user is following. (For sorting posts)
  router.get("/user/:id", controller.allFollowing);

  // Select the ids of every user that is following the specified user (For seeing who is following you)
  router.get("/user/followers/:id", controller.allFollowers);

  // Create a follow relation.
  router.post("/", controller.create);

  // Delete a single follow relation with id.
  router.delete("/:id", controller.delete);

  // Add routes to server.
  app.use("/api/follows", router);
};
