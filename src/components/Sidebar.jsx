import { useState } from "react";
import {
  MdHome,
  MdAddCircleOutline,
  MdSettings,
  MdLogout,
  MdPerson,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: "Home", label: "Home", icon: <MdHome /> },
    { id: "Create Post", label: "Create Post", icon: <MdAddCircleOutline /> },
  ];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Brand */}
      <a href="/" className="sidebar-brand" aria-label="SocialSphere home">
        <div className="sidebar-brand-icon" aria-hidden="true">
          <RiSparklingFill style={{ color: "#fff" }} />
        </div>
        <span className="sidebar-brand-text">SocialSphere</span>
      </a>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <ul className="sidebar-nav" role="list">
        {navItems.map((item) => (
          <li key={item.id} className="sidebar-nav-item" role="listitem">
            <button
              className={`sidebar-nav-link${selectedTab === item.id ? " active" : ""}`}
              onClick={() => setSelectedTab(item.id)}
              aria-current={selectedTab === item.id ? "page" : undefined}
            >
              <span className="sidebar-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="sidebar-nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* User Menu */}
      <div className="sidebar-user">
        <button
          className="sidebar-user-btn"
          onClick={() => setUserMenuOpen((o) => !o)}
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=SocialSphere"
            alt="Your avatar"
            className="sidebar-avatar"
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Shubham</div>
            <div className="sidebar-user-handle">@shubham</div>
          </div>
          <span aria-hidden="true">
            {userMenuOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </span>
        </button>

        {userMenuOpen && (
          <div
            role="menu"
            style={{
              marginTop: "8px",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              animation: "scaleIn 0.18s ease",
            }}
          >
            {[
              { icon: <MdPerson />, label: "Profile" },
              { icon: <MdSettings />, label: "Settings" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                role="menuitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-sm)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-glass-hover)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <span style={{ fontSize: "16px" }}>{icon}</span>
                {label}
              </button>
            ))}
            <div style={{ height: "1px", background: "var(--color-border)", margin: "4px 0" }} />
            <button
              role="menuitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 14px",
                background: "none",
                border: "none",
                color: "var(--color-danger)",
                fontSize: "var(--font-size-sm)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-danger-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <MdLogout style={{ fontSize: "16px" }} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
