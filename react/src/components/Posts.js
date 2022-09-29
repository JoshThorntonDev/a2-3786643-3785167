import { getPosts } from "../data/dbrepository";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import "./css/Posts.css";

import PostCreator from "./PostCreator";
import { PlusCircleFill } from "react-bootstrap-icons";

import PostCard from "./PostCard";
import UserContext from "../contexts/UserContext";
import Spinner from "react-bootstrap/Spinner";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      const currentPosts = await getPosts();

      setPosts(currentPosts);
      setIsLoading(false);
    }

    loadPosts();
  }, [showModal]); // if modal gets toggled, reload the posts

  const [post, setPost] = useState({
    userId: currentUser,
    content: "",
    image: "",
    replyPostIds: [],
    date: "unknown",
    time: "",
    postId: "",
  });

  const toggleModal = () => {
    // toggle the edit state

    post.content = "";
    post.postId = "";
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
      <br></br>
      <PostCreator
        show={showModal}
        toggle={toggleModal}
        fields={post}
        setFields={setPost}
      />

      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <span className="text-muted">No posts have been submitted.</span>
        ) : (
          posts.map((x) => <PostCard key={x.id} post={x} allowDelete={false} />)
        )}
      </div>
    </div>
  );
}
export default Posts;
