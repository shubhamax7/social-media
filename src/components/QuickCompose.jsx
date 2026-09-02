import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import { FiImage, FiSmile, FiTag, FiSend, FiX } from "react-icons/fi";

const POPULAR_TAGS = ["react", "webdev", "ai", "design", "coding", "vite"];

const QuickCompose = () => {
  const { addPost } = usePostList();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState(["webdev"]);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast({
        type: "error",
        title: "Content required",
        message: "Please write something before posting.",
      });
      return;
    }

    setIsSubmitting(true);
    const postTitle = title.trim() || content.slice(0, 45) + (content.length > 45 ? "..." : "");

    setTimeout(() => {
      addPost(
        "shubham",
        postTitle,
        content.trim(),
        0,
        selectedTags,
        imageUrl.trim() || null
      );

      setTitle("");
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      setIsSubmitting(false);

      showToast({
        type: "success",
        title: "Thought published! 🚀",
        message: "Your post is now trending on the feed.",
      });
    }, 400);
  };

  return (
    <div className="quick-compose-card">
      <div className="quick-compose-header">
        <img
          src="https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham"
          alt="Your avatar"
          className="quick-compose-avatar"
        />
        <div className="quick-compose-inputs">
          <input
            type="text"
            className="quick-compose-title"
            placeholder="Title / Catchphrase (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="quick-compose-textarea"
            placeholder="What is happening in your tech sphere today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {showImageInput && (
        <div className="quick-compose-image-bar">
          <input
            type="url"
            className="quick-compose-image-input"
            placeholder="Paste image URL (e.g. Unsplash link)..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            type="button"
            className="quick-compose-image-close"
            onClick={() => {
              setImageUrl("");
              setShowImageInput(false);
            }}
            aria-label="Remove image URL"
          >
            <FiX />
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="quick-compose-preview-img-wrapper">
          <img src={imageUrl} alt="Preview attachment" className="quick-compose-preview-img" />
        </div>
      )}

      <div className="quick-compose-tag-chips">
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`quick-tag-chip ${selectedTags.includes(tag) ? "selected" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="quick-compose-footer">
        <div className="quick-compose-actions">
          <button
            type="button"
            className={`quick-action-btn ${showImageInput ? "active" : ""}`}
            onClick={() => setShowImageInput(!showImageInput)}
            title="Attach image"
          >
            <FiImage />
            <span>Image</span>
          </button>
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => toggleTag("react")}
            title="Add React tag"
          >
            <FiTag />
            <span>Tags</span>
          </button>
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => setContent((prev) => prev + " ✨")}
            title="Add emoji"
          >
            <FiSmile />
            <span>Emoji</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-quick-post"
          onClick={handlePost}
          disabled={isSubmitting || !content.trim()}
        >
          <FiSend />
          <span>{isSubmitting ? "Posting..." : "Post"}</span>
        </button>
      </div>
    </div>
  );
};

export default QuickCompose;
