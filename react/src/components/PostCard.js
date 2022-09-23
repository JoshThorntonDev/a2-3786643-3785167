import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./css/Posts.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { deletePost } from "../data/PostRepository";
import { getUser } from "../data/Repository";
import { useState } from "react";
import PostCreator from "./PostCreator";

function PostCard(props) {
  var name = "";
  const [post, setPost] = useState(props.post);
  // deal with some posts not being linked with an existing profile, and provide a placeholder name
  if (props.post.userId === "[deleted]") {
    name = "[deleted]";
  } else {
    name = getUser(props.post.userId).name;
  }

  const [showEdit, setShowEdit] = useState(false);

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
    props.setAltered(true);
  };

  return (
    <Card>
      <Card.Body>{props.post.content}</Card.Body>
      {props.post.image && ( // only render <hr> and <img> if the post actually has an image
        <Card.Body>
          <hr />

          <img
            variant="bottom"
            alt={
              props.post.image === "[deleted]"
                ? "This image has been deleted"
                : "Posted by a user"
            }
            src={props.post.image}
          />
        </Card.Body>
      )}

      <Card.Footer className="d-flex justify-content-between">
        <div>Posted by: {name}</div>{" "}
        <div>
          {props.allowDelete && (
            <span className="postButton">
              <PostCreator
                show={showEdit}
                toggle={toggleEdit}
                fields={post}
                setFields={setPost}
                editing={true}
              />
              <Button
                size="sm"
                variant="info"
                onClick={() => {
                  toggleEdit();
                }}
              >
                <PencilSquare /> Edit
              </Button>{" "}
              <Button
                size="sm"
                onClick={() => {
                  deletePost(props.post.postId);
                  props.setAltered(true);
                }}
                variant="danger"
              >
                <Trash /> Delete
              </Button>
            </span>
          )}{" "}
          {props.post.date} | {props.post.time}
        </div>
      </Card.Footer>
    </Card>
  );
}

export default PostCard;
