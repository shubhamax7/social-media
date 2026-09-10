import { createContext, useContext, useReducer, useEffect } from "react";

export const generatePostSummary = (title = "", body = "") => {
  const text = `${title} ${body}`.trim();
  if (!text) {
    return [
      "Highlights modern web engineering practices and design architecture.",
      "Emphasizes performance optimizations and user interaction speed.",
      "Shared with the SocialSphere developer community."
    ];
  }
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (sentences.length >= 3) {
    return sentences.slice(0, 3);
  }
  if (sentences.length === 2) {
    return [
      sentences[0],
      sentences[1],
      "Key community discussion spark on SocialSphere."
    ];
  }
  return [
    title || "Core technical concept explored.",
    sentences[0] || body.slice(0, 80) + "...",
    "Live conversation open for developer insights and feedback."
  ];
};

const SEED_POSTS = [
  {
    id: 9901,
    title: "Building next-generation design systems with Glassmorphism & React 19 ✨",
    body: "Just finished redesigning SocialSphere with unified design tokens, dynamic micro-interactions, and fluid typography. The dark theme contrast ratios and glass reflections look stunning on OLED displays! What styling foundation does your team prefer today?",
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
    poll: {
      question: "Which styling approach does your team prefer in 2026?",
      options: [
        { id: "opt1", text: "CSS Tokens & Vanilla CSS / PostCSS", votes: 142 },
        { id: "opt2", text: "Tailwind CSS v4", votes: 119 },
        { id: "opt3", text: "StyleX / Zero-runtime CSS", votes: 48 },
        { id: "opt4", text: "CSS Modules", votes: 35 }
      ],
      totalVotes: 344,
      userVotedOptionId: null,
      expiresAt: "Active · Ends in 2 days"
    },
    aiSummary: [
      "Introduces unified design tokens and responsive glassmorphism across OLED screens.",
      "Eliminates bloated CSS-in-JS runtimes in favor of fluid CSS custom properties.",
      "Optimizes layout structure for high-framerate desktop and mobile experiences."
    ]
  },
  {
    id: 9902,
    title: "AI agents and autonomous developer workflows in 2026 🤖⚡",
    body: "We are entering an era where software pair programming is completely fluid. Agents can analyze full-stack repositories, identify UI friction points, rewrite stylesheets, and verify in headless browsers in minutes. Where do you find the highest leverage?",
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
    poll: {
      question: "Where do autonomous AI coding agents provide the highest leverage?",
      options: [
        { id: "p2_1", text: "Full-repo refactoring & CSS polishing", votes: 89 },
        { id: "p2_2", text: "Autonomous test verification & regression checking", votes: 115 },
        { id: "p2_3", text: "Documentation & API scaffolding", votes: 24 }
      ],
      totalVotes: 228,
      userVotedOptionId: "p2_2",
      expiresAt: "Active · Ends in 18 hours"
    },
    aiSummary: [
      "Software engineering is shifting toward autonomous pair-programming agents.",
      "Automated browser validation ensures high visual fidelity without manual clicking.",
      "Agents dramatically accelerate bug diagnosis and cross-system refactoring."
    ]
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
    aiSummary: [
      "Vite 7 delivers sub-100ms cold starts and 15ms HMR updates.",
      "Native CSS variables streamline real-time dark mode and theme customizability.",
      "Replaces heavy CSS runtime overhead with browser-native performant stylesheets."
    ]
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
  votePoll: () => {},
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
    case "VOTE_POLL": {
      const { postId, optionId } = action.payload;
      return {
        ...state,
        postList: state.postList.map((post) => {
          if (post.id !== postId || !post.poll) return post;
          const prevSelected = post.poll.userVotedOptionId;
          const isUnvoting = prevSelected === optionId;

          const newOptions = post.poll.options.map((opt) => {
            let votes = opt.votes || 0;
            if (opt.id === prevSelected) {
              votes = Math.max(0, votes - 1);
            }
            if (!isUnvoting && opt.id === optionId) {
              votes += 1;
            }
            return { ...opt, votes };
          });

          const totalVotes = newOptions.reduce((acc, curr) => acc + curr.votes, 0);

          return {
            ...post,
            poll: {
              ...post.poll,
              options: newOptions,
              userVotedOptionId: isUnvoting ? null : optionId,
              totalVotes,
            },
          };
        }),
      };
    }
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

const STORAGE_KEY = "socialsphere_posts_v5";

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.postList));
    } catch (e) {
      console.error("Failed to persist posts", e);
    }
  }, [state.postList]);

  const addPost = (
    userId,
    postTitle,
    postBody,
    reactions,
    tags,
    image = null,
    authorProfile = null,
    poll = null,
    aiSummary = null
  ) => {
    const summary = aiSummary || generatePostSummary(postTitle, postBody);
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
        authorName: authorProfile?.name || "Shubham Sharma",
        username: authorProfile?.username || (userId ? String(userId).toLowerCase().replace(/\s+/g, "_") : "shubham"),
        authorAvatar: authorProfile?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId || "Shubham"}`,
        isVerified: true,
        userId: userId || "shubham",
        tags: Array.isArray(tags) ? tags : [],
        poll: poll || null,
        aiSummary: summary,
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

  const votePoll = (postId, optionId) => {
    dispatch({
      type: "VOTE_POLL",
      payload: { postId, optionId },
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
        votePoll,
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
