import { usePostList } from "../store/post-list-store";
import { MdDeleteOutline } from "react-icons/md";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";

/**
 * Returns a relative time string (e.g. "2h ago") from an ISO timestamp.
 * Falls back gracefully if no timestamp is present.
 */
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
  const { deletePost, likePost } = usePostList();

  const avatarSeed = post.userId ?? post.id;
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`;
  const authorName = post.username ?? `User ${post.userId ?? ""}`;

  const handleDelete = () => {
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deletePost(post.id);
    }
  };

  return (
    <article className="post-card" aria-label={`Post: ${post.title}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <img
            src={avatarUrl}
            alt={`${authorName}'s avatar`}
            className="post-avatar"
            loading="lazy"
            width={44}
            height={44}
          />
          <div className="post-author-info">
            <span className="post-author-name">{authorName}</span>
            <span className="post-timestamp">{getRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        <button
          className="post-delete-btn"
          onClick={handleDelete}
          aria-label={`Delete post: ${post.title}`}
          title="Delete post"
        >
          <MdDeleteOutline />
        </button>
      </div>

      {/* Body */}
      <h2 className="post-title">{post.title}</h2>
      <p className="post-body">{post.body}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-tags" role="list" aria-label="Post tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-tag" role="listitem">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer actions */}
      <div className="post-footer">
        <button
          className={`post-action-btn${post.liked ? " liked" : ""}`}
          onClick={() => likePost(post.id)}
          aria-label={post.liked ? "Unlike post" : "Like post"}
          aria-pressed={post.liked}
        >
          <span className="action-icon">
            {post.liked ? <AiFillHeart /> : <FiHeart />}
          </span>
          <span>{post.reactions}</span>
        </button>

        <button
          className="post-action-btn"
          aria-label="Comment on post"
        >
          <span className="action-icon"><FiMessageCircle /></span>
          <span>Reply</span>
        </button>

        <button
          className="post-action-btn"
          aria-label="Share post"
          style={{ marginLeft: "auto" }}
        >
          <span className="action-icon"><FiShare2 /></span>
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};

export default Post;
