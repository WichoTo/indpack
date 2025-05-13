import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'
import Footer from './Footer'
import "../../styles/global.css"
import HamburguerMenu from './HamburguerMenu'
import { useAuthRole } from '../../config/auth'

const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false)
  const {role} =useAuthRole()
  const toggleSidebar = () => setSidebarVisible(v => !v)

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'var(--third-color)',
        overflow: 'hidden',
      }}
    >
      {sidebarVisible && <Sidebar visible={sidebarVisible} role={role!} />}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HamburguerMenu onToggle={toggleSidebar} />

        {/* Contenido principal */}
        <div
          style={{
            flexGrow: 1,
            padding: '1rem',
            overflow: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Layout
