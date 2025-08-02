import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Chip,
  Box,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { Sucursal, User } from '../../config/types';
import { useFetchSucursales } from '../../hooks/useFetchFunctions';

interface UsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  usuario: User;
  setUsuario: React.Dispatch<React.SetStateAction<User>>;
}

const AREAS = ['Produccion', 'Administracion', 'Ventas'];

const UsuarioModal: React.FC<UsuarioModalProps> = ({
  open,
  onClose,
  onSave,
  usuario,
  setUsuario,
}) => {
  const { sucursales } = useFetchSucursales();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

 const handleRoleChange = (e: SelectChangeEvent) => {
  setUsuario(prev => ({ ...prev, role: e.target.value as string }));
};


  const toggleSucursal = (suc: Sucursal) => {
    setUsuario(prev => {
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
      const assigned = prev.area ?? [];
      const exists = assigned.includes(area);
      const nuevos = exists
        ? assigned.filter(a => a !== area)
        : [...assigned, area];
      return { ...prev, area: nuevos };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(usuario);
  };

  const isExisting = Boolean(usuario.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{backgroundColor:'var(--primary-color)',color:'white'}}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAddIcon sx={{ color: '#fff' }} />
            {isExisting ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                name="nombre"
                label="Nombre completo"
                value={usuario.nombre}
                onChange={handleChange}
                fullWidth
                required
                autoFocus
              />
              <TextField
                name="email"
                label="Correo electrónico"
                value={usuario.email}
                onChange={handleChange}
                type="email"
                fullWidth
                required
                disabled={isExisting}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                name="telefono"
                label="Celular"
                value={usuario.telefono || ''}
                onChange={handleChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="role-label">Tipo de Usuario</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={usuario.role}
                  label="Tipo de Usuario"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="Usuario">Usuario</MenuItem>
                  <MenuItem value="Administrador">Administrador</MenuItem>
                  <MenuItem value="Gerente">Gerente</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Sucursales y áreas solo si no es Admin */}
            {usuario.role !== 'Administrador' && (
              <>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Sucursales asignadas
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {sucursales.map(suc => (
                      <FormControlLabel
                        key={suc.id}
                        control={
                          <Checkbox
                            checked={usuario.sucursales?.some(s => s.id === suc.id) ?? false}
                            onChange={() => toggleSucursal(suc)}
                            color="primary"
                          />
                        }
                        label={suc.nombreSucursal}
                      />
                    ))}
                  </Stack>
                  <Box mt={1}>
                    {usuario.sucursales?.length
                      ? usuario.sucursales.map(suc => (
                          <Chip
                            key={suc.id}
                            label={suc.nombreSucursal}
                            sx={{ mr: 1, mb: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}
                            size="small"
                          />
                        ))
                      : <Typography variant="caption" color="text.secondary">Ninguna seleccionada</Typography>}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Áreas asignadas
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {AREAS.map(area => (
                      <FormControlLabel
                        key={area}
                        control={
                          <Checkbox
                            checked={usuario.area?.includes(area) ?? false}
                            onChange={() => toggleArea(area)}
                            color="primary"
                          />
                        }
                        label={area}
                      />
                    ))}
                  </Stack>
                  <Box mt={1}>
                    {usuario.area?.length
                      ? usuario.area.map(area => (
                          <Chip
                            key={area}
                            label={area}
                            sx={{ mr: 1, mb: 1, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
                            size="small"
                          />
                        ))
                      : <Typography variant="caption" color="text.secondary">Ninguna seleccionada</Typography>}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UsuarioModal;
