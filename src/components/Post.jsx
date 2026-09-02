import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import {
  MdDeleteOutline,
  MdMoreHoriz,
  MdBookmark,
  MdBookmarkBorder,
} from "react-icons/md";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiRepeat,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const getRelativeTime = (isoString) => {
  if (!isoString) return "Just now";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
};

const Post = ({ post }) => {
  const { deletePost, likePost, bookmarkPost, repostPost, addComment, setActiveTag } =
    usePostList();
  const { showToast } = useToast();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const avatarSeed = post.userId ?? post.id;
  const avatarUrl =
    post.authorAvatar ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`;
  const authorName = post.authorName || `User ${post.userId ?? ""}`;
  const username = post.username || `user_${post.userId ?? "dev"}`;

  const handleDelete = () => {
    setMenuOpen(false);
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deletePost(post.id);
      showToast({
        type: "info",
        title: "Post removed",
        message: "Your post has been deleted from the feed.",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast({
      type: "success",
      title: "Link copied to clipboard! 📋",
      message: `Direct link for "${post.title.slice(0, 30)}..." ready to share.`,
    });
  };

  const handleRepost = () => {
    repostPost(post.id);
    showToast({
      type: post.reposted ? "info" : "success",
      title: post.reposted ? "Undo Repost" : "Reposted to your feed! 🔁",
      message: post.reposted
        ? "Removed from your reposts."
        : "Shared with your network.",
    });
  };

  const handleBookmark = () => {
    bookmarkPost(post.id);
    showToast({
      type: post.bookmarked ? "info" : "success",
      title: post.bookmarked ? "Bookmark removed" : "Post saved! 🔖",
      message: post.bookmarked
        ? "Removed from your reading list."
        : "Saved to your bookmarks tab.",
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addComment(post.id, commentInput.trim(), "Shubham");
    setCommentInput("");
    showToast({
      type: "success",
      title: "Reply posted! 💬",
      message: "Your comment was added to the conversation.",
    });
  };

  return (
    <article className="post-card" aria-label={`Post: ${post.title}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="post-avatar-wrapper">
            <img
              src={avatarUrl}
              alt={`${authorName}'s avatar`}
              className="post-avatar"
              loading="lazy"
              width={46}
              height={46}
            />
          </div>
          <div className="post-author-info">
            <div className="post-author-name-row">
              <span className="post-author-name">{authorName}</span>
              {post.isVerified !== false && (
                <RiVerifiedBadgeFill
                  className="verified-badge"
                  title="Verified Account"
                />
              )}
              <span className="post-handle">@{username}</span>
            </div>
            <span className="post-timestamp">{getRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        <div className="post-menu-wrapper">
          <button
            className="post-menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Post actions menu"
            aria-expanded={menuOpen}
          >
            <MdMoreHoriz />
          </button>

          {menuOpen && (
            <div className="post-dropdown-menu" role="menu">
              <button
                role="menuitem"
                onClick={handleShare}
                className="dropdown-item"
              >
                <FiShare2 /> Copy link
              </button>
              <button
                role="menuitem"
                onClick={handleBookmark}
                className="dropdown-item"
              >
                {post.bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
                {post.bookmarked ? "Remove bookmark" : "Save bookmark"}
              </button>
              <div className="dropdown-divider" />
              <button
                role="menuitem"
                onClick={handleDelete}
                className="dropdown-item text-danger"
              >
                <MdDeleteOutline /> Delete post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Body */}
      <h2 className="post-title">{post.title}</h2>
      <p className="post-body">{post.body}</p>

      {/* Attached Media Banner */}
      {post.image && (
        <div className="post-image-container">
          <img
            src={post.image}
            alt={post.title}
            className="post-media-img"
            loading="lazy"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-tags" role="list" aria-label="Post tags">
          {post.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="post-tag"
              role="listitem"
              onClick={() => setActiveTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="post-footer">
        {/* Like */}
        <button
          className={`post-action-btn like-btn ${post.liked ? "liked" : ""}`}
          onClick={() => likePost(post.id)}
          aria-label={post.liked ? "Unlike post" : "Like post"}
          aria-pressed={post.liked}
        >
          <span className="action-icon">
            {post.liked ? <AiFillHeart className="text-heart" /> : <FiHeart />}
          </span>
          <span className="action-count">{post.reactions || 0}</span>
        </button>

        {/* Comment */}
        <button
          className={`post-action-btn comment-btn ${showComments ? "active" : ""}`}
          onClick={() => setShowComments(!showComments)}
          aria-label="View comments"
          aria-expanded={showComments}
        >
          <span className="action-icon">
            <FiMessageCircle />
          </span>
          <span className="action-count">
            {post.commentsCount || (post.comments ? post.comments.length : 0)}
          </span>
        </button>

        {/* Repost */}
        <button
          className={`post-action-btn repost-btn ${post.reposted ? "reposted" : ""}`}
          onClick={handleRepost}
          aria-label="Repost"
          aria-pressed={post.reposted}
        >
          <span className="action-icon">
            <FiRepeat />
          </span>
          <span className="action-count">{post.repostsCount || 0}</span>
        </button>

        {/* Bookmark */}
        <button
          className={`post-action-btn bookmark-btn ${post.bookmarked ? "bookmarked" : ""}`}
          onClick={handleBookmark}
          aria-label={post.bookmarked ? "Remove bookmark" : "Bookmark post"}
          aria-pressed={post.bookmarked}
        >
          <span className="action-icon">
            {post.bookmarked ? <MdBookmark className="text-bookmark" /> : <MdBookmarkBorder />}
          </span>
        </button>

        {/* Share */}
        <button
          className="post-action-btn share-btn"
          onClick={handleShare}
          aria-label="Share post"
          title="Share post"
        >
          <span className="action-icon">
            <FiShare2 />
          </span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="post-comments-section" aria-label="Comments">
          <form className="comment-compose-form" onSubmit={handleAddComment}>
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham"
              alt="Your avatar"
              className="comment-user-avatar"
            />
            <input
              type="text"
              className="comment-input"
              placeholder="Write a thoughtful reply..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!commentInput.trim()}
              aria-label="Submit comment"
            >
              <FiSend />
            </button>
          </form>

          {post.comments && post.comments.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.author}`}
                    alt={comment.author}
                    className="comment-author-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-author-row">
                      <span className="comment-author-name">{comment.author}</span>
                      {comment.handle && (
                        <span className="comment-handle">{comment.handle}</span>
                      )}
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments-msg">
              <span>No replies yet. Be the first to spark the conversation! ✨</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default Post;
