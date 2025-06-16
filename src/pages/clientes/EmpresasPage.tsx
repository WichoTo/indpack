import React, { useState } from 'react';
import {
  Box,
  Table,
  IconButton,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Typography,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import EmpresaModal from '../../components/empresas/EmpresaModal';
import DialogComponent from '../../components/general/DialogComponent';

import { useAuthRole } from "../../config/auth";
import { useFetchEmpresas, deleteEmpresa, actualizarEmpresa } from "../../hooks/useFetchFunctions";
import { Empresa } from '../../config/types';
import { useSucursal } from '../../config/context/SucursalContext';
import Spinner from '../../components/general/Spinner';

const PageEmpresas: React.FC = () => {
  const { role, user } = useAuthRole();
  const { selectedSucursal } = useSucursal();
  const sucursalId = selectedSucursal?.id ?? '';
  const { empresas } = useFetchEmpresas(sucursalId);

  const initialEmpresa: Empresa = {
    id: crypto.randomUUID(),
    nombre: '',
    nombrecontacto: '',
    correoconctacto: '',
    telefono: '',
    userid: user?.id ?? '',
    sucursalid: sucursalId,
  };

  const [empresa, setEmpresa] = useState<Empresa>(initialEmpresa);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);

  // Modal handlers
  const openModal = () => {
    setEmpresa(initialEmpresa);
    setModalOpen(true);
  };
  const openEditModal = (emp: Empresa) => {
    setEmpresa(emp);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEmpresa(initialEmpresa);
  };

  // Save handler
  const handleSave = async (emp: Empresa) => {
    setLoading(true);
    try {
      await actualizarEmpresa(emp);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  // Delete handlers
  const openConfirm = (emp: Empresa) => {
    setEmpresaToDelete(emp);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setEmpresaToDelete(null);
  };
  const handleDelete = async () => {
    if (!empresaToDelete) return;
    setLoading(true);
    try {
      await deleteEmpresa(empresaToDelete.id);
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // Filter by current user
  const empresasFiltradas = empresas.filter(e => e.userid === user?.id);

  return (
    <>
      {loading && <Spinner open />}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Empresas</Typography>
          <IconButton color="primary" onClick={openModal}>
            <BusinessIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} style={{ padding: 5, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>Nombre</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>Contacto</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>Correo Contacto</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>Teléfono</TableCell>
                {role === 'Gerente' && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {empresasFiltradas.map(emp => (
                <TableRow
                  key={emp.id}
                  onClick={() => openEditModal(emp)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{emp.nombre}</TableCell>
                  <TableCell>{emp.nombrecontacto}</TableCell>
                  <TableCell>{emp.correoconctacto}</TableCell>
                  <TableCell>{emp.telefono}</TableCell>
                  {role === 'Gerente' && (
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={e => {
                          e.stopPropagation();
                          openConfirm(emp);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <EmpresaModal
          empresa={empresa}
          open={modalOpen}
          onClose={closeModal}
          setEmpresa={setEmpresa}
          onSave={handleSave}
        />
        <DialogComponent
          open={confirmOpen}
          onClose={closeConfirm}
          onConfirm={handleDelete}
          title="¿Estás seguro?"
          message={`¿Deseas eliminar la empresa "${empresaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        />
      </Box>
    </>
  );
};

export default PageEmpresas;
