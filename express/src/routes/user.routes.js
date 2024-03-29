//Routes to call user controller methods
//Adapted from week 8 lab user.routes.js

module.exports = (express, app) => {

  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:id", controller.one);
  
  //Select a single user by email
  router.get("/selectemail/:email", controller.findByEmail);

  //Select a single user by username
  router.get("/selectname/:username", controller.findByName);

  // Select one user from the database if username and password are a match.
  router.get("/login", controller.login);

  // Create a new user.
  router.post("/", controller.create);

  // Delete a single user with id.
  router.delete("/:id", controller.delete);

  //update details of an existing user
  router.put("/", controller.update)

  // Add routes to server.
  app.use("/api/users", router);
};
