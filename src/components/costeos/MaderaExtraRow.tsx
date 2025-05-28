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
import {  calcularTipoPolin, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const MaderaExtraRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {



  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ gridColumn: 'span 3' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
                MADERA EXTRA
            </Typography>
          </Box>
          <Box>
            <Select
              size="small"
              margin="dense"
              fullWidth
              value={producto?.maderaExtra?.tipoPolin || calcularTipoPolin(producto.peso??0,materiales)}
              onChange={(e) => {
                setCosteo((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    productos: prev.productos.map((prod) =>
                      prod.id === producto?.id
                        ? {
                            ...prod,
                            maderaExtra: {
                              ...(prod.maderaExtra || {}),
                              tipoPolin: e.target.value,
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
              <MenuItem value="">Selecciona tipo de polín</MenuItem>
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
              label="Medida"
              type="number"
              value={producto?.maderaExtra?.medida ?? ""}
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
                            maderaExtra: {
                              ...(prod.maderaExtra || {}),
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

export default MaderaExtraRow;
