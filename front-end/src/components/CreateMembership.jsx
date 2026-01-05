import React, { useState } from 'react'
import { createMembership } from '../api'

export default function CreateMembership(){
  const [user_id, setUserId] = useState('')
  const [monthly_amount, setMonthlyAmount] = useState('')
  const [start_date, setStartDate] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      const row = await createMembership({ user_id: Number(user_id), monthly_amount: Number(monthly_amount), start_date })
      setMsg(`Created membership id=${row.id}`)
      setUserId(''); setMonthlyAmount(''); setStartDate('')
    }catch(err){
      setMsg('Error: '+err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={user_id} onChange={e=>setUserId(e.target.value)} placeholder="User ID" />
      <input value={monthly_amount} onChange={e=>setMonthlyAmount(e.target.value)} placeholder="Monthly amount" />
      <input value={start_date} onChange={e=>setStartDate(e.target.value)} placeholder="Start date (YYYY-MM-DD)" />
      <button type="submit">Create Membership</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}