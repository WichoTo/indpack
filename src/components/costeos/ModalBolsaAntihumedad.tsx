import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { MaterialSuc, Producto } from "../../config/types";
import { handleCalcularTotales, handleImporteChange } from "../../hooks/useFetchCosteo";

interface ModalBolsaAntihumedadProps {
  open: boolean;
  onClose: () => void;
  productoActivo: any;
  setPedidoActivo: React.Dispatch<React.SetStateAction<any>>;
  materiales: MaterialSuc[];
}

const ModalBolsaAntihumedad: React.FC<ModalBolsaAntihumedadProps> = ({
  open,
  onClose,
  productoActivo,
  setPedidoActivo,
  materiales
}) => {
  useEffect(() => {
    if (productoActivo?.id) {
      const eventLike = {
        target: {
          name: "bolsaAntihumedad.cantidad",
          value: productoActivo.bolsaAntihumedad?.cantidad ?? 0
        }
      } as React.ChangeEvent<HTMLInputElement>;

      handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);
      handleCalcularTotales(productoActivo.id, setPedidoActivo, materiales);
    }
    // eslint-disable-next-line
  }, [
    productoActivo?.bolsaAntihumedad
  ])

  // --- Colores para una mejor visual
  const fondoBase = "#fffde7";   // amarillo suave
  const fondoVerde = "#e8f5e9";  // verde claro
  const inputReadOnly = {
    bgcolor: "#f5f5f5",
    fontWeight: "bold",
    borderRadius: 1,
    "& input": { textAlign: "center", fontWeight: "bold", bgcolor: "#f5f5f5" }
  };
  const inputEditable = {
    bgcolor: "#fff",
    fontWeight: "bold",
    borderRadius: 1,
    "& input": { textAlign: "center", fontWeight: "bold", bgcolor: "#fff" }
  };

  // --- Helpers para respetar el 0 (no usar ||)
  const safeValue = (val: any) => (val === undefined || val === null) ? '' : val;

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => (reason === 'backdropClick' ? undefined : onClose())}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 10 }}>
        <IconButton color="primary" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle
        sx={{
          color: "#fff",
          backgroundColor: "var(--secondary-color, #263238)",
          fontWeight: "bold",
          fontSize: 22,
          pb: 1.2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        Cálculo de Bolsa Antihumedad
        <Typography fontSize={13} fontWeight={400} color="white">
          Ajusta sólo las celdas verdes para recalcular.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5, pb: 2, background: "#fafbfc" }}>
        {/* Dimensiones generales */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary">LARGO</Typography>
            <TextField
              value={safeValue(productoActivo?.largoEquipo)}
              type="number"
              size="small"
              fullWidth
              InputProps={{ readOnly: true, sx: inputReadOnly }}
            />
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary">ANCHO</Typography>
            <TextField
              value={safeValue(productoActivo?.anchoEquipo)}
              type="number"
              size="small"
              fullWidth
              InputProps={{ readOnly: true, sx: inputReadOnly }}
            />
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary">ALTO</Typography>
            <TextField
              value={safeValue(productoActivo?.altoEquipo)}
              type="number"
              size="small"
              fullWidth
              InputProps={{ readOnly: true, sx: inputReadOnly }}
            />
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary">PESO</Typography>
            <TextField
              value={safeValue(productoActivo?.peso)}
              type="number"
              size="small"
              fullWidth
              InputProps={{ readOnly: true, sx: inputReadOnly }}
            />
          </Box>
        </Box>

        {/* Tabla de cálculo */}
        <Box mt={1.5}>
          <TableContainer component={Paper} elevation={0} sx={{ width: '100%', boxShadow: 'none', borderRadius: 2, background: "#fff" }}>
            <Table size="small" sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  {/* BASE Y TECHO */}
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', border: 0, bgcolor: fondoBase, fontSize: 15 }}>
                    BASE Y TECHO
                  </TableCell>
                  {/* PAREDES */}
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', border: 0, bgcolor: fondoVerde, fontSize: 15 }}>
                    PAREDES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* BASE Y TECHO */}
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.largobase)}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.anchobase)}
                      onChange={e => {
                        const value = Number(e.target.value);
                        setPedidoActivo((prev: any) => ({
                          ...prev,
                          productos: prev.productos.map((prod: Producto) => {
                            if (prod.id !== productoActivo.id) return prod;
                            return {
                              ...prod,
                              bolsaAntihumedad: {
                                ...prod.bolsaAntihumedad,
                                anchobase: value,
                              },
                            };
                          }),
                        }));
                      }}
                      onBlur={e => {
                        let value = Number(e.target.value);
                        const esMultiploValido = (n: number) => n % 20 === 0 || n % 30 === 0;
                        if (!esMultiploValido(value)) {
                          let m20 = Math.round(value / 20) * 20;
                          let m30 = Math.round(value / 30) * 30;
                          value = Math.abs(m20 - value) < Math.abs(m30 - value) ? m20 : m30;
                        }
                        //if (value < 20) value = 0;
                        setPedidoActivo((prev: any) => ({
                          ...prev,
                          productos: prev.productos.map((prod: Producto) => {
                            if (prod.id !== productoActivo.id) return prod;
                            // --- Aquí el 0 sí se respeta
                            const anchobase = value;
                            const nuevoIndiceBase = anchobase - (prod.anchoEquipo ?? 0);
                            const nuevoLargoBase = (prod.largoEquipo ?? 0) + nuevoIndiceBase;
                            const nuevaCantidadBase = (nuevoLargoBase * (anchobase / 120) * 2) / 100;
                            const nuevoLargoParedes = (nuevoLargoBase + anchobase) * 2;
                            return {
                              ...prod,
                              bolsaAntihumedad: {
                                ...prod.bolsaAntihumedad,
                                anchobase: anchobase,
                                indicebase: nuevoIndiceBase,
                                largobase: nuevoLargoBase,
                                cantidadBase: nuevaCantidadBase,
                                largoparedes: nuevoLargoParedes,
                              },
                            };
                          }),
                        }));
                      }}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ disableUnderline: true, sx: inputEditable }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.indicebase)}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                  {/* PAREDES */}
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.largoparedes)}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.altoparedes)}
                      onChange={e => {
                        const nuevoAltoParedes = Number(e.target.value);
                        setPedidoActivo((prev: any) => ({
                          ...prev,
                          productos: prev.productos.map((prod: Producto) => {
                            if (prod.id !== productoActivo.id) return prod;
                            // Aquí respetamos el 0
                            const anchobase = prod.bolsaAntihumedad?.anchobase ?? 0;
                            const largobase = prod.bolsaAntihumedad?.largobase ?? 0;
                            const indicebase = prod.bolsaAntihumedad?.indicebase ?? 0;
                            const altoEquipo = prod.altoEquipo ?? 0;
                            const nuevoIndiceParedes = nuevoAltoParedes + indicebase - altoEquipo;
                            const nuevaCantidadParedes =
                              ((largobase + anchobase) * 2 * (nuevoAltoParedes / 120)) / 100;
                            return {
                              ...prod,
                              bolsaAntihumedad: {
                                ...prod.bolsaAntihumedad,
                                altoparedes: nuevoAltoParedes,
                                indiceparedes: nuevoIndiceParedes,
                                cantidadParedes: nuevaCantidadParedes,
                                cantidad: (nuevaCantidadParedes + (prod.bolsaAntihumedad?.cantidadBase ?? 0)) * 1.07,
                              },
                            };
                          }),
                        }));
                        const eventLike = {
                          target: {
                            name: 'bolsaAntihumedad.cantidad',
                            value: productoActivo.bolsaAntihumedad?.cantidad ?? 0
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);
                      }}
                      onBlur={e => {
                        let value = Number(e.target.value);
                        function ajustarMultiplo20o30(n: number) {
                          if (n < 20) return 20;
                          if (n % 20 === 0 || n % 30 === 0) return n;
                          const m20 = Math.round(n / 20) * 20;
                          const m30 = Math.round(n / 30) * 30;
                          return Math.abs(m20 - n) < Math.abs(m30 - n) ? m20 : m30;
                        }
                        value = ajustarMultiplo20o30(value);
                        setPedidoActivo((prev: any) => ({
                          ...prev,
                          productos: prev.productos.map((prod: Producto) => {
                            if (prod.id !== productoActivo.id) return prod;
                            const anchobase = prod.bolsaAntihumedad?.anchobase ?? 0;
                            const largobase = prod.bolsaAntihumedad?.largobase ?? 0;
                            const indicebase = prod.bolsaAntihumedad?.indicebase ?? 0;
                            const altoEquipo = prod.altoEquipo ?? 0;
                            const nuevoIndiceParedes = value + indicebase - altoEquipo;
                            const nuevaCantidadParedes =
                              ((largobase + anchobase) * 2 * (value / 120)) / 100;
                            return {
                              ...prod,
                              bolsaAntihumedad: {
                                ...prod.bolsaAntihumedad,
                                altoparedes: value,
                                indiceparedes: nuevoIndiceParedes,
                                cantidadParedes: nuevaCantidadParedes,
                                cantidad: (nuevaCantidadParedes + (prod.bolsaAntihumedad?.cantidadBase ?? 0)) * 1.07,
                              },
                            };
                          }),
                        }));
                        const eventLike = {
                          target: {
                            name: 'bolsaAntihumedad.cantidad',
                            value: productoActivo.bolsaAntihumedad?.cantidad ?? 0
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);
                      }}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ disableUnderline: true, sx: inputEditable }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: 0 }}>
                    <TextField
                      value={safeValue(productoActivo?.bolsaAntihumedad?.indiceparedes)}
                      size="small"
                      type="number"
                      variant="standard"
                      InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
                      sx={{ width: 58 }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Totales finales */}
        <Box mt={2} display="flex" gap={2} alignItems="center" justifyContent="center" flexWrap="wrap">
          <Paper elevation={0} sx={{
            bgcolor: fondoBase, px: 2, py: 1, borderRadius: 2, minWidth: 170, textAlign: "center"
          }}>
            <Typography variant="body2" fontWeight={700}>Cantidad base</Typography>
            <TextField
              value={safeValue(productoActivo?.bolsaAntihumedad?.cantidadBase)}
              size="small"
              type="number"
              variant="standard"
              InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
            />
          </Paper>
          <Paper elevation={0} sx={{
            bgcolor: fondoVerde, px: 2, py: 1, borderRadius: 2, minWidth: 170, textAlign: "center"
          }}>
            <Typography variant="body2" fontWeight={700}>Cantidad Paredes</Typography>
            <TextField
              value={safeValue(productoActivo?.bolsaAntihumedad?.cantidadParedes)}
              size="small"
              type="number"
              variant="standard"
              InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
            />
          </Paper>
          <Paper elevation={0} sx={{
            bgcolor: "#bbdefb", px: 2, py: 1, borderRadius: 2, minWidth: 170, textAlign: "center"
          }}>
            <Typography variant="body2" fontWeight={900} color="primary">
              Cantidad Bolsa
            </Typography>
            <TextField
              value={safeValue(productoActivo?.bolsaAntihumedad?.cantidad)}
              size="small"
              type="number"
              variant="standard"
              InputProps={{ readOnly: true, disableUnderline: true, sx: inputReadOnly }}
            />
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBolsaAntihumedad;
