import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./css/Posts.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { deletePost } from "../data/PostRepository";
import { useEffect, useState } from "react";
import PostCreator from "./PostCreator";
import { findUser } from "../data/dbrepository";

function PostCard(props) {
  
  const [post, setPost] = useState(props.post);
  const [name, setName] = useState('')


  const [showEdit, setShowEdit] = useState(false);

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
    props.setAltered(true);
  };

  const getDate = () => {
    var date = new Date(post.updatedAt)
    return date.toLocaleDateString()
  }

  const getTime = () => {
    var time = new Date(post.updatedAt)
    return time.toLocaleTimeString()
  }

  useEffect(() => {
    async function assignNameToPost() {
      const user = await findUser(post.user_id)
      setName(user.username)
    }
    assignNameToPost()
  },[post.user_id])

  return (
    <Card>
      <Card.Body><div dangerouslySetInnerHTML={{ __html: props.post.content }} /></Card.Body>
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
          {getDate()} | {getTime()}
        </div>
      </Card.Footer>
    </Card>
  );
}

export default PostCard;
