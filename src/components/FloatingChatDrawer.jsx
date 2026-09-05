import { useState, useRef, useEffect } from "react";
import { useChat } from "../store/ChatContext";
import { useToast } from "./Toast";
import {
  FiMessageSquare,
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiMinus,
  FiMaximize2,
  FiSend,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const FloatingChatDrawer = ({ setSelectedTab }) => {
  const {
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
    markAsRead,
  } = useChat();

  const { showToast } = useToast();
  const [drawerMode, setDrawerMode] = useState("chat"); // "list" or "chat"
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isChatDrawerOpen && !isChatDrawerMinimized && drawerMode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages, activeConversation?.isTyping, isChatDrawerOpen, isChatDrawerMinimized, drawerMode]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputText);
    setInputText("");
  };

  const handleExpandToFull = () => {
    setIsChatDrawerOpen(false);
    if (setSelectedTab) {
      setSelectedTab("Messages");
    }
  };

  // If drawer is closed, show only floating trigger pill
  if (!isChatDrawerOpen) {
    return (
      <button
        type="button"
        className="floating-chat-pill"
        onClick={() => {
          setIsChatDrawerOpen(true);
          setIsChatDrawerMinimized(false);
          if (activeConversationId) {
            markAsRead(activeConversationId);
          }
        }}
        aria-label="Open instant messenger"
      >
        <div className="floating-pill-avatars">
          {conversations.slice(0, 2).map((c, i) => (
            <img
              key={c.id}
              src={c.participant.avatar}
              alt=""
              className={`pill-stacked-avatar pill-avatar-${i}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="floating-pill-text">Messaging</span>
        {totalUnreadCount > 0 && (
          <span className="floating-pill-badge">{totalUnreadCount}</span>
        )}
        <FiChevronUp className="floating-pill-icon" />
      </button>
    );
  }

  return (
    <div
      className={`floating-drawer-window ${
        isChatDrawerMinimized ? "minimized" : ""
      }`}
      role="dialog"
      aria-label="Direct message drawer"
    >
      {/* DRAWER HEADER */}
      <div className="drawer-header">
        {drawerMode === "chat" && activeConversation ? (
          <div className="drawer-header-left">
            <button
              type="button"
              className="btn-drawer-nav"
              onClick={() => setDrawerMode("list")}
              title="All conversations"
              aria-label="Back to conversations"
            >
              <FiArrowLeft />
            </button>
            <div className="drawer-recipient-meta">
              <div className="drawer-recipient-name-row">
                <span className="drawer-recipient-name">
                  {activeConversation.participant.name}
                </span>
                {activeConversation.participant.isVerified && (
                  <RiVerifiedBadgeFill className="verified-badge-xs" />
                )}
              </div>
              <span className="drawer-recipient-status">
                {activeConversation.participant.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        ) : (
          <div className="drawer-header-left">
            <FiMessageSquare className="drawer-header-icon" />
            <span className="drawer-header-title">Messaging</span>
            {totalUnreadCount > 0 && (
              <span className="drawer-unread-pill">{totalUnreadCount}</span>
            )}
          </div>
        )}

        <div className="drawer-header-controls">
          <button
            type="button"
            className="btn-drawer-ctrl"
            onClick={() => setIsChatDrawerMinimized((m) => !m)}
            title={isChatDrawerMinimized ? "Expand" : "Minimize"}
            aria-label={isChatDrawerMinimized ? "Expand" : "Minimize"}
          >
            {isChatDrawerMinimized ? <FiChevronUp /> : <FiMinus />}
          </button>
          <button
            type="button"
            className="btn-drawer-ctrl"
            onClick={handleExpandToFull}
            title="Expand to full screen"
            aria-label="Expand to full screen"
          >
            <FiMaximize2 />
          </button>
          <button
            type="button"
            className="btn-drawer-ctrl"
            onClick={() => setIsChatDrawerOpen(false)}
            title="Close"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* DRAWER BODY (Only visible when not minimized) */}
      {!isChatDrawerMinimized && (
        <div className="drawer-body">
          {drawerMode === "list" ? (
            /* CONVERSATION LIST IN DRAWER */
            <div className="drawer-conv-list">
              {conversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    className={`drawer-conv-item ${
                      conv.id === activeConversationId ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      markAsRead(conv.id);
                      setDrawerMode("chat");
                    }}
                  >
                    <div className="drawer-avatar-wrap">
                      <img
                        src={conv.participant.avatar}
                        alt=""
                        className="drawer-avatar"
                      />
                      {conv.participant.online && (
                        <span className="drawer-online-dot" />
                      )}
                    </div>
                    <div className="drawer-conv-info">
                      <div className="drawer-conv-title-row">
                        <span className="drawer-conv-name">
                          {conv.participant.name}
                        </span>
                        <span className="drawer-conv-time">
                          {lastMsg ? lastMsg.time : ""}
                        </span>
                      </div>
                      <p className="drawer-conv-preview">
                        {conv.isTyping
                          ? "typing..."
                          : lastMsg
                          ? lastMsg.text
                          : "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="drawer-item-badge">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* ACTIVE CHAT IN DRAWER */
            <div className="drawer-chat-view">
              <div className="drawer-chat-messages">
                {activeConversation?.messages.map((m) => {
                  const isMe = m.sender === "me";
                  return (
                    <div
                      key={m.id}
                      className={`drawer-msg-row ${isMe ? "me" : "them"}`}
                    >
                      <div className="drawer-msg-bubble">
                        <p>{m.text}</p>
                        <span className="drawer-msg-time">{m.time}</span>
                      </div>
                    </div>
                  );
                })}

                {activeConversation?.isTyping && (
                  <div className="drawer-msg-row them">
                    <div className="drawer-msg-bubble drawer-typing">
                      <span className="typing-dot dot-1" />
                      <span className="typing-dot dot-2" />
                      <span className="typing-dot dot-3" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* DRAWER INPUT COMPOSER */}
              <form className="drawer-composer" onSubmit={handleSend}>
                <input
                  type="text"
                  className="drawer-input"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-drawer-send"
                  disabled={!inputText.trim()}
                  aria-label="Send"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatDrawer;
