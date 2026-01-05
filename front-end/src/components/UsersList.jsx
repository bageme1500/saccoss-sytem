import React, { useEffect, useState } from 'react'
import api from '../api'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.fetchUsers().then((data) => {
      setUsers(data)
      setLoading(false)
    }).catch((e) => {
      setError(e.message)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{color:'red'}}>Error: {error}</div>

  return (
    <div>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  )
}