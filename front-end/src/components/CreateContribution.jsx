import React, { useState } from 'react'
import { createMonthlyContribution } from '../api'

export default function CreateContribution(){
  const [membership_id, setMembershipId] = useState('')
  const [month, setMonth] = useState('')
  const [expected_amount, setExpectedAmount] = useState('')
  const [paid_amount, setPaidAmount] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      const row = await createMonthlyContribution({ membership_id: Number(membership_id), month, expected_amount: Number(expected_amount), paid_amount: Number(paid_amount || 0) })
      setMsg(`Created monthly contribution id=${row.id}`)
      setMembershipId(''); setMonth(''); setExpectedAmount(''); setPaidAmount('')
    }catch(err){
      setMsg('Error: '+err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={membership_id} onChange={e=>setMembershipId(e.target.value)} placeholder="Membership ID" />
      <input value={month} onChange={e=>setMonth(e.target.value)} placeholder="Month (YYYY-MM)" />
      <input value={expected_amount} onChange={e=>setExpectedAmount(e.target.value)} placeholder="Expected amount" />
      <input value={paid_amount} onChange={e=>setPaidAmount(e.target.value)} placeholder="Paid amount (optional)" />
      <button type="submit">Create Contribution</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}