import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import {
  Costeo,
  Producto,
  Material,
} from '../../config/types';
import {
  actualizarMedidasParedes,
  handleCalcularMedidaCorral,
  handleMedidasProductoChange,
  handleProductoChange
} from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
}

const MedidasRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales
}) => {

  const onMedidaChange = (campo: string, valor: string) => {
    handleProductoChange(
      valor,
      campo,
      setCosteo,
      producto?.id ?? '',
      materiales,
      'numeric'
    );
    if (producto?.id) {
      handleMedidasProductoChange(producto.id, setCosteo, materiales);
      handleCalcularMedidaCorral(producto.id, setCosteo, materiales);
      actualizarMedidasParedes(producto.id, setCosteo);
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          mb: 2,
          letterSpacing: 1,
          color: "var(--primary-color)",
          borderLeft: "4px solid var(--primary-color)",
          pl: 1.3,
        }}
      >
        Medidas
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Grupo: Medidas del Equipo */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
        Medidas del Equipo
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Largo del Equipo (cm)"
          name="largoEquipo"
          type="number"
          value={producto.largoEquipo ?? 0}
          onChange={e => onMedidaChange('largoEquipo', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Ancho del Equipo (cm)"
          name="anchoEquipo"
          type="number"
          value={producto.anchoEquipo ?? 0}
          onChange={e => onMedidaChange('anchoEquipo', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Alto del Equipo (cm)"
          name="altoEquipo"
          type="number"
          value={producto.altoEquipo ?? 0}
          onChange={e => onMedidaChange('altoEquipo', e.target.value)}
        />
      </Box>

      {/* Grupo: Incrementos y Grosor */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
        Incrementos y Grosor
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr 1fr' }} gap={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Incr. Largo (cm)"
          name="incrLargo"
          type="number"
          value={producto.incrLargo ?? 0}
          onChange={e => onMedidaChange('incrLargo', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Incr. Ancho (cm)"
          name="incrAncho"
          type="number"
          value={producto.incrAncho ?? 0}
          onChange={e => onMedidaChange('incrAncho', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Incr. Alto (cm)"
          name="incrAlto"
          type="number"
          value={producto.incrAlto ?? 0}
          onChange={e => onMedidaChange('incrAlto', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Grosor (cm)"
          name="grosor"
          type="number"
          value={producto.grosor ?? 0}
          onChange={e => onMedidaChange('grosor', e.target.value)}
        />
      </Box>

      {/* Grupo: Medidas de Empaque */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
        Medidas de Empaque
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Largo Empaque (cm)"
          name="largoEmpaque"
          type="number"
          value={producto.largoEmpaque ?? 0}
          onChange={e => onMedidaChange('largoEmpaque', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Ancho Empaque (cm)"
          name="anchoEmpaque"
          type="number"
          value={producto.anchoEmpaque ?? 0}
          onChange={e => onMedidaChange('anchoEmpaque', e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Alto Empaque (cm)"
          name="altoEmpaque"
          type="number"
          value={producto.altoEmpaque ?? 0}
          onChange={e => onMedidaChange('altoEmpaque', e.target.value)}
        />
      </Box>

      {/* Grupo: Peso */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
        Peso del Equipo
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          margin="dense"
          label="Peso (kg)"
          name="peso"
          type="number"
          value={producto.peso ?? 1}
          onChange={event =>
            onMedidaChange('peso', event.target.value)
           // handleProductoChange(event.target.value, "peso", setCosteo, producto?.id ?? "", materiales)
          }
        />
      </Box>
    </>
  );
};

export default MedidasRow;
