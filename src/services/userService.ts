// services/userService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface User {
  _id: string
  name: string
  company?: string
  email: string
  role: 'admin' | 'user'
  package?: string
}

export interface CreateUserPayload {
  name: string
  company?: string
  email: string
  password: string
  role: 'admin' | 'user'
  package?: string
}

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/api/admin/users`)
  if (!res.ok) throw new Error('Kullanıcılar alınamadı')
  return res.json()
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Kullanıcı eklenemedi')
  }
  return res.json()
}

export const updateUser = async (id: string, payload: Partial<CreateUserPayload>): Promise<User> => {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Kullanıcı güncellenemedi')
  }
  return res.json()
}

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Kullanıcı silinemedi')
  }
  return res.json()
}
