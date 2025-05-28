import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl
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
  materiales:Material[],
  tiposMateriales:Record<string, string[]>
}

const ParedRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {



  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr '}} gap={2} mb={1} alignItems="center">
          <Box gridColumn="1 / -1">
            <Typography variant="h6" sx={{ fontWeight: "bold",   color: "var(--primary-color)" }}>
                CAJA
            </Typography>
          </Box>
          <Box gridColumn="1 / -1">
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
              Paredes
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
              Tipo Paredes
            </Typography>
          </Box>
           <Box gridColumn="1 / -1">
            <FormControl fullWidth>
              <Select
                size="small"
                margin="dense"
                name="tipoParedes"
                value={producto.paredes?.tipoParedes ?? ""}
                displayEmpty
                onChange={(e) => {
                  const nuevoTipo = e.target.value;
                  setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
                        p.id === producto.id
                          ? {
                              ...p,
                              paredes: {
                                ...(p.paredes || {}),
                                tipoParedes: nuevoTipo,
                              },
                            }
                          : p
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
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
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField 
              size="small"
              margin="dense" fullWidth label="Largo 2y4" type="number" value={producto?.paredes?.largo2y4 ?? 0} onChange={(e) => {
                  const nuevovalor = parseFloat(e.target.value);
                  setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
                        p.id === producto.id
                          ? {
                              ...p,
                              paredes: {
                                ...(p.paredes || {}),
                                largo2y4: nuevovalor,
                              },
                            }
                          : p
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField 
              size="small"
              margin="dense" fullWidth label="Alto 2y4" type="number" value={producto?.paredes?.alto2y4 ?? 0} onChange={(e) => {
                const nuevovalor = parseFloat(e.target.value);
                setCosteo(prev => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    productos: prev.productos.map(p =>
                      p.id === producto.id
                        ? {
                            ...p,
                            paredes: {
                              ...(p.paredes || {}),
                              alto2y4: nuevovalor,
                            },
                          }
                        : p
                    ),
                  };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
              }}
            />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField 
              size="small"
              margin="dense" fullWidth label="Largo 1y3" type="number" value={producto?.paredes?.largo1y3 ?? 0} onChange={(e) => {
                    const nuevovalor = parseFloat(e.target.value);
                    setCosteo(prev => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        productos: prev.productos.map(p =>
                          p.id === producto.id
                            ? {
                                ...p,
                                paredes: {
                                  ...(p.paredes || {}),
                                  largo1y3: nuevovalor,
                                },
                              }
                            : p
                        ),
                      };
                    });
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }}
                />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField 
              size="small"
              margin="dense" fullWidth label="Alto 1y3" type="number" value={producto?.paredes?.alto1y3 ?? 0} onChange={(e) => {
                  const nuevovalor = parseFloat(e.target.value);
                  setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
                        p.id === producto.id
                          ? {
                              ...p,
                              paredes: {
                                ...(p.paredes || {}),
                                alto1y3: nuevovalor,
                              },
                            }
                          : p
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField 
              size="small"
              margin="dense" fullWidth label="Largo Techo" type="number" value={producto?.paredes?.largoTecho ?? 0} onChange={(e) => {
                    const nuevovalor = parseFloat(e.target.value);
                    setCosteo(prev => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        productos: prev.productos.map(p =>
                          p.id === producto.id
                            ? {
                                ...p,
                                paredes: {
                                  ...(p.paredes || {}),
                                  largoTecho: nuevovalor,
                                },
                              }
                            : p
                        ),
                      };
                    });
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }}
                />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField 
              size="small"
              margin="dense"fullWidth label="Alto Techo" type="number" value={producto?.paredes?.altoTecho ?? 0} onChange={(e) => {
                  const nuevovalor = parseFloat(e.target.value);
                  setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
                        p.id === producto.id
                          ? {
                              ...p,
                              paredes: {
                                ...(p.paredes || {}),
                                altoTecho: nuevovalor,
                              },
                            }
                          : p
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "var(--primary-color)" }}>
                Tipo de Marco
              </Typography>
                <Select
                  size="small"
                  margin="dense"
                  fullWidth
                  name="tipoMarco"
                  value={producto.paredes.tipoMarco || calcularTipoTabla(producto.peso??0,materiales)}
                  onChange={(e) => {
                    const nuevovalor = e.target.value;
                    setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
                        p.id === producto.id
                          ? {
                              ...p,
                              paredes: {
                                ...(p.paredes || {}),
                                tipoMarco: nuevovalor,
                              },
                            }
                          : p
                      ),
                    };
                  });
                    if (producto?.id) {
                      handleCalcularTotales(producto.id, setCosteo, materiales);
                    }
                  }}
                  displayEmpty
                >
                  <MenuItem value=""></MenuItem>
                  {tiposMateriales.Tablas.map((valor) => (
                    <MenuItem key={valor} value={valor}>
                      {valor}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
            
          
        </Box>
    </>
  );
};

export default ParedRow;
