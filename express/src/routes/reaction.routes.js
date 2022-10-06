//Routes to call reaction controller methods
//Adapted from week 8 lab post.routes.js

module.exports = (express, app) => {
  const controller = require("../controllers/reaction.controller.js");
  const router = express.Router();

  // Select all reactions.
  router.get("/", controller.all);

  // Create a new reaction.
  router.post("/", controller.create);

  // Update a reaction with id.
  router.put("/", controller.update);

  router.delete("/:id", controller.delete);

  // Add routes to server.
  app.use("/api/reactions", router);
};
