import React, { useState } from 'react'
import api from '../api'

export default function CreateUser(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role_name, setRoleName] = useState('member')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      const user = await api.createUser({ name, email, password, role_name })
      setMsg(`Created user ${user.name} (id=${user.id})`)
      setName(''); setEmail(''); setPassword('')
    }catch(err){
      setMsg('Error: '+err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <input value={role_name} onChange={e=>setRoleName(e.target.value)} placeholder="Role (name)" />
      <button type="submit">Create User</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}