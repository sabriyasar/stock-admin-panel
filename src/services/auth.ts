import api from './api'

export interface LoginResponse {
  token: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/admin/login', { email, password })
  return res.data
}
