import React from 'react'
import { userApi, membershipApi, contributionApi, paymentApi } from '../services/api'
import { useApi } from '../hooks/useApi'

export default function Dashboard(){
  const { data: users, loading: usersLoading } = useApi(() => userApi.getAll())
  const { data: memberships, loading: membershipsLoading } = useApi(() => membershipApi.getAll())
  const { data: contributions, loading: contributionsLoading } = useApi(() => contributionApi.getAll())
  const { data: payments, loading: paymentsLoading } = useApi(() => paymentApi.getAll())

  const loading = usersLoading || membershipsLoading || contributionsLoading || paymentsLoading
  
  const stats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: '👥',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Active Memberships',
      value: memberships?.length || 0,
      icon: '📋',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Contributions',
      value: contributions?.length || 0,
      icon: '💰',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Total Payments',
      value: payments?.length || 0,
      icon: '💳',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    }
  ]

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="grid">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-icon" style={{ background: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <h3>{stat.title}</h3>
            <div className="num" style={{ color: stat.color }}>{stat.value}</div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              marginTop: '8px'
            }}>
              {stat.value === 1 ? 'record' : 'records'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Info Section */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>System Overview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              System Status
            </div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              <span>●</span>
              <span>Operational</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Database
            </div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              SQLite
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
