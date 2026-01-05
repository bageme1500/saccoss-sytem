import React from 'react'
import UsersList from './components/UsersList'
import CreateUser from './components/CreateUser'
import CreateRole from './components/CreateRole'
import CreateMembership from './components/CreateMembership'
import CreateContribution from './components/CreateContribution'
import CreatePayment from './components/CreatePayment'

export default function App() {
  return (
    <div className="container">
      <h1>Saccos Demo</h1>
      <div className="grid">
        <div>
          <h2>Users</h2>
          <UsersList />
        </div>
        <div>
          <h2>Create Role</h2>
          <CreateRole />
          <h2>Create User</h2>
          <CreateUser />
          <h2>Create Membership</h2>
          <CreateMembership />
          <h2>Create Contribution</h2>
          <CreateContribution />
          <h2>Create Payment</h2>
          <CreatePayment />
        </div>
      </div>
    </div>
  )
}