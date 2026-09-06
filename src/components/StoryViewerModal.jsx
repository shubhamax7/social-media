import { useState, useEffect, useRef } from "react";
import { useStories } from "../store/StoriesContext";
import { useToast } from "./Toast";
import {
  FiX,
  FiPause,
  FiPlay,
  FiSend,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const SLIDE_DURATION_MS = 5000;
const REACTION_EMOJIS = ["❤️", "🔥", "👏", "😂", "😮", "🚀"];

let reactionCounter = 0;
const generateReaction = (emoji) => {
  reactionCounter += 1;
  const offset = ((reactionCounter * 37) % 80) - 40;
  return { id: reactionCounter, emoji, offset };
};

const StoryViewerModal = () => {
  const {
    isViewerOpen,
    activeUser,
    activeSlide,
    activeSlideIndex,
    isPaused,
    setIsPaused,
    closeStoryViewer,
    nextSlide,
    prevSlide,
    reactToStory,
    replyToStory,
  } = useStories();

  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const holdTimeoutRef = useRef(null);

  const [prevSlideId, setPrevSlideId] = useState(null);

  // Reset progress cleanly when active slide changes
  if (activeSlide && activeSlide.id !== prevSlideId) {
    setPrevSlideId(activeSlide.id);
    setProgress(0);
  }

  // Main timer loop for slide auto-advance
  useEffect(() => {
    if (!isViewerOpen || isPaused || !activeSlide) return;

    const intervalTime = 50; // update every 50ms for smooth 60fps bar
    const step = (intervalTime / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isViewerOpen, isPaused, activeSlide, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeStoryViewer();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isViewerOpen, nextSlide, prevSlide, closeStoryViewer, setIsPaused]);

  // Handle pointer down (pause) and pointer up (resume)
  const handlePointerDown = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsPaused(true);
    }, 150);
  };

  const handlePointerUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    setIsPaused(false);
  };

  // Trigger floating animated reaction
  const handleReactionClick = (emoji) => {
    if (!activeUser || !activeSlide) return;

    reactToStory(activeUser.id, activeSlide.id, emoji);

    const reactionItem = generateReaction(emoji);

    setFloatingReactions((prev) => [...prev, reactionItem]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionItem.id));
    }, 1400);
  };

  // Submit DM reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeUser || !activeSlide) return;

    replyToStory(activeUser, activeSlide, replyText.trim());
    showToast({
      type: "success",
      title: `Reply sent to ${activeUser.name}`,
      message: `"${replyText.trim().slice(0, 35)}..." sent to direct messages.`,
    });
    setReplyText("");
  };

  // Share story link
  const handleShareStory = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast({
      type: "info",
      title: "Story link copied 📋",
      message: `Direct link to ${activeUser.name}'s story copied to clipboard.`,
    });
  };

  if (!isViewerOpen || !activeSlide || !activeUser) {
    return null;
  }

  return (
    <div
      className="story-viewer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${activeUser.name}'s Story`}
    >
      {/* Dimmed backdrop - click outside card to close */}
      <div className="story-viewer-backdrop" onClick={closeStoryViewer} />

      {/* Main Story Container with Navigation Arrows on large screens */}
      <div className="story-viewer-shell">
        <button
          type="button"
          className="story-desktop-nav-btn story-prev-btn"
          onClick={prevSlide}
          aria-label="Previous story"
        >
          <FiChevronLeft />
        </button>

        <div
          className="story-card-wrapper"
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
        >
          {/* Top Segmented Progress Bars */}
          <div className="story-progress-segments" aria-label="Story progress">
            {activeUser.slides.map((slide, idx) => {
              let fillPercent = 0;
              if (idx < activeSlideIndex) fillPercent = 100;
              else if (idx === activeSlideIndex) fillPercent = progress;

              return (
                <div key={slide.id || idx} className="story-progress-track">
                  <div
                    className="story-progress-fill"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Story Card Header */}
          <div className="story-card-header">
            <div className="story-header-author">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="story-header-avatar"
              />
              <div className="story-header-meta">
                <div className="story-header-name-row">
                  <span className="story-header-name">{activeUser.name}</span>
                  {activeSlide.tag && (
                    <span className="story-header-tag">{activeSlide.tag}</span>
                  )}
                </div>
                <span className="story-header-time">{activeSlide.time || "Just now"}</span>
              </div>
            </div>

            <div className="story-header-controls">
              <button
                type="button"
                className="story-ctrl-btn"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Resume story" : "Pause story"}
                title={isPaused ? "Resume (Space)" : "Pause (Space)"}
              >
                {isPaused ? <FiPlay /> : <FiPause />}
              </button>

              <button
                type="button"
                className="story-ctrl-btn"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>

              <button
                type="button"
                className="story-ctrl-btn story-close-btn"
                onClick={closeStoryViewer}
                aria-label="Close story viewer (Esc)"
                title="Close (Esc)"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Media & Content Slide Display */}
          <div className="story-content-body">
            {activeSlide.type === "image" && activeSlide.mediaUrl ? (
              <div
                className="story-image-canvas"
                style={{ backgroundImage: `url(${activeSlide.mediaUrl})` }}
              >
                <div className="story-gradient-vignette" />
              </div>
            ) : (
              <div
                className="story-gradient-canvas"
                style={{
                  background:
                    activeSlide.gradient ||
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                }}
              >
                <div className="story-canvas-sheen" />
                <div className="story-sparkle-watermark">
                  <RiSparklingFill />
                </div>
              </div>
            )}

            {/* Tap Navigation Target Zones */}
            <div
              className="story-tap-zone story-tap-left"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous slide"
            />
            <div
              className="story-tap-zone story-tap-right"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next slide"
            />

            {/* Caption & Overlay Card Content */}
            <div className="story-text-overlay">
              {activeSlide.tag && (
                <span className="story-overlay-pill">{activeSlide.tag}</span>
              )}
              <p className="story-overlay-caption">{activeSlide.caption}</p>
            </div>

            {/* Floating Burst Reactions */}
            <div className="story-floating-burst-container" pointer-events="none">
              {floatingReactions.map((r) => (
                <span
                  key={r.id}
                  className="story-floating-particle"
                  style={{ transform: `translateX(${r.offset}px)` }}
                >
                  {r.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Interactive Actions */}
          <div className="story-card-footer">
            {/* Quick Emoji Reaction Buttons */}
            <div className="story-reaction-row" aria-label="React with emoji">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="story-reaction-btn"
                  onClick={() => handleReactionClick(emoji)}
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Interactive Reply or Owner Stats */}
            <div className="story-interaction-bottom">
              {!activeUser.isUser ? (
                <form className="story-reply-form" onSubmit={handleSendReply}>
                  <input
                    type="text"
                    className="story-reply-input"
                    placeholder={`Reply to ${activeUser.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    aria-label={`Reply to ${activeUser.name}`}
                  />
                  <button
                    type="submit"
                    className="story-send-reply-btn"
                    disabled={!replyText.trim()}
                    aria-label="Send reply message"
                  >
                    <FiSend />
                  </button>
                </form>
              ) : (
                <div className="story-owner-meta">
                  <span className="story-owner-badge">
                    <RiSparklingFill style={{ color: "var(--accent-primary)", marginRight: 4 }} />
                    Your Story • {activeSlide.likes || 0} reactions received
                  </span>
                </div>
              )}

              <button
                type="button"
                className="story-action-icon-btn"
                onClick={handleShareStory}
                aria-label="Share story"
                title="Share story link"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="story-desktop-nav-btn story-next-btn"
          onClick={nextSlide}
          aria-label="Next story"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StoryViewerModal;
