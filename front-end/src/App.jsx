import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import UsersList from './components/UsersList'
import CreateUser from './components/CreateUser'
import CreateRole from './components/CreateRole'
import CreateMembership from './components/CreateMembership'
import CreateContribution from './components/CreateContribution'
import CreatePayment from './components/CreatePayment'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      users: 'Users Management',
      createUser: 'Create New User',
      memberships: 'Create Membership',
      contributions: 'Create Contribution',
      payments: 'Record Payment'
    }
    return titles[view] || 'Dashboard'
  }

  return (
    <div className="app-wrap">
      {/* Sidebar + mobile backdrop */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        active={view}
        onNav={setView}
        isOpen={sidebarOpen || window.innerWidth > 768}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main">
        <div className="header">
          <h1>{getPageTitle()}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="secondary header-menu"
              onClick={() => setSidebarOpen(true)}
            >
              ☰ Menu
            </button>
            <div className="header-badge">Admin Panel</div>
          </div>
        </div>

        {view === 'dashboard' && <Dashboard />}
        {view === 'users' && <UsersList />}
        {view === 'createUser' && <CreateUser />}
        {view === 'memberships' && <CreateMembership />}
        {view === 'contributions' && <CreateContribution />}
        {view === 'payments' && <CreatePayment />}
      </main>
    </div>
  )
}
