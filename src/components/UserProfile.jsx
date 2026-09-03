import { useState } from "react";
import { useUserProfile, AVATAR_PRESETS, BANNER_PRESETS } from "../store/UserProfileContext";
import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import Post from "./Post";
import {
  FiEdit3,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiUsers,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiCamera,
  FiCheck,
  FiX,
  FiActivity,
  FiImage,
  FiLayers,
} from "react-icons/fi";
import { RiVerifiedBadgeFill, RiSparklingFill } from "react-icons/ri";
import { MdPostAdd } from "react-icons/md";

const UserProfile = ({ setSelectedTab }) => {
  const { profile, updateProfile } = useUserProfile();
  const { postList } = usePostList();
  const { showToast } = useToast();

  const [activeProfileTab, setActiveProfileTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showBannerPicker, setShowBannerPicker] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
    avatarSeed: profile.avatarSeed,
    bannerUrl: profile.bannerUrl,
  });

  // Calculate User Stats
  const userAuthoredPosts = postList.filter(
    (p) =>
      p.authorName === profile.name ||
      p.username === profile.username ||
      p.userId === profile.username ||
      p.userId === "shubham"
  );

  const totalReactionsReceived = userAuthoredPosts.reduce(
    (sum, p) => sum + (p.reactions || 0),
    0
  );

  const totalCommentsReceived = userAuthoredPosts.reduce(
    (sum, p) => sum + (p.commentsCount || (p.comments ? p.comments.length : 0)),
    0
  );

  const bookmarkedPosts = postList.filter((p) => p.bookmarked);
  const likedPosts = postList.filter((p) => p.liked);

  const engagementScore =
    userAuthoredPosts.length > 0
      ? Math.round(
          ((totalReactionsReceived * 2 + totalCommentsReceived * 3) /
            userAuthoredPosts.length) *
            10
        )
      : 0;

  // Handler for sharing profile
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: "success",
        title: "Profile link copied! 📋",
        message: `Shareable link to ${profile.handle}'s profile copied to clipboard.`,
      });
    }
  };

  // Open modal with current profile values
  const handleOpenEdit = () => {
    setEditForm({
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      avatarSeed: profile.avatarSeed,
      bannerUrl: profile.bannerUrl,
    });
    setIsEditModalOpen(true);
  };

  // Save profile edits
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showToast({
        type: "error",
        title: "Name required",
        message: "Please enter your display name.",
      });
      return;
    }

    const cleanUsername = (editForm.username || "shubham")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    updateProfile({
      name: editForm.name.trim(),
      username: cleanUsername,
      bio: editForm.bio.trim(),
      location: editForm.location.trim(),
      website: editForm.website.trim(),
      avatarSeed: editForm.avatarSeed.trim() || "Shubham",
      bannerUrl: editForm.bannerUrl.trim() || profile.bannerUrl,
    });

    setIsEditModalOpen(false);
    showToast({
      type: "success",
      title: "Profile Updated ✨",
      message: "Your changes have been saved and applied across SocialSphere.",
    });
  };

  // Select quick banner
  const handleSelectBanner = (url) => {
    updateProfile({ bannerUrl: url });
    setShowBannerPicker(false);
    showToast({
      type: "info",
      title: "Banner changed",
      message: "Your profile header banner has been updated.",
    });
  };

  // Filter posts based on active profile tab
  let displayedPosts = [];
  if (activeProfileTab === "posts") {
    displayedPosts = userAuthoredPosts;
  } else if (activeProfileTab === "liked") {
    displayedPosts = likedPosts;
  } else if (activeProfileTab === "saved") {
    displayedPosts = bookmarkedPosts;
  }

  return (
    <div className="user-profile-view">
      {/* 1. Profile Header / Banner Card */}
      <div className="profile-banner-card">
        <div
          className="profile-banner-media"
          style={{ backgroundImage: `url(${profile.bannerUrl})` }}
        >
          <div className="profile-banner-overlay" />
          <button
            type="button"
            className="btn-change-banner"
            onClick={() => setShowBannerPicker(!showBannerPicker)}
            aria-label="Change banner image"
            title="Change cover banner"
          >
            <FiImage />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Banner Preset Selector Dropdown */}
        {showBannerPicker && (
          <div className="banner-picker-flyout">
            <div className="banner-picker-title">
              <span>Select Theme Banner</span>
              <button
                type="button"
                className="banner-picker-close"
                onClick={() => setShowBannerPicker(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="banner-picker-grid">
              {BANNER_PRESETS.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  className="banner-preset-item"
                  style={{ backgroundImage: `url(${b.url})` }}
                  onClick={() => handleSelectBanner(b.url)}
                >
                  <span className="banner-preset-name">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Info Header Content */}
        <div className="profile-header-content">
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrapper">
              <img
                src={profile.avatarUrl}
                alt={`${profile.name}'s avatar`}
                className="profile-avatar-img"
              />
              <span className="profile-online-ring" title="Online now" />
              <button
                type="button"
                className="profile-avatar-edit-badge"
                onClick={handleOpenEdit}
                title="Change avatar"
              >
                <FiCamera />
              </button>
            </div>

            <div className="profile-actions-group">
              <button
                type="button"
                className="btn-profile-secondary"
                onClick={handleShareProfile}
                title="Share profile"
              >
                <FiShare2 />
                <span>Share</span>
              </button>
              <button
                type="button"
                className="btn-profile-primary"
                onClick={handleOpenEdit}
              >
                <FiEdit3 />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{profile.name}</h1>
              {profile.isVerified && (
                <RiVerifiedBadgeFill
                  className="verified-badge-lg"
                  title="Verified Account"
                />
              )}
              {profile.isPro && (
                <span className="profile-pro-tag">
                  <RiSparklingFill /> Pro
                </span>
              )}
            </div>

            <div className="profile-handle-row">
              <span className="profile-handle">{profile.handle}</span>
            </div>

            {profile.bio && (
              <p className="profile-bio-text">{profile.bio}</p>
            )}

            <div className="profile-meta-bar">
              {profile.location && (
                <span className="profile-meta-item">
                  <FiMapPin className="meta-icon" />
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="profile-meta-item profile-meta-link"
                >
                  <FiGlobe className="meta-icon" />
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="profile-meta-item">
                <FiCalendar className="meta-icon" />
                {profile.joinedDate}
              </span>
              <div className="profile-followers-counter">
                <FiUsers className="meta-icon" />
                <span className="count-bold">{profile.following}</span>
                <span className="count-label">Following</span>
                <span className="count-dot">•</span>
                <span className="count-bold">{profile.followers}</span>
                <span className="count-label">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Activity & Analytics Dashboard Metrics */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-card-glow stat-glow-blue" />
          <div className="stat-card-icon stat-icon-blue">
            <FiLayers />
          </div>
          <div className="stat-card-data">
            <span className="stat-card-val">{userAuthoredPosts.length}</span>
            <span className="stat-card-label">Authored Posts</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-glow stat-glow-pink" />
          <div className="stat-card-icon stat-icon-pink">
            <FiHeart />
          </div>
          <div className="stat-card-data">
            <span className="stat-card-val">{totalReactionsReceived}</span>
            <span className="stat-card-label">Reactions Received</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-glow stat-glow-amber" />
          <div className="stat-card-icon stat-icon-amber">
            <FiBookmark />
          </div>
          <div className="stat-card-data">
            <span className="stat-card-val">{bookmarkedPosts.length}</span>
            <span className="stat-card-label">Saved Bookmarks</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-glow stat-glow-green" />
          <div className="stat-card-icon stat-icon-green">
            <FiActivity />
          </div>
          <div className="stat-card-data">
            <span className="stat-card-val">
              {engagementScore > 0 ? `${engagementScore}%` : "Top 5%"}
            </span>
            <span className="stat-card-label">Engagement Index</span>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Content Feed */}
      <div className="profile-feed-section">
        <div className="profile-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeProfileTab === "posts"}
            className={`profile-tab-btn ${
              activeProfileTab === "posts" ? "active" : ""
            }`}
            onClick={() => setActiveProfileTab("posts")}
          >
            <FiLayers />
            <span>My Posts</span>
            <span className="tab-pill-badge">{userAuthoredPosts.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeProfileTab === "liked"}
            className={`profile-tab-btn ${
              activeProfileTab === "liked" ? "active" : ""
            }`}
            onClick={() => setActiveProfileTab("liked")}
          >
            <FiHeart />
            <span>Liked Posts</span>
            <span className="tab-pill-badge">{likedPosts.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeProfileTab === "saved"}
            className={`profile-tab-btn ${
              activeProfileTab === "saved" ? "active" : ""
            }`}
            onClick={() => setActiveProfileTab("saved")}
          >
            <FiBookmark />
            <span>Bookmarks</span>
            <span className="tab-pill-badge">{bookmarkedPosts.length}</span>
          </button>
        </div>

        {/* Posts list / Empty state */}
        <div className="profile-feed-content">
          {displayedPosts.length > 0 ? (
            <div className="profile-posts-list">
              {displayedPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="profile-empty-state">
              <div className="empty-state-icon-wrap">
                {activeProfileTab === "posts" ? (
                  <MdPostAdd className="empty-icon" />
                ) : activeProfileTab === "liked" ? (
                  <FiHeart className="empty-icon" />
                ) : (
                  <FiBookmark className="empty-icon" />
                )}
              </div>
              <h3 className="empty-state-title">
                {activeProfileTab === "posts"
                  ? "No posts published yet"
                  : activeProfileTab === "liked"
                  ? "No liked posts yet"
                  : "No bookmarked posts yet"}
              </h3>
              <p className="empty-state-desc">
                {activeProfileTab === "posts"
                  ? "Share your first thought, code snippet, or UI breakthrough with the community."
                  : activeProfileTab === "liked"
                  ? "Posts you like will show up here for quick reference."
                  : "Save insightful posts to build your personal reading list."}
              </p>
              {activeProfileTab === "posts" ? (
                <button
                  type="button"
                  className="btn-empty-action"
                  onClick={() => setSelectedTab("Create Post")}
                >
                  <MdPostAdd />
                  <span>Create Your First Post</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-empty-action"
                  onClick={() => setSelectedTab("Home")}
                >
                  <span>Explore Trending Feed</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Edit Profile & Avatar Modal */}
      {isEditModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div
            className="profile-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Profile"
          >
            <div className="profile-modal-header">
              <div className="modal-title-wrap">
                <FiEdit3 className="modal-header-icon text-accent" />
                <h3 className="modal-title">Edit Profile</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              {/* Avatar Picker Section */}
              <div className="edit-section-block">
                <label className="edit-form-label">Choose Avatar Style</label>
                <div className="avatar-picker-preview-row">
                  <div className="avatar-preview-box">
                    <img
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${
                        editForm.avatarSeed || "Shubham"
                      }`}
                      alt="Avatar preview"
                      className="avatar-preview-img"
                    />
                  </div>
                  <div className="avatar-presets-col">
                    <div className="avatar-presets-grid">
                      {AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.seed}
                          type="button"
                          className={`avatar-preset-btn ${
                            editForm.avatarSeed === p.seed ? "selected" : ""
                          }`}
                          onClick={() =>
                            setEditForm((prev) => ({ ...prev, avatarSeed: p.seed }))
                          }
                          title={`Select ${p.name}`}
                        >
                          <img
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${p.seed}`}
                            alt={p.name}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="custom-seed-input-row">
                      <input
                        type="text"
                        className="custom-seed-input"
                        placeholder="Or type custom avatar seed (e.g. Neo)..."
                        value={editForm.avatarSeed}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            avatarSeed: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Username */}
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label" htmlFor="edit-name">
                    Display Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    className="edit-form-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label className="edit-form-label" htmlFor="edit-username">
                    Handle
                  </label>
                  <div className="handle-input-wrap">
                    <span className="handle-prefix">@</span>
                    <input
                      id="edit-username"
                      type="text"
                      className="edit-form-input handle-input"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="edit-form-group">
                <div className="bio-label-row">
                  <label className="edit-form-label" htmlFor="edit-bio">
                    Bio
                  </label>
                  <span className="char-count">
                    {editForm.bio.length} / 240
                  </span>
                </div>
                <textarea
                  id="edit-bio"
                  className="edit-form-textarea"
                  rows={3}
                  maxLength={240}
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell the community about yourself, your tech stack, and what you build..."
                />
              </div>

              {/* Location & Website */}
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label" htmlFor="edit-location">
                    Location
                  </label>
                  <div className="input-with-icon">
                    <FiMapPin className="input-icon" />
                    <input
                      id="edit-location"
                      type="text"
                      className="edit-form-input with-icon"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label className="edit-form-label" htmlFor="edit-website">
                    Website / Portfolio
                  </label>
                  <div className="input-with-icon">
                    <FiGlobe className="input-icon" />
                    <input
                      id="edit-website"
                      type="url"
                      className="edit-form-input with-icon"
                      value={editForm.website}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://yourportfolio.dev"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  <FiCheck />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
