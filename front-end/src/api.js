const BASE = 'http://localhost:3000/api'

export async function fetchUsers() {
  const res = await fetch(`${BASE}/users`)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function createRole(name) {
  const res = await fetch(`${BASE}/roles`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name }) })
  if (!res.ok) throw new Error('Failed to create role')
  return res.json()
}

export async function createUser(payload) {
  const res = await fetch(`${BASE}/users`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'unknown'}))
    throw new Error(err.error || 'Failed to create user')
  }
  return res.json()
}

export async function createMembership(payload){
  const res = await fetch(`${BASE}/memberships`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'unknown'}))
    throw new Error(err.error || 'Failed to create membership')
  }
  return res.json()
}

export async function createMonthlyContribution(payload){
  const res = await fetch(`${BASE}/monthly_contributions`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'unknown'}))
    throw new Error(err.error || 'Failed to create contribution')
  }
  return res.json()
}

export async function createPayment(payload){
  const res = await fetch(`${BASE}/payments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'unknown'}))
    throw new Error(err.error || 'Failed to create payment')
  }
  return res.json()
}

export default { fetchUsers, createRole, createUser }