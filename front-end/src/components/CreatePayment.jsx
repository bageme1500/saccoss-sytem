import React, { useState } from 'react'
import { createPayment } from '../api'

export default function CreatePayment(){
  const [monthly_contribution_id, setMonthlyContributionId] = useState('')
  const [amount_paid, setAmountPaid] = useState('')
  const [method, setMethod] = useState('cash')
  const [reference, setReference] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      const result = await createPayment({ monthly_contribution_id: Number(monthly_contribution_id), amount_paid: Number(amount_paid), method, reference })
      setMsg(`Created payment id=${result.payment.id}`)
      setMonthlyContributionId(''); setAmountPaid(''); setReference('')
    }catch(err){
      setMsg('Error: '+err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={monthly_contribution_id} onChange={e=>setMonthlyContributionId(e.target.value)} placeholder="Monthly Contribution ID" />
      <input value={amount_paid} onChange={e=>setAmountPaid(e.target.value)} placeholder="Amount" />
      <input value={method} onChange={e=>setMethod(e.target.value)} placeholder="Method" />
      <input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Reference" />
      <button type="submit">Create Payment</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}