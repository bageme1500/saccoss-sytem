import React, { useState } from "react";

export default function Sidebar({ active, onNav, isOpen, onClose }) {
  const [openMenu, setOpenMenu] = useState(null);

  const navItems = [
    {
      label: "Home",
      key: "home",
      icon: "🏠",
    },
    {
      label: "Users",
      key: "users",
      icon: "👥",
      children: [
        { label: "Create User", key: "createUser" },
        { label: "Update User", key: "updateUser" },
        { label: "All Users", key: "allUsers" },
      ],
    },
    {
      label: "Contributions",
      key: "contributions",
      icon: "💰",
      children: [
        { label: "Monthly Set Amount", key: "monthlyAmount" },
        { label: "Expected Total Amount", key: "expectedTotal" },
        { label: "Contributed List", key: "contributedList" },
      ],
    },
    {
      label: "Payments",
      key: "payments",
      icon: "💳",
    },
  ];

  const handleNavClick = (key) => {
    onNav(key);
    if (onClose) onClose();
  };

  const toggleMenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-text">SACCOS Admin</span>
        </div>

        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.key} className="nav-group">
            {/* Parent item */}
            <button
              className={`nav-item ${active === item.key ? "active" : ""
                }`}
              onClick={() =>
                item.children
                  ? toggleMenu(item.key)
                  : handleNavClick(item.key)
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.children && (
                <span className="nav-arrow">
                  {openMenu === item.key ? "▾" : "▸"}
                </span>
              )}
            </button>

            {/* Child items */}
            {item.children && openMenu === item.key && (
              <div className="nav-children">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    className={`nav-sub-item ${active === child.key ? "active" : ""
                      }`}
                    onClick={() => handleNavClick(child.key)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">© 2026 SACCOS System</div>
    </aside>
  );
}
