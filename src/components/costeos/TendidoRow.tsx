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
import {  calcularTipoTabla, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const TendidoRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {



  return (
    <>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
                TENDIDO
            </Typography>
          </Box>                  
          <Box>
            <Select
              size="small"
              margin="dense"
              fullWidth
              name="tipo"
              value={
                producto?.tendido?.tipo ??
                (producto?.peso !== undefined ? calcularTipoTabla(producto.peso,materiales) : "")
              }
              onChange={(e) => {
                const nuevoTipo = e.target.value;
                if (!producto?.id) return; // Evita actualizar si no hay un producto activo

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
              <MenuItem >Selecciona tipo</MenuItem>
              {tiposMateriales.Tablas.map((valor) => (
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
              label="Cantidad Tendido"
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
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Extra Tendido"
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
          </Box>          
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Medida Tendido"
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
        </Box>
    </>
  );
};

export default TendidoRow;
