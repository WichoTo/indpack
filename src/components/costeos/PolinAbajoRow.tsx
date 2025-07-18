import React from 'react';
import {  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Costeo, PolinAbajo, Material, Producto } from '../../config/types';
import { handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface PolinAbajoRowProps {
  polin: PolinAbajo;
  producto:Producto;
  index: number;
  productoId: string;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales:Record<string, string[]>
}

const PolinAbajoRow: React.FC<PolinAbajoRowProps> = ({
  polin,
  index,
  productoId,
  setCosteo,
  materiales,
  tiposMateriales,
  producto
}) => {
  const updateField = (
    field: keyof PolinAbajo,
    value: number | string
  ) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(prod =>
          prod.id === productoId
            ? {
                ...prod,
                polinesAbajo: prod.polinesAbajo.map((p, i) =>
                  i === index ? { ...p, [field]: value } : p
                ),
              }
            : prod
        ),
      };
    });
    handleCalcularTotales(productoId, setCosteo, materiales);
  };

  const handleDelete = () => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(prod =>
          prod.id === productoId
            ? {
                ...prod,
                polinesAbajo: prod.polinesAbajo.filter((_, i) => i !== index),
              }
            : prod
        ),
      };
    });
    handleCalcularTotales(productoId, setCosteo, materiales);
  };
function isTipoPolinPermitido(
  tipo: string,
  largoEmpaque: number
): boolean {
  // Pasamos a mayúsculas y quitamos espacios
  const tipoPolin = tipo.replace(/\s+/g, '').toUpperCase();

  // Si el largo es > 420, no permitimos 4X2 ni 4X3 (incluye P4X2,  P4X3, etc.)
  if (largoEmpaque > 420 && /4X(2|3)$/i.test(tipoPolin)) {
    return false;
  }

  return true;
}

  return (
    <Box key={"pa"+index} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr 1fr '}} gap={2} mb={1} alignItems="center">
        <Box>
            <TextField
            fullWidth
            size="small"
            margin="dense"
            type="number"
            label={`Cantidad P.Abajo ${index + 1}`}
            value={polin.cantidad ?? 0}
            onChange={e => updateField('cantidad', parseFloat(e.target.value) || 0)}
            />
        </Box>
        <Box>
            <FormControl fullWidth size="small" margin="dense">
            <InputLabel id={`tipo-polin-label-${index}`}>{`Tipo P.Abajo ${index + 1}`}</InputLabel>
            <Select
                labelId={`tipo-polin-label-${index}`}
                label={`Tipo P.Abajo ${index + 1}`}
                value={polin.tipo || ''}
                displayEmpty
                onChange={e => updateField('tipo', e.target.value as string)}
            >
                <MenuItem value=""><em>Selecciona un tipo</em></MenuItem>
                {tiposMateriales.Polines
                  .filter(tipo => isTipoPolinPermitido(tipo, producto.largoEmpaque))
                  .map((rawTipo) => {
                    const tipo = rawTipo.trim();
                    return (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    );
                  })
                }
            </Select>
            </FormControl>
        </Box>
        <Box>
          <TextField
            fullWidth
            size="small"
            margin="dense"
            type="number"
            label={`Medida P.Abajo ${index + 1}`}
            value={polin.medida ?? 0}
            onChange={e => updateField('medida', parseFloat(e.target.value) || 0)}
          />
        </Box>
        <Box>
            <IconButton onClick={handleDelete} sx={{ color: 'gray' }}>
            <DeleteIcon />
            </IconButton>
        </Box>
    </Box>

  );
};

export default PolinAbajoRow;
