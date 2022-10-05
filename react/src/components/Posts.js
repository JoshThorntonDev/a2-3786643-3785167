import { getPosts } from "../data/dbrepository";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import "./css/Posts.css";

import PostCreator from "./PostCreator";
import { PlusCircleFill } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import UserContext from "../contexts/UserContext";
import Spinner from "react-bootstrap/Spinner";

import ReactPaginate from "react-paginate";
import PlaceholderPost from "./PlaceholderPost";
import Thread from "./Thread";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { currentUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [sortNewest, setSortNewest] = useState(false);

  const [post, setPost] = useState({
    userId: currentUser,
    content: "",
    image: "",
    replyId: null,
    depth: 0,
  });

  useEffect(() => {
    async function loadPosts() {
      const currentPosts = await getPosts();

      if (sortNewest) {
        setPosts(currentPosts.reverse());
      } else {
        setPosts(currentPosts);
      }

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    loadPosts();
  }, [showModal, sortNewest]); // if modal or sort order gets toggled, reload the posts

  const toggleModal = () => {
    // toggle the edit state

    post.content = "";
    post.replyId = null;
    post.image = "";

    setShowModal((current) => !current);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 8; // number of posts to display per page
  const pageCount = Math.ceil(posts.length / pageSize); // finds the number of pages needed to fit all posts
  const offset = page * pageSize; // keeps track of where the first post of each page is
  const postsToDisplay = posts.slice(offset, offset + pageSize); // selects only the posts on the current page

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
              </Spinner>{" "}
              Loading posts
              <br></br>
              <PlaceholderPost />
              <br></br>
              <PlaceholderPost />
              <br></br>
              <PlaceholderPost />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <span className="text-muted">No posts have been submitted.</span>
        ) : (
          <div>
            <div className="d-flex justify-content-between">
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
              <div>
                <Form>
                  <Form.Group>
                    <Form.Label>
                      <strong>Sort by:</strong>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => setSortNewest((current) => !current)}
                    >
                      <option>Oldest First</option>
                      <option>Newest First</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
            </div>
            {postsToDisplay.map((x) => (
              <div key={x.id} className="topPost">
                <Thread post={x} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Posts;
