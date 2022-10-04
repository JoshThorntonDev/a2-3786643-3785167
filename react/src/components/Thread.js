import PostCard from "./PostCard";
import { useContext, useEffect, useState } from "react";
import { findUser, getRepliesTo } from "../data/dbrepository";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/esm/Collapse";

function Thread(props) {
  const [post] = useState(props.post);
  const [replies, setReplies] = useState([]);

  const [newChild, setNewChild] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies((current) => !current);
  };

  useEffect(() => {
    async function getReplies() {
      // get the replies
      const temp = await getRepliesTo(Number(post.id));
      setReplies(temp);
    }

    getReplies();
  }, []);

  useEffect(() => {
    if (newChild) {
      // add a new reply
      setReplies([...replies, newChild]);

      setNewChild(false);
    }
  }, [newChild]);

  return (
    <Stack>
      {props.main & (replies.length !== 0) ? (
        <PostCard
          post={post}
          allowDelete={false}
          update={setNewChild}
          toggleReplies={toggleReplies}
        />
      ) : (
        <PostCard
          post={post}
          allowDelete={false}
          update={setNewChild}
          toggleReplies={null}
        />
      )}

      {props.main
        ? replies.map((x) => (
            <Collapse key={x.id} in={showReplies}>
              <div className="reply">
                <Thread post={x} allowDelete={false} reply={"reply"} />
              </div>
            </Collapse>
          ))
        : replies.map((x) => (
            <div key={x.id} className="reply">
              <Thread post={x} allowDelete={false} reply={"reply"} />
            </div>
          ))}

      {}
    </Stack>
  );
}
export default Thread;
