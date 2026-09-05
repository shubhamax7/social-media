import { createContext, useContext, useState, useEffect } from "react";

const INITIAL_CONVERSATIONS = [
  {
    id: "conv_sarah",
    participant: {
      id: "sarah_j",
      name: "Sarah Jenkins",
      handle: "@sarah_j",
      role: "Senior UI/UX Architect",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SarahJ",
      isVerified: true,
      online: true,
    },
    unreadCount: 1,
    isTyping: false,
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    messages: [
      {
        id: "m_s1",
        sender: "them",
        text: "Hey Shubham! I saw your updates on the SocialSphere v2 design tokens ✨",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        time: "25m ago",
        status: "read",
      },
      {
        id: "m_s2",
        sender: "me",
        text: "Thanks Sarah! We tuned the glassmorphic backdrop-filters and contrast ratios for OLED displays.",
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        time: "18m ago",
        status: "read",
      },
      {
        id: "m_s3",
        sender: "them",
        text: "The subtle borders and vibrant gradient glows look sublime. Are you planning to release a public design kit for Figma?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        time: "10m ago",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv_devon",
    participant: {
      id: "devon_codes",
      name: "Devon Vance",
      handle: "@devon_codes",
      role: "AI Systems Engineer",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DevonV",
      isVerified: true,
      online: true,
    },
    unreadCount: 1,
    isTyping: false,
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    messages: [
      {
        id: "m_d1",
        sender: "them",
        text: "Yo Shubham! Have you benchmarked the cold start times on Vite 7 yet?",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        time: "45m ago",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv_clara",
    participant: {
      id: "clara_design",
      name: "Clara Oswald",
      handle: "@clara_design",
      role: "Product Designer @ Figma",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ClaraO",
      isVerified: true,
      online: false,
    },
    unreadCount: 0,
    isTyping: false,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: "m_c1",
        sender: "them",
        text: "Hi Shubham! Love the interactive profile header customization. The avatar presets are a great touch!",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        time: "4h ago",
        status: "read",
      },
      {
        id: "m_c2",
        sender: "me",
        text: "Appreciate that, Clara! Next up is interactive direct messaging with creators.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        time: "3h ago",
        status: "read",
      },
    ],
  },
];

const SIMULATED_REPLIES = {
  sarah_j: [
    "That makes total sense! Having accessible contrast in dark mode is so crucial for readability.",
    "I'm testing out similar CSS custom property structures in our design system. The speed is incredible!",
    "Love that approach! Let's schedule a quick design review when you get a chance.",
    "The micro-animations feel super fluid. Well done! 🚀",
  ],
  devon_codes: [
    "Autonomous agents pair-programming directly in the workspace is definitely where the future is headed.",
    "Nice! Vite 7 HMR response under 20ms feels like magic when iterating on components.",
    "I was just looking at the network payload metrics—super light and responsive!",
    "Definitely agree! Let me know if you want to test some edge deployment configurations together.",
  ],
  clara_design: [
    "Figma tokens sync seamlessly when structured like that. Keep pushing the boundaries!",
    "Great work on this! The community feedback is going to be amazing.",
    "Let me know if you'd like me to review the typography scale or accessibility scores!",
  ],
  cre_1: [
    "Fascinating perspective! Multi-agent coordination in modern web applications opens up huge potential.",
    "Agreed. Real-time contextual assistance without latency is the holy grail.",
    "Looking forward to reading more of your updates on this!",
  ],
  cre_3: [
    "Starring this right now! Open-source tooling needs more polished UI like this.",
    "Awesome craft! Keep shipping!",
  ],
  default: [
    "Thanks for reaching out! Really excited about what you're building here.",
    "That's a fantastic idea. Let me look into that and follow up shortly!",
    "Appreciate the message! Always great connecting with fellow builders.",
  ],
};

const ChatContext = createContext({
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  totalUnreadCount: 0,
  isChatDrawerOpen: false,
  isChatDrawerMinimized: false,
  setActiveConversationId: () => {},
  setIsChatDrawerOpen: () => {},
  setIsChatDrawerMinimized: () => {},
  sendMessage: () => {},
  startConversationWithUser: () => {},
  markAsRead: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("socialsphere_chats_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved chats", e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState("conv_sarah");
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isChatDrawerMinimized, setIsChatDrawerMinimized] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_chats_v1", JSON.stringify(conversations));
    } catch (e) {
      console.error("Failed to persist chats", e);
    }
  }, [conversations]);

  const totalUnreadCount = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  // Mark conversation as read
  const markAsRead = (convId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, status: "read" })),
            }
          : c
      )
    );
  };

  // Automatically mark active conversation as read when selected
  useEffect(() => {
    if (activeConversationId) {
      markAsRead(activeConversationId);
    }
  }, [activeConversationId]);

  // Start or select conversation with any user/creator
  const startConversationWithUser = (user) => {
    if (!user) return;
    const existing = conversations.find(
      (c) =>
        c.participant.id === user.id ||
        c.participant.handle === user.handle ||
        c.participant.name.toLowerCase() === user.name.toLowerCase()
    );

    if (existing) {
      setActiveConversationId(existing.id);
      markAsRead(existing.id);
      setIsChatDrawerOpen(true);
      setIsChatDrawerMinimized(false);
      return existing.id;
    }

    // Create new conversation
    const newConvId = `conv_${user.id || Date.now()}`;
    const newConv = {
      id: newConvId,
      participant: {
        id: user.id || `u_${Date.now()}`,
        name: user.name || "Creator",
        handle: user.handle || `@${user.name?.toLowerCase().replace(/\s+/g, "_") || "creator"}`,
        role: user.role || "Community Member",
        avatar: user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name || "Creator"}`,
        isVerified: !!user.isVerified,
        online: true,
      },
      unreadCount: 0,
      isTyping: false,
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `m_init_${Date.now()}`,
          sender: "them",
          text: `Hey! Thanks for connecting on SocialSphere. How's your project coming along?`,
          timestamp: new Date().toISOString(),
          time: "Just now",
          status: "read",
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setIsChatDrawerOpen(true);
    setIsChatDrawerMinimized(false);
    return newConvId;
  };

  // Send message with simulated response
  const sendMessage = (convId, text) => {
    if (!text || !text.trim()) return;

    const trimmed = text.trim();
    const now = new Date();
    const userMsg = {
      id: `m_${Date.now()}`,
      sender: "me",
      text: trimmed,
      timestamp: now.toISOString(),
      time: "Just now",
      status: "sent",
    };

    // 1. Add user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastUpdated: now.toISOString(),
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    // 2. Trigger simulated typing indicator
    const targetConv = conversations.find((c) => c.id === convId);
    const participantId = targetConv?.participant?.id || "default";

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, isTyping: true } : c))
      );
    }, 600);

    // 3. Deliver simulated reply
    setTimeout(() => {
      const repliesPool =
        SIMULATED_REPLIES[participantId] || SIMULATED_REPLIES.default;
      const randomReply =
        repliesPool[Math.floor(Math.random() * repliesPool.length)];

      const replyMsg = {
        id: `m_rep_${Date.now()}`,
        sender: "them",
        text: randomReply,
        timestamp: new Date().toISOString(),
        time: "Just now",
        status: "delivered",
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const isCurrentlyActive = activeConversationId === convId;
            return {
              ...c,
              isTyping: false,
              lastUpdated: new Date().toISOString(),
              unreadCount: isCurrentlyActive ? 0 : (c.unreadCount || 0) + 1,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1900);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        totalUnreadCount,
        isChatDrawerOpen,
        isChatDrawerMinimized,
        setActiveConversationId,
        setIsChatDrawerOpen,
        setIsChatDrawerMinimized,
        sendMessage,
        startConversationWithUser,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
