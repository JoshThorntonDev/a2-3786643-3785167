import "./css/Profile.css";
import { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useParams } from "react-router-dom";
import { findUser, getPostsByUser } from "../data/dbrepository";
import UserContext from "../contexts/UserContext";
import PlaceholderPost from "./PlaceholderPost";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ReactionContext from "../contexts/ReactionContext";
import ProfileCard from "./ProfileCard";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isThisMyAccount, setIsThisMyAccount] = useState(false); // determines if edit/delete buttons show
  const [updated, setUpdated] = useState(false);
  const navigate = useNavigate();

  const { reactions } = useContext(ReactionContext);
  const { checkForReactions } = useContext(ReactionContext);

  if (id === "1") {
    // dont allow access to the deleted user
    navigate(`/posts`, { replace: true });
  }

  useEffect(() => {
    setIsThisMyAccount(false); // make sure theres no way to trick react into leaving this as true when changing page

    if (updated) {
      // forces name displayed on posts to reset
      setPosts([]);
    }

    setUpdated(false); // reset update state if it was set

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
      const current = await getPostsByUser(id);

      setPosts(current);
    }

    loadUser();
    loadPosts();

    if (reactions.length === 0) {
      checkForReactions();
    }

    // this removes the warning that checkForReactions isnt a dependency, because adding it would cause an infinite loop
    // eslint-disable-next-line
  }, [id, updated]);




  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const pageSize = 3; // number of posts to display per page
  const pageCount = Math.ceil(posts.length / pageSize); // finds the number of pages needed to fit all posts
  const offset = page * pageSize; // keeps track of where the first post of each page is
  const postsToDisplay = posts.slice(offset, offset + pageSize); // selects only the posts on the current page

  return (
    <div>
      {isLoading ? (
        <div className="fade-in d-flex justify-content-center">
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
            <ProfileCard user={user} setUser={setUser} isThisMyAccount={isThisMyAccount}/>
          <hr />

          <h3>Posts by {user.username}</h3>

          {posts.length === 0 ? (
            <div className="d-flex justify-content-center">
              <h4 className="fade-in text-muted">No posts found</h4>
            </div>
          ) : (
            <div>
              {posts.length > pageSize && ( // only show page indicator when required
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
                    user={user}
                    setUser={setUser}
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
