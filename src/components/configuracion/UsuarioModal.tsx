// src/components/Usuarios/UsuarioModal.tsx
import React from 'react';
import { Sucursal, User } from '../../config/types';
import { useFetchSucursales } from '../../hooks/useFetchFunctions';

interface UsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  usuario: User;
  setUsuario: React.Dispatch<React.SetStateAction<User>>;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({
  open,
  onClose,
  onSave,
  usuario,
  setUsuario,
}) => {
  const { sucursales } = useFetchSucursales();

  if (!open || !usuario) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuario(prev => prev && ({ ...prev, [name]: value }));
  };

  const toggleSucursal = (suc: Sucursal) => {
    setUsuario(prev => {
      if (!prev) return prev;
      const assigned = prev.sucursales ?? [];
      const exists = assigned.some(s => s.id === suc.id);
      const nuevos = exists
        ? assigned.filter(s => s.id !== suc.id)
        : [...assigned, suc];
      return { ...prev, sucursales: nuevos };
    });
  };

  const toggleArea = (area: string) => {
    setUsuario(prev => {
      if (!prev) return prev;
      const assigned = prev.area ?? [];
      const exists = assigned.includes(area);
      const nuevos = exists
        ? assigned.filter(a => a !== area)
        : [...assigned, area];
      return { ...prev, area: nuevos };
    });
  };

  const handleSubmit = () => {
    onSave(usuario);
  };

  const isExisting = Boolean(usuario.id);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ color: 'var(--primary-color)' }}>
            {usuario.id ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              name="nombre"
              className="form-control"
              value={usuario.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={usuario.email}
              onChange={handleChange}
              disabled={isExisting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Celular</label>
            <input
              name="telefono"
              className="form-control"
              value={usuario.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Usuario</label>
            <select
              name="role"
              className="form-control"
              value={usuario.role}
              onChange={handleChange}
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
              <option value="Gerente">Gerente</option>
            </select>
          </div>

          {/* Sólo mostrar a menos que sea Administrador */}
          {usuario.role !== 'Administrador' && (
            <>
              <div className="form-group">
                <label className="form-label">Sucursales asignadas</label>
                <div>
                  {sucursales.map(suc => (
                    <label
                      key={suc.id}
                      style={{ display: 'block', marginBottom: '.5rem', color: 'var(--primary-color)' }}
                    >
                      <input
                        type="checkbox"
                        checked={usuario.sucursales?.some(s => s.id === suc.id) ?? false}
                        onChange={() => toggleSucursal(suc)}
                      />{' '}
                      {suc.nombreSucursal}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Áreas asignadas</label>
                <div>
                  {['Produccion', 'Administracion', 'Ventas'].map(area => (
                    <label
                      key={area}
                      style={{ display: 'block', marginBottom: '.5rem', color: 'var(--primary-color)' }}
                    >
                      <input
                        type="checkbox"
                        checked={usuario.area?.includes(area) ?? false}
                        onChange={() => toggleArea(area)}
                      />{' '}
                      {area}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-gray" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-aqua" onClick={handleSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;
