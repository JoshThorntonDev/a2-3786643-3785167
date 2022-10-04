import PostCard from "./PostCard";
import { useContext, useEffect, useState } from "react";
import { findUser, getRepliesTo } from "../data/dbrepository";
import Stack from "react-bootstrap/Stack";

function Thread(props) {
  const [post] = useState(props.post);
  const [replies, setReplies] = useState([]);

  const [childCalledUpdate, setChildCalledUpdate] = useState(false);

  useEffect(() => {
    async function getReplies() {
      const temp = await getRepliesTo(Number(post.id));
      setReplies(temp);
    }

    getReplies();
  }, []);

  useEffect(() => {
    async function getReplies() {
      const temp = await getRepliesTo(Number(post.id));
      setReplies(temp);
    }

    if (childCalledUpdate) {
      setReplies([]);
      getReplies();
    }

    setChildCalledUpdate(false);
  }, [childCalledUpdate]);

  return (
    <Stack>
      <PostCard post={post} allowDelete={false} update={setChildCalledUpdate} />

      {replies.map((x) => (
        <div key={x.id} className="reply">
          <Thread
            post={x}
            allowDelete={false}
            reply={"reply"}
            update={setChildCalledUpdate}
          />
        </div>
      ))}
    </Stack>
  );
}
export default Thread;
