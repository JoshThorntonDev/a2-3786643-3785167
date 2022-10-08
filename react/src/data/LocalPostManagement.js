function getTopLevelPosts(allLocalPosts) {
  return allLocalPosts.filter((post) => post.depth === 0);
}

function getRepliesToFromLocal(allLocalPosts, postId) {
  return allLocalPosts.filter((post) => post.replyId === postId);
}

function findPostsByUser(allLocalPosts, userId) {
  return allLocalPosts.filter((post) => post.userId === userId);
}

function reversePosts(posts) {
  return posts.reverse();
}

export { getTopLevelPosts, getRepliesToFromLocal, findPostsByUser, reversePosts};
