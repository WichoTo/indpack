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
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ClienteModal from '../../components/clientes/ClienteModal.tsx';
import DialogComponent from '../../components/general/DialogComponent.tsx';

import { useAuthRole } from "../../config/auth.tsx";
import { useFetchClientes,deleteCliente, actualizarCliente } from "../../hooks/useFetchFunctions.tsx"; 
import { Cliente } from '../../config/types.tsx';
import { useSucursal } from '../../config/context/SucursalContext.tsx';
import Spinner from '../../components/general/Spinner.tsx';


const Page: React.FC = () => {
  const { role,user } = useAuthRole();
  const {selectedSucursal} =useSucursal();
  const selectedSuc:string = selectedSucursal?.id || "undefined"
  const { clientes } = useFetchClientes(selectedSuc);

  const [loading, setLoading] = useState(false)
  
  const initialCliente : Cliente = {
    id:crypto.randomUUID(),
    nombreCompleto:'',
    correoElectronico:'',
    celular:'',
    empresa:'',
    empresaid:'',
    userid:user?.id || '',
    sucursalid:selectedSucursal?.id??'',
  }
  const [cliente, setCliente] = useState<Cliente>(initialCliente);
  
  const [isClienteModalOpen, setIsClienteModalOpen] = useState<boolean>(false);

  const openClienteModal = () => {
    setCliente(initialCliente);
    setIsClienteModalOpen(true);
  };

  const handleAbrirCliente = (cliente: Cliente) => {
    setCliente(cliente);
    setIsClienteModalOpen(true);
  };

  const closeClienteModal = () => {
    setIsClienteModalOpen(false);
    setCliente(initialCliente);
  };

  const handleSaveCliente = async (cliente:Cliente)=>{
    setLoading(true)
    try{
        await actualizarCliente(cliente)
    }finally{
        setCliente(initialCliente);
        setIsClienteModalOpen(false);
        setLoading(false)
    }
  }

  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  const handleOpenConfirmDialog = (cliente: any) => {
    setClienteToDelete(cliente);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setClienteToDelete(null);
  };

  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;

    try {
      await deleteCliente(clienteToDelete.id); // Eliminamos el cliente de Firebase
      alert(`Cliente ${clienteToDelete.nombreCompleto} eliminado correctamente.`);
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      alert("Error al eliminar el cliente.");
    } finally {
      handleCloseConfirmDialog(); // Cerramos el diálogo después de eliminar
    }
    handleCloseConfirmDialog()
  };
  const clientesFiltrados = clientes.filter((cliente) => cliente.userid === user.id);

  return (
    <>
      {loading && <Spinner open />}
    <Box >
     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Listado de Clientes</Typography>
          <IconButton color="primary" onClick={openClienteModal}>
            <PersonIcon />
          </IconButton>
      </Box>
    <TableContainer component={Paper}  style={{ padding:5, overflowY: 'auto' }}>
        <Table stickyHeader>
        <TableHead className="sticky-header">
            <TableRow sx={{backgroundColor: 'var(--primary-color)',color: '#fff'}}>
            <TableCell sx={{backgroundColor: 'var(--primary-color)',color: '#fff'}} >Nombre Completo</TableCell>
            <TableCell  sx={{backgroundColor: 'var(--primary-color)',color: '#fff'}}>Celular</TableCell>
            <TableCell sx={{backgroundColor: 'var(--primary-color)',color: '#fff'}}>Correo Electrónico</TableCell>
            <TableCell sx={{backgroundColor: 'var(--primary-color)',color: '#fff'}}>Empresa</TableCell>
            {role === 'Gerente' && <TableCell ></TableCell>}
            </TableRow>
        </TableHead>
            <TableBody>
                {clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id} onClick={() => handleAbrirCliente(cliente)} style={{ cursor: 'pointer' }}>
                        <TableCell>{cliente.nombreCompleto}</TableCell>
                        <TableCell>{cliente.correoElectronico}</TableCell>
                        <TableCell>{cliente.celular}</TableCell>
                        <TableCell>{cliente.empresa}</TableCell>
                        {role === 'Gerente' && (
                        <TableCell>
                            <IconButton color="error" onClick={() => handleOpenConfirmDialog(cliente)}>
                            <DeleteIcon />
                            </IconButton>
                        </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>

            
          </Box>
        <ClienteModal cliente={cliente} open={isClienteModalOpen} onClose={closeClienteModal} setCliente={setCliente} onSave={handleSaveCliente} />
        <DialogComponent
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            onConfirm={handleDeleteCliente}
            title="¿Estás seguro?"
            message={`¿Estás seguro de que deseas eliminar a ${clienteToDelete?.nombreCompleto}? Esta acción no se puede deshacer.`}
        />
    </>
  );
};

export default Page;
