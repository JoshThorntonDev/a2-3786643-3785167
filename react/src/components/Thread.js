import PostCard from "./PostCard";
import { useContext, useEffect, useState } from "react";
import { findUser, getRepliesTo } from "../data/dbrepository";
import Stack from "react-bootstrap/Stack";

function Thread(props) {
  const [post] = useState(props.post);
  const [replies, setReplies] = useState([]);

  const [newChild, setNewChild] = useState(false);

  useEffect(() => {
    async function getReplies() {
      const temp = await getRepliesTo(Number(post.id));
      setReplies(temp);
    }

    getReplies();
  }, []);

  useEffect(() => {
    if (newChild) {
      setReplies([
        ...replies,
        newChild,
      ]);

      setNewChild(false);
    }
  }, [newChild]);

  return (
    <Stack>
      <PostCard post={post} allowDelete={false} update={setNewChild} />

      {
        replies.map((x) => (
          <div key={x.id} className="reply">
            <Thread post={x} allowDelete={false} reply={"reply"} />
          </div>
        ))}
    </Stack>
  );
}
export default Thread;
