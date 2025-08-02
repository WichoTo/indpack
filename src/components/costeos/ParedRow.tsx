import React, { useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Divider,
  Paper,
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

  // Limpia tipoParedes si es Huacal
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
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 2,
        background: "#fafbfc",
        borderLeft: "4px solid var(--primary-color)"
      }}
    >
      <Typography variant="h6" fontWeight={900} color="var(--primary-color)" sx={{ mb: 1 }}>
        Caja - Paredes
      </Typography>

      {/* Selector de TipoParedes */}
      {producto.tipoEquipo !== 'Huacal' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} color="var(--primary-color)" mb={1}>
            Tipo de Paredes
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Paredes</InputLabel>
            <Select
              name="tipoParedes"
              value={producto.paredes?.tipoParedes ?? ''}
              label="Tipo de Paredes"
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
                handleMedidasProductoChange(producto.id, setCosteo, materiales);
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

      <Divider sx={{ my: 2 }} />

      {/* Campos de dimensiones */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr'
        }}
        gap={2}
        alignItems="center"
        mb={2}
      >
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Largo 2 y 4"
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
          label="Alto 2 y 4"
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
          label="Largo 1 y 3"
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
          label="Alto 1 y 3"
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Selector de tipo de marco */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: 'var(--primary-color)' }}
        >
          Tipo de Marco
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Tipo de Marco</InputLabel>
          <Select
            name="tipoMarco"
            value={producto.paredes?.tipoMarco || "T7/8"}
            label="Tipo de Marco"
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
    </Paper>
  );
};

export default ParedRow;
