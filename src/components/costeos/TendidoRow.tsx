import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
  Paper,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Costeo,
  Producto,
  Material,
} from '../../config/types';
import { calcularTipoTabla, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const TendidoRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 2,
        background: "#f9fafd",
        borderLeft: "4px solid var(--primary-color)",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={800} color="var(--primary-color)">
          TENDIDO
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr 1fr'
        }}
        gap={2}
        mb={1}
        alignItems="center"
      >
        {/* Selector de tipo siempre arriba */}
        <FormControl fullWidth size="small">
          <InputLabel>Tipo</InputLabel>
          <Select
            name="tipo"
            value={
              producto?.tendido?.tipo ??
              (producto?.peso !== undefined ? calcularTipoTabla(producto.peso, materiales) : "")
            }
            label="Tipo"
            onChange={(e) => {
              const nuevoTipo = e.target.value;
              if (!producto?.id) return;
              setCosteo((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  productos: prev.productos.map((prod) =>
                    prod.id === producto.id
                      ? {
                          ...prod,
                          tendido: {
                            ...prod.tendido,
                            tipo: nuevoTipo,
                          },
                        }
                      : prod
                  ),
                };
              });
              if (producto?.id) {
                handleCalcularTotales(producto.id, setCosteo, materiales);
              }
            }}
            displayEmpty
          >
            <MenuItem value=""><em>Selecciona tipo</em></MenuItem>
            {tiposMateriales.Tablas.map((valor) => (
              <MenuItem key={valor} value={valor}>
                {valor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cantidad */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Cantidad"
          type="number"
          name="cantidad"
          value={
            producto?.tendido?.cantidad ||
            (producto?.largoEmpaque ? (producto.largoEmpaque / 14).toFixed(2) : 0)
          }
          onChange={(e) => {
            const nuevaCantidad = parseFloat(e.target.value) || 0;
            setCosteo((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                productos: prev.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        tendido: {
                          ...prod.tendido,
                          cantidad: nuevaCantidad,
                        },
                      }
                    : prod
                ),
              };
            });
            if (producto?.id) {
              handleCalcularTotales(producto.id, setCosteo, materiales);
            }
          }}
        />

        {/* Extra */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Extra"
          type="number"
          name="extra"
          value={producto?.tendido?.extra || 0}
          onChange={(e) => {
            const nuevoExtra = parseFloat(e.target.value) || 0;
            setCosteo((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                productos: prev.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        tendido: {
                          ...prod.tendido,
                          extra: nuevoExtra,
                        },
                      }
                    : prod
                ),
              };
            });
            if (producto?.id) {
              handleCalcularTotales(producto.id, setCosteo, materiales);
            }
          }}
        />

        {/* Medida */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Medida (cm)"
          type="number"
          name="medida"
          value={producto?.tendido?.medida || producto?.anchoEmpaque}
          onChange={(e) => {
            const nuevaMedida = parseFloat(e.target.value) || 0;
            setCosteo((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                productos: prev.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        tendido: {
                          ...prod.tendido,
                          medida: nuevaMedida,
                        },
                      }
                    : prod
                ),
              };
            });
            if (producto?.id) {
              handleCalcularTotales(producto.id, setCosteo, materiales);
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default TendidoRow;
