import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import {
  Costeo,
  Producto,
  Material,
} from '../../config/types';
import { calcularTipoPolin, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const PolinAmarreRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#f9fafd",
        borderLeft: "4px solid var(--primary-color)",
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" fontWeight={800} color="var(--primary-color)">
          Polín Amarre
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr 1fr'
        }}
        gap={2}
        alignItems="center"
      >
        {/* Cantidad */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Cantidad"
          type="number"
          name="cantidad"
          value={producto?.polinAmarre?.cantidad ?? 0}
          onChange={(e) => {
            const nuevaCantidad = parseFloat(e.target.value) || 0;
            setCosteo((prevPedido) => {
              if (!prevPedido) return prevPedido;
              return {
                ...prevPedido,
                productos: prevPedido.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        polinAmarre: {
                          ...(prod.polinAmarre || {}),
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
          inputProps={{ min: 0 }}
        />

        {/* Tipo de polín */}
        <Select
          size="small"
          margin="dense"
          fullWidth
          name="tipoPolin"
          value={producto?.polinAmarre?.tipoPolin || calcularTipoPolin(producto.peso ?? 0, materiales)}
          onChange={(e) => {
            const nuevoTipoPolin = e.target.value;
            setCosteo((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                productos: prev.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        polinAmarre: {
                          ...(prod.polinAmarre || {}),
                          tipoPolin: nuevoTipoPolin,
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
          renderValue={(value) => (value ? value : "Tipo de polín")}
        >
          <MenuItem value="">Tipo de polín</MenuItem>
          {tiposMateriales.Polines.map((valor) => (
            <MenuItem key={valor} value={valor}>
              {valor}
            </MenuItem>
          ))}
        </Select>

        {/* Medida */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Medida (cm)"
          type="number"
          name="medida"
          value={producto?.polinAmarre?.medida ?? producto?.anchoEmpaque ?? 0}
          onChange={(e) => {
            const nuevaMedida = parseFloat(e.target.value) || producto?.anchoEmpaque || 0;
            setCosteo((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                productos: prev.productos.map((prod) =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        polinAmarre: {
                          ...(prod.polinAmarre || {}),
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

export default PolinAmarreRow;
