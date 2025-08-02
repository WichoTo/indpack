import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Paper,
  Divider,
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
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const tiposCorralArr = [
  { value: 'Corrido', label: 'Corrido' },
  { value: 'Parcial Largo', label: 'Parcial Largo' },
  { value: 'Parcial Ancho', label: 'Parcial Ancho' },
  { value: 'Topes', label: 'Topes' }
];

const CorralRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {

  // Helpers para renderizar cada tipo de corral
  const renderCamposCorral = () => {
    switch (producto?.tipoCorral) {
      case "Corrido":
        return (
          <>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Medida Corrido"
              type="number"
              value={
                producto?.corral?.[0]?.tipoCorral === "Corrido"
                  ? (producto.corral[0] as CorralGeneral).medida
                  : 2 * (producto?.anchoEmpaque ?? 0) + 2 * (producto?.largoEmpaque ?? 0)
              }
              onChange={e => {
                const nuevaMedida = parseFloat(e.target.value) || 0;
                if (producto?.id) {
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                  )
                                : [{
                                    tipoCorral: "Corrido",
                                    tipoPolin: calcularTipoPolin(prod.peso || 0, materiales),
                                    medida: nuevaMedida
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }
              }}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Tipo Polín</InputLabel>
              <Select
                value={producto?.corral?.[0]?.tipoPolin || ""}
                label="Tipo Polín"
                onChange={e => {
                  const nuevoTipoPolin = e.target.value;
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0
                                      ? { ...corralItem, tipoPolin: nuevoTipoPolin }
                                      : corralItem
                                  )
                                : [{
                                    tipoCorral: "Corrido",
                                    tipoPolin: nuevoTipoPolin,
                                    medida: calcularMedidaCorral(prod)
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
                displayEmpty
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map(valor => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Parcial Largo":
        return (
          <>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Medida Parcial Largo"
              type="number"
              value={
                producto?.corral?.[0]?.tipoCorral === "Parcial Largo"
                  ? (producto.corral[0] as CorralGeneral).medida
                  : 2 * (producto?.largoEmpaque ?? 0)
              }
              onChange={e => {
                const nuevaMedida = parseFloat(e.target.value) || 0;
                if (producto?.id) {
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                  )
                                : [{
                                    tipoCorral: "Parcial Largo",
                                    tipoPolin: calcularTipoPolin(prod.peso || 0, materiales),
                                    medida: nuevaMedida
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }
              }}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Tipo Polín</InputLabel>
              <Select
                value={producto?.corral?.[0]?.tipoPolin || ""}
                label="Tipo Polín"
                onChange={e => {
                  const nuevoTipoPolin = e.target.value;
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0
                                      ? { ...corralItem, tipoPolin: nuevoTipoPolin }
                                      : corralItem
                                  )
                                : [{
                                    tipoCorral: "Parcial Largo",
                                    tipoPolin: nuevoTipoPolin,
                                    medida: calcularMedidaCorral(prod)
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
                displayEmpty
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map(valor => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Parcial Ancho":
        return (
          <>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Medida Parcial Ancho"
              type="number"
              value={
                producto?.corral?.[0]?.tipoCorral === "Parcial Ancho"
                  ? (producto.corral[0] as CorralGeneral).medida
                  : 2 * (producto?.anchoEmpaque ?? 0)
              }
              onChange={e => {
                const nuevaMedida = parseFloat(e.target.value) || 0;
                if (producto?.id) {
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0 ? { ...corralItem, medida: nuevaMedida } : corralItem
                                  )
                                : [{
                                    tipoCorral: "Parcial Ancho",
                                    tipoPolin: calcularTipoPolin(prod.peso || 0, materiales),
                                    medida: nuevaMedida
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }
              }}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Tipo Polín</InputLabel>
              <Select
                value={producto?.corral?.[0]?.tipoPolin || ""}
                label="Tipo Polín"
                onChange={e => {
                  const nuevoTipoPolin = e.target.value;
                  setCosteo(prevPedido => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map(prod =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              corral: prod.corral.length
                                ? prod.corral.map((corralItem, index) =>
                                    index === 0
                                      ? { ...corralItem, tipoPolin: nuevoTipoPolin }
                                      : corralItem
                                  )
                                : [{
                                    tipoCorral: "Parcial Ancho",
                                    tipoPolin: nuevoTipoPolin,
                                    medida: calcularMedidaCorral(prod)
                                  }],
                            }
                          : prod
                      ),
                    };
                  });
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
                displayEmpty
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map(valor => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Topes":
        return (
          <>
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
              onChange={e => {
                const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                setCosteo(prev => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    productos: prev.productos.map(p =>
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
                handleCalcularTotales(producto.id, setCosteo, materiales);
              }}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Tipo Polín</InputLabel>
              <Select
                value={
                  producto.corral?.[0]?.tipoCorral === "Topes"
                    ? (producto.corral[0] as CorralTopes).tipoPolin
                    : ""
                }
                label="Tipo Polín"
                displayEmpty
                onChange={e => {
                  const nuevoTipoPolin = e.target.value as string;
                  setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      productos: prev.productos.map(p =>
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
                  handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              >
                <MenuItem value="">Selecciona un tipo de polín</MenuItem>
                {tiposMateriales.Polines.map(polin => (
                  <MenuItem key={polin} value={polin}>
                    {polin}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#f6f8fa",
        borderLeft: "4px solid var(--primary-color)",
      }}
    >
      <Typography variant="h6" fontWeight={800} color="var(--primary-color)" mb={1}>
        Corral
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Tipo de Corral (siempre visible) */}
      <FormControl fullWidth size="small" margin="dense" sx={{ mb: 2 }}>
        <InputLabel>Tipo de Corral</InputLabel>
        <Select
          value={producto?.tipoCorral || ""}
          label="Tipo de Corral"
          onChange={e => {
            const nuevoTipoCorral = e.target.value as TipoCorral;
            setCosteo(prevPedido => {
              if (!prevPedido) return prevPedido;
              return {
                ...prevPedido,
                productos: prevPedido.productos.map(prod =>
                  prod.id === producto?.id
                    ? {
                        ...prod,
                        tipoCorral: nuevoTipoCorral,
                        corral: nuevoTipoCorral
                          ? [
                              nuevoTipoCorral === "Topes"
                                ? {
                                    tipoCorral: "Topes",
                                    tipoPolin: calcularTipoPolin(prod.peso || 0, materiales),
                                    cantidad: 2,
                                  }
                                : {
                                    tipoCorral: nuevoTipoCorral as TipoCorral,
                                    tipoPolin: calcularTipoPolin(prod.peso || 0, materiales),
                                    medida: calcularMedidaCorral({ ...prod, tipoCorral: nuevoTipoCorral }),
                                  },
                            ]
                          : [],
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
          <MenuItem value="-">Sin Corral</MenuItem>
          {tiposCorralArr.map(tc => (
            <MenuItem key={tc.value} value={tc.value}>
              {tc.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Campos dependientes (según tipo de corral) */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: producto.tipoCorral === "Topes" ? "1fr 1fr" : "1fr 1fr",
        }}
        gap={2}
      >
        {renderCamposCorral()}
      </Box>
    </Paper>
  );
};

export default CorralRow;
