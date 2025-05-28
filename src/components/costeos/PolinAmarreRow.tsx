import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography
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
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const PolinAmarreRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {
  



  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
      <Box sx={{ gridColumn: 'span 3' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
            POLIN AMARRE
        </Typography>
      </Box>
              
      <Box>
        <TextField
              size="small"
              margin="dense"
          fullWidth
          label="Cantidad Polín Amarre"
          type="number"
          name="cantidad"
          value={producto?.polinAmarre?.cantidad || 0}
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
        />
      </Box>
      <Box>
        <Select
              size="small"
              margin="dense"
          fullWidth
          name="tipoPolin"
          value={producto?.polinAmarre?.tipoPolin || calcularTipoPolin(producto.peso??0,materiales)}
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
          renderValue={(value) => (value ? value : "Selecciona un tipo de polín")}
        >
          {tiposMateriales.Polines.map((valor) => (
            <MenuItem key={valor} value={valor}>
              {valor}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <TextField
              size="small"
              margin="dense"
          fullWidth
          label="Medida Polín Amarre"
          type="number"
          name="medida"
          value={producto?.polinAmarre?.medida || producto?.anchoEmpaque}
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
      
    </Box>
    </>
  );
};

export default PolinAmarreRow;
