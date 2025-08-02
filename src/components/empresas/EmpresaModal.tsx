import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Box,
  Divider
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
  const [touched, setTouched] = useState(false);

  const handleChange = (
    field: keyof Omit<Empresa, 'id' | 'userid' | 'sucursalid'>,
    value: string
  ) => {
    setEmpresa(prev => ({ ...prev, [field]: value }));
  };

  // Validaciones básicas (puedes expandirlas)
  const isValid =
    empresa.nombre.trim() !== '' 

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!isValid) return;
    await onSave(empresa);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{backgroundColor:'var(--primary-color)',color:'white',pr: 5 }}>
          <Typography variant="h6" fontWeight={700}>
            {empresa.id ? 'Editar Empresa' : 'Nueva Empresa'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 16, top: 18, color: 'grey.700' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre de la empresa"
              value={empresa.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              required
              autoFocus
              error={touched && empresa.nombre.trim() === ''}
              helperText={touched && empresa.nombre.trim() === '' ? "El nombre es requerido" : ''}
            />
            <TextField
              label="Nombre de contacto"
              value={empresa.nombrecontacto}
              onChange={e => handleChange('nombrecontacto', e.target.value)}
              required
              error={touched && empresa.nombrecontacto.trim() === ''}
            />
            <TextField
              label="Correo de contacto"
              type="email"
              value={empresa.correoconctacto}
              onChange={e => handleChange('correoconctacto', e.target.value)}
              required
              error={touched && empresa.correoconctacto?.trim() === ''}
            />
            <TextField
              label="Teléfono"
              value={empresa.telefono}
              onChange={e => handleChange('telefono', e.target.value)}
              required
              error={touched && empresa.telefono.trim() === ''}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            type="submit"
            disabled={!isValid}
          >
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EmpresaModal;
