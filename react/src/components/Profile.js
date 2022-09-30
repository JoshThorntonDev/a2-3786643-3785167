import "./css/Profile.css";
import Button from "react-bootstrap/Button";

import { PencilSquare, PersonCircle, Trash } from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import ProfileEditor from "./ProfileEditor";
import ProfileDeleter from "./ProfileDeleter";
import PostCard from "./PostCard";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { findUser, getPostsByUser } from "../data/dbrepository";
import UserContext from "../contexts/UserContext";
import PlaceholderPost from "./PlaceholderPost";
import Spinner from "react-bootstrap/Spinner";

import ReactPaginate from "react-paginate";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);

  const isThisMyAccount = async () => {
    var value = false;
    if (id === currentUser) {
      value = true;
    }
    return value;
  };

  useEffect(() => {
    async function loadUser() {
      const current = await findUser(id);

      setUser(current);
      setIsLoading(false);
    }

    async function loadPosts() {
      const current = await getPostsByUser(id);

      setPosts(current);
    }
    loadUser();
    loadPosts();
  }, [isLoading]);

  const [fields, setFields] = useState({
    // a field storing all possible user data, currently only name is editable
    name: "",
    email: "",
    password: "",
    date: "",
    posts: [],
  });
  // the field is stored here to make it easier to clear the values when the modal is closed,
  // either by closing it manually or when an update is successful

  const [showEdit, setShowEdit] = useState(false); // state for profile edit modal
  const [showDelete, setShowDelete] = useState(false); // state for profile delete modal

  const toggleEdit = () => {
    // toggle the edit state
    // it also clears the fields in case the user opens it again
    fields.name = "";
    fields.password = "";
    setShowEdit((current) => !current);
  };

  const toggleDelete = () => {
    //toggle delete state, clear password in case it was entered before
    fields.password = "";
    setShowDelete((current) => !current);
  };

  const getDate = () => {
    var date = new Date(user.updatedAt);
    return date.toLocaleDateString();
  };

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
          <Card border="secondary" className="profile">
            {/* <ProfileEditor
          show={showEdit}
          toggle={toggleEdit}
          fields={fields}
          setFields={setFields}
        /> */}

            {
              <ProfileDeleter
                show={showDelete}
                toggle={toggleDelete}
                fields={fields}
                setFields={setFields}
                user={user}
              />
            }
            <PersonCircle size={"10vh"} className="image"></PersonCircle>

            <div className="information">
              <h1>{user.username}'s Profile</h1>
              <p>{user.email}</p>
              <hr />
              <p>Joined: {getDate()}</p>
            </div>

            {isThisMyAccount() && ( // only show edit and delete when its the logged in account
              <div className="edit">
                <Button onClick={toggleEdit} variant="primary" type="submit">
                  <PencilSquare size={"2vh"}></PencilSquare> Edit
                </Button>

                <Button onClick={toggleDelete} variant="danger" type="submit">
                  <Trash size={"2vh"}></Trash> Delete
                </Button>
              </div>
            )}
          </Card>

          <hr />

          <h3>Posts by {user.username}</h3>

          {posts.length === 0 ? (
            <div className="d-flex justify-content-center">
              <h5 className="text-muted">No posts found</h5>
            </div>
          ) : (
            <div>
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
              {postsToDisplay.map((x) => (
                <PostCard key={x.id} post={x} allowDelete={false} />
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
