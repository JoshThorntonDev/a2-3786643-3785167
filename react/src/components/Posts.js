import { getPosts } from "../data/dbrepository";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import "./css/Posts.css";

import PostCreator from "./PostCreator";
import { PlusCircleFill } from "react-bootstrap-icons";

import PostCard from "./PostCard";
import UserContext from "../contexts/UserContext";
import Spinner from "react-bootstrap/Spinner";

import ReactPaginate from "react-paginate";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
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

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 4;
  const pageCount = Math.ceil(posts.length / pageSize);
  const offset = page * pageSize;
  const postsToDisplay = posts.slice(offset, offset + pageSize);

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
          <div>
            {postsToDisplay.map((x) => (
              <PostCard key={x.id} post={x} allowDelete={false} />
            ))}
            <ReactPaginate
              onPageChange={handlePageClick}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              breakClassName="page-link"
              activeClassName="active"
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default Posts;
