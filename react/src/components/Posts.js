import { findFollowedUsers, getPosts } from "../data/dbrepository";
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

import ReactionContext from "../contexts/ReactionContext";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { currentUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [sortNewest, setSortNewest] = useState(false);

  const { reactions } = useContext(ReactionContext);
  const { checkForReactions } = useContext(ReactionContext);

  const [showType, setShowType] = useState("all");

  useEffect(() => {
    if (reactions.length === 0) {
      checkForReactions();
    }
  }, []);

  useEffect(() => {
    async function loadPosts() {
      await checkForReactions(); // ensure we have the latest copy of reactions

      var currentPosts = await getPosts();

      if (!sortNewest) {
        currentPosts = currentPosts.reverse();
      }

      if (showType === "following") {
        var follows = await findFollowedUsers(Number(currentUser));

        var ids = [];
        follows.forEach((follow) => {
          ids.push(follow.followingId);
        });
        console.log(ids);

        currentPosts = currentPosts.filter((post) => ids.includes(post.userId));
      }

      setPosts(currentPosts);

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    loadPosts();
  }, [showModal, sortNewest, showType]); // if modal or sort order gets toggled, reload the posts

  const toggleModal = () => {
    // toggle the edit state

    setShowModal((current) => !current);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 6; // number of posts to display per page
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
      <PostCreator show={showModal} toggle={toggleModal} user={currentUser} />

      <div>
        <div className="d-flex justify-content-between">
          <Form onChange={(e) => setShowType(e.target.value)}>
            <Form.Group>
              <Form.Label>
                <strong>Display posts from:</strong>
              </Form.Label>
              <Form.Select>
                <option value="all">Everyone</option>
                <option value="following">Followed Users</option>
              </Form.Select>
            </Form.Group>
          </Form>
          {posts.length !== 0 && (
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
          )}

          <div>
            <Form>
              <Form.Group>
                <Form.Label>
                  <strong>Sort by:</strong>
                </Form.Label>
                <Form.Select
                  onChange={(e) => setSortNewest((current) => !current)}
                >
                  <option>Newest First</option>
                  <option>Oldest First</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        </div>
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
          <div className="text-muted text-center">No posts were found.</div>
        ) : (
          <div>
            {postsToDisplay.map((x) => (
              <div key={x.id} className="topPost">
                <Thread post={x} main={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Posts;
