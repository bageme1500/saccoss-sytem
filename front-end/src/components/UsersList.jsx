import React from 'react'
import { userApi } from '../services/api'
import { useApi } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function UsersList() {
  const { data: users, loading, error } = useApi(() => userApi.getAll())

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading users...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="card">
        <div className="msg error">Error: {handleApiError(error)}</div>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="card">
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
          No users found. Create your first user to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ fontWeight: '600', color: 'var(--primary)' }}>#{u.id}</td>
              <td style={{ fontWeight: '500' }}>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: u.role === 'admin' ? '#dc2626' : '#059669',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {u.role || 'N/A'}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {new Date(u.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
