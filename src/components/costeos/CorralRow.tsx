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
  CorralTopes,
  CorralGeneral,
  TipoCorral
} from '../../config/types';
import { calcularMedidaCorral, calcularTipoPolin, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const CorralRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {

  return (
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ gridColumn: 'span 3' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
                CORRAL
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 3' }}>
          <Select
            size="small" margin="dense"
            fullWidth
            name="tipoCorral"
            value={producto?.tipoCorral || ""} 
            onChange={(e) => {
              const nuevoTipoCorral = e.target.value as TipoCorral;

              setCosteo((prevPedido) => {
                if (!prevPedido) return prevPedido;

                return {
                  ...prevPedido,
                  productos: prevPedido.productos.map((prod) =>
                    prod.id === producto?.id
                      ? {
                          ...prod,
                          tipoCorral: nuevoTipoCorral,
                          corral: nuevoTipoCorral
                            ? [
                                nuevoTipoCorral === "Topes"
                                  ? {
                                      tipoCorral: "Topes",
                                      tipoPolin: calcularTipoPolin(prod.peso || 0,materiales),
                                      cantidad: 2, // Cantidad predeterminada, ajustar si es necesario
                                    }
                                  : {
                                      tipoCorral: nuevoTipoCorral as TipoCorral,
                                      tipoPolin: calcularTipoPolin(prod.peso || 0,materiales),
                                      medida: calcularMedidaCorral({ ...prod, tipoCorral: nuevoTipoCorral }),
                                    },
                              ]
                            : [], // Si el usuario borra la selección, el array queda vacío
                        }
                      : prod
                  ),
                };
              });
              if(producto?.id){
                handleCalcularTotales(producto.id, setCosteo, materiales);
              }
            }}
            displayEmpty
          >
            <MenuItem value="">Selecciona tipo de corral</MenuItem>
            {["Corrido", "Parcial Largo", "Parcial Ancho", "Topes"].map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </Select>
          </Box>
          {producto?.tipoCorral === "Corrido" && (
            <>
              <TextField
                size="small" margin="dense"
                fullWidth
                label="Medida Corrido"
                type="number"
                value={
                  producto?.corral?.length && producto?.corral[0]?.tipoCorral === "Corrido"
                    ? (producto.corral[0] as CorralGeneral).medida
                    : 2 * (producto?.anchoEmpaque ?? 0) + 2 * (producto?.largoEmpaque ?? 0)
                }
                onChange={(e) => {
                  const nuevaMedida = parseFloat(e.target.value) || 0;

                  if (producto?.id) {
                    setCosteo((prevPedido) => {
                      if (!prevPedido) return prevPedido;

                      return {
                        ...prevPedido,
                        productos: prevPedido.productos.map((prod) =>
                          prod.id === producto.id
                            ? {
                                ...prod,
                                corral: prod.corral.length
                                  ? prod.corral.map((corralItem, index) =>
                                      index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                    )
                                  : [{ tipoCorral: "Corrido", tipoPolin: calcularTipoPolin(prod.peso || 0,materiales), medida: nuevaMedida }],
                              }
                            : prod
                        ),
                      };
                    });
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }
                }}
              />
              <Select
                size="small" margin="dense"
                fullWidth
                value={producto?.corral?.[0]?.tipoPolin || ""}
                onChange={(e) => {
                  const nuevoTipoPolin = e.target.value;
                  setCosteo((prevPedido) => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map((prod) =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0 ? { ...corralItem, tipoPolin: nuevoTipoPolin } : corralItem
                                  )
                                : [{ tipoCorral: "Corrido", tipoPolin: nuevoTipoPolin, medida: calcularMedidaCorral(prod) }],
                            }
                          : prod
                      ),
                    };
                  });
                  if(producto.id){
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }                            
                }}
                displayEmpty
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map((valor) => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </Select>
              </>
            )}

            {producto?.tipoCorral === "Parcial Largo" && (
              <>
                <TextField
                  size="small" margin="dense"
                  fullWidth
                  label="Medida Parcial Largo"
                  type="number"
                  value={
                    producto?.corral?.length && producto?.corral[0]?.tipoCorral === "Parcial Largo"
                      ? (producto.corral[0] as CorralGeneral).medida
                      : 2 * (producto?.largoEmpaque ?? 0)
                  }
                  onChange={(e) => {
                    const nuevaMedida = parseFloat(e.target.value) || 0;
                    if (producto?.id) {
                      setCosteo((prevPedido) => {
                        if (!prevPedido) return prevPedido;
                        return {
                          ...prevPedido,
                          productos: prevPedido.productos.map((prod) =>
                            prod.id === producto.id
                              ? {
                                  ...prod,
                                  corral: prod.corral.length
                                    ? prod.corral.map((corralItem, index) =>
                                        index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                      )
                                    : [{ tipoCorral: "Parcial Largo", tipoPolin: calcularTipoPolin(prod.peso || 0,materiales), medida: nuevaMedida }],
                                }
                              : prod
                          ),
                        };
                      });
                      handleCalcularTotales(producto.id, setCosteo, materiales);
                    }
                  }}
                />
                <Select
                  size="small" margin="dense"
                  fullWidth
                  value={producto?.corral?.[0]?.tipoPolin || ""}
                  onChange={(e) => {
                    const nuevoTipoPolin = e.target.value;
                    setCosteo((prevPedido) => {
                      if (!prevPedido) return prevPedido;
                      return {
                        ...prevPedido,
                        productos: prevPedido.productos.map((prod) =>
                          prod.id === producto?.id
                            ? {
                                ...prod,
                                corral: prod.corral.length
                                  ? prod.corral.map((corralItem, index) =>
                                      index === 0 ? { ...corralItem, tipoPolin: nuevoTipoPolin } : corralItem
                                    )
                                  : [{ tipoCorral: "Parcial Largo", tipoPolin: nuevoTipoPolin, medida: calcularMedidaCorral(prod) }],
                              }
                            : prod
                        ),
                      };
                    });
                    if(producto.id){
                      handleCalcularTotales(producto.id, setCosteo, materiales);
                    }
                  }}
                  displayEmpty
                >
                  <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                  {tiposMateriales.Polines.map((valor) => (
                    <MenuItem key={valor} value={valor}>
                      {valor}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
            {producto?.tipoCorral === "Parcial Ancho" && (
              <>
              <TextField
                size="small" margin="dense"
                fullWidth
                label="Medida Parcial Ancho"
                type="number"
                value={
                  producto?.corral?.length && producto?.corral[0]?.tipoCorral === "Parcial Ancho"
                    ? (producto.corral[0] as CorralGeneral).medida
                    : 2 * (producto?.anchoEmpaque ?? 0)
                }
                onChange={(e) => {
                  const nuevaMedida = parseFloat(e.target.value) || 0;
                  if (producto?.id) {
                    setCosteo((prevPedido) => {
                      if (!prevPedido) return prevPedido;
                      return {
                        ...prevPedido,
                        productos: prevPedido.productos.map((prod) =>
                          prod.id === producto.id
                            ? {
                                ...prod,
                                corral: prod.corral.length
                                  ? prod.corral.map((corralItem, index) =>
                                      index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                    )
                                  : [{ tipoCorral: "Parcial Ancho", tipoPolin: calcularTipoPolin(prod.peso || 0,materiales), medida: nuevaMedida }],
                              }
                            : prod
                        ),
                      };
                    });
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }
                }}
              />
              <Select
                size="small" margin="dense"
                fullWidth
                value={producto?.corral?.[0]?.tipoPolin || ""}
                onChange={(e) => {
                  const nuevoTipoPolin = e.target.value;
                  setCosteo((prevPedido) => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map((prod) =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0 ? { ...corralItem, tipoPolin: nuevoTipoPolin } : corralItem
                                  )
                                : [{ tipoCorral: "Parcial Ancho", tipoPolin: nuevoTipoPolin, medida: calcularMedidaCorral(prod) }],
                            }
                          : prod
                      ),
                    };
                  });
                  if(producto.id){
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }
                }}
                displayEmpty
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map((valor) => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </Select>
              </>
            )}
            {producto?.tipoCorral === "Topes" && (
              <>
                <Box>
                  <TextField
                    fullWidth
                    label="Cantidad de Topes"
                    type="number"
                    size="small"
                    margin="dense"
                    value={
                      producto.corral?.[0]?.tipoCorral === "Topes"
                        ? (producto.corral[0] as CorralTopes).cantidad ?? 0
                        : 0
                    }
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                      setCosteo((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          productos: prev.productos.map((p) =>
                            p.id === producto.id
                              ? {
                                  ...p,
                                  corral: p.corral.map((c, i) =>
                                    c.tipoCorral === "Topes" && i === 0
                                      ? { ...c, cantidad: nuevaCantidad }
                                      : c
                                  ),
                                }
                              : p
                          ),
                        };
                      });
                      if(producto.id){
                        handleCalcularTotales(producto.id, setCosteo, materiales);
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Select
                    margin="dense"
                    fullWidth
                    size="small"
                    displayEmpty
                    value={
                      producto.corral?.[0]?.tipoCorral === "Topes"
                        ? (producto.corral[0] as CorralTopes).tipoPolin
                        : ""
                    }
                    onChange={(e) => {
                      const nuevoTipoPolin = e.target.value as string;
                      setCosteo((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          productos: prev.productos.map((p) =>
                            p.id === producto.id
                              ? {
                                  ...p,
                                  corral: p.corral.map((c, i) =>
                                    c.tipoCorral === "Topes" && i === 0
                                      ? { ...c, tipoPolin: nuevoTipoPolin }
                                      : c
                                  ),
                                }
                              : p
                          ),
                        };
                      });
                      if(producto.id){
                        handleCalcularTotales(producto.id, setCosteo, materiales);
                      }
                    }}
                  >
                    <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                    {tiposMateriales.Polines.map((polin) => (
                      <MenuItem key={polin} value={polin}>
                        {polin}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box />
              </>
            )}
        </Box>
  );
};

export default CorralRow;
