// src/config/variables.ts
import React from 'react'
import BusinessIcon from '@mui/icons-material/Business'
import PeopleIcon from '@mui/icons-material/PeopleOutline'
// Agrupación de imágenes e íconos
import logo from "../assets/logos/logoPrincipal.png";
export const images = {
  logo,
};
export interface RouteConfig {
  path: string
  name: string
  icon: React.ElementType
  element: React.LazyExoticComponent<React.FC>
  rol?: string | string[]
  hideProjectSelector?: boolean
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: 'inicio',
    name: 'Home',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    hideProjectSelector: true,
  },
  {
    path: 'usuarios',
    name: 'Usuarios',
    icon: PeopleIcon,
    rol: ['Administrador'],
    element: React.lazy(() => import('../pages/configpages/UsuariosPage')),
    hideProjectSelector: true,
  },
  {
        path: 'sucursales',
        name: 'Sucursales',
        icon: BusinessIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/SucursalesPage')),
        hideProjectSelector: true,
      },
]

export const routesNav: RouteConfig[] = [
  {
    path: 'inicio',
    name: 'Home',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    hideProjectSelector: false,
  },
  {
    path: 'configuracion',
    name: 'Configuración',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    rol: ['Administrador'],
    hideProjectSelector: true,   // opcional para el padre
    children: [
      {
        path: 'usuarios',
        name: 'Usuarios',
        icon: PeopleIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/UsuariosPage')),
        hideProjectSelector: true,
      },
      {
        path: 'sucursales',
        name: 'Sucursales',
        icon: BusinessIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/SucursalesPage')),
        hideProjectSelector: true,
      },
    ]
  },
]
