import { useState } from "react";
import { useSearch } from "../store/SearchContext";
import { useToast } from "./Toast";
import { FiSearch, FiBell, FiX, FiCheck } from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const NOTIFICATIONS = [
  { id: 1, text: "Elena Vance liked your post on React 19", time: "2m ago" },
  { id: 2, text: "Marcus Brody commented: 'Browser automation is a game changer!'", time: "18m ago" },
  { id: 3, text: "Sarah Jenkins started following your sphere", time: "1h ago" },
];

const Header = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const handleClearNotifications = () => {
    setUnreadCount(0);
    showToast({
      type: "info",
      title: "Notifications cleared",
      message: "All recent notifications marked as read.",
    });
  };

  return (
    <header className="app-header">
      {/* Search Bar with Keyboard Tag */}
      <div className="header-search-wrapper">
        <FiSearch className="header-search-icon" aria-hidden="true" />
        <input
          id="global-search"
          type="search"
          className="header-search-input"
          placeholder="Search thoughts, tags (#react), or creators..."
          aria-label="Search posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            type="button"
            className="header-search-clear"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search query"
          >
            <FiX />
          </button>
        ) : (
          <span className="search-kbd-tag">⌘K</span>
        )}
      </div>

      {/* Right Actions */}
      <div className="header-actions">
        {/* Live Network Status Indicator */}
        <div className="header-status-badge">
          <span className="live-status-dot" />
          <span className="live-status-text">Network Live</span>
        </div>

        {/* Notification Bell */}
        <div className="header-notification-wrapper">
          <button
            type="button"
            className="btn-header-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-flyout" role="dialog" aria-label="Notifications">
              <div className="flyout-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="btn-mark-read"
                    onClick={handleClearNotifications}
                  >
                    <FiCheck /> Mark all read
                  </button>
                )}
              </div>
              <div className="flyout-list">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flyout-item">
                    <span className="flyout-item-dot" />
                    <div className="flyout-item-body">
                      <p className="flyout-item-text">{n.text}</p>
                      <span className="flyout-item-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-header-login"
          onClick={() =>
            showToast({
              type: "info",
              title: "Demo Mode",
              message: "You are currently logged in as @shubham.",
            })
          }
        >
          Profile
        </button>

        <button
          type="button"
          className="btn-header-signup"
          onClick={() =>
            showToast({
              type: "success",
              title: "VIP Status",
              message: "All premium features unlocked for pair session.",
            })
          }
        >
          <RiSparklingFill style={{ marginRight: 4 }} />
          Pro Member
        </button>
      </div>
    </header>
  );
};

export default Header;