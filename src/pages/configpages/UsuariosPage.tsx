// src/pages/UsuariosPage.tsx
import React, { useState } from 'react';
import {
  Box,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Estado inicial para un usuario nuevo
const initialUsuario: User = {
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

  const [loading, setLoading] = useState(false);

  // Abrir modal de usuario (nuevo o editar)
  const openModal = (u: User) => {
    setUsuario(u);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setUsuario(initialUsuario);
  };

  // Guardar usuario (crear o editar)
  const handleSaveUser = async (u: User) => {
    setLoading(true);
    try {
      await actualizarUsuario(u);
      fetchUsuarios();
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  // Iniciar proceso de borrado
  const handleDeleteClick = (u: User) => {
    setUserToDelete(u);
    setConfirmOpen(true);
  };

  // Confirmar borrado
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (userToDelete) {
        await eliminarUsuario(userToDelete.id);
        fetchUsuarios();
      }
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  // Cancelar borrado
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* Spinner global */}
      <Spinner open={loading} />

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Gestión de Usuarios
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openModal(initialUsuario)}
        sx={{ mb: 3, fontWeight: 600 }}
        startIcon={<PersonAddIcon />}
      >
        Agregar Usuario
      </Button>


      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText', fontWeight: 700 }}>
                Nombre
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText', fontWeight: 700 }}>
                Correo
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText', fontWeight: 700 }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'primary.contrastText', fontWeight: 700, textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay usuarios registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u, i) => (
                <TableRow key={u.id || i} hover>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.telefono ?? '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => openModal(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(u)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear/editar usuario */}
      <NewUserModal
        open={showModal}
        onClose={closeModal}
        onSave={handleSaveUser}
        usuario={usuario}
        setUsuario={setUsuario}
      />

      {/* Diálogo de confirmación de borrado */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>¿Eliminar usuario?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas eliminar al usuario{' '}
            <b>{userToDelete?.nombre}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage;
