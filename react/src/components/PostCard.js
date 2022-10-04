import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./css/Posts.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { deletePost } from "../data/PostRepository";
import { useContext, useEffect, useState } from "react";
import PostCreator from "./PostCreator";
import { findUser, getRepliesTo } from "../data/dbrepository";
import { useNavigate } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import UserContext from "../contexts/UserContext";

function PostCard(props) {
  const navigate = useNavigate();
  const [post, setPost] = useState(props.post);
  const [name, setName] = useState(props.name);
  const [showEdit, setShowEdit] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const { currentUser } = useContext(UserContext);

  const REPLY_DEPTH = 10; // sets max reply depth

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
    props.setAltered(true);
  };

  const [reply, setReply] = useState({
    userId: currentUser,
    content: "",
    image: "",
    replyId: null,
    depth: 0,
  });


  const toggleReply = (depth, replyId) => {
    reply.content = "";
    reply.replyId = replyId;

    reply.depth = depth;

    setShowReply((current) => !current);
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

    if (name === undefined) {
      // only query db when name isnt set
      assignNameToPost();
    }
  }, [post.userId]);


  return (
    <Stack>
      <Card className={props.reply}>
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
            {props.post.depth < REPLY_DEPTH && (
              <span>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    toggleReply(props.post.depth, props.post.id);
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


      <PostCreator
        show={showReply}
        toggle={toggleReply}
        fields={reply}
        setFields={setReply}
        type="REPLY"
        replyId={reply.replyId}
        update={props.update}
      />
    </Stack>
  );
}

export default PostCard;
