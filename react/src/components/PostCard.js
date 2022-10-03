import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./css/Posts.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { deletePost } from "../data/PostRepository";
import { useEffect, useState } from "react";
import PostCreator from "./PostCreator";
import { findUser, getRepliesTo } from "../data/dbrepository";
import { useNavigate } from "react-router-dom";

function PostCard(props) {
  const navigate = useNavigate();
  const [post, setPost] = useState(props.post);
  const [name, setName] = useState(props.name);
  const [showEdit, setShowEdit] = useState(false);

  const [replies, setReplies] = useState([]);

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
    props.setAltered(true);
  };

  const getDate = () => {
    var date = new Date(post.updatedAt);
    return date.toLocaleDateString();
  };

  const getTime = () => {
    var time = new Date(post.updatedAt);
    return time.toLocaleTimeString();
  };

  useEffect(() => {
    async function assignNameToPost() {
      const user = await findUser(post.userId);
      setName(user.username);
    }
    async function getReplies() {
      const temp = await getRepliesTo(Number(post.id));
      setReplies(temp);
    }

    getReplies();
    if (name === undefined) {
      // only query db when name isnt set
      assignNameToPost();
    }
  }, [post.userId]);

  return (
    <div className="top">
      <Card>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: props.post.content }} />
        </Card.Body>
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
          <div
            onClick={() => {
              navigate(`/profile/${post.userId}`, {
                replace: false,
              });
            }}
          >
            Posted by:{" "}
            {name ? (
              <Button size="sm" variant="outline-secondary">
                {name}
              </Button>
            ) : (
              <Button size="sm" variant="outline-secondary">
                &nbsp; {/* fixes the button changing size when name loads */}
              </Button>
            )}
          </div>{" "}
          <div>
            {props.post.depth < 2 && (
              <span>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    props.toggleReply(props.post.depth, props.post.id);
                  }}
                >
                  <PencilSquare /> Reply
                </Button>
              </span>
            )}
            {props.allowDelete && (
              <span className="postButton">
                <PostCreator
                  show={showEdit}
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
      {replies.map((x) => (
        <div className="d-flex justify-content-end reply">
        <div className="test">
          <PostCard
            key={x.id}
            post={x}
            allowDelete={false}
            toggleReply={props.toggleReply}
          />
        </div>
        </div>
      ))}
    </div>
  );
}

export default PostCard;
