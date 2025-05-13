// src/pages/UsuariosPage.tsx
import React, { useState } from 'react';
import {
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NewUserModal from '../../components/configuracion/UsuarioModal';
import { User } from '../../config/types';
import { actualizarUsuario, eliminarUsuario, useFetchUsuarios } from '../../hooks/useFetchFunctions';
import Spinner from '../../components/general/Spinner';

 const initialUsuario : User = {
    id: '',
    nombre: '',
    email: '',
    telefono: undefined,
    role: 'Usuario',
    sucursales: [],
  };

const UsuariosPage: React.FC = () => {
  const { usuarios, fetchUsuarios } = useFetchUsuarios();
  
  const [usuario, setUsuario] = useState<User>(initialUsuario);

  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

 const [loading, setLoading] = useState(false)

  
  const openModal = (u: User) => {
    setUsuario(u);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setUsuario(initialUsuario);
  };

  const handleSaveUser = async (u: User) => {
    setLoading(true)
    try {
      await actualizarUsuario(u);
    } finally {
      closeModal();
      fetchUsuarios();
      setLoading(false)
    }
    
  };

  const handleDeleteClick = (u: User) => {
    setUserToDelete(u);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    setLoading(true)
    if (userToDelete) {
      await eliminarUsuario(userToDelete.id);
      fetchUsuarios();
      setLoading(false)
    }
    setConfirmOpen(false);
    setUserToDelete(null);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };
  if (loading) return  <Spinner open={true}/>
  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openModal(initialUsuario)}
        sx={{ mb: 2 }}
      >
        Agregar Usuario
      </Button>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText' }}>
                Nombre
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText' }}>
                Correo
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText' }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography>No hay usuarios registrados.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ color: 'var(--primary-color)' }}>{u.nombre}</TableCell>
                  <TableCell sx={{ color: 'var(--primary-color)' }}>{u.email}</TableCell>
                  <TableCell sx={{ color: 'var(--primary-color)' }}>{u.telefono}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openModal(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(u)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Spinner open={loading} />

      {/* Modal controlado desde el padre */}
      <NewUserModal
        open={showModal}
        onClose={closeModal}
        onSave={handleSaveUser}
        usuario={usuario}       // <─ paso usuario o null
        setUsuario={setUsuario} // <─ paso el setter
      />

      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage;
