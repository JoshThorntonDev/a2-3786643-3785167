//Controller for calling methods on users
//Adapted from week 8 Lab post.controller.js

const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll();
  res.json(posts);
};

// Select all posts made by specified user
exports.allByUser = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      userId: req.params.id
    }
  });
  res.json(posts);
};


// Create a post in the database.
exports.create = async (req, res) => {
  const post = await db.post.create({
    content: req.body.content,
    image: req.body.image,
    userId: req.body.userId, // set foreign key
    depth: req.body.depth,
    replyId: req.body.replyId
  });

  res.json(post);
};

// delete a post
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  await db.post.destroy({where: {id: id}})
  res.send({
    message: `Deleted post ${id}`
  });
}