const express = require("express");
const cors = require("cors");
const db = require("./src/database");

//Code adapted from Week 8 Lab Material
//(some stuff commented out for now so it can run)

// Database will be sync'ed in the background.
db.sync();

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS suport.
app.use(cors());

// Simple Hello World route.
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

//Add routes to call methods on users and posts
require("./src/routes/user.routes.js")(express, app);
require("./src/routes/post.routes.js")(express, app);
require("./src/routes/reaction.routes.js")(express, app);
require("./src/routes/follow.routes.js")(express, app);

//// Set port, listen for requests.
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
