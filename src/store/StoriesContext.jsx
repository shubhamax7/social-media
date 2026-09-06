import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useUserProfile } from "./UserProfileContext";
import { useChat } from "./ChatContext";

const INITIAL_STORIES_DATA = [
  {
    id: "user_sarah",
    name: "Sarah J.",
    handle: "@sarah_j",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SarahJ",
    hasUnseen: true,
    slides: [
      {
        id: "slide_s1",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
        caption: "Refining micro-interactions and glassmorphic blur effects for SocialSphere v2 ✨",
        tag: "#DesignSystem",
        time: "1h ago",
        likes: 24,
      },
      {
        id: "slide_s2",
        type: "gradient",
        gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
        caption: "Design isn't just how it looks—it's how effortlessly it glides at 120Hz 🚀",
        tag: "#UIUX",
        time: "45m ago",
        likes: 38,
      },
    ],
  },
  {
    id: "user_devon",
    name: "Devon V.",
    handle: "@devon_codes",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DevonV",
    hasUnseen: true,
    slides: [
      {
        id: "slide_d1",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        caption: "Local neural model latency dropped under 14ms using int8 quantizations! ⚡️",
        tag: "#CyberAI",
        time: "2h ago",
        likes: 42,
      },
      {
        id: "slide_d2",
        type: "gradient",
        gradient: "linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #3b82f6 100%)",
        caption: "Always stress-test your concurrent connections before pushing to main branch 🛡️",
        tag: "#BuildInPublic",
        time: "1h ago",
        likes: 19,
      },
    ],
  },
  {
    id: "user_elena",
    name: "Elena R.",
    handle: "@elena_v",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ElenaR",
    hasUnseen: true,
    slides: [
      {
        id: "slide_e1",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        caption: "Morning espresso & clearing the code review queue before standup ☕️💻",
        tag: "#CoffeeCode",
        time: "3h ago",
        likes: 56,
      },
      {
        id: "slide_e2",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        caption: "Clean minimalist setup brings effortless focus and calm 🌿",
        tag: "#WorkspaceVibes",
        time: "2h ago",
        likes: 67,
      },
    ],
  },
  {
    id: "user_marcus",
    name: "Marcus B.",
    handle: "@marcus_b",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MarcusB",
    hasUnseen: false,
    slides: [
      {
        id: "slide_m1",
        type: "gradient",
        gradient: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
        caption: "Zero downtime multi-region rollout completed across all 8 clusters 🌍✅",
        tag: "#DevOps",
        time: "5h ago",
        likes: 31,
      },
    ],
  },
  {
    id: "user_aria",
    name: "Aria Kim",
    handle: "@aria_kim",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AriaK",
    hasUnseen: true,
    slides: [
      {
        id: "slide_a1",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        caption: "Exploring procedural WebGL shader waves with dynamic audio reactive feedback 🎨",
        tag: "#CreativeTech",
        time: "4h ago",
        likes: 88,
      },
      {
        id: "slide_a2",
        type: "gradient",
        gradient: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #3b82f6 100%)",
        caption: "When math becomes visual poetry ✨ Keep building beautiful things.",
        tag: "#Inspiration",
        time: "2h ago",
        likes: 54,
      },
    ],
  },
  {
    id: "user_liam",
    name: "Liam Wu",
    handle: "@liam_wu",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LiamW",
    hasUnseen: false,
    slides: [
      {
        id: "slide_l1",
        type: "gradient",
        gradient: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)",
        caption: "Our open source library just crossed 10k stars on GitHub! Unbelievable milestone ❤️🎉",
        tag: "#OpenSource",
        time: "6h ago",
        likes: 142,
      },
    ],
  },
];

const DEFAULT_USER_STORIES = [
  {
    id: "my_story_1",
    type: "gradient",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    caption: "Welcome to SocialSphere Stories! Tap '+' on your avatar to publish your own story 🌟",
    tag: "#SocialSphere",
    time: "Just now",
    likes: 12,
  },
];

