import React, { useState } from 'react'
import api from '../api'

export default function CreateRole(){
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      const row = await api.createRole(name)
      setMsg(`Created role ${row.name} (id=${row.id})`)
      setName('')
    }catch(err){
      setMsg('Error: '+err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Role name" />
      <button type="submit">Create Role</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}