//Adapted from week 8 lab material index.js

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

//Models
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.reaction = require("./models/reaction.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);

// Relate tables

db.user.hasMany(db.post, {
  foreignKey: {
    allowNull: true
  }
})

db.user.belongsToMany(db.user, {through: 'follow', as:'following'})


db.post.hasOne(db.post, {
  foreignKey: "replyId"

})

db.post.belongsTo(db.user);

db.post.hasMany(db.reaction, {
  foreignKey: "postId"
})

db.reaction.belongsTo(db.user);



//Sync schema and seed initial data
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // force it to sync, will delete everything
  // await db.sequelize.sync({ force: true });

  await seedData();
};

//Seed database with initial data
async function seedData() {
  const userIds = [101, 105, 106, 107];


  const userCount = await db.user.count();
  const postCount = await db.post.count();
  const reactionCount = await db.reaction.count();

  //Only seed users table when it's empty
  if (userCount === 0) {
    const argon2 = require("argon2");
    let hash = await argon2.hash((Math.random() + Math.random()).toString(), { type: argon2.argon2id });

    await db.user.create({
      id: 1,
      email: "[deleted]",
      password_hash: hash,
      username: "[deleted]",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: 2,
      email: "testuser@email.com",
      password_hash: hash,
      username: "Test User"
    })

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userIds[0],
      email: "first@email.com",
      password_hash: hash,
      username: "First User",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userIds[1],
      email: "second@email.com",
      password_hash: hash,
      username: "Second User",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userIds[2],
      email: "third@email.com",
      password_hash: hash,
      username: "Third User",
    });

    hash = await argon2.hash("password1!", { type: argon2.argon2id });
    await db.user.create({
      id: userIds[3],
      email: "fourth@email.com",
      password_hash: hash,
      username: "Fourth User",
    });


  }

  //Only seed posts table when it's empty
  if (postCount === 0) {
    await db.post.create({
      content: "this is the first post, <h1>which does not have an image,</h1> and is on the second page",
      userId: userIds[0]
    });
    await db.post.create({
      content: "this is the second post, which has an image",
      image:
        "https://images.unsplash.com/photo-1488372759477-a7f4aa078cb6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      userId: userIds[1]
    });
    await db.post.create({
      content: "<h1>I like pianos</h1>",
      image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
      userId: userIds[2]
    });
    await db.post.create({
      content: "I don't see how that is relevant...",
      depth: 1,
      replyId: 3,
      userId: userIds[3]
    });

    await db.post.create({
      content: "Let's get started on the project we were talking about",
      userId: userIds[3]
    });

    await db.post.create({
      content: "<h2>Another post</h2>",
      userId: userIds[3]
    });
    await db.post.create({
      content: "<h2>The post after this will cause a second page to be created</h2>",
      userId: userIds[3]
    });
  }


  if (reactionCount === 0) {
    await db.reaction.create({
      type: "dislike",
      postId: 3,
      userId: userIds[3]
    });
  }
}

module.exports = db;
