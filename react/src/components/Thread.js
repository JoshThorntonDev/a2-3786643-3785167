import PostCard from "./PostCard";
import { useContext, useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack";
import Collapse from "react-bootstrap/Collapse";
import { getRepliesToFromLocal } from "../data/LocalPostManagement";
import PostContext from "../contexts/PostContext";
import UserContext from "../contexts/UserContext";

function Thread(props) {
  const [post] = useState(props.post);
  const {posts} = useContext(PostContext)
  const [replies, setReplies] = useState([]);

  const {users} = useContext(UserContext)

  const [newChild, setNewChild] = useState(false); // stores a new reply when one is made, and it changing causes useEffect to add it to the list of replies

  const [showReplies, setShowReplies] = useState(false); // dont show replies by default

  const [showSelf, setShowSelf] = useState(false);

  const toggleReplies = () => {
    setShowReplies((current) => !current);
  };

  const [name, setName] = useState("")

  useEffect(() => {
    var user = users.find((user) => user.id === Number(post.userId));

    if (user !== undefined) {
      setName(user.username)
    } else {
      setName("[unknown]")
    }


    const temp = getRepliesToFromLocal(posts, post.id);

    setReplies(temp.reverse());

    setShowSelf(true);
    setShowReplies(true);

  }, [post.id]);

  useEffect(() => {
    if (newChild) {
      // add a new reply
      setReplies([...replies, newChild]);

      setNewChild(false);
      
      setShowReplies(!true);
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
            name={name}
          />
        ) : (
          <PostCard post={post} update={setNewChild} toggleReplies={null} name={name} />
        )}
        {props.main
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
            ))}
        {}
      </Stack>
    </Collapse>
  );
}
export default Thread;
