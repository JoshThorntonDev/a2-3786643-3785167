import "./css/Profile.css";
import Button from "react-bootstrap/Button";

import { PencilSquare, PersonCircle, Trash } from "react-bootstrap-icons";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import ProfileEditor from "./ProfileEditor";
import ProfileDeleter from "./ProfileDeleter";
import PostCard from "./PostCard";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { findUser, getPostsByUser } from "../data/dbrepository";
import UserContext from "../contexts/UserContext";
import PlaceholderPost from "./PlaceholderPost";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ReactionContext from "../contexts/ReactionContext";
import ProfileCard from "./ProfileCard";
import PostContext from "../contexts/PostContext";
import { findPostsByUser } from "../data/LocalPostManagement";
function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { checkForPosts } = useContext(PostContext);
  const { posts } = useContext(PostContext);

  const [update, setUpdate] = useState(false);

  const [userPosts, setUserPosts] = useState([]);

  const [page, setPage] = useState(0);
  const [isThisMyAccount, setIsThisMyAccount] = useState(false);

  const navigate = useNavigate();

  const { reactions } = useContext(ReactionContext);
  const { checkForReactions } = useContext(ReactionContext);

  if (id === "1") {
    // dont allow access to the deleted user
    navigate(`/posts`, { replace: true });
  }

  useEffect(() => {
    if (posts.length === 0) {
      checkForPosts();
    }

    setIsThisMyAccount(false); // make sure theres no way to trick react into leaving this as true when changing page

    async function loadUser() {
      const current = await findUser(id);

      if (current === null) {
        navigate(`/`, { replace: true });
      }

      setUser(current);

      if (id === currentUser) {
        // flag for showing edit and delete buttons
        setIsThisMyAccount(true);
      }

      setIsLoading(false);
    }

    async function loadPosts() {
      const current = findPostsByUser(posts, user.id);

      setUserPosts(current.reverse());
    }

    loadUser();
    if (user !== null) {
      loadPosts();
    }

    if (reactions.length === 0) {
      checkForReactions();
    }
  }, [posts]);

  useEffect(() => {
    if (user !== null) {
      setName(user.username);
    }
  }, [update]);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 4; // number of posts to display per page
  const pageCount = Math.ceil(userPosts.length / pageSize); // finds the number of pages needed to fit all posts
  const offset = page * pageSize; // keeps track of where the first post of each page is
  const postsToDisplay = userPosts.slice(offset, offset + pageSize); // selects only the posts on the current page

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>{" "}
            Loading profile
            <br></br>
            <PlaceholderPost />
            <br></br>
            <PlaceholderPost />
            <br></br>
            <PlaceholderPost />
          </div>
        </div>
      ) : (
        <div>
          <ProfileCard
            user={user}
            update={setUpdate}
            isThisMyAccount={isThisMyAccount}
          />
          <hr />

          <h3>Posts by {name}</h3>

          {userPosts.length === 0 ? (
            <div className="d-flex justify-content-center">
              <h5 className="text-muted">No posts found</h5>
            </div>
          ) : (
            <div>
              {userPosts.length > pageSize && ( // only show page indicator when required
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

              {postsToDisplay.map((x) => (
                <div className="profilePost">
                  <PostCard
                    key={x.id}
                    post={x}
                    allowDelete={false}
                    name={name}
                    toggleReplies={null}
                    onProfile={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;

// updating code adapted from Week5 practical activity 1
