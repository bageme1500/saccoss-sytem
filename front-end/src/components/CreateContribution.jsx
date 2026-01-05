import React, { useState } from 'react'
import { contributionApi } from '../services/api'
import { useMutation } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function CreateContribution(){
  const [membership_id, setMembershipId] = useState('')
  const [month, setMonth] = useState('')
  const [expected_amount, setExpectedAmount] = useState('')
  const [paid_amount, setPaidAmount] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const { mutate: createContribution, loading } = useMutation(contributionApi.create)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try{
      await createContribution(
        { membership_id: Number(membership_id), month, expected_amount: Number(expected_amount), paid_amount: Number(paid_amount || 0) },
        {
          onSuccess: (row) => {
            setMsg(`Successfully created monthly contribution (ID: ${row.id})`)
            setMsgType('success')
            setMembershipId('')
            setMonth('')
            setExpectedAmount('')
            setPaidAmount('')
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
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Create Monthly Contribution</h3>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Membership ID</label>
          <input 
            type="number"
            value={membership_id} 
            onChange={e=>setMembershipId(e.target.value)} 
            placeholder="Enter membership ID" 
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Month</label>
          <input 
            type="month"
            value={month} 
            onChange={e=>setMonth(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Expected Amount</label>
          <input 
            type="number"
            step="0.01"
            value={expected_amount} 
            onChange={e=>setExpectedAmount(e.target.value)} 
            placeholder="0.00" 
            required
            min="0.01"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Paid Amount (Optional)</label>
          <input 
            type="number"
            step="0.01"
            value={paid_amount} 
            onChange={e=>setPaidAmount(e.target.value)} 
            placeholder="0.00" 
            min="0"
          />
        </div>
        
        <button className="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Creating Contribution...</span>
            </>
          ) : (
            <>
              <span>💰</span>
              <span>Create Contribution</span>
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
