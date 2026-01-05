import React, { useState } from 'react'
import { userApi } from '../services/api'
import { useMutation } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function CreateUser(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role_name, setRoleName] = useState('member')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const { mutate: createUser, loading } = useMutation(userApi.create)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try{
      await createUser({ name, email, password, role_name }, {
        onSuccess: (user) => {
          setMsg(`Successfully created user "${user.name}" (ID: ${user.id})`)
          setMsgType('success')
          setName('')
          setEmail('')
          setPassword('')
          setRoleName('member')
        },
        onError: (err) => {
          setMsg(handleApiError(err))
          setMsgType('error')
        }
      })
    }catch(err){
      // Error handled in onError callback
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Create New User</h3>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Enter full name" 
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="user@example.com" 
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password"
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="Enter password" 
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Role</label>
          <select 
            value={role_name} 
            onChange={e=>setRoleName(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button className="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Creating User...</span>
            </>
          ) : (
            <>
              <span>➕</span>
              <span>Create User</span>
            </>
          )}
        </button>
        
        {msg && (
          <div className={`msg ${msgType}`}>
            {msgType === 'success' ? '✓ ' : '✗ '}
            {msg}
          </div>
        )}
      </form>
    </div>
  )
}
