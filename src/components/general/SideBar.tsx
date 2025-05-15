// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { routesNav } from '../../config/variables';
import { logout } from '../../config/auth';

interface SidebarProps {
  visible: boolean;
  role: string;
  onClose: () => void;    // <-- añadimos callback de cierre
}
const drawerWidth = 250;

const Sidebar: React.FC<SidebarProps> = ({ visible, role, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!visible) return null;

  const allowedRoutes = routesNav
    .filter(route => !route.rol || route.rol.includes(role))
    .map(route => ({
      ...route,
      children: route.children?.filter(child => !child.rol || child.rol.includes(role))
    }));

  return (
    <>
      {/* Backdrop semitransparente */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1050,
        }}
      />

      {/* Sidebar propiamente dicho, con stopPropagation */}
      <aside
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '90px',    // o el alto de tu AppBar
          left: 0,
          width: `${drawerWidth}px`,
          height: `calc(100vh - 90px)`,
          backgroundColor: 'var(--primary-color)',
          color: '#fff',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1100,
        }}
      >
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {allowedRoutes.map((route, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <Link
                  to={route.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: location.pathname === route.path ? '#000' : '#fff',
                    backgroundColor: location.pathname === route.path ? '#fff' : 'transparent',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                  }}
                >
                  {route.icon && <route.icon style={{ marginRight: '0.5rem' }} />}
                  {route.name}
                </Link>
                {route.children && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: '0.5rem' }}>
                    {route.children.map((child, cidx) => (
                      <li key={cidx} style={{ margin: '0.25rem 0' }}>
                        <Link
                          to={child.path}
                          style={{
                            display: 'block',
                            padding: '0.4rem 0.5rem',
                            paddingLeft: '2rem',
                            borderRadius: '4px',
                            color: location.pathname === child.path ? '#000' : '#fff',
                            backgroundColor: location.pathname === child.path ? '#fff' : 'transparent',
                            textDecoration: 'none',
                          }}
                        >
                          {child.icon && <child.icon fontSize="small" style={{ marginRight: '0.5rem' }} />}
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li style={{ marginTop: 'auto' }}>
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
                <ExitToAppIcon fontSize="small" style={{ marginRight: '0.5rem' }} />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
