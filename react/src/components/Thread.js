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
    setShowReplies(true);
  }, [post.id]);

  useEffect(() => {
    if (newChild) {
      // add a new reply
      setReplies([...replies, newChild]);

      setNewChild(false);
      if (props.main) {
        setShowReplies(!true);
      } else {
        setShowReplies(true);
      }
      
    }
  }, [newChild, replies]);
  

  return (
    <Collapse in={showSelf}>
      <Stack className={!showReplies & props.main ? "topPostBottom" : ""}>
        {" "}
        {/* Controls if the post should have a line at the bottom */}
        {replies.length !== 0 ? (
          <PostCard
            post={post}
            update={setNewChild}
            toggleReplies={toggleReplies}
            main={props.main}
          />
        ) : (
          <PostCard post={post} update={setNewChild} toggleReplies={null} />
        )}
        {
          props.main
            ? replies.map((x) => (
                <Collapse key={x.id} in={!showReplies}>
                  <div className="reply">
                    <div className="line"></div>

                    <Thread post={x} />
                  </div>
                </Collapse>
              ))
            : replies.map((x) => (
                <Collapse key={x.id} in={showReplies}>
                  <div key={x.id} className="reply">
                     {/* when showing replies from a main post, !showReplies shows all at first */}
                    <div className="line"></div>
                    <Thread post={x} />
                  </div>
                </Collapse>
              ))
        }
        {}
      </Stack>
    </Collapse>
  );
}
export default Thread;
