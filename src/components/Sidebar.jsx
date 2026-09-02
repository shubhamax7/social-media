import { useState } from "react";
import { usePostList } from "../store/post-list-store";
import {
  MdHome,
  MdAddCircleOutline,
  MdBookmark,
  MdExplore,
  MdSettings,
  MdLogout,
  MdPerson,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdEdit,
} from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const { postList, setActiveFeedTab } = usePostList();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const bookmarkedCount = postList.filter((p) => p.bookmarked).length;

  const handleNavClick = (tabId) => {
    if (tabId === "Saved") {
      setSelectedTab("Home");
      setActiveFeedTab("bookmarks");
    } else if (tabId === "Explore") {
      setSelectedTab("Home");
      setActiveFeedTab("trending");
    } else {
      setSelectedTab(tabId);
    }
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Brand Logo & Name */}
      <a
        href="/"
        className="sidebar-brand"
        aria-label="SocialSphere home"
        onClick={(e) => {
          e.preventDefault();
          setSelectedTab("Home");
          setActiveFeedTab("trending");
        }}
      >
        <div className="sidebar-brand-icon" aria-hidden="true">
          <RiSparklingFill style={{ color: "#fff" }} />
        </div>
        <div className="sidebar-brand-title-wrap">
          <span className="sidebar-brand-text">SocialSphere</span>
          <span className="sidebar-brand-sub">Platform v2</span>
        </div>
      </a>

      <div className="sidebar-divider" />

      {/* Primary Navigation */}
      <ul className="sidebar-nav" role="list">
        <li className="sidebar-nav-item" role="listitem">
          <button
            className={`sidebar-nav-link ${selectedTab === "Home" ? "active" : ""}`}
            onClick={() => handleNavClick("Home")}
          >
            <span className="sidebar-nav-icon"><MdHome /></span>
            <span className="sidebar-nav-label">Home Feed</span>
          </button>
        </li>

        <li className="sidebar-nav-item" role="listitem">
          <button
            className="sidebar-nav-link"
            onClick={() => handleNavClick("Explore")}
          >
            <span className="sidebar-nav-icon"><MdExplore /></span>
            <span className="sidebar-nav-label">Explore & Trends</span>
          </button>
        </li>

        <li className="sidebar-nav-item" role="listitem">
          <button
            className="sidebar-nav-link"
            onClick={() => handleNavClick("Saved")}
          >
            <span className="sidebar-nav-icon"><MdBookmark /></span>
            <span className="sidebar-nav-label">Bookmarks</span>
            {bookmarkedCount > 0 && (
              <span className="sidebar-pill-badge">{bookmarkedCount}</span>
            )}
          </button>
        </li>

        <li className="sidebar-nav-item" role="listitem">
          <button
            className={`sidebar-nav-link ${selectedTab === "Create Post" ? "active" : ""}`}
            onClick={() => handleNavClick("Create Post")}
          >
            <span className="sidebar-nav-icon"><MdAddCircleOutline /></span>
            <span className="sidebar-nav-label">Create Post</span>
          </button>
        </li>
      </ul>

      {/* Primary Compose Action Button in Sidebar */}
      <div className="sidebar-compose-container">
        <button
          type="button"
          className="btn-sidebar-compose"
          onClick={() => setSelectedTab("Create Post")}
        >
          <MdEdit />
          <span>New Post</span>
        </button>
      </div>

      {/* Bottom User Profile */}
      <div className="sidebar-user">
        <button
          className="sidebar-user-btn"
          onClick={() => setUserMenuOpen((o) => !o)}
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <div className="sidebar-avatar-container">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham"
              alt="Your avatar"
              className="sidebar-avatar"
            />
            <span className="user-online-dot" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Shubham</div>
            <div className="sidebar-user-handle">@shubham</div>
          </div>
          <span className="user-menu-chevron" aria-hidden="true">
            {userMenuOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </span>
        </button>

        {userMenuOpen && (
          <div className="user-dropdown-popover" role="menu">
            <button role="menuitem" className="popover-item">
              <MdPerson /> Profile & Stats
            </button>
            <button role="menuitem" className="popover-item">
              <MdSettings /> Preferences
            </button>
            <div className="popover-divider" />
            <button role="menuitem" className="popover-item text-danger">
              <MdLogout /> Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
