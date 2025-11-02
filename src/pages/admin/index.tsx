'use client'

import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, message } from 'antd'
import Dashboard from '@/components/dashboard'
import api from '@/services/api'

export default function AdminPage() {
  const [stats, setStats] = useState<{ totalUsers: number; todayUsers: number }>({
    totalUsers: 0,
    todayUsers: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/users/stats')
        setStats(res.data)
      } catch (err) {
        console.error('İstatistikler alınamadı:', err)
        message.error('İstatistikler alınamadı')
      }
    }
    fetchStats()
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
      </Row>
    </Dashboard>
  )
}