const StoriesContext = createContext();

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error("useStories must be used within a StoriesProvider");
  }
  return context;
};

export const StoriesProvider = ({ children }) => {
  const { profile } = useUserProfile();
  const { startConversationWithUser, sendMessage } = useChat();

  // All community stories
  const [communityStories, setCommunityStories] = useState(() => {
    try {
      const saved = localStorage.getItem("socialsphere_community_stories");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read stories from localStorage", e);
    }
    return INITIAL_STORIES_DATA;
  });

  // Logged-in user's own stories
  const [userStories, setUserStories] = useState(() => {
    try {
      const saved = localStorage.getItem("socialsphere_user_stories");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read user stories from localStorage", e);
    }
    return DEFAULT_USER_STORIES;
  });

  // Track seen slide IDs to prevent unneeded glowing rings
  const [seenSlideIds, setSeenSlideIds] = useState(() => {
    try {
      const saved = localStorage.getItem("socialsphere_seen_slides");
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load seen slides", e);
    }
    return new Set();
  });

  // Viewer Modal State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Story Creator Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_community_stories", JSON.stringify(communityStories));
    } catch (e) {
      console.error("Failed to persist community stories", e);
    }
  }, [communityStories]);

  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_user_stories", JSON.stringify(userStories));
    } catch (e) {
      console.error("Failed to persist user stories", e);
    }
  }, [userStories]);

  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_seen_slides", JSON.stringify(Array.from(seenSlideIds)));
    } catch (e) {
      console.error("Failed to persist seen slides", e);
    }
  }, [seenSlideIds]);

  // Build the complete combined stories list where the current user is at index 0
  const allStoriesList = useMemo(
    () => [
      {
        id: "current_user",
        name: "Your Story",
        handle: profile.handle || "@shubham",
        avatar: profile.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham",
        isUser: true,
        hasUnseen: userStories.length > 0 && userStories.some((s) => !seenSlideIds.has(s.id)),
        slides: userStories,
      },
      ...communityStories.map((cs) => {
        const allSeen = cs.slides.every((s) => seenSlideIds.has(s.id));
        return {
          ...cs,
          hasUnseen: !allSeen,
        };
      }),
    ],
    [profile.handle, profile.avatarUrl, userStories, seenSlideIds, communityStories]
  );

  // Mark current slide as seen
  const markSlideSeen = useCallback((slideId) => {
    if (!slideId) return;
    setSeenSlideIds((prev) => {
      if (prev.has(slideId)) return prev;
      const next = new Set(prev);
      next.add(slideId);
      return next;
    });
  }, []);

  // Open viewer at specific user and slide
  const openStoryViewer = (userId, slideIdx = 0) => {
    const userIdx = allStoriesList.findIndex((u) => u.id === userId);
    if (userIdx !== -1) {
      const targetUser = allStoriesList[userIdx];
      if (!targetUser.slides || targetUser.slides.length === 0) {
        // If current user has no slides, open creator instead
        if (targetUser.isUser) {
          setIsCreatorOpen(true);
          return;
        }
      }
      setActiveUserIndex(userIdx);
      // Find first unseen slide if slideIdx is 0
      let startSlide = slideIdx;
      if (slideIdx === 0 && targetUser.slides && targetUser.slides.length > 0) {
        const firstUnseen = targetUser.slides.findIndex((s) => !seenSlideIds.has(s.id));
        if (firstUnseen !== -1) {
          startSlide = firstUnseen;
        }
      }
      setActiveSlideIndex(Math.min(startSlide, Math.max(0, (targetUser.slides?.length || 1) - 1)));
      setIsPaused(false);
      setIsViewerOpen(true);

      const activeSlide = targetUser.slides?.[startSlide];
      if (activeSlide) {
        markSlideSeen(activeSlide.id);
      }
    }
  };

  const closeStoryViewer = () => {
    setIsViewerOpen(false);
    setIsPaused(false);
  };

  // Next slide / user navigation
  const nextSlide = useCallback(() => {
    const currentUser = allStoriesList[activeUserIndex];
    if (!currentUser || !currentUser.slides) return;

    if (activeSlideIndex < currentUser.slides.length - 1) {
      const nextIdx = activeSlideIndex + 1;
      setActiveSlideIndex(nextIdx);
      markSlideSeen(currentUser.slides[nextIdx]?.id);
    } else {
      // Go to next user with stories
      if (activeUserIndex < allStoriesList.length - 1) {
        const nextUserIdx = activeUserIndex + 1;
        setActiveUserIndex(nextUserIdx);
        setActiveSlideIndex(0);
        const nextUser = allStoriesList[nextUserIdx];
        if (nextUser?.slides?.[0]) {
          markSlideSeen(nextUser.slides[0].id);
        }
      } else {
        // Reached end of all stories
        closeStoryViewer();
      }
    }
  }, [activeUserIndex, activeSlideIndex, allStoriesList, markSlideSeen]);

  // Previous slide / user navigation
  const prevSlide = useCallback(() => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
    } else {
      // Go to previous user's last slide
      if (activeUserIndex > 0) {
        const prevUserIdx = activeUserIndex - 1;
        const prevUser = allStoriesList[prevUserIdx];
        const lastSlideIdx = Math.max(0, (prevUser.slides?.length || 1) - 1);
        setActiveUserIndex(prevUserIdx);
        setActiveSlideIndex(lastSlideIdx);
      }
    }
  }, [activeUserIndex, activeSlideIndex, allStoriesList]);

  // Add a new story for the logged in user
  const addStory = ({ type = "gradient", mediaUrl = "", gradient = "", caption = "", tag = "#Story" }) => {
    const newSlide = {
      id: `my_story_${Date.now()}`,
      type,
      mediaUrl,
      gradient: gradient || "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
      caption: caption.trim() || "Sharing a moment on SocialSphere ✨",
      tag: tag.startsWith("#") ? tag : `#${tag}`,
      time: "Just now",
      likes: 0,
    };

    setUserStories((prev) => [newSlide, ...prev]);
    setIsCreatorOpen(false);
    return newSlide;
  };

  // React to a story slide
  const reactToStory = (userId, slideId) => {
    if (userId === "current_user") {
      setUserStories((prev) =>
        prev.map((s) => (s.id === slideId ? { ...s, likes: (s.likes || 0) + 1 } : s))
      );
    } else {
      setCommunityStories((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              slides: u.slides.map((s) =>
                s.id === slideId ? { ...s, likes: (s.likes || 0) + 1 } : s
              ),
            };
          }
          return u;
        })
      );
    }
  };

  // Reply to story directly connecting into ChatContext
  const replyToStory = (user, slide, replyText) => {
    if (!replyText || !replyText.trim() || !user) return;

    if (user.isUser) {
      return; // Cannot DM yourself
    }

    const convId = startConversationWithUser({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      isVerified: true,
      role: "Creator",
    });

    const fullMessage = `Replied to your story [${slide.tag || "Story"}]: "${replyText.trim()}"`;
    sendMessage(convId, fullMessage);
  };

  return (
    <StoriesContext.Provider
      value={{
        allStoriesList,
        userStories,
        communityStories,
        isViewerOpen,
        isCreatorOpen,
        activeUser: allStoriesList[activeUserIndex] || allStoriesList[0],
        activeSlide: (allStoriesList[activeUserIndex]?.slides || [])[activeSlideIndex] || null,
        activeSlideIndex,
        totalSlides: (allStoriesList[activeUserIndex]?.slides || []).length,
        isPaused,
        setIsPaused,
        openStoryViewer,
        closeStoryViewer,
        nextSlide,
        prevSlide,
        addStory,
        reactToStory,
        replyToStory,
        openStoryCreator: () => setIsCreatorOpen(true),
        closeStoryCreator: () => setIsCreatorOpen(false),
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export default StoriesProvider;
