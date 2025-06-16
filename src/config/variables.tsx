// src/config/variables.ts
import React from 'react'
import BusinessIcon from '@mui/icons-material/Business'
import PeopleIcon from '@mui/icons-material/PeopleOutline'
// Agrupación de imágenes e íconos
import logo from "../assets/logos/logoPrincipal.png";
export const images = {
  logo,
};


  export const listasDesplegables = {
    tiposMateriales: {
      Polines: ["P6X4", "P4X4", "P4X3", "P4X2"],
      Tablas: ["T7/8", "T1 1/2"],
      Duelas: ["D7", "D3", "D4", "T3", "T4"],
      Paredes: ["TRIPL5", "TRIPL6", "TRIPL9", "TRIPL12", "OSB12"],
      Otros: ["Bolsa Antihumedad", "Termo", "DESEC", "S.GOLPE","S.POS","SEÑAL"]
    },
    tiposTacon: ["Corrido", "Pieza"],
    tiposEquipo: ["Caja","Tarima","Huacal"]
  };



export interface RouteConfig {
  path: string
  name: string
  icon: React.ElementType
  element: React.LazyExoticComponent<React.FC>
  rol?: string | string[]
  hideSucursalSelector?: boolean
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: 'inicio',
    name: 'Home',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    hideSucursalSelector: true,
  },
  {
    path: 'usuarios',
    name: 'Usuarios',
    icon: PeopleIcon,
    rol: ['Administrador'],
    element: React.lazy(() => import('../pages/configpages/UsuariosPage')),
    hideSucursalSelector: true,
  },
  {
    path: 'sucursales',
    name: 'Sucursales',
    icon: BusinessIcon,
    rol: ['Administrador'],
    element: React.lazy(() => import('../pages/configpages/SucursalesPage')),
    hideSucursalSelector: true,
  },
  {
    path: 'materiales',
    name: 'Materiales',
    icon: BusinessIcon,
    rol: ['Administrador'],
    element: React.lazy(() => import('../pages/configpages/MaterialesPage')),
    hideSucursalSelector: false,
  },
  {
    path: 'clientes',
    name: 'Clientes',
    icon: PeopleIcon,
    rol: ['Administrador','Gerente'],
    element: React.lazy(() => import('../pages/clientes/EmpresasPage')),
    hideSucursalSelector: false,
  },
  {
    path: 'costeos',
    name: 'Costeos',
    icon: BusinessIcon,
    rol: ['Administrador','Gerente'],
    element: React.lazy(() => import('../pages/pedidos/PedidosPage')),
    hideSucursalSelector: false,
  },
]

export const routesNav: RouteConfig[] = [
  {
    path: 'inicio',
    name: 'Home',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    hideSucursalSelector: true,
  },
  {
    path: 'configuracion',
    name: 'Configuración',
    icon: BusinessIcon,
    element: React.lazy(() => import('../pages/IndexPage')),
    rol: ['Administrador'],
    hideSucursalSelector: true,   // opcional para el padre
    children: [
      {
        path: 'usuarios',
        name: 'Usuarios',
        icon: PeopleIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/UsuariosPage')),
        hideSucursalSelector: true,
      },
      {
        path: 'sucursales',
        name: 'Sucursales',
        icon: BusinessIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/SucursalesPage')),
        hideSucursalSelector: true,
      },
      {
        path: 'materiales',
        name: 'Materiales',
        icon: BusinessIcon,
        rol: ['Administrador'],
        element: React.lazy(() => import('../pages/configpages/MaterialesPage')),
        hideSucursalSelector: false,
      },
    ]
  },  
  {
    path: 'clientes',
    name: 'Clientes',
    icon: PeopleIcon,
    rol: ['Administrador','Gerente'],
    element: React.lazy(() => import('../pages/clientes/EmpresasPage')),
    hideSucursalSelector: false,
  },
  {
    path: 'costeos',
    name: 'Costeos',
    icon: BusinessIcon,
    rol: ['Administrador','Gerente'],
    element: React.lazy(() => import('../pages/pedidos/PedidosPage')),
    hideSucursalSelector: false,
  },
]
