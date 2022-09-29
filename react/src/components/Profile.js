import "./css/Profile.css";
import Button from "react-bootstrap/Button";

import { PencilSquare, PersonCircle, Trash } from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import ProfileEditor from "./ProfileEditor";
import ProfileDeleter from "./ProfileDeleter";
import PostCard from "./PostCard";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { findUser } from "../data/dbrepository";
import UserContext from "../contexts/UserContext";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  const isThisMyAccount = () => {
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
    loadUser();
  }, [id]);

  //const posts = getAllPostsByUser(currentUser);
  // this is used to get all the posts and display them on this profile page
  // currentUser could be changed to display posts of other users if accessing other profiles becomes a requirement

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

  const [altered, setAltered] = useState(false);

  useEffect(() => {
    setAltered(false);
  }, [altered]);

  const getDate = () => {
    var date = new Date(user.updatedAt);
    return date.toLocaleDateString();
  };

  return (
    <div>
      {isLoading ? (
        <span></span>
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

          <h3>All posts by {user.username}</h3>

          {/* {posts.length === 0 ? (
        <div className="d-flex justify-content-center">
          <h5 className="text-muted">This user has no existing posts</h5>
        </div>
      ) : (
        Object.keys(posts).map((id) => {
          const post = posts[id];

          return (
            <PostCard
              className="smallCards"
              key={id}
              id={id}
              post={post}
              setAltered={setAltered}
              allowDelete={true}
            />
          );
        })
      )} */}
        </div>
      )}
    </div>
  );
}

export default Profile;

// updating code adapted from Week5 practical activity 1
