import { createContext, useContext, useReducer, useEffect } from "react";

const SEED_POSTS = [
  {
    id: 9901,
    title: "Building next-generation design systems with Glassmorphism & React 19 ✨",
    body: "Just finished redesigning SocialSphere with unified design tokens, dynamic micro-interactions, and fluid typography. The dark theme contrast ratios and glass reflections look stunning on OLED displays!",
    reactions: 284,
    liked: true,
    repostsCount: 42,
    reposted: false,
    bookmarked: true,
    commentsCount: 19,
    comments: [
      { id: 1, author: "Alex Rivera", handle: "@arivera", text: "The glass blur effects and vibrant gradients look sublime!", time: "12m ago" },
      { id: 2, author: "Elena Vance", handle: "@elena_v", text: "So smooth! The 3-column desktop layout feels just like modern Twitter/Bluesky.", time: "5m ago" }
    ],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    authorName: "Sarah Jenkins",
    username: "sarah_j",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SarahJ",
    isVerified: true,
    userId: "sarah_j",
    tags: ["design", "react", "frontend", "uiux"],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 9902,
    title: "AI agents and autonomous developer workflows in 2026 🤖⚡",
    body: "We are entering an era where software pair programming is completely fluid. Agents can analyze full-stack repositories, identify UI friction points, rewrite stylesheets, and verify in headless browsers in minutes. What's your favorite agent workflow?",
    reactions: 198,
    liked: false,
    repostsCount: 31,
    reposted: false,
    bookmarked: false,
    commentsCount: 14,
    comments: [
      { id: 3, author: "Marcus Brody", handle: "@marcus_dev", text: "Browser automation testing for UI regression is definitely the biggest game changer.", time: "18m ago" }
    ],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    authorName: "Devon Vance",
    username: "devon_codes",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DevonV",
    isVerified: true,
    userId: "devon_v",
    tags: ["ai", "coding", "tech", "future"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9903,
    title: "Vite 7 + CSS Custom Properties is pure speed 🚀",
    body: "Cold starts in 80ms, hot module replacement in 15ms. Combined with native CSS variables for theme switching without bloated CSS-in-JS runtimes, web development has never felt this fast.",
    reactions: 156,
    liked: true,
    repostsCount: 18,
    reposted: false,
    bookmarked: false,
    commentsCount: 8,
    comments: [],
    authorName: "Shubham",
    username: "shubham",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham",
    isVerified: true,
    userId: "shubham",
    tags: ["vite", "javascript", "webdev"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  }
];

export const PostList = createContext({
  postList: [],
  fetchStatus: "idle",
  activeTag: "all",
  activeFeedTab: "trending",
  setActiveTag: () => {},
  setActiveFeedTab: () => {},
  addPost: () => {},
  addInitialPosts: () => {},
  deletePost: () => {},
  likePost: () => {},
  bookmarkPost: () => {},
  repostPost: () => {},
  addComment: () => {},
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
    case "ADD_INITIAL_POSTS": {
      // Merge while avoiding duplicate IDs
      const existingIds = new Set(state.postList.map((p) => p.id));
      const newUnique = action.payload.posts.filter((p) => !existingIds.has(p.id));
      return {
        ...state,
        postList: [...state.postList, ...newUnique],
      };
    }
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
                  ? Math.max(0, post.reactions - 1)
                  : post.reactions + 1,
                liked: !post.liked,
              }
            : post
        ),
      };
    case "BOOKMARK_POST":
      return {
        ...state,
        postList: state.postList.map((post) =>
          post.id === action.payload.postId
            ? { ...post, bookmarked: !post.bookmarked }
            : post
        ),
      };
    case "REPOST_POST":
      return {
        ...state,
        postList: state.postList.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                reposted: !post.reposted,
                repostsCount: (post.repostsCount || 0) + (post.reposted ? -1 : 1),
              }
            : post
        ),
      };
    case "ADD_COMMENT":
      return {
        ...state,
        postList: state.postList.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                commentsCount: (post.commentsCount || 0) + 1,
                comments: [
                  ...(post.comments || []),
                  {
                    id: Date.now(),
                    author: action.payload.author || "You",
                    handle: "@you",
                    text: action.payload.text,
                    time: "Just now",
                  },
                ],
              }
            : post
        ),
      };
    case "SET_ACTIVE_TAG":
      return { ...state, activeTag: action.payload };
    case "SET_FEED_TAB":
      return { ...state, activeFeedTab: action.payload };
    case "SET_FETCH_STATUS":
      return { ...state, fetchStatus: action.payload };
    default:
      return state;
  }
};

const getInitialState = () => {
  try {
    const saved = localStorage.getItem("socialsphere_posts");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          postList: parsed,
          fetchStatus: "idle",
          activeTag: "all",
          activeFeedTab: "trending",
        };
      }
    }
  } catch (e) {
    console.error("Failed to load posts from storage", e);
  }
  return {
    postList: SEED_POSTS,
    fetchStatus: "idle",
    activeTag: "all",
    activeFeedTab: "trending",
  };
};

const PostListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postListReducer, null, getInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_posts", JSON.stringify(state.postList));
    } catch (e) {
      console.error("Failed to persist posts", e);
    }
  }, [state.postList]);

  const addPost = (userId, postTitle, postBody, reactions, tags, image = null) => {
    dispatch({
      type: "ADD_POST",
      payload: {
        id: Date.now(),
        title: postTitle,
        body: postBody,
        reactions: parseInt(reactions, 10) || 0,
        liked: false,
        repostsCount: 0,
        reposted: false,
        bookmarked: false,
        commentsCount: 0,
        comments: [],
        image: image || null,
        authorName: "Shubham",
        username: userId ? String(userId).toLowerCase().replace(/\s+/g, "_") : "shubham",
        authorAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId || "Shubham"}`,
        isVerified: true,
        userId: userId || "shubham",
        tags: Array.isArray(tags) ? tags : [],
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

  const bookmarkPost = (postId) => {
    dispatch({ type: "BOOKMARK_POST", payload: { postId } });
  };

  const repostPost = (postId) => {
    dispatch({ type: "REPOST_POST", payload: { postId } });
  };

  const addComment = (postId, text, author = "Shubham") => {
    dispatch({
      type: "ADD_COMMENT",
      payload: { postId, text, author },
    });
  };

  const setActiveTag = (tag) => {
    dispatch({ type: "SET_ACTIVE_TAG", payload: tag });
  };

  const setActiveFeedTab = (tab) => {
    dispatch({ type: "SET_FEED_TAB", payload: tab });
  };

  const setFetchStatus = (status) => {
    dispatch({ type: "SET_FETCH_STATUS", payload: status });
  };

  return (
    <PostList.Provider
      value={{
        postList: state.postList,
        fetchStatus: state.fetchStatus,
        activeTag: state.activeTag,
        activeFeedTab: state.activeFeedTab,
        addPost,
        addInitialPosts,
        deletePost,
        likePost,
        bookmarkPost,
        repostPost,
        addComment,
        setActiveTag,
        setActiveFeedTab,
        setFetchStatus,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
