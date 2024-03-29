//Controller for calling methods on posts
//Adapted from week 8 Lab post.controller.js

const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      depth: 0
    }
  });
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

// Select all posts made by specified user
exports.repliesTo = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      replyId: req.params.id
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

//update content and image of an existing post
exports.update = async (req, res) => {

  const id = req.body.id;
  
  const post = await db.post.findByPk(id)

  post.content = req.body.content;
  post.image = req.body.image;

  if(req.body.userId === 1) {
    post.userId = 1
  }

  await post.save()
  res.json(post)
}

// delete a post, exposed to user in any way, but keeping it for posterity
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  await db.post.destroy({where: {id: id}})
  res.send({
    message: `Deleted post ${id}`
  });
}