'use client'
import { useState, useEffect, ReactNode } from 'react'
import { MenuOutlined, CloseOutlined, LeftOutlined, RightOutlined, DashboardOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  children: ReactNode
}

export default function Dashboard({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen)
  const closeSidebar = () => setMobileOpen(false)
  const toggleCollapse = () => setCollapsed(!collapsed)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) setMobileOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`dashboard-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {isMobile && (
          <div className="sidebar-header">
            <CloseOutlined className="close-icon" onClick={closeSidebar} />
          </div>
        )}
        {!isMobile && <div className="logo">Admin Panel</div>}

        <ul>
          <li className={router.pathname === '/admin' ? 'active' : ''}>
            <Link href="/admin">
              <DashboardOutlined className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li className={router.pathname === '/admin/users-management' ? 'active' : ''}>
            <Link href="/admin/users-management">
              <SettingOutlined className="icon" />
              <span className="text">Kullanıcılar</span>
            </Link>
          </li>
          <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutOutlined className="icon" />
            <span className="text">Çıkış Yap</span>
          </li>
        </ul>

        {!isMobile && (
          <div className="collapse-toggle" onClick={toggleCollapse}>
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="main">
        {isMobile && (
          <div className="mobile-header">
            <MenuOutlined className="menu-icon" onClick={toggleMobileSidebar} />
            <div className="mobile-title">Admin Paneli</div>
            <LogoutOutlined className="menu-icon" onClick={handleLogout} />
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
