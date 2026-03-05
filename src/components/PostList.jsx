import { useContext, useState } from "react";
import Post from "./Post";
import { PostList as PostListData } from "../store/post-list-store";
import WelcomeMessage from "./WelcomeMessage";

const PostList = () => {
  const { postList, addInitialPosts } = useContext(PostListData);
  const [dataFetched, setDataFetched] = useState(false);

  if (!dataFetched) {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const normalizedPosts = data.posts.map((post) => {
          let reactions = post.reactions;

          if (typeof reactions === "object" && reactions !== null) {
            const { likes = 0, dislikes = 0 } = reactions;
            reactions = likes + dislikes;
          }

          return { ...post, reactions };
        });

        addInitialPosts(normalizedPosts);
        setDataFetched(true);
      });
  }

  return (
    <>
      {postList.length === 0 && <WelcomeMessage />}
      {postList.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default PostList;
