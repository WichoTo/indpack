// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { routesNav } from '../../config/variables';
import { logout } from '../../config/auth';

interface SidebarProps {
  visible: boolean;
  role:string;
}

const Sidebar: React.FC<SidebarProps> = ({ visible,role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!visible) return null;

  const allowedRoutes = routesNav
    .filter(route => {
      if (!route.rol) return true;
      return route.rol.includes(role);
    })
    .map(route => {
      if (!route.children) return route;
      return {
        ...route,
        children: route.children.filter(child => {
          if (!child.rol) return true;
          return child.rol.includes(role);
        }),
      };
    });

  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        padding: '1rem',
        height: '100vh',
        display: 'flex',         // ① sidebar también en flex
        flexDirection: 'column',
      }}
    >
      <h2 style={{ marginTop: 0, color: 'var(--secondary-color)' }}>
        Menú
      </h2>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            flex: 1,              // ② ul ocupa todo el espacio restante
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {allowedRoutes.map((route, idx) => (
            <li key={idx} style={{ marginBottom: '1rem' }}>
              <Link
                to={route.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color:
                    location.pathname === route.path ? '#000' : '#fff',
                  backgroundColor:
                    location.pathname === route.path ? '#fff' : 'transparent',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                {route.icon && (
                  <route.icon style={{ marginRight: '0.5rem' }} />
                )}
                {route.name}
              </Link>
              {route.children && (
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    marginTop: '0.5rem',
                  }}
                >
                  {route.children.map((child, cidx) => (
                    <li key={cidx} style={{ margin: '0.25rem 0' }}>
                      <Link
                        to={child.path}
                        style={{
                          display: 'block',
                          padding: '0.4rem 0.5rem',
                          paddingLeft: '2rem',
                          borderRadius: '4px',
                          color:
                            location.pathname === child.path
                              ? '#000'
                              : '#fff',
                          backgroundColor:
                            location.pathname === child.path
                              ? '#fff'
                              : 'transparent',
                          textDecoration: 'none',
                        }}
                      >
                        {child.icon && (
                          <child.icon
                            fontSize="small"
                            style={{ marginRight: '0.5rem' }}
                          />
                        )}
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* logout al fondo */}
          <li
            style={{
              marginTop: 'auto',   // ③ empuja este li hasta abajo
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                width: '100%',
              }}
            >
              <ExitToAppIcon
                fontSize="small"
                style={{ marginRight: '0.5rem' }}
              />
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
