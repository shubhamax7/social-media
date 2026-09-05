import { useState, useEffect, useRef } from "react";
import { useChat } from "../store/ChatContext";
import { useToast } from "./Toast";
import {
  FiSearch,
  FiSend,
  FiVideo,
  FiPhone,
  FiMoreVertical,
  FiCheck,
  FiImage,
  FiSmile,
} from "react-icons/fi";
import { RiVerifiedBadgeFill, RiSparklingFill } from "react-icons/ri";

const QUICK_CHIPS = [
  "🚀 Let's ship it!",
  "✨ Looks incredible!",
  "👍 Sounds good to me.",
  "💡 Great perspective!",
  "🔥 Super clean work",
  "🙌 Appreciate the feedback!",
];

const MessagesView = () => {
  const {
    conversations,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    sendMessage,
    markAsRead,
  } = useChat();

  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, activeConversation?.isTyping]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.participant.name.toLowerCase().includes(term) ||
      c.participant.handle.toLowerCase().includes(term) ||
      c.messages.some((m) => m.text.toLowerCase().includes(term))
    );
  });

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputText);
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chipText) => {
    if (!activeConversationId) return;
    sendMessage(activeConversationId, chipText);
    showToast({
      type: "success",
      title: "Quick Reply Sent",
      message: `Sent: "${chipText}"`,
    });
  };

  const handleMockCall = (type) => {
    showToast({
      type: "info",
      title: `${type === "video" ? "Video" : "Voice"} Call`,
      message: `Initiating encrypted ${type} call with ${activeConversation?.participant?.name || "creator"}...`,
    });
  };

  return (
    <div className="messages-page-layout">
      {/* LEFT PANE: CONVERSATION LIST */}
      <aside className="messages-sidebar" aria-label="Direct message conversations">
        <div className="messages-sidebar-header">
          <div className="messages-title-row">
            <h2 className="messages-heading">Direct Messages</h2>
            <span className="messages-count-pill">{conversations.length}</span>
          </div>

          <div className="messages-search-box">
            <FiSearch className="messages-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="messages-search-input"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="messages-conv-list" role="list">
          {filteredConversations.length === 0 ? (
            <div className="messages-empty-filter">
              <p>No conversations found matching &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <button
                  key={conv.id}
                  className={`conv-item-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    markAsRead(conv.id);
                  }}
                  role="listitem"
                  aria-selected={isActive}
                >
                  <div className="conv-avatar-wrapper">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="conv-avatar"
                      loading="lazy"
                    />
                    {conv.participant.online && (
                      <span className="online-status-badge" title="Online" />
                    )}
                  </div>

                  <div className="conv-content">
                    <div className="conv-top-row">
                      <div className="conv-name-group">
                        <span className="conv-name">{conv.participant.name}</span>
                        {conv.participant.isVerified && (
                          <RiVerifiedBadgeFill
                            className="verified-badge-sm"
                            title="Verified"
                          />
                        )}
                      </div>
                      <span className="conv-time">
                        {lastMsg ? lastMsg.time : ""}
                      </span>
                    </div>

                    <div className="conv-bottom-row">
                      <p className="conv-preview">
                        {conv.isTyping ? (
                          <span className="typing-text">typing...</span>
                        ) : lastMsg ? (
                          <>
                            {lastMsg.sender === "me" && (
                              <span className="conv-you-prefix">You: </span>
                            )}
                            {lastMsg.text}
                          </>
                        ) : (
                          "Start conversation"
                        )}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="conv-unread-pill">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* RIGHT PANE: ACTIVE CONVERSATION */}
      <main className="messages-main-chat" aria-label="Active conversation">
        {activeConversation ? (
          <>
            {/* Chat Top Bar */}
            <header className="chat-top-header">
              <div className="chat-recipient-info">
                <div className="conv-avatar-wrapper">
                  <img
                    src={activeConversation.participant.avatar}
                    alt={activeConversation.participant.name}
                    className="conv-avatar-lg"
                  />
                  {activeConversation.participant.online && (
                    <span className="online-status-badge" />
                  )}
                </div>
                <div className="chat-recipient-text">
                  <div className="recipient-name-row">
                    <h3 className="recipient-name">
                      {activeConversation.participant.name}
                    </h3>
                    {activeConversation.participant.isVerified && (
                      <RiVerifiedBadgeFill className="verified-badge" />
                    )}
                  </div>
                  <div className="recipient-meta-row">
                    <span className="recipient-handle">
                      {activeConversation.participant.handle}
                    </span>
                    <span className="meta-dot">•</span>
                    <span className="recipient-role">
                      {activeConversation.participant.role}
                    </span>
                    <span className="meta-dot">•</span>
                    <span
                      className={`recipient-status-indicator ${
                        activeConversation.participant.online
                          ? "status-online"
                          : "status-offline"
                      }`}
                    >
                      {activeConversation.participant.online
                        ? "Active now"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="chat-actions-group">
                <button
                  type="button"
                  className="btn-chat-action"
                  onClick={() => handleMockCall("voice")}
                  title="Voice call"
                  aria-label="Voice call"
                >
                  <FiPhone />
                </button>
                <button
                  type="button"
                  className="btn-chat-action"
                  onClick={() => handleMockCall("video")}
                  title="Video call"
                  aria-label="Video call"
                >
                  <FiVideo />
                </button>
                <button
                  type="button"
                  className="btn-chat-action"
                  onClick={() =>
                    showToast({
                      type: "info",
                      title: "Direct Connection",
                      message: `End-to-end encrypted thread with ${activeConversation.participant.name}.`,
                    })
                  }
                  title="Encrypted connection"
                  aria-label="Encryption info"
                >
                  <RiSparklingFill />
                </button>
              </div>
            </header>

            {/* Chat History */}
            <div className="chat-messages-container" role="log">
              <div className="chat-encryption-notice">
                <RiSparklingFill style={{ color: "var(--accent-primary)", marginRight: 6 }} />
                <span>Messages in this sphere are protected with end-to-end client encryption.</span>
              </div>

              {activeConversation.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`message-bubble-wrapper ${isMe ? "outgoing" : "incoming"}`}
                  >
                    {!isMe && (
                      <img
                        src={activeConversation.participant.avatar}
                        alt=""
                        className="msg-bubble-avatar"
                        aria-hidden="true"
                      />
                    )}
                    <div className="msg-bubble-content">
                      <div className="msg-bubble">
                        <p className="msg-text">{msg.text}</p>
                      </div>
                      <div className="msg-info-row">
                        <span className="msg-time">{msg.time}</span>
                        {isMe && (
                          <span className="msg-status-receipt" title="Delivered">
                            <FiCheck />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {activeConversation.isTyping && (
                <div className="message-bubble-wrapper incoming typing-bubble-row">
                  <img
                    src={activeConversation.participant.avatar}
                    alt=""
                    className="msg-bubble-avatar"
                    aria-hidden="true"
                  />
                  <div className="msg-bubble-content">
                    <div className="msg-bubble typing-bubble">
                      <span className="typing-dot dot-1" />
                      <span className="typing-dot dot-2" />
                      <span className="typing-dot dot-3" />
                    </div>
                    <span className="typing-indicator-caption">
                      {activeConversation.participant.name} is typing...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Response Chips */}
            <div className="quick-reply-chips-bar" aria-label="Suggested quick replies">
              <span className="quick-reply-label">Quick reply:</span>
              <div className="chips-scroll">
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chip-btn"
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Composer */}
            <form className="chat-composer-form" onSubmit={handleSend}>
              <button
                type="button"
                className="composer-media-btn"
                onClick={() =>
                  showToast({
                    type: "info",
                    title: "Image Upload",
                    message: "Attachment picker is active. Select media to send.",
                  })
                }
                title="Attach media"
                aria-label="Attach media"
              >
                <FiImage />
              </button>

              <button
                type="button"
                className="composer-media-btn"
                onClick={() =>
                  showToast({
                    type: "info",
                    title: "Emoji Reaction",
                    message: "Select an emoji from the quick reply chips above.",
                  })
                }
                title="Emojis"
                aria-label="Emojis"
              >
                <FiSmile />
              </button>

              <input
                type="text"
                className="composer-input"
                placeholder={`Message ${activeConversation.participant.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Message input"
              />

              <button
                type="submit"
                className={`composer-send-btn ${inputText.trim() ? "can-send" : ""}`}
                disabled={!inputText.trim()}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-selection">
            <div className="empty-icon-wrap">
              <RiSparklingFill />
            </div>
            <h3>Select a conversation</h3>
            <p>Choose a creator from the left pane or start a new direct message.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesView;
