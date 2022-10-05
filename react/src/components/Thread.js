import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { getRepliesTo } from "../data/dbrepository";
import Stack from "react-bootstrap/Stack";
import Collapse from "react-bootstrap/Collapse";

function Thread(props) {
  const [post] = useState(props.post);
  const [replies, setReplies] = useState([]);

  const [newChild, setNewChild] = useState(false); // stores a new reply when one is made, and it changing causes useEffect to add it to the list of replies

  const [showReplies, setShowReplies] = useState(false); // dont show replies by default

  const [showSelf, setShowSelf] = useState(false);

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
    setShowSelf(true);
  }, [post.id]);

  useEffect(() => {
    if (newChild) {
      // add a new reply
      setReplies([...replies, newChild]);

      setNewChild(false);

      setShowReplies(true); // we just made a reply, so we probably want to see the replies
    }
  }, [newChild, replies]);

  return (
    <Collapse in={showSelf}>
      <Stack className={showReplies & props.main ? "topPostBottom" : ""}>
        {" "}
        {/* Controls if the post should have a line at the bottom */}
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
        {
          // only put the child posts inside a collapse if this is a top level post,
          //otherwise it is impossible to show them without giving the show prop to every child
          props.main
            ? replies.map((x) => (
                <Collapse key={x.id} in={showReplies}>
                  <div className="reply">
                    <div className="line"></div>

                    <Thread post={x} allowDelete={false} reply={"reply"} />
                  </div>
                </Collapse>
              ))
            : replies.map((x) => (
                <div key={x.id} className="reply">
                  <div className="line"></div>
                  <Thread post={x} allowDelete={false} reply={"reply"} />
                </div>
              ))
        }
        {}
      </Stack>
    </Collapse>
  );
}
export default Thread;
