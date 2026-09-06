import { useState } from "react";
import { useStories } from "../store/StoriesContext";
import { useUserProfile } from "../store/UserProfileContext";
import { useToast } from "./Toast";
import { FiX, FiImage, FiZap, FiCheck, FiSend, FiTag } from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const GRADIENT_PRESETS = [
  {
    name: "Cosmic Neon",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
  },
  {
    name: "Cyber Cyan",
    gradient: "linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #3b82f6 100%)",
  },
  {
    name: "Solar Flare",
    gradient: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
  },
  {
    name: "Emerald Glow",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #0284c7 100%)",
  },
  {
    name: "Midnight Aurora",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #701a75 100%)",
  },
];

const PHOTO_PRESETS = [
  {
    name: "Tech Matrix",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Coffee & Code",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Minimal Studio",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Glass Waves",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Deep Space",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
  },
];

const SUGGESTED_TAGS = [
  "#BuildInPublic",
  "#React19",
  "#DesignSystem",
  "#CoffeeCode",
  "#Vibes",
  "#Milestone",
];

const CreateStoryModal = () => {
  const { isCreatorOpen, closeStoryCreator, addStory, openStoryViewer } = useStories();
  const { profile } = useUserProfile();
  const { showToast } = useToast();

  const [storyType, setStoryType] = useState("gradient"); // "gradient" | "photo"
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].gradient);
  const [selectedPhoto, setSelectedPhoto] = useState(PHOTO_PRESETS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedTag, setSelectedTag] = useState("#BuildInPublic");
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isCreatorOpen) return null;

  const activePhotoUrl = customPhotoUrl.trim() || selectedPhoto;

  const handlePublish = (e) => {
    e.preventDefault();
    setIsPublishing(true);

    addStory({
      type: storyType === "photo" ? "image" : "gradient",
      mediaUrl: storyType === "photo" ? activePhotoUrl : "",
      gradient: storyType === "gradient" ? selectedGradient : "",
      caption: caption.trim() || "Sharing my moment on SocialSphere ✨",
      tag: selectedTag,
    });

    setIsPublishing(false);

    showToast({
      type: "success",
      title: "Story Published! 🚀",
      message: "Your story is now live and visible to the community for 24 hours.",
    });

    // Automatically open viewer to review the newly posted story
    setTimeout(() => {
      openStoryViewer("current_user", 0);
    }, 300);
  };

  return (
    <div
      className="story-creator-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Create Story"
    >
      <div className="story-creator-backdrop" onClick={closeStoryCreator} />

      <div className="story-creator-modal">
        {/* Header */}
        <div className="story-creator-header">
          <div className="story-creator-title-wrap">
            <div className="story-creator-icon-badge">
              <RiSparklingFill />
            </div>
            <div>
              <h3 className="story-creator-title">Create New Story</h3>
              <p className="story-creator-sub">Share a snapshot or thought with your network</p>
            </div>
          </div>
          <button
            type="button"
            className="story-creator-close"
            onClick={closeStoryCreator}
            aria-label="Close story creator"
          >
            <FiX />
          </button>
        </div>

        {/* Studio Layout: Settings on Left, Real-time Mobile Preview on Right */}
        <div className="story-creator-body">
          {/* Controls Column */}
          <form className="story-creator-form" onSubmit={handlePublish}>
            {/* Story Format Selector */}
            <div className="creator-field-group">
              <label className="creator-field-label">Canvas Type</label>
              <div className="creator-type-segmented">
                <button
                  type="button"
                  className={`creator-type-btn ${storyType === "gradient" ? "active" : ""}`}
                  onClick={() => setStoryType("gradient")}
                >
                  <FiZap /> Gradient Mesh
                </button>
                <button
                  type="button"
                  className={`creator-type-btn ${storyType === "photo" ? "active" : ""}`}
                  onClick={() => setStoryType("photo")}
                >
                  <FiImage /> Photo / Imagery
                </button>
              </div>
            </div>

            {/* Background Palette / Presets */}
            {storyType === "gradient" ? (
              <div className="creator-field-group">
                <label className="creator-field-label">Color Theme</label>
                <div className="creator-presets-grid">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className={`preset-swatch-btn ${selectedGradient === preset.gradient ? "selected" : ""}`}
                      style={{ background: preset.gradient }}
                      onClick={() => setSelectedGradient(preset.gradient)}
                      title={preset.name}
                    >
                      {selectedGradient === preset.gradient && <FiCheck className="swatch-check" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="creator-field-group">
                <label className="creator-field-label">Curated Backgrounds</label>
                <div className="creator-photos-grid">
                  {PHOTO_PRESETS.map((photo) => (
                    <button
                      key={photo.name}
                      type="button"
                      className={`photo-preset-btn ${selectedPhoto === photo.url && !customPhotoUrl ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedPhoto(photo.url);
                        setCustomPhotoUrl("");
                      }}
                      title={photo.name}
                    >
                      <img src={photo.url} alt={photo.name} />
                      {selectedPhoto === photo.url && !customPhotoUrl && (
                        <div className="photo-check-badge">
                          <FiCheck />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="custom-photo-url-wrap">
                  <input
                    type="url"
                    className="creator-input"
                    placeholder="Or paste custom image URL..."
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Caption Text Area */}
            <div className="creator-field-group">
              <div className="creator-field-header">
                <label className="creator-field-label">Story Thought / Caption</label>
                <span className="creator-char-count">{caption.length}/140</span>
              </div>
              <textarea
                className="creator-textarea"
                rows={3}
                maxLength={140}
                placeholder="What's happening right now? Write something inspiring..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Tag Selection */}
            <div className="creator-field-group">
              <label className="creator-field-label">Topic Sticker</label>
              <div className="creator-tags-wrap">
                {SUGGESTED_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`creator-tag-chip ${selectedTag === tag ? "active" : ""}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="creator-actions-row">
              <button
                type="button"
                className="creator-cancel-btn"
                onClick={closeStoryCreator}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="creator-publish-btn"
                disabled={isPublishing}
              >
                <RiSparklingFill style={{ marginRight: 6 }} />
                Share to Your Story
              </button>
            </div>
          </form>

          {/* Live Mobile Card Preview */}
          <div className="story-creator-preview-pane">
            <span className="preview-pane-label">Live Preview</span>
            <div className="creator-live-card">
              {/* Fake Progress */}
              <div className="creator-preview-progress">
                <div className="preview-progress-bar" />
              </div>

              {/* Author Header */}
              <div className="creator-preview-header">
                <img
                  src={profile.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham"}
                  alt="Avatar"
                  className="preview-avatar"
                />
                <div className="preview-author-info">
                  <span className="preview-name">{profile.name || "Your Story"}</span>
                  <span className="preview-time">Just now</span>
                </div>
              </div>

              {/* Card Canvas */}
              <div className="creator-preview-canvas">
                {storyType === "photo" ? (
                  <div
                    className="preview-image-bg"
                    style={{ backgroundImage: `url(${activePhotoUrl})` }}
                  >
                    <div className="story-gradient-vignette" />
                  </div>
                ) : (
                  <div
                    className="preview-gradient-bg"
                    style={{ background: selectedGradient }}
                  >
                    <div className="story-canvas-sheen" />
                  </div>
                )}

                {/* Overlay Text */}
                <div className="preview-text-box">
                  {selectedTag && <span className="story-overlay-pill">{selectedTag}</span>}
                  <p className="preview-caption">
                    {caption.trim() || "Your inspiring story caption will appear right here ✨"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
