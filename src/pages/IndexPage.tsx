// src/pages/HomePage.tsx
import React from 'react';
import "../styles/global.css";

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#fff', // Fondo blanco para buen contraste
        border: '2px solid var(--primary-color)', // Borde con el color primario
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        margin: '2rem auto',
        maxWidth: '800px',
      }}
    >
      <h2
        style={{
          color: 'var(--primary-color)',      // Título en color primario
          fontSize: 'var(--font-size-title)',   // Tamaño de título definido en las variables
          marginBottom: '1rem',
        }}
      >
        Bienvenido
      </h2>
    </div>
  );
};

export default HomePage;
