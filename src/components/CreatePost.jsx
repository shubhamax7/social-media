import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import { MdSend, MdImage, MdPreview } from "react-icons/md";
import { FiTag, FiCheck, FiArrowLeft } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const MAX_BODY_LENGTH = 600;

const PRESET_IMAGES = [
  { id: "none", label: "No image", url: "" },
  { id: "code", label: "💻 Coding", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80" },
  { id: "ai", label: "🤖 AI & Cyber", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80" },
  { id: "design", label: "🎨 Glass & Design", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80" },
  { id: "space", label: "🌌 Cosmos", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80" },
];

const PRESET_TAGS = ["react", "webdev", "ai", "javascript", "design", "coding", "vite", "cloud"];

const CreatePost = ({ setSelectedTab }) => {
  const { addPost } = usePostList();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState(["react", "webdev"]);
  const [selectedImage, setSelectedImage] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Post title is required.";
    else if (title.trim().length < 5) errs.title = "Title must be at least 5 characters.";

    if (!body.trim()) errs.body = "Post content is required.";
    else if (body.length > MAX_BODY_LENGTH)
      errs.body = `Content must be under ${MAX_BODY_LENGTH} characters.`;

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    const finalImage = customImageUrl.trim() || selectedImage || null;

    setTimeout(() => {
      addPost(
        "shubham",
        title.trim(),
        body.trim(),
        0,
        selectedTags,
        finalImage
      );

      setIsSubmitting(false);

      showToast({
        type: "success",
        title: "Post published to feed! 🚀",
        message: "Your story has been broadcast to all followers.",
      });

      setSelectedTab("Home");
    }, 500);
  };

  const activeImage = customImageUrl.trim() || selectedImage;

  return (
    <div className="create-post-container">
      {/* Top Header */}
      <div className="create-post-topbar">
        <button
          type="button"
          className="btn-back-feed"
          onClick={() => setSelectedTab("Home")}
          aria-label="Back to feed"
        >
          <FiArrowLeft /> Back to Feed
        </button>
        <button
          type="button"
          className={`btn-toggle-preview ${showPreview ? "active" : ""}`}
          onClick={() => setShowPreview(!showPreview)}
        >
          <MdPreview /> {showPreview ? "Hide Preview" : "Live Preview"}
        </button>
      </div>

      <div className="create-post-layout-grid">
        {/* Form Column */}
        <div className="create-post-form-col">
          <div className="create-post-header">
            <h1 className="create-post-title">Create a New Post</h1>
            <p className="create-post-subtitle">
              Publish insights, code patterns, or design updates to the community.
            </p>
          </div>

          <form className="create-post-form" onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="cp-title" className="form-label">
                Post Title <span className="required">*</span>
              </label>
              <input
                id="cp-title"
                type="text"
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder="e.g. Architecting Scalable Design Systems in 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Content Body */}
            <div className="form-group">
              <label htmlFor="cp-body" className="form-label">
                Content Body <span className="required">*</span>
              </label>
              <textarea
                id="cp-body"
                className={`form-textarea ${errors.body ? "error" : ""}`}
                placeholder="Share your thoughts, engineering challenges, architecture breakdown, or advice..."
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="form-hint">
                <span className={errors.body ? "form-error" : ""}>
                  {errors.body || "Markdown and emojis supported"}
                </span>
                <span
                  style={{
                    color:
                      body.length > MAX_BODY_LENGTH * 0.9
                        ? "var(--color-warning)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {body.length}/{MAX_BODY_LENGTH}
                </span>
              </div>
            </div>

            {/* Category / Hashtag Selector */}
            <div className="form-group">
              <label className="form-label">
                <FiTag style={{ marginRight: 6 }} /> Select Topics
              </label>
              <div className="tags-selection-pills">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-choice-pill ${selectedTags.includes(tag) ? "selected" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                    {selectedTags.includes(tag) && <FiCheck className="pill-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Attachment */}
            <div className="form-group">
              <label className="form-label">
                <MdImage style={{ marginRight: 6 }} /> Cover Image Banner (Optional)
              </label>
              <div className="image-preset-grid">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-img-btn ${selectedImage === preset.url && !customImageUrl ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setCustomImageUrl("");
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="url"
                className="form-input"
                style={{ marginTop: 10 }}
                placeholder="Or paste any custom image URL..."
                value={customImageUrl}
                onChange={(e) => {
                  setCustomImageUrl(e.target.value);
                  setSelectedImage("");
                }}
              />
            </div>

            {/* Submit Bar */}
            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Publishing..."
                ) : (
                  <>
                    <MdSend /> Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        {showPreview && (
          <div className="create-post-preview-col">
            <h3 className="preview-heading">Live Preview</h3>
            <div className="preview-card-wrapper">
              <article className="post-card preview-card">
                <div className="post-header">
                  <div className="post-author">
                    <img
                      src="https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham"
                      alt="Avatar"
                      className="post-avatar"
                    />
                    <div className="post-author-info">
                      <div className="post-author-name-row">
                        <span className="post-author-name">Shubham</span>
                        <RiVerifiedBadgeFill className="verified-badge" />
                        <span className="post-handle">@shubham</span>
                      </div>
                      <span className="post-timestamp">Just now</span>
                    </div>
                  </div>
                </div>

                <h2 className="post-title">
                  {title || "Your post title will appear here..."}
                </h2>
                <p className="post-body">
                  {body ||
                    "Start typing in the content box to see your live preview rendered in real time."}
                </p>

                {activeImage && (
                  <div className="post-image-container">
                    <img
                      src={activeImage}
                      alt="Banner Preview"
                      className="post-media-img"
                    />
                  </div>
                )}

                {selectedTags.length > 0 && (
                  <div className="post-tags">
                    {selectedTags.map((tag) => (
                      <span key={tag} className="post-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
