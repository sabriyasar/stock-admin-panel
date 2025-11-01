'use client'
import { ReactNode } from 'react'
import Dashboard from '@/components/dashboard'

interface Props {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return <Dashboard>{children}</Dashboard>
}
