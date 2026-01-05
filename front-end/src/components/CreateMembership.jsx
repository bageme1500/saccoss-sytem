import React, { useState } from 'react'
import { membershipApi } from '../services/api'
import { useMutation } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function CreateMembership(){
  const [user_id, setUserId] = useState('')
  const [monthly_amount, setMonthlyAmount] = useState('')
  const [start_date, setStartDate] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const { mutate: createMembership, loading } = useMutation(membershipApi.create)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try{
      await createMembership(
        { user_id: Number(user_id), monthly_amount: Number(monthly_amount), start_date },
        {
          onSuccess: (row) => {
            setMsg(`Successfully created membership (ID: ${row.id})`)
            setMsgType('success')
            setUserId('')
            setMonthlyAmount('')
            setStartDate('')
          },
          onError: (err) => {
            setMsg(handleApiError(err))
            setMsgType('error')
          }
        }
      )
    }catch(err){
      // Error handled in onError callback
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Create New Membership</h3>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">User ID</label>
          <input 
            type="number"
            value={user_id} 
            onChange={e=>setUserId(e.target.value)} 
            placeholder="Enter user ID" 
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Monthly Amount</label>
          <input 
            type="number"
            step="0.01"
            value={monthly_amount} 
            onChange={e=>setMonthlyAmount(e.target.value)} 
            placeholder="0.00" 
            required
            min="0.01"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input 
            type="date"
            value={start_date} 
            onChange={e=>setStartDate(e.target.value)} 
            required
          />
        </div>
        
        <button className="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Creating Membership...</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Create Membership</span>
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
