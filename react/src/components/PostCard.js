import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./css/Posts.css";
import { PencilSquare, Trash, ChatLeftText } from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import PostCreator from "./PostCreator";
import { findUser } from "../data/dbrepository";
import { useNavigate } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import UserContext from "../contexts/UserContext";
import PostDeleter from "./PostDeleter";
import ReactionArea from "./ReactionArea";

function PostCard(props) {
  const navigate = useNavigate();
  const [post, setPost] = useState(props.post);
  const [name, setName] = useState(props.name);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const { currentUser } = useContext(UserContext);

  const [postValue, setPostValue] = useState({
    // stores what the post is currently displaying, so that when a user enters text in the editor,
    // it doesn't update the post until they save
    content: "",
    image: "",
  });

  const [allowEdit, setAllowEdit] = useState(false);

  const REPLY_DEPTH = 10; // sets max reply depth

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
  };

  const toggleDelete = () => {
    // toggle the delete state
    setShowDelete((current) => !current);
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
    reply.image = "";

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

    return time.toLocaleTimeString("en-AU", { hour12: false });
  };

  // on first render, set content and image
  useEffect(() => {
    setPostValue({ content: post.content, image: post.image });
  }, []);

  useEffect(() => {
    async function assignNameToPost() {
      const user = await findUser(post.userId);
      setName(user.username);
    }

    if (name === undefined) {
      // only query db when name isnt set
      assignNameToPost();
    }

    if (post.userId.toString() === currentUser) {
      // only users who made the post should be able to edit/delete
      setAllowEdit(true);
    }
  }, [post.userId, currentUser, name, post.content, post.image]);

  return (
    <Stack>
      <Card border={showReply && "secondary"} className={props.reply}>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: postValue.content }} />
        </Card.Body>
        {postValue.image !== "" && ( // only render <hr> and <img> if the post actually has an image
          <Card.Body>
            <hr />
            <img alt="" variant="bottom" src={postValue.image} />
          </Card.Body>
        )}

        <Card.Footer onDoubleClick={props.toggleReplies}>
          <Container fluid>
            <Row>
              <Col>
                <Row>
                  <Col sm="auto"  className="postButton">
                    {name ? (
                      name !== "[deleted]" ? (
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => {
                            navigate(`/profile/${post.userId}`, {
                              replace: false,
                            });
                          }}
                        >
                          {name}
                        </Button>
                      ) : (
                        <Button size="sm" disabled variant="outline-secondary">
                          {name}
                        </Button>
                      )
                    ) : (
                      <Button size="sm" variant="outline-success">
                        &nbsp;{" "}
                        {/* fixes the button changing size when name loads */}
                      </Button>
                    )}
                  </Col>
                  <Col>
                    {allowEdit && (
                      <span className="postButton d-flex justify-content-evenly">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => {
                            toggleEdit();
                          }}
                        >
                          <PencilSquare /> Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            toggleDelete();
                          }}
                          variant="outline-danger"
                        >
                          <Trash /> Delete
                        </Button>
                      </span>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col sm={3} className="text-center">
                {props.main && (
                  <Button
                    size="sm"
                    onClick={props.toggleReplies}
                    variant="secondary"
                    type="submit"
                  >
                    Show/Hide Replies
                  </Button>
                )}
              </Col>
              <Col className="text-end">
                <Container fluid>
                  <Row>
                    <Col>
                      <Row>
                        <Col sm="auto" className="align-middle">
                          <ReactionArea likes={5} dislikes={1} />
                        </Col>
                        <Col>
                          {props.post.depth < REPLY_DEPTH && !props.onProfile && (
                            <Button
                              size="sm"
                              className="w-50"
                              variant="outline-primary"
                              onClick={() => {
                                toggleReply(props.post.depth, props.post.id);
                              }}
                            >
                              <ChatLeftText /> Reply
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Col>{" "}
                    <Col className="p-0" sm="auto">
                      <small className="align-middle">
                        {getDate()} | {getTime()}
                      </small>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
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

      <PostCreator
        show={showEdit}
        toggle={toggleEdit}
        fields={post}
        setFields={setPost}
        updater={setPostValue}
        type="EDIT"
      />

      <PostDeleter
        post={post}
        show={showDelete}
        toggle={toggleDelete}
        setName={setName}
        setEdit={setAllowEdit}
      />
    </Stack>
  );
}

export default PostCard;
