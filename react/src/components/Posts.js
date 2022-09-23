import { getPosts } from "../data/PostRepository";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import "./css/Posts.css";

import PostCreator from "./PostCreator";
import { PlusCircleFill } from "react-bootstrap-icons";

import PostCard from "./PostCard";
import UserContext from "../contexts/UserContext";

function Posts() {
  const { currentUser } = useContext(UserContext);

  const posts = getPosts();

  const [post, setPost] = useState({
    userId: currentUser,
    content: "",
    image: "",
    replyPostIds: [],
    date: "unknown",
    time: "",
    postId: "",
  });

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    // toggle the edit state

    post.content = "";
    post.postId = ""
    post.image = "";

    setShowModal((current) => !current);
  };

  return (
    <div>
      <h1>All Posts</h1>
      <div className="d-flex justify-content-center">
        <Button onClick={toggleModal}>
          <PlusCircleFill /> Create a post
        </Button>
      </div>

      <PostCreator
        show={showModal}
        toggle={toggleModal}
        fields={post}
        setFields={setPost}
      />

      {Object.keys(posts).map((id) => {
        const post = posts[id];

        return <PostCard key={id} id={id} post={post} allowDelete={false} />;
      })}
    </div>
  );
}
export default Posts;
