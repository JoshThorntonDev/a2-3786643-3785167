import "./css/Profile.css";
import Button from "react-bootstrap/Button";

import {
  PencilSquare,
  PersonCircle,
  PersonPlusFill,
  PersonVideo2,
  Trash,
} from "react-bootstrap-icons";
import { useState } from "react";
import ProfileEditor from "./ProfileEditor";
import ProfileDeleter from "./ProfileDeleter";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

function ProfileCard(props) {
  const [showEdit, setShowEdit] = useState(false); // state for profile edit modal
  const [showDelete, setShowDelete] = useState(false); // state for profile delete modal

  const navigate = useNavigate();

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
        user={props.user}
        setUser={props.setUser}
      />

      {
        <ProfileDeleter
          show={showDelete}
          toggle={toggleDelete}
          user={props.user}
        />
      }
      <PersonCircle size={"100"} className="image"></PersonCircle>

      <div className="information">
        {props.listed ? (
          <h1>{props.user.username}</h1>
        ) : (
          <h1>{props.user.username}'s Profile</h1>
        )}
        <p>{props.user.email}</p>
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
      {props.listed && ( // only show buttons when profile is being listed
        <div className="edit">
          <Button variant="primary" type="submit">
            <PersonPlusFill size={20} /> Follow
          </Button>

          <Button
            onClick={() => {
              navigate(`/profile/${props.user.id}`, {
                replace: false,
              });
            }}
            variant="success"
            type="submit"
          >
            <PersonVideo2 size={20} /> Profile
          </Button>
        </div>
      )}
    </Card>
  );
}

export default ProfileCard;

// updating code adapted from Week5 practical activity 1
