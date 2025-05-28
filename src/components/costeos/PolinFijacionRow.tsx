import React from 'react';
import {  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Costeo,  Material, PolinFijacion } from '../../config/types';
import { handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  polin: PolinFijacion;
  index: number;
  productoId: string;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales:Record<string, string[]>
}

const PolinFijacionRow: React.FC<Props> = ({
  polin,
  index,
  productoId,
  setCosteo,
  materiales,
  tiposMateriales
  
}) => {
  
  const updateField = (
    field: keyof PolinFijacion,
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
                polinesFijacion: prod.polinesFijacion.map((p, i) =>
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
                polinesFijacion: prod.polinesFijacion.filter((_, i) => i !== index),
              }
            : prod
        ),
      };
    });
    handleCalcularTotales(productoId, setCosteo, materiales);
  };

  return (
    <Box  display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr 1fr '}} gap={2}  alignItems="center">
        <Box>
            <TextField
            fullWidth
            size="small"
            margin="dense"
            type="number"
            label={`Cantidad P.Fijacion ${index + 1}`}
            value={polin.cantidad ?? 0}
            onChange={e => updateField('cantidad', parseFloat(e.target.value) || 0)}
            />
        </Box>
        <Box>
            <FormControl fullWidth size="small" margin="dense">
            <InputLabel id={`tipo-polin-label-${index}`}>{`Tipo P.Fijacion ${index + 1}`}</InputLabel>
            <Select
                size="small"
                margin="dense"
                labelId={`tipo-polin-label-${index}`}
                label={`Tipo P.Fijacion ${index + 1}`}
                value={polin.tipo || ''}
                displayEmpty
                onChange={e => updateField('tipo', e.target.value as string)}
            >
                <MenuItem value=""><em>Selecciona un tipo</em></MenuItem>
                {tiposMateriales.Polines.map((rawTipo) => {
                const tipo = rawTipo.trim();
                return (
                    <MenuItem key={tipo} value={tipo}>
                    {tipo}
                    </MenuItem>
                );
                })}
            </Select>
            </FormControl>
        </Box>
        <Box>
            <TextField
            fullWidth
            size="small"
            margin="dense"
            type="number"
            label={`Medida P.Fijacion ${index + 1}`}
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

export default PolinFijacionRow;
