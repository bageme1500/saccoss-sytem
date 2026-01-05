import React, { useState } from 'react'
import { paymentApi } from '../services/api'
import { useMutation } from '../hooks/useApi'
import { handleApiError } from '../utils/errorHandler'

export default function CreatePayment(){
  const [monthly_contribution_id, setMonthlyContributionId] = useState('')
  const [amount_paid, setAmountPaid] = useState('')
  const [method, setMethod] = useState('cash')
  const [reference, setReference] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const { mutate: createPayment, loading } = useMutation(paymentApi.create)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try{
      await createPayment(
        { monthly_contribution_id: Number(monthly_contribution_id), amount_paid: Number(amount_paid), method, reference },
        {
          onSuccess: (result) => {
            setMsg(`Successfully created payment (ID: ${result.payment.id})`)
            setMsgType('success')
            setMonthlyContributionId('')
            setAmountPaid('')
            setMethod('cash')
            setReference('')
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
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Record Payment</h3>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Monthly Contribution ID</label>
          <input 
            type="number"
            value={monthly_contribution_id} 
            onChange={e=>setMonthlyContributionId(e.target.value)} 
            placeholder="Enter contribution ID" 
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Amount Paid</label>
          <input 
            type="number"
            step="0.01"
            value={amount_paid} 
            onChange={e=>setAmountPaid(e.target.value)} 
            placeholder="0.00" 
            required
            min="0.01"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select 
            value={method} 
            onChange={e=>setMethod(e.target.value)}
            required
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="check">Check</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Reference Number (Optional)</label>
          <input 
            value={reference} 
            onChange={e=>setReference(e.target.value)} 
            placeholder="Transaction reference"
          />
        </div>
        
        <button className="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>💳</span>
              <span>Record Payment</span>
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
