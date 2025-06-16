import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Empresa } from '../../config/types';

interface EmpresaModalProps {
  empresa: Empresa;
  open: boolean;
  onClose: () => void;
  setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>;
  onSave: (empresa: Empresa) => Promise<void>;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({
  empresa,
  open,
  onClose,
  setEmpresa,
  onSave,
}) => {
  const handleChange = (
    field: keyof Omit<Empresa, 'id' | 'userid' | 'sucursalid'>,
    value: string
  ) => {
    setEmpresa(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSave(empresa);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">
          {empresa.id ? 'Editar Empresa' : 'Nueva Empresa'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2
          }}
        >
          <TextField
            label="Nombre de la empresa"
            value={empresa.nombre}
            onChange={e => handleChange('nombre', e.target.value)}
            fullWidth
            autoFocus
            sx={{ gridColumn: '1 / -1' }}
          />

          <TextField
            label="Nombre de contacto"
            value={empresa.nombrecontacto}
            onChange={e => handleChange('nombrecontacto', e.target.value)}
            fullWidth
          />
          <TextField
            label="Correo de contacto"
            type="email"
            value={empresa.correoconctacto}
            onChange={e => handleChange('correoconctacto', e.target.value)}
            fullWidth
          />

          <TextField
            label="Teléfono"
            value={empresa.telefono}
            onChange={e => handleChange('telefono', e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmpresaModal;
