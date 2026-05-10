'use client'
// Router de Sidebar por persona ativa.

import { Suspense } from 'react'
import Sidebar from './Sidebar'
import EcSidebar from './EcSidebar'
import SubV1Sidebar from './SubV1Sidebar'
import AqSidebar from './AqSidebar'
import { usePersonaStore } from '@/stores/personaStore'

export default function SidebarRouter() {
  const persona = usePersonaStore((s) => s.persona)
  const version = usePersonaStore((s) => s.version)
  if (persona === 'adquirente')                        return <AqSidebar />
  if (persona === 'estabelecimento')                   return <EcSidebar />
  if (persona === 'subadquirente' && version === 'v1') return <Suspense><SubV1Sidebar /></Suspense>
  return <Sidebar />  // SUB v0 = legacy
}
