import { createContext, useContext, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  fetchStatus: "idle", // "idle" | "fetching" | "error"
  addPost: () => {},
  addInitialPosts: () => {},
  deletePost: () => {},
  likePost: () => {},
  setFetchStatus: () => {},
});

export const usePostList = () => useContext(PostList);

const postListReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_POST":
      return {
        ...state,
        postList: state.postList.filter(
          (post) => post.id !== action.payload.postId
        ),
      };
    case "ADD_INITIAL_POSTS":
      return {
        ...state,
        postList: [...state.postList, ...action.payload.posts],
      };
    case "ADD_POST":
      return {
        ...state,
        postList: [action.payload, ...state.postList],
      };
    case "LIKE_POST":
      return {
        ...state,
        postList: state.postList.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                reactions: post.liked
                  ? post.reactions - 1
                  : post.reactions + 1,
                liked: !post.liked,
              }
            : post
        ),
      };
    case "SET_FETCH_STATUS":
      return { ...state, fetchStatus: action.payload };
    default:
      return state;
  }
};

const initialState = {
  postList: [],
  fetchStatus: "idle",
};

const PostListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postListReducer, initialState);

  const addPost = (userId, postTitle, postBody, reactions, tags) => {
    dispatch({
      type: "ADD_POST",
      payload: {
        id: Date.now(),
        title: postTitle,
        body: postBody,
        reactions: parseInt(reactions, 10) || 0,
        liked: false,
        userId: userId,
        tags: tags,
        createdAt: new Date().toISOString(),
      },
    });
  };

  const addInitialPosts = (posts) => {
    dispatch({ type: "ADD_INITIAL_POSTS", payload: { posts } });
  };

  const deletePost = (postId) => {
    dispatch({ type: "DELETE_POST", payload: { postId } });
  };

  const likePost = (postId) => {
    dispatch({ type: "LIKE_POST", payload: { postId } });
  };

  const setFetchStatus = (status) => {
    dispatch({ type: "SET_FETCH_STATUS", payload: status });
  };

  return (
    <PostList.Provider
      value={{
        postList: state.postList,
        fetchStatus: state.fetchStatus,
        addPost,
        addInitialPosts,
        deletePost,
        likePost,
        setFetchStatus,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
