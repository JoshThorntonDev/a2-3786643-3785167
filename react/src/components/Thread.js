import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { getRepliesTo } from "../data/dbrepository";
import Stack from "react-bootstrap/Stack";
import Collapse from "react-bootstrap/esm/Collapse";

function Thread(props) {
  const [post] = useState(props.post);
  const [replies, setReplies] = useState([]);

  const [newChild, setNewChild] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

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

      setShowReplies(true);
    }
  }, [newChild, replies]);

  return (
    <Collapse in={showSelf}>
      <Stack className={showReplies & props.main ? "topPostBottom" : ""}>
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
                <Collapse
                  key={x.id}
                  in={showReplies}
                >
                  <div className="reply">
                    <div className="line">

                    </div>

                    <Thread post={x} allowDelete={false} reply={"reply"} />
                  </div>
                </Collapse>
              ))
            : replies.map((x) => (
                <div key={x.id} className="reply">
                  <div className="line">

                  </div>
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
