import { getPosts, getUsers } from "../data/dbrepository";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useRef, useState } from "react";
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
import { getTopLevelPosts } from "../data/LocalPostManagement";
import PostContext from "../contexts/PostContext";

function Posts() {
  const postRef = useRef([]);
  const topPostRef = useRef([]);
  const {posts, setPosts} = useContext(PostContext)
  const {checkForUsers} = useContext(UserContext)

  

  const [topPosts, setTopPosts] = useState(topPostRef.current);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { currentUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const { reactions } = useContext(ReactionContext);
  const { checkForReactions } = useContext(ReactionContext);

  const [post, setPost] = useState({
    userId: currentUser,
    content: "",
    image: "",
    replyId: null,
    depth: 0,
  });

  useEffect(() => {
    if (postRef.current !== posts) {
      setTopPosts(posts);
    }
    postRef.current = posts;
    topPostRef.current = topPosts;
  }, [posts, topPosts]);

  useEffect(() => {
    if (reactions.length === 0) {
      checkForReactions();
    }
  }, []);

  useEffect(() => {
    async function loadPosts() {
      await checkForReactions(); // ensure we have the latest copy of reactions

      const currentPosts = await getPosts();
      setPosts(currentPosts.reverse()); // the db gives us posts ordered from oldest to newest

      var tempTopPosts = getTopLevelPosts(currentPosts);
      checkForUsers()
      setTopPosts(tempTopPosts);

      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }

    loadPosts();
  }, []); // if modal or sort order gets toggled, reload the posts

  useEffect(() => {
    if (posts.length !== 0) {
      var tempTopPosts = getTopLevelPosts(posts);

      setTopPosts(tempTopPosts);


      setTimeout(() => {
        // in case the db responds extremely quickly, prevent loading animation from looking bad
        setIsLoading(false);
      }, 300);
    }
  }, [posts]);



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

  const pageSize = 6; // number of posts to display per page
  const pageCount = Math.ceil(topPosts.length / pageSize); // finds the number of pages needed to fit all posts
  const offset = page * pageSize; // keeps track of where the first post of each page is
  const postsToDisplay = topPosts.reverse().slice(offset, offset + pageSize); // selects only the posts on the current page

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

              </div>
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
