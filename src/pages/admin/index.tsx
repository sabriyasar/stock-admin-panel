'use client'

import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, message, Badge } from 'antd'
import Dashboard from '@/components/dashboard'
import api from '@/services/api'
import { io, Socket } from 'socket.io-client'

interface Stats {
  totalUsers: number
  todayUsers: number
  onlineUsers: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    todayUsers: 0,
    onlineUsers: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/users/stats')
        setStats(prev => ({
          ...prev,
          totalUsers: res.data.totalUsers,
          todayUsers: res.data.todayUsers
        }))
      } catch (err) {
        console.error('İstatistikler alınamadı:', err)
        message.error('İstatistikler alınamadı')
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const s: Socket = io(process.env.NEXT_PUBLIC_API_URL || '')

    s.on('online_users', (count: number) => {
      setStats(prev => ({ ...prev, onlineUsers: count }))
    })

    return () => {
      s.disconnect()
    }
  }, [])

  return (
    <Dashboard>
      <h1 style={{ marginBottom: 24 }}>Admin Paneli</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered>
            <Statistic title="Toplam Kullanıcı" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered>
            <Statistic title="Bugün Kayıt Olanlar" value={stats.todayUsers} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: stats.onlineUsers > 0 ? 'green' : 'gray'
                }}
              ></span>
              <Statistic
                title="Anlık Çevrimiçi Kullanıcı"
                value={stats.onlineUsers}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Dashboard>
  )
}
