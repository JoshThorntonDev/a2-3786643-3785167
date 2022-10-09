import "./css/Profile.css";
import Button from "react-bootstrap/Button";

import { PencilSquare, PersonCircle, Trash } from "react-bootstrap-icons";
import { useState } from "react";
import ProfileEditor from "./ProfileEditor";
import ProfileDeleter from "./ProfileDeleter";
import Card from "react-bootstrap/Card";


function ProfileCard(props) {
  const [user, setUser] = useState(props.user)

  // the field is stored here to make it easier to clear the values when the modal is closed,
  // either by closing it manually or when an update is successful

  const [showEdit, setShowEdit] = useState(false); // state for profile edit modal
  const [showDelete, setShowDelete] = useState(false); // state for profile delete modal

  const toggleEdit = () => {
    // toggle the edit state
    // it also clears the fields in case the user opens it again
    setShowEdit((current) => !current);
  };

  const toggleDelete = () => {
    //toggle delete state, clear password in case it was entered before
    setShowDelete((current) => !current);
  };

  const getDate = () => {
    var date = new Date(props.user.createdAt);
    return date.toLocaleDateString();
  };


  return (
    <Card border="secondary" className="profile">
      <ProfileEditor
        show={showEdit}
        toggle={toggleEdit}
        user={user}
        setUser={setUser}
      />

      {<ProfileDeleter show={showDelete} toggle={toggleDelete} user={user} />}
      <PersonCircle size={"100"} className="image"></PersonCircle>

      <div className="information">
        <h1>{user.username}'s Profile</h1>
        <p>{user.email}</p>
        <hr />
        <p>Joined: {getDate()}</p>
      </div>

      {props.isThisMyAccount && ( // only show edit and delete when its the logged in account
        <div className="edit">
          <Button onClick={toggleEdit} variant="primary" type="submit">
            <PencilSquare size={"20"}></PencilSquare> Edit
          </Button>

          <Button onClick={toggleDelete} variant="danger" type="submit">
            <Trash size={"20"}></Trash> Delete
          </Button>
        </div>
      )}
    </Card>
  );
}

export default ProfileCard;

// updating code adapted from Week5 practical activity 1
