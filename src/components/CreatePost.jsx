import { useContext, useRef, useState } from "react";
import { PostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import { MdSend } from "react-icons/md";

const MAX_BODY_LENGTH = 500;

const CreatePost = ({ setSelectedTab }) => {
  const { addPost } = useContext(PostList);
  const { showToast } = useToast();

  const [errors, setErrors] = useState({});
  const [bodyLength, setBodyLength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userIdRef = useRef();
  const postTitleRef = useRef();
  const postBodyRef = useRef();
  const reactionsRef = useRef();
  const tagsRef = useRef();

  const validate = () => {
    const errs = {};
    if (!userIdRef.current.value.trim()) errs.userId = "User ID is required.";
    if (!postTitleRef.current.value.trim()) errs.title = "Title is required.";
    if (postTitleRef.current.value.trim().length < 5)
      errs.title = "Title must be at least 5 characters.";
    if (!postBodyRef.current.value.trim()) errs.body = "Content is required.";
    if (postBodyRef.current.value.length > MAX_BODY_LENGTH)
      errs.body = `Content must be under ${MAX_BODY_LENGTH} characters.`;
    const reactions = reactionsRef.current.value;
    if (reactions && (isNaN(Number(reactions)) || Number(reactions) < 0))
      errs.reactions = "Reactions must be a non-negative number.";
    return errs;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);

    const userId = userIdRef.current.value.trim();
    const postTitle = postTitleRef.current.value.trim();
    const postBody = postBodyRef.current.value.trim();
    const reactions = reactionsRef.current.value;
    const tags = tagsRef.current.value
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    // Simulate brief async (UX)
    setTimeout(() => {
      addPost(userId, postTitle, postBody, reactions || 0, tags);

      // Reset form
      userIdRef.current.value = "";
      postTitleRef.current.value = "";
      postBodyRef.current.value = "";
      reactionsRef.current.value = "";
      tagsRef.current.value = "";
      setBodyLength(0);
      setErrors({});
      setIsSubmitting(false);

      showToast({
        type: "success",
        title: "Post published!",
        message: "Your post is now live on the feed.",
      });

      // Navigate back to feed
      setTimeout(() => setSelectedTab("Home"), 400);
    }, 600);
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1 className="create-post-title">Create a Post</h1>
        <p className="create-post-subtitle">
          Share something with the community
        </p>
      </div>

      <form className="create-post-form" onSubmit={handleSubmit} noValidate>
        {/* User ID */}
        <div className="form-group">
          <label htmlFor="cp-userId" className="form-label">
            User ID <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="cp-userId"
            type="text"
            className={`form-input${errors.userId ? " error" : ""}`}
            ref={userIdRef}
            placeholder="e.g. 1"
            aria-required="true"
            aria-describedby={errors.userId ? "cp-userId-error" : undefined}
          />
          {errors.userId && (
            <span id="cp-userId-error" className="form-error" role="alert">
              {errors.userId}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="cp-title" className="form-label">
            Post Title <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="cp-title"
            type="text"
            className={`form-input${errors.title ? " error" : ""}`}
            ref={postTitleRef}
            placeholder="What's on your mind?"
            aria-required="true"
            aria-describedby={errors.title ? "cp-title-error" : undefined}
          />
          {errors.title && (
            <span id="cp-title-error" className="form-error" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="form-group">
          <label htmlFor="cp-body" className="form-label">
            Content <span className="required" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cp-body"
            className={`form-textarea${errors.body ? " error" : ""}`}
            ref={postBodyRef}
            placeholder="Share your thoughts, ideas, or stories..."
            rows={5}
            maxLength={MAX_BODY_LENGTH}
            onChange={(e) => setBodyLength(e.target.value.length)}
            aria-required="true"
            aria-describedby="cp-body-hint"
          />
          <div className="form-hint" id="cp-body-hint">
            <span className={errors.body ? "form-error" : ""}>
              {errors.body || " "}
            </span>
            <span
              style={{
                color:
                  bodyLength > MAX_BODY_LENGTH * 0.9
                    ? "var(--color-warning)"
                    : "var(--color-text-muted)",
              }}
            >
              {bodyLength}/{MAX_BODY_LENGTH}
            </span>
          </div>
        </div>

        <div className="form-row">
          {/* Reactions */}
          <div className="form-group">
            <label htmlFor="cp-reactions" className="form-label">
              Initial Reactions
            </label>
            <input
              id="cp-reactions"
              type="number"
              min="0"
              className={`form-input${errors.reactions ? " error" : ""}`}
              ref={reactionsRef}
              placeholder="0"
              aria-describedby={errors.reactions ? "cp-reactions-error" : undefined}
            />
            {errors.reactions && (
              <span id="cp-reactions-error" className="form-error" role="alert">
                {errors.reactions}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="cp-tags" className="form-label">
              Hashtags
            </label>
            <input
              id="cp-tags"
              type="text"
              className="form-input"
              ref={tagsRef}
              placeholder="react vite webdev"
            />
            <div className="form-hint">
              <span>Space or comma separated</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
              Publishing...
            </>
          ) : (
            <>
              <MdSend /> Publish Post
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
