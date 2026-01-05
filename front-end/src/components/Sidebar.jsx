import React from 'react';

export default function Sidebar({ active, onNav }) {
  const navItems = [
    { label: 'Dashboard', key: 'dashboard', icon: '📊' },
    { label: 'Users', key: 'users', icon: '👥' },
    { label: 'Create User', key: 'createUser', icon: '➕' },
    { label: 'Memberships', key: 'memberships', icon: '📋' },
    { label: 'Contributions', key: 'contributions', icon: '💰' },
    { label: 'Payments', key: 'payments', icon: '💳' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">🏦</div>
        <span>Saccos Admin</span>
      </div>

      {/* Navigation */}
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={active === item.key ? 'active' : ''}
            onClick={() => onNav(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'auto'
      }}>
        © 2026 SACCOS System
      </div>
    </aside>
  );
}
