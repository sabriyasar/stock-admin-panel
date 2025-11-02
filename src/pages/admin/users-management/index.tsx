'use client'

import { useEffect, useState } from 'react'
import { Table, Spin, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import api from '@/services/api'
import Dashboard from '@/components/dashboard'
import axios from 'axios'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  company?: string
  package?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      setUsers(res.data)
    } catch (err) {
      console.error('Kullanıcılar alınamadı', err)
      message.error('Kullanıcılar alınamadı')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openModal = (user?: User) => {
    setEditingUser(user || null)
    if (user) {
      form.setFieldsValue(user)
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/users/${id}`)
      message.success('Kullanıcı silindi')
      fetchUsers()
    } catch (err) {
      console.error(err)
      message.error('Kullanıcı silinemedi')
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      let updatedUser: User | null = null
  
      if (editingUser) {
        const res = await api.put(`/api/admin/users/${editingUser._id}`, values)
        message.success('Kullanıcı güncellendi')
        updatedUser = res.data
      } else {
        const res = await api.post('/api/admin/users', values)
        message.success('Kullanıcı eklendi')
        updatedUser = res.data
      }
  
      setModalVisible(false)
  
      setUsers(prev => {
        if (editingUser && updatedUser) {
          return prev.map(u => (u._id === updatedUser!._id ? updatedUser! : u))
        } else if (updatedUser) {
          return [...prev, updatedUser]
        }
        return prev
      })
    } catch (err) {
      console.error(err)
      message.error('İşlem başarısız')
    }
  }  

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: '_id', key: '_id', width: 220, ellipsis: true },
    {
      title: 'Ad Soyad',
      key: 'fullName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
    },
    { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    { title: 'Şirket', dataIndex: 'company', key: 'company', render: company => company || '-' },
    {
      title: 'Paket',
      dataIndex: 'package',
      key: 'package',
      filters: [
        { text: 'Basic', value: 'basic' },
        { text: 'Premium', value: 'premium' },
        { text: 'Gold', value: 'gold' },
      ],
      onFilter: (value, record) => record.package === value,
      render: pkg => pkg || 'basic',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <div className="user-actions">
          <Button type="link" onClick={() => openModal(record)}>Düzenle</Button>
          <Popconfirm
            title="Bu kullanıcıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>Sil</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]
  
  return (
    <Dashboard>
      <div className="users-page">
        <div className="users-header">
          <h1>Kullanıcılar</h1>
          <Button type="primary" onClick={() => openModal()}>
            Yeni Kullanıcı Ekle
          </Button>
        </div>

        {loading ? (
          <div className="loading-area">
            <Spin tip="Yükleniyor..." />
          </div>
        ) : (
          <div className="table-wrapper">
            <Table
              dataSource={users}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              bordered
              scroll={{ x: 'max-content' }} // ✅ mobilde yatay scroll
            />
          </div>
        )}

        <Modal
          title={editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
          open={modalVisible}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          centered
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Ad" name="firstName" rules={[{ required: true, message: 'Ad girin' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Soyad" name="lastName" rules={[{ required: true, message: 'Soyad girin' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email girin' },
                { type: 'email', message: 'Geçerli email girin' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Şifre"
              name="password"
              rules={editingUser ? [] : [{ required: true, message: 'Şifre girin' }]}
            >
              <Input.Password placeholder={editingUser ? "Şifreyi değiştirmek için girin" : "Şifre"} />
            </Form.Item>
            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Role seçin' }]}>
              <Select>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="user">User</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Paket" name="package" rules={[{ required: true, message: 'Paket seçin' }]}>
              <Select>
                <Select.Option value="basic">Basic</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
                <Select.Option value="gold">Gold</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Şirket" name="company">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Dashboard>
  )
}
