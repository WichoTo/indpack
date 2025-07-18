import React, { useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl
} from '@mui/material';
import {
  handleCalcularTotales,
  handleMedidasProductoChange,
  recalcularGrosor
} from '../../hooks/useFetchCosteo';
import { Costeo, Producto, Material } from '../../config/types';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const ParedRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {

  // Si cambiamos a Huacal, limpias tipoParedes y recalculas grosor + totales
  useEffect(() => {
    if (producto.tipoEquipo === 'Huacal' && producto.paredes?.tipoParedes) {
      setCosteo(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          productos: prev.productos.map(p => {
            if (p.id !== producto.id) return p;
            const updatedParedes = { ...p.paredes!, tipoParedes: '' };
            const newGrosor = recalcularGrosor({ ...p, paredes: updatedParedes });
            return {
              ...p,
              paredes: updatedParedes,
              grosor: newGrosor
            };
          })
        };
      });
      handleCalcularTotales(producto.id, setCosteo, materiales);
    }
  }, [producto.tipoEquipo, producto.paredes?.tipoParedes]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
      gap={2}
      mb={1}
      alignItems="center"
    >
      <Box gridColumn="1 / -1">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
          CAJA
        </Typography>
      </Box>
      <Box gridColumn="1 / -1">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
          Paredes
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
          Tipo de Paredes
        </Typography>
      </Box>

      {/* Solo mostramos el selector de tipoParedes si NO es Huacal */}
      {producto.tipoEquipo !== 'Huacal' && (
        <Box gridColumn="1 / -1">
          <FormControl fullWidth>
            <Select
              size="small"
              margin="dense"
              name="tipoParedes"
              value={producto.paredes?.tipoParedes ?? ''}
              displayEmpty
              onChange={e => {
                const nuevoTipo = e.target.value as string;
                setCosteo(prev => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    productos: prev.productos.map(p => {
                      if (p.id !== producto.id) return p;
                      const updatedParedes = {
                        ...(p.paredes || {}),
                        tipoParedes: nuevoTipo
                      };
                      const newGrosor = recalcularGrosor({
                        ...p,
                        paredes: updatedParedes
                      });
                      return {
                        ...p,
                        paredes: updatedParedes,
                        grosor: newGrosor
                      };
                    })
                  };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
                handleMedidasProductoChange(producto.id, setCosteo, materiales)
              }}
            >
              <MenuItem value="">
                <em>Selecciona un tipo</em>
              </MenuItem>
              {tiposMateriales.Paredes.map(valor => (
                <MenuItem key={valor} value={valor}>
                  {valor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Campos de dimensiones (SIEMPRE visibles) */}
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Largo 2y4"
        type="number"
        value={producto.paredes?.largo2y4 ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, largo2y4: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Alto 2y4"
        type="number"
        value={producto.paredes?.alto2y4 ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, alto2y4: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Largo 1y3"
        type="number"
        value={producto.paredes?.largo1y3 ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, largo1y3: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Alto 1y3"
        type="number"
        value={producto.paredes?.alto1y3 ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, alto1y3: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Largo Techo"
        type="number"
        value={producto.paredes?.largoTecho ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, largoTecho: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="Alto Techo"
        type="number"
        value={producto.paredes?.altoTecho ?? 0}
        onChange={e => {
          const v = parseFloat(e.target.value);
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p =>
                p.id === producto.id
                  ? { ...p, paredes: { ...p.paredes!, altoTecho: v } }
                  : p
              )
            };
          });
          handleCalcularTotales(producto.id, setCosteo, materiales);
        }}
      />

      {/* Tipo de Marco SIEMPRE visible */}
      <Box gridColumn="1 / -1">
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', mb: 1, color: 'var(--primary-color)' }}
        >
          Tipo de Marco
        </Typography>
        <FormControl fullWidth>
          <Select
            size="small"
            margin="dense"
            name="tipoMarco"
            value={producto.paredes.tipoMarco || "T7/8"}
            onChange={e => {
              const val = e.target.value as string;
              setCosteo(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  productos: prev.productos.map(p =>
                    p.id === producto.id
                      ? { ...p, paredes: { ...p.paredes!, tipoMarco: val } }
                      : p
                  )
                };
              });
              handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            displayEmpty
          >
            <MenuItem value=""><em>Selecciona un tipo</em></MenuItem>
            {tiposMateriales.Tablas.map(valor => (
              <MenuItem key={valor} value={valor}>
                {valor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ParedRow;
