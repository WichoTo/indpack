// src/components/Footer.tsx
import React from 'react';
import logoPrincipal from '../../assets/logos/logoPrincipal.png'; // Ajusta la ruta si es necesario

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        padding: '1rem',
        backgroundColor: '#5a6268',
        textAlign: 'center',
      }}
    >
      {/* Mostrar el logo principal */}
      <img
        src={logoPrincipal}
        alt="Logo Principal"
        style={{
          width: '100px', // Ajusta el tamaño según lo necesites
          marginBottom: '0.5rem',
        }}
      />
      <p>&copy; {new Date().getFullYear()}  Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
