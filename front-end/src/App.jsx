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
      <Sidebar active={view} onNav={setView} />
      <main className="main">
        <div className="header">
          <h1>{getPageTitle()}</h1>
          <div className="header-badge">Admin Panel</div>
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
