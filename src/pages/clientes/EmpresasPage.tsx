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
  Stack,
  Button,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
      <Box maxWidth="lg" sx={{ mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <BusinessIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h4" fontWeight={700}>Empresas</Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openModal}
            sx={{ fontWeight: 600, boxShadow: 2 }}
          >
            Agregar Empresa
          </Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 700 }}>Contacto</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 700 }}>Correo Contacto</TableCell>
                <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 700 }}>Teléfono</TableCell>
                {role === 'Gerente' && <TableCell sx={{ backgroundColor: 'var(--primary-color)' }} />}
              </TableRow>
            </TableHead>
            <TableBody>
              {empresasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No hay empresas registradas.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                empresasFiltradas.map(emp => (
                  <TableRow
                    key={emp.id}
                    hover
                    sx={{ cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={() => openEditModal(emp)}
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
                          aria-label="Eliminar empresa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
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
