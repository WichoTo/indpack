import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Cliente  } from "../../config/types.tsx"; 

interface ClienteModalProps {
  cliente: Cliente;
  open: boolean;
  onClose: () => void;
  setCliente: React.Dispatch<React.SetStateAction<Cliente>>;
  onSave: (cliente:Cliente) => void;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ cliente, open, onClose, setCliente ,onSave}) => {
  
 const handleInputChange = (field: keyof Cliente, value: any) => {
    setCliente(prev => ({ ...prev, [field]: value }))
  }
  const handleActualizarCliente = (cliente: Cliente) => {
    console.log(cliente);
    onSave(cliente);
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }}
      // para que la capa se centre
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          position: 'relative',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 3,
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          align="center"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {cliente?.nombreCompleto ?? 'Cliente'}
        </Typography>

        <TextField
          fullWidth
          label="Nombre Completo"
          name="nombreCompleto"
          value={cliente.nombreCompleto}
          onChange={(e)=>handleInputChange("nombreCompleto",e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Empresa"
          name="empresa"
          value={cliente.empresa}
          onChange={(e)=>handleInputChange("empresa",e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Correo Electrónico"
          name="correoElectronico"
          value={cliente.correoElectronico}
          onChange={(e)=>handleInputChange("correoElectronico",e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Celular"
          name="celular"
          value={cliente.celular}
          onChange={(e)=>handleInputChange("celular",e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Botón actualizar */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => cliente && handleActualizarCliente(cliente)}
        >
          Actualizar Cliente
        </Button>
      </Box>
    </Modal>
  );
};

export default ClienteModal;
