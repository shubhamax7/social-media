import { createContext, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId,
    );
  }
  return newPostList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(
    postListReducer,
    DEFAULT_POST_LIST,
  );

  const addPost = () => {};
  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  return (
    <PostList.Provider value={{ postList, addPost, deletePost }}>
      {" "}
      {children}{" "}
    </PostList.Provider>
  );
};

const DEFAULT_POST_LIST = [
  {
    id: "1",
    title: "Going to Delhi",
    body: "Hi, I am going to delhi, see you soon.",
    reactions: 2,
    userId: "user-9",
    tags: ["vacation", "delhi", "travel"],
  },
  {
    id: "2",
    title: "Going to Mumbai",
    body: "Hi, I am going to mumbai, see you soon.",
    reactions: 14,
    userId: "user-10",
    tags: ["vacation", "Mumbai", "travel"],
  },
];

export default PostListProvider;
