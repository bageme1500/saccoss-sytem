import React, { useState } from 'react'
import { roleApi } from '../services/api'
import { useMutation } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function CreateRole(){
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const { mutate: createRole, loading } = useMutation((name) => roleApi.create(name))

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try{
      await createRole(name, {
        onSuccess: (row) => {
          setMsg(`Successfully created role "${row.name}" (ID: ${row.id})`)
          setMsgType('success')
          setName('')
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
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Create New Role</h3>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Role Name</label>
          <input 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            placeholder="e.g., manager, treasurer" 
            required
            style={{ textTransform: 'lowercase' }}
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
            Role names should be lowercase and descriptive
          </small>
        </div>
        
        <button className="primary" type="submit" disabled={loading || !name.trim()}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Creating Role...</span>
            </>
          ) : (
            <>
              <span>➕</span>
              <span>Create Role</span>
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
