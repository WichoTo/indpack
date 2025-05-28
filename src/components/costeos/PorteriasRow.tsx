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

const PorteriasRow: React.FC<Props> = ({
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
                PORTERÍAS
            </Typography>
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cantidad Porterías"
              type="number"
              name="cantidad"
              value={producto?.porterias?.cantidad || 0 }
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
                            porterias: {
                              ...(prod.porterias || {}),
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
              value={producto?.porterias?.tipoPolin || calcularTipoPolin(producto.peso??0,materiales)}
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
                            porterias: {
                              ...(prod.porterias || {}),
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
              label="Medida Porterías"
              type="number"
              name="medida"
              value={producto?.porterias?.medida || 2 * (producto?.altoEmpaque ?? 0) + (producto?.anchoEmpaque ?? 0)}
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
                            porterias: {
                              ...(prod.porterias || {}),
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

export default PorteriasRow;
