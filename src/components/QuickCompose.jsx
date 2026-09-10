import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import { useUserProfile } from "../store/UserProfileContext";
import { useToast } from "./Toast";
import AiMagicModal from "./AiMagicModal";
import { FiImage, FiSmile, FiTag, FiSend, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { MdHowToVote } from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";

const POPULAR_TAGS = ["react", "webdev", "ai", "design", "coding", "vite"];

const QuickCompose = () => {
  const { addPost } = usePostList();
  const { profile } = useUserProfile();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState(["webdev"]);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, ""]);
    }
  };

  const handleRemovePollOption = (idx) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx, val) => {
    setPollOptions((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
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

    let builtPoll = null;
    if (showPoll) {
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        showToast({
          type: "error",
          title: "Poll incomplete",
          message: "Please provide at least 2 valid poll options.",
        });
        return;
      }
      builtPoll = {
        question: pollQuestion.trim() || title.trim() || content.trim().slice(0, 60),
        options: validOptions.map((opt, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: opt,
          votes: 0,
        })),
        totalVotes: 0,
        userVotedOptionId: null,
        expiresAt: "Active · Ends in 24 hours",
      };
    }

    setIsSubmitting(true);
    const postTitle = title.trim() || content.slice(0, 45) + (content.length > 45 ? "..." : "");

    setTimeout(() => {
      addPost(
        profile.username || "shubham",
        postTitle,
        content.trim(),
        0,
        selectedTags,
        imageUrl.trim() || null,
        profile,
        builtPoll
      );

      setTitle("");
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      setShowPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setIsSubmitting(false);

      showToast({
        type: "success",
        title: builtPoll ? "Poll published to community! 🗳️" : "Thought published! 🚀",
        message: builtPoll
          ? "Your community poll is live and voting is active."
          : "Your post is now trending on the feed.",
      });
    }, 400);
  };

  return (
    <div className="quick-compose-card">
      <div className="quick-compose-header">
        <img
          src={profile.avatarUrl}
          alt={`${profile.name}'s avatar`}
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

      {/* Collapsible Poll Creator Box */}
      {showPoll && (
        <div className="quick-poll-builder">
          <div className="quick-poll-header">
            <span className="quick-poll-title">
              <MdHowToVote /> Community Poll
            </span>
            <button
              type="button"
              className="quick-poll-close"
              onClick={() => setShowPoll(false)}
              aria-label="Remove poll"
            >
              <FiX />
            </button>
          </div>
          <input
            type="text"
            className="quick-poll-question-input"
            placeholder="Poll Question (e.g. Which tool do you use most?)"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
          />
          <div className="quick-poll-options-list">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="quick-poll-opt-row">
                <span className="quick-poll-opt-num">{idx + 1}</span>
                <input
                  type="text"
                  className="quick-poll-opt-input"
                  placeholder={`Choice ${idx + 1}...`}
                  value={opt}
                  onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    className="quick-poll-opt-del"
                    onClick={() => handleRemovePollOption(idx)}
                    aria-label={`Remove choice ${idx + 1}`}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
          {pollOptions.length < 4 && (
            <button
              type="button"
              className="btn-quick-add-opt"
              onClick={handleAddPollOption}
            >
              <FiPlus /> Add Choice ({pollOptions.length}/4)
            </button>
          )}
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
          {/* AI Magic Studio trigger */}
          <button
            type="button"
            className="quick-action-btn ai-magic-trigger-btn"
            onClick={() => setIsAiModalOpen(true)}
            title="Open AI Studio Copilot"
          >
            <RiSparklingFill className="text-sparkle" />
            <span>AI Magic</span>
          </button>

          {/* Poll toggle */}
          <button
            type="button"
            className={`quick-action-btn ${showPoll ? "active" : ""}`}
            onClick={() => setShowPoll(!showPoll)}
            title="Create interactive poll"
          >
            <MdHowToVote />
            <span>Poll</span>
          </button>

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

      {/* AI Studio Copilot Modal */}
      <AiMagicModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={({ title: newTitle, body: newBody, tags: newTags }) => {
          if (newTitle) setTitle(newTitle);
          if (newBody) setContent(newBody);
          if (newTags?.length) setSelectedTags(newTags);
        }}
        initialDraft={{
          title,
          body: content,
          tags: selectedTags,
        }}
      />
    </div>
  );
};

export default QuickCompose;
