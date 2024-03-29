import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./css/Posts.css";
import {
  PencilSquare,
  Trash,
  ChatLeftText,
  BarChartSteps,
} from "react-bootstrap-icons";
import { useContext, useEffect, useRef, useState } from "react";
import PostCreator from "./PostCreator";
import { findUser } from "../data/dbrepository";
import { useNavigate } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import UserContext from "../contexts/UserContext";
import PostDeleter from "./PostDeleter";
import ReactionArea from "./ReactionArea";
import ReactionContext from "../contexts/ReactionContext";

function PostCard(props) {
  const navigate = useNavigate();
  const [post, setPost] = useState(props.post);
  const [name, setName] = useState(props.name);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const { currentUser } = useContext(UserContext);

  const { reactions } = useContext(ReactionContext);

  const REPLY_DEPTH = 10; // sets max reply depth

  const [localReactions] = useState({ // each post stores a copy of its reactions locally so it is easier to add/remove reactions client-side
    numLikes: 0,
    numDislikes: 0,
    default: "",
    defaultId: null,
  });

  const [postValue, setPostValue] = useState({
    // stores what the post is currently displaying, so that when a user enters text in the editor,
    // it doesn't update the post until they save
    content: "",
    image: "",
  });

  const [allowEdit, setAllowEdit] = useState(false);

  const toggleEdit = () => {
    // toggle the edit state
    setShowEdit((current) => !current);
  };

  const toggleDelete = () => {
    // toggle the delete state
    setShowDelete((current) => !current);
  };

  const [reply, setReply] = useState();
  const [depth, setDepth] = useState(0); // assume that the depth (indentation) of a post is 0, ie not a reply

  const toggleReply = (depth, replyId) => {
    //toggle the reply state and set the replyId and depth of the post being replied to
    setReply(replyId);
    setDepth(depth);
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
    if (reactions.length > 0) {
      // get reactions for this post only
      var postReacts = reactions.filter(
        (reaction) => reaction.postId === post.id
      );

      if (postReacts[0] === undefined) {
        return;
      }

      // this pattern can be adapted to accomodate additional reaction types, eg "heart" or "angry"
      var likes = postReacts.filter((x) => x.type === "like");
      var dislikes = postReacts.filter((x) => x.type === "dislike");

      var needToSetDefault = postReacts.find( // determines which, if either, of the two buttons needs to be visually selected when post loads
        (x) => x.userId.toString() === currentUser.toString()
      );

      if (needToSetDefault) {
        localReactions.default = needToSetDefault.type;
        localReactions.defaultId = needToSetDefault.id;
      }
      localReactions.numLikes = likes.length;
      localReactions.numDislikes = dislikes.length;

      reactionArea.current = // update the reaction area to reflect any new reactions
        (
          <ReactionArea
            default={localReactions.default} // if it starts with nothing, a like or a dislike
            defaultId={localReactions.defaultId} // pk of reaction in db if it exists
            likes={localReactions.numLikes}
            dislikes={localReactions.numDislikes}
            userId={currentUser}
            postId={post.id} // id of the post its rendering inside
          />
        );
    }
  }, [reactions]);

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

  // store the reaction area in a useRef so its values arent lost on re render
  const reactionArea = useRef(
    <ReactionArea
      default={localReactions.default}
      defaultId={localReactions.defaultId}
      likes={localReactions.numLikes}
      dislikes={localReactions.numDislikes}
      userId={currentUser}
      postId={post.id}
    />
  );

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
                  <Col sm="auto" className="postButton">
                    {!props.onProfile ? (
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
                      <div></div>
                    )}
                  </Col>
                  <Col>
                    {allowEdit && (
                      <span className="postButton">
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
                    variant="outline-secondary"
                    type="submit"
                  >
                    <BarChartSteps></BarChartSteps> Replies
                  </Button>
                )}
                {!props.main && props.toggleReplies && (
                  <Button
                    size="sm"
                    onClick={props.toggleReplies}
                    variant="outline-secondary"
                    type="submit"
                  >
                    <BarChartSteps></BarChartSteps>
                  </Button>
                )}
              </Col>
              <Col className="text-end">
                <Container fluid>
                  <Row>
                    <Col>
                      <Row>
                        <Col sm="auto" className="align-middle">
                          {
                            reactionArea.current /* render the current reaction area */
                          }
                        </Col>
                        <Col>
                          {props.post.depth < REPLY_DEPTH && !props.onProfile && (
                            <Button
                              size="sm"
                              className="postButton"
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
        user={currentUser}
        type="REPLY"
        replyId={reply}
        depth={depth}
        update={props.update}
      />

      <PostCreator
        show={showEdit}
        toggle={toggleEdit}
        user={currentUser}
        post={post}
        updater={setPostValue}
        type="EDIT"
      />

      <PostDeleter
        post={post}
        show={showDelete}
        toggle={toggleDelete}
        setName={setName}
        setPostValue={setPostValue}
        setEdit={setAllowEdit}
      />
    </Stack>
  );
}

export default PostCard;
