const db = require("../database");

exports.all = async (req, res) => {
  const reactions = await db.reaction.findAll();
  res.json(reactions);
};

// Create a reaction in the database.
exports.create = async (req, res) => {
  const reaction = await db.reaction.create({
    type: req.body.type,
    userId: req.body.userId,
    postId: req.body.postId,
  });

  res.json(reaction);
};

exports.update = async (req, res) => {
  const id = req.params.id;

  const reaction = await db.reaction.findByPk(id);

  reaction.type = req.body.type;

  await reaction.save();
  res.json(reaction);
};

// delete a reaction
exports.delete = async (req, res) => {
    const id = req.params.id;
    
    const deleted = await db.reaction.destroy({
      where: {
        id: id
      }
    })
    res.json(deleted);

  }
