import React, { useState } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Box,
  Tooltip,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';
import { Totales, Producto, Costeo, MaterialSuc, BolsaAntihumedad } from '../../config/types';
import { handleImporteChange, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import ModalBolsaAntihumedad from './ModalBolsaAntihumedad';

interface TotalesTableProps {
  totales: Totales[];
  materiales: MaterialSuc[];
  producto: Producto;
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>;
}

export const TotalesTable: React.FC<TotalesTableProps> = ({
  totales,
  materiales,
  producto,
  setPedidoActivo,
}) => {
  const [modalBolsaOpen, setModalBolsaOpen] = useState(false);

  const mapeoExtras: Record<string, string> = {
    'DESEC.':           'cantidadDesec',
    'S.GOLPE':          'cantidadSGolpe',
    'S.POS.':           'cantidadSPOS',
    'SEÑAL':            'cantidadSENAL',
    'BolsaAntihumedad': 'cantidadBolsa',
    'Termo':            'cantidadTermo',
  };
  const mapeoPrecioExtras: Record<string, string> = {
  'DESEC.':           'precioDesec',
  'S.GOLPE':          'precioSGolpe',
  'S.POS.':           'precioSPOS',
  'SEÑAL':            'precioSENAL',
  'BolsaAntihumedad': 'precioBolsa',
  'Termo':            'precioTermo',
};
const mapeoImporteExtras: Record<string, string> = {
  'DESEC.':           'importeDesec',
  'S.GOLPE':          'importeSGolpe',
  'S.POS.':           'importeSPOS',
  'SEÑAL':            'importeSENAL',
  'BolsaAntihumedad': 'bolsaAntihumedad.importeTotal',
  'Termo':            'importeTermo',
};

  // --- Acciones
  const actualizarPreciosTotales = () => {
    setPedidoActivo(prev => {
      if (!prev) return prev;
      // ... igual a tu lógica actual ...
      // (omito por espacio, sólo copiar tu función)
      return prev; // solo para compilar, cambia por tu lógica real
    });
    handleCalcularTotales(producto.id, setPedidoActivo, materiales);
  };

  // --- Render
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--primary-color)' }}>
          Totales por Material
        </Typography>
        <Tooltip title="Actualizar precios de materiales según catálogo actual">
          <Button
            onClick={actualizarPreciosTotales}
            variant="contained"
            startIcon={<UpdateIcon />}
            sx={{ fontWeight: 700, borderRadius: 2, ml: 2 }}
            color="secondary"
          >
            Actualizar Precios
          </Button>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--secondary-color-light)" }}>
              <TableCell sx={{ width: 180, fontWeight: 700 }}>Material/Extra</TableCell>
              <TableCell align="right" sx={{ width: 120, fontWeight: 700 }}>Cantidad / Medida</TableCell>
              <TableCell align="right" sx={{ width: 120, fontWeight: 700 }}>Precio Unitario</TableCell>
              <TableCell align="right" sx={{ width: 120, fontWeight: 700 }}>Costo Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totales.map((total, idx) => {
              const campoCantidad = mapeoExtras[total.tipo];
              const esExtra = Boolean(campoCantidad);
              const esDesec = total.tipo === 'DESEC.';
              const esBolsa = total.tipo === 'BolsaAntihumedad';
              const esTermo = total.tipo === 'Termo';

              if ((esBolsa && producto.bantihumedad !== 'Si') ||
                  (esTermo && producto.termo !== 'Si')) return null;

              // Para cantidad automática DESEC.
              const largo = (producto.largoEmpaque || 0) / 100;
              const alto = (producto.altoEmpaque || 0) / 100;
              const ancho = (producto.anchoEmpaque || 0) / 100;
              const volumen = largo * alto * ancho;
              const cantidadDesecAuto = Math.round(volumen+ 1) ;
              const medidaFormateada = (total.medida ?? 0).toFixed(2);

              return (
                <TableRow
                  key={idx}
                  sx={{
                    backgroundColor: esBolsa ? "rgba(77, 208, 225, 0.10)" : esExtra ? "rgba(253, 216, 53, 0.08)" : "inherit"
                  }}
                >
                  {/* Columna: Tipo de material */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {total.tipo}
                      {esBolsa && (
                        <Tooltip title="Editar detalles de bolsa antihumedad">
                          <IconButton size="small" color="primary" onClick={() => setModalBolsaOpen(true)}>
                            <EditNoteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  {/* Columna: Cantidad/Medida */}
                  <TableCell align="right">
                    {esBolsa ? (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ readOnly: true }}
                        value={producto.bolsaAntihumedad?.cantidad ?? 0}
                        onClick={() => setModalBolsaOpen(true)}
                        sx={{ width: 90, bgcolor: "#e3f2fd", cursor: "pointer" }}
                        title="Click para editar cálculo de bolsa"
                      />
                    ) : esDesec ? (
                      <Tooltip title="Cantidad automática calculada según volumen. Puedes editar manualmente.">
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                          value={producto.cantidadDesec ?? cantidadDesecAuto}
                          onChange={e => {
                            const raw = e.target.value;
                            const nuevaCant = raw === '' ? cantidadDesecAuto : parseInt(raw, 10);
                            setPedidoActivo(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                productos: prev.productos.map(p => {
                                  if (p.id !== producto.id) return p;
                                  const precioUnit = p.precioDesec ?? 0;
                                  return {
                                    ...p,
                                    cantidadDesec: nuevaCant,
                                    automaticoDesec: raw === '',
                                    importeDesec: Math.round(precioUnit * nuevaCant * 100) / 100,
                                  };
                                })
                              };
                            });
                            handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                          }}
                          sx={{ width: 90 }}
                        />
                      </Tooltip>
                    ) : esExtra ? (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: 1 }}
                         value={producto[mapeoExtras[total.tipo]] ?? ""}
                         name={mapeoExtras[total.tipo]}

                        onChange={e => {
                          handleImporteChange(e, setPedidoActivo, materiales, producto);
                          handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                        }}
                        sx={{ width: 90 }}
                      />
                    ) : (
                      <Typography align="right" sx={{ fontWeight: 500 }}>{medidaFormateada}</Typography>
                    )}
                  </TableCell>

                  {/* Columna: Precio Unitario */}
                  <TableCell align="right">
                    {esBolsa ? (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: '0.01' }}
                        value={producto.bolsaAntihumedad?.precioUnitario ?? 0}
                        onChange={e => {
                              const nuevoPrecio = parseFloat(e.target.value) || 0;
                              setPedidoActivo(prev => ({
                                ...prev,
                                productos: prev.productos.map(p => {
                                  if (p.id !== producto.id) return p;

                                  // Garantiza que hay bolsa y todos los campos existen
                                  const safeBolsa: BolsaAntihumedad = {
                                    cantidad:           p.bolsaAntihumedad?.cantidad           ?? 0,
                                    cantidadBase:       p.bolsaAntihumedad?.cantidadBase       ?? 0,
                                    cantidadParedes:    p.bolsaAntihumedad?.cantidadParedes    ?? 0,
                                    largobase:          p.bolsaAntihumedad?.largobase          ?? 0,
                                    anchobase:          p.bolsaAntihumedad?.anchobase          ?? 0,
                                    indicebase:         p.bolsaAntihumedad?.indicebase         ?? 0,
                                    largoparedes:       p.bolsaAntihumedad?.largoparedes       ?? 0,
                                    altoparedes:        p.bolsaAntihumedad?.altoparedes        ?? 0,
                                    indiceparedes:      p.bolsaAntihumedad?.indiceparedes      ?? 0,
                                    precioUnitario:     nuevoPrecio,
                                    importeTotal:       nuevoPrecio * (p.bolsaAntihumedad?.cantidad ?? 0),
                                  };

                                  return {
                                    ...p,
                                    bolsaAntihumedad: safeBolsa,
                                  };
                                }),
                              }));
                            }}

                        sx={{ width: 90, bgcolor: "#e3f2fd", cursor: "pointer" }}
                      />
                    ) :esExtra ? (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: '0.01' }}
                        value={producto[mapeoPrecioExtras[total.tipo]] ?? total.precioUnitario}
                        onChange={e => {
                          const precioCampo = mapeoPrecioExtras[total.tipo];
                          setPedidoActivo(prev => ({
                            ...prev,
                            productos: prev.productos.map(p => {
                              if (p.id !== producto.id) return p;
                              const updated: Producto = { ...p };
                              updated[precioCampo] = parseFloat(e.target.value) || 0;
                              // Recalcula el importe según la cantidad actual
                              const cantidad = updated[mapeoExtras[total.tipo]] ?? 0;
                              const precio = updated[precioCampo] ?? 0;
                              const importeCampo =
                                total.tipo === 'DESEC.' ? 'importeDesec'
                                : total.tipo === 'S.GOLPE' ? 'importeSGolpe'
                                : total.tipo === 'S.POS.' ? 'importeSPOS'
                                : total.tipo === 'SEÑAL' ? 'importeSENAL'
                                : undefined;
                              if (importeCampo) {
                                updated[importeCampo] = cantidad * precio;
                              }
                              return updated;
                            }),
                          }));
                          handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                        }}
                        sx={{ width: 90 }}
                      />
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: '0.01' }}
                        value={total.precioUnitario}
                        onChange={e => {
                          // Tu lógica original para materiales normales
                          const nuevoPrecio = parseFloat(e.target.value) || 0;
                          setPedidoActivo(prev => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              productos: prev.productos.map(p => {
                                if (p.id !== producto.id) return p;
                                const totalesActualizados = p.totales.map(t => {
                                  if (t.tipo !== total.tipo) return t;
                                  const factor = t.medida && t.medida > 0 ? t.medida : t.cantidad!;
                                  return {
                                    ...t,
                                    precioUnitario: nuevoPrecio,
                                    precioTotal: Math.round(nuevoPrecio * factor * 100) / 100,
                                  };
                                });
                                return {
                                  ...p,
                                  totales: totalesActualizados,
                                };
                              }),
                            };
                          });
                          handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                        }}
                        sx={{ width: 90 }}
                      />
                    )}
                  </TableCell>

                  {/* Columna: Total */}
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {esBolsa
                      ? formatoMoneda(producto.bolsaAntihumedad?.importeTotal ?? 0)
                      : esTermo
                      ? formatoMoneda(producto.importeTermo ?? 0)
                      : esDesec
                      ? formatoMoneda(producto.importeDesec ?? 0)
                      : esExtra
                      ? formatoMoneda(producto[mapeoImporteExtras[total.tipo]] ?? 0)
                      : formatoMoneda(total.precioTotal)}
                  </TableCell>


                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalBolsaAntihumedad
        open={modalBolsaOpen}
        onClose={() => setModalBolsaOpen(false)}
        productoActivo={producto}
        setPedidoActivo={setPedidoActivo}
        materiales={materiales}
      />
    </Box>
  );
};
