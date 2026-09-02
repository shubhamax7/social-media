import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import { FiTrendingUp, FiUserPlus, FiCheck, FiZap, FiActivity } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const TRENDING_TOPICS = [
  { tag: "react", title: "#React19", category: "Technology", posts: "42.8K" },
  { tag: "ai", title: "#AutonomousAgents", category: "Artificial Intelligence", posts: "128.4K" },
  { tag: "vite", title: "#Vite7Speed", category: "Developer Tools", posts: "24.1K" },
  { tag: "design", title: "#Glassmorphism2026", category: "UI/UX Design", posts: "18.3K" },
  { tag: "coding", title: "#CleanCode", category: "Programming", posts: "67.9K" },
];

const SUGGESTED_CREATORS = [
  {
    id: "cre_1",
    name: "Dr. Aris Thorne",
    handle: "@aris_ai",
    role: "AI Research Lead",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ArisAI",
    isVerified: true,
  },
  {
    id: "cre_2",
    name: "Clara Oswald",
    handle: "@clara_design",
    role: "Product Designer @ Figma",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ClaraO",
    isVerified: true,
  },
  {
    id: "cre_3",
    name: "Kenji Sato",
    handle: "@kenji_builds",
    role: "Open Source Creator",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=KenjiS",
    isVerified: false,
  },
];

const RightSidebar = () => {
  const { setActiveTag, activeTag } = usePostList();
  const { showToast } = useToast();
  const [followingMap, setFollowingMap] = useState({});

  const toggleFollow = (creator) => {
    const isNowFollowing = !followingMap[creator.id];
    setFollowingMap((prev) => ({ ...prev, [creator.id]: isNowFollowing }));
    showToast({
      type: isNowFollowing ? "success" : "info",
      title: isNowFollowing ? "Following Creator" : "Unfollowed",
      message: isNowFollowing
        ? `You are now following ${creator.name} (${creator.handle}).`
        : `Removed ${creator.name} from your following feed.`,
    });
  };

  return (
    <aside className="right-sidebar" aria-label="Secondary widgets">
      {/* Pro / Feature Highlight Banner */}
      <div className="pro-card">
        <div className="pro-card-glow" />
        <div className="pro-card-content">
          <div className="pro-card-header">
            <span className="pro-badge"><FiZap /> SocialSphere Pro</span>
            <span className="pro-pill">v2.4</span>
          </div>
          <h3 className="pro-title">Experience AI-Augmented Feed</h3>
          <p className="pro-desc">
            Ultra-fast updates, customizable glass themes, and priority algorithmic distribution.
          </p>
          <button
            type="button"
            className="btn-pro-action"
            onClick={() =>
              showToast({
                type: "info",
                title: "SocialSphere Pro",
                message: "You already have the full Pro experience enabled in this demo!",
              })
            }
          >
            Explore Benefits
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="widget-card">
        <div className="widget-header">
          <div className="widget-title-group">
            <FiTrendingUp className="widget-icon text-accent" />
            <h3 className="widget-title">Trending for you</h3>
          </div>
          {activeTag !== "all" && (
            <button
              className="widget-clear-btn"
              onClick={() => setActiveTag("all")}
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="trending-list">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.tag}
              className={`trending-item ${activeTag === item.tag ? "active" : ""}`}
              onClick={() => {
                setActiveTag(activeTag === item.tag ? "all" : item.tag);
                showToast({
                  type: "info",
                  title: `Filter: ${item.title}`,
                  message: `Filtering feed for #${item.tag} posts.`,
                });
              }}
            >
              <div className="trending-info">
                <span className="trending-cat">{item.category}</span>
                <span className="trending-tag">{item.title}</span>
                <span className="trending-count">{item.posts} posts</span>
              </div>
              <span className="trending-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="widget-card">
        <div className="widget-header">
          <div className="widget-title-group">
            <FiUserPlus className="widget-icon text-pink" />
            <h3 className="widget-title">Who to follow</h3>
          </div>
        </div>

        <div className="creators-list">
          {SUGGESTED_CREATORS.map((creator) => {
            const isFollowing = followingMap[creator.id];
            return (
              <div key={creator.id} className="creator-item">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="creator-avatar"
                  loading="lazy"
                />
                <div className="creator-details">
                  <div className="creator-name-row">
                    <span className="creator-name">{creator.name}</span>
                    {creator.isVerified && (
                      <RiVerifiedBadgeFill className="verified-badge" title="Verified Creator" />
                    )}
                  </div>
                  <span className="creator-handle">{creator.handle}</span>
                  <span className="creator-role">{creator.role}</span>
                </div>
                <button
                  type="button"
                  className={`btn-follow ${isFollowing ? "following" : ""}`}
                  onClick={() => toggleFollow(creator)}
                  aria-label={isFollowing ? `Unfollow ${creator.name}` : `Follow ${creator.name}`}
                >
                  {isFollowing ? (
                    <>
                      <FiCheck /> Following
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live System Activity Badge */}
      <div className="activity-card">
        <div className="activity-indicator">
          <span className="live-dot" />
          <span className="activity-label">Live Platform Activity</span>
        </div>
        <div className="activity-metrics">
          <div className="metric-item">
            <span className="metric-val">1.4K</span>
            <span className="metric-desc">Online Now</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-val">8.2K</span>
            <span className="metric-desc">Posts Today</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-val">99.9%</span>
            <span className="metric-desc">Uptime</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
