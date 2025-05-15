// src/components/general/Layout.tsx
import React, {  useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import Sidebar from './SideBar'
import HamburguerMenu from './HamburguerMenu'
import { useAuthRole } from '../../config/auth'
import { useSucursal } from '../../config/context/SucursalContext'
import { routesNav } from '../../config/variables'
import type { RouteConfig } from '../../config/variables'

const drawerWidth = 250

const Layout: React.FC = () => {
  
  const { role, loading } = useAuthRole()
  const theme = useTheme()
  const location = useLocation()

  // Context de sucursales
  const { sucursales, selectedSucursal, setSelectedSucursal } = useSucursal()


  // Toggle del sidebar
  const [sidebarVisible, setSidebarOpen] = useState(false)

  if (loading) return null

  const toggleSidebar = () => {
    setSidebarOpen(open => !open)
  }

  // Encontrar la ruta de navegación actual
  const pathKey = location.pathname.replace(/^\//, '')
  let currentRoute: RouteConfig | undefined =
    routesNav.find(r => r.path === pathKey)
  if (!currentRoute) {
    // Checar en children
    currentRoute = routesNav
      .flatMap(r => r.children || [])
      .find(c => c.path === pathKey)
  }
  const showSelector = currentRoute && !currentRoute.hideSucursalSelector

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: 'var(--primary-color)' }}>
        <Toolbar>
          {/* Hamburger para móvil y desktop */}
          <HamburguerMenu onToggle={toggleSidebar} />


          {/* Selector de sucursal */}
          {showSelector && (
            <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
              <InputLabel sx={{ color: '#fff' }}>Sucursal</InputLabel>
              <Select
                value={selectedSucursal?.id || ''}
                label="Sucursal"
                onChange={e => {
                  const sel = sucursales.find(s => s.id === e.target.value)
                  if (sel) setSelectedSucursal(sel)
                }}
                sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
              >
                {sucursales.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombreSucursal}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar siempre visible en desktop o si sidebarVisible */}
      {sidebarVisible && <Sidebar visible={true} role={role!} onClose={()=>setSidebarOpen(false)}  />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 10,
          // si sidebarVisible=true, en pantallas >=sm margen = drawerWidth, sino 0
          ml: {
            xs: 0,
            sm: sidebarVisible ? `${drawerWidth}px` : 0,
          },
          // opcional: transición suave
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
