'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, message } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import api from '@/services/api'
import { AxiosError } from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await api.post('/api/admin/auth/login', values)
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      message.success('Giriş başarılı')
      router.push('/admin')
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>
      console.error('Login başarısız:', error)
      message.error(error.response?.data?.error || 'Email veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Yönetici Girişi</h2>
        <p className="login-subtitle">Lütfen hesabınıza giriş yapın</p>
        <Form layout="vertical" onFinish={onFinish} className="login-form">
          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: 'Email girin' },
              { type: 'email', message: 'Geçerli email girin' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="ornek@mail.com" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: 'Şifre girin' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
