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
import {  MaterialSuc, Producto } from "../../config/types";
import { handleCalcularTotales, handleImporteChange } from "../../hooks/useFetchCosteo";
interface ModalBolsaAntihumedadProps {
  open: boolean;
  onClose: () => void;
  productoActivo: any; // Usa tu tipo Producto si lo tienes
  setPedidoActivo: React.Dispatch<React.SetStateAction<any>>;
  materiales:MaterialSuc[]
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
    // 1. Simula el evento para handleImporteChange
    const eventLike = {
      target: {
        name: "cantidadBolsa",
        value: productoActivo.bolsaAntihumedad?.cantidad ?? 0
      }
    } as React.ChangeEvent<HTMLInputElement>;

    handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);

    // 2. Luego recalcula totales (opcional: puedes dejar solo uno, el otro ya recalcula totales)
    handleCalcularTotales(productoActivo.id, setPedidoActivo, materiales);
  }
}, [
  productoActivo?.bolsaAntihumedad
]);


  return (
    <Dialog
        open={open}
        onClose={(_, reason) =>
          reason === 'backdropClick' ? undefined : onClose()
        }
        // desactivamos los anchos por defecto
        fullWidth={false}
        maxWidth={false}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            color: "white",
            backgroundColor: "var(--secondary-color)",
          }}
        >Cálculo de Bolsa Antihumedad</DialogTitle>
      <DialogContent>
        <Box mt={2} display="flex" flexDirection="row" gap={2} alignItems="center">
          <Box>
            <Typography variant="caption">LARGO</Typography>
            <TextField
              value={productoActivo?.largoEquipo ?? ""}
              type="number"
              size="small"
              fullWidth
            />
          </Box>
          <Box>
            <Typography variant="caption">ANCHO</Typography>
            <TextField
              value={productoActivo?.anchoEquipo ?? ""}
              type="number"
              size="small"
              fullWidth
            />
          </Box>
          <Box>
            <Typography variant="caption">ALTO</Typography>
            <TextField
              value={productoActivo?.altoEquipo ?? ""}
              type="number"
              size="small"
              fullWidth
            />
          </Box>
          <Box>
            <Typography variant="caption">PESO</Typography>
            <TextField
              value={productoActivo?.peso ?? ""}
              type="number"
              size="small"
              fullWidth
            />
          </Box>
        </Box>
            <Box mt={3}>
            <TableContainer component={Paper} sx={{ width: '100%', boxShadow: 'none', mt: 1 }}>
                <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                    <TableRow>
                    {/* BASE Y TECHO, abarca 3 celdas */}
                    <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', border: '1px solid #222', p: 0.5, background: '#e6ee9c' }}>
                        BASE Y TECHO
                    </TableCell>
                    {/* PAREDES, abarca 3 celdas */}
                    <TableCell align="center" colSpan={3} sx={{ fontWeight: 'bold', border: '1px solid #222', p: 0.5, background: '#a5d6a7' }}>
                        PAREDES
                    </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    {/* BASE Y TECHO */}
                    <TableCell
                        align="center"
                        sx={{
                            background: '#ffeb3b',
                            fontWeight: 'bold',
                            border: '1px solid #222',
                            p: 0.5,
                            width: 60,
                        }}
                        >
                        <TextField
                            value={productoActivo?.bolsaAntihumedad?.largobase ?? ''}
                            size="small"
                            type="number"
                            variant="standard"
                            InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0, width: 54 },
                            }}
                            sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#ffeb3b',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0 },
                            }}
                        />
                        </TableCell>

                        <TableCell
                        align="center"
                        sx={{
                            background: '#43a047',
                            color: 'white',
                            fontWeight: 'bold',
                            border: '1px solid #222',
                            p: 0.5,
                            width: 60,
                        }}
                        >
                        <TextField
                          value={productoActivo?.bolsaAntihumedad?.anchobase ?? ''}
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
                                    // los demás cálculos igual...
                                  },
                                };
                              }),
                            }));
                          }}
                          onBlur={e => {
                            let value = Number(e.target.value);

                            // --- Redondea al múltiplo más cercano de 20 o 30 mayor o igual a 20
                            // Solo acepta múltiplos de 20 o 30 (ejemplo: 20, 30, 40, 60, 120, etc)
                            // Puedes ajustar si solo quieres exacto 20 o exacto 30, o ambos.
                            const esMultiploValido = (n:number) => n % 20 === 0 || n % 30 === 0;
                            if (!esMultiploValido(value)) {
                              // Ajusta al múltiplo de 20 o 30 más cercano
                              let m20 = Math.round(value / 20) * 20;
                              let m30 = Math.round(value / 30) * 30;
                              // Elige el más cercano
                              value = Math.abs(m20 - value) < Math.abs(m30 - value) ? m20 : m30;
                            }
                            if (value < 20) value = 20;
                                   
                            setPedidoActivo((prev: any) => ({
                              ...prev,
                              productos: prev.productos.map((prod: Producto) => {
                                if (prod.id !== productoActivo.id) return prod;
                                 const nuevoIndiceBase = value - prod.anchoEquipo;
                                    const nuevoLargoBase = Number(prod.largoEquipo) + nuevoIndiceBase;
                                    const nuevaCantidadBase =(nuevoLargoBase * (value / 120) * 2) / 100;
                                    // OJO: usa los NUEVOS valores
                                    const nuevoLargoParedes = (nuevoLargoBase + value) * 2;
                                return {
                                  ...prod,
                                  bolsaAntihumedad: {
                                    ...prod.bolsaAntihumedad,
                                    anchobase: value,
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
                            InputProps={{
                            disableUnderline: true,
                            sx: {
                                textAlign: 'center',
                                fontWeight: 'bold',
                                bgcolor: '#43a047',
                                color: 'white',
                                p: 0,
                                width: 54,
                            },
                            }}
                            sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#43a047',
                            color: 'white',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#43a047', color: 'white', p: 0 },
                            }}
                        />
                        </TableCell>

                    <TableCell align="center" sx={{ background: '#cddc39', fontWeight: 'bold', border: '1px solid #222', p: 0.5, width: 60 }}>
                        <TextField
                            value={productoActivo?.bolsaAntihumedad?.indicebase ?? ''}
                            size="small"
                            type="number"
                            variant="standard"
                            InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0, width: 54 },
                            }}
                            sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#ffeb3b',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0 },
                            }}
                        />
                    </TableCell>
                    {/* PAREDES */}
                    <TableCell align="center" sx={{ background: '#ffeb3b', fontWeight: 'bold', border: '1px solid #222', p: 0.5, width: 60 }}>
                        <TextField
                            value={productoActivo!.bolsaAntihumedad?.largoparedes ?? ''}
                            size="small"
                            type="number"
                            variant="standard"
                            InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0, width: 54 },
                            }}
                            sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#ffeb3b',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0 },
                            }}
                        />
                    </TableCell>
                    <TableCell align="center" sx={{ background: '#43a047', color: 'white', fontWeight: 'bold', border: '1px solid #222', p: 0.5, width: 60 }}>
                        <TextField
                          value={productoActivo?.bolsaAntihumedad?.altoparedes ?? ''}
                          onChange={e => {
                            const nuevoAltoParedes = Number(e.target.value);

                            setPedidoActivo((prev: any) => ({
                              ...prev,
                              productos: prev.productos.map((prod: Producto) => {
                                if (prod.id !== productoActivo.id) return prod;

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
                                    cantidad: (nuevaCantidadParedes + (prod.bolsaAntihumedad?.cantidadBase || 0)) * 1.07,
                                  },
                                };
                              }),
                            }));

                            // handleImporteChange igual que antes
                            const eventLike = {
                              target: {
                                name: 'cantidadBolsa',
                                value: productoActivo.bolsaAntihumedad!.cantidad
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);
                          }}
                          onBlur={e => {
                            // Solo acepta múltiplos de 20 o 30
                            let value = Number(e.target.value);

                            function ajustarMultiplo20o30(n:number) {
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
                                    cantidad: (nuevaCantidadParedes + (prod.bolsaAntihumedad?.cantidadBase || 0)) * 1.07,
                                  },
                                };
                              }),
                            }));

                            // handleImporteChange igual que antes (opcional: lo puedes poner aquí también si quieres recalcular con el nuevo valor ajustado)
                            const eventLike = {
                              target: {
                                name: 'cantidadBolsa',
                                value: productoActivo.bolsaAntihumedad!.cantidad
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleImporteChange(eventLike, setPedidoActivo, materiales, productoActivo);
                          }}
                          size="small"
                          type="number"
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              textAlign: 'center',
                              fontWeight: 'bold',
                              bgcolor: '#43a047',
                              color: 'white',
                              p: 0,
                              width: 54,
                            },
                          }}
                          sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#43a047',
                            color: 'white',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#43a047', color: 'white', p: 0 },
                          }}
                        />

                    </TableCell>
                    <TableCell align="center" sx={{ background: '#cddc39', fontWeight: 'bold', border: '1px solid #222', p: 0.5, width: 60 }}>
                        <TextField
                            value={productoActivo?.bolsaAntihumedad?.indiceparedes ?? ''}
                            size="small"
                            type="number"
                            variant="standard"
                            InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0, width: 54 },
                            }}
                            sx={{
                            width: '54px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            bgcolor: '#ffeb3b',
                            p: 0,
                            '& input': { textAlign: 'center', fontWeight: 'bold', bgcolor: '#ffeb3b', p: 0 },
                            }}
                        />
                    </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            </Box>
            <Box mt={1} display="flex" alignItems="center">
                <Box sx={{ width: 180 /* 3 columnas de 60px */ }} />
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Cantidad base:
                        </Typography>
                        <TextField
                        value={productoActivo?.bolsaAntihumedad?.cantidadBase ?? ''}
                        size="small"
                        type="number"
                        variant="standard"
                        />
                </Box>
                <Box sx={{ width: 180 /* 3 columnas de 60px */ }} />
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Cantidad Paredes:
                        </Typography>
                        <TextField
                        value={productoActivo?.bolsaAntihumedad?.cantidadParedes?? ''}
                        size="small"
                        type="number"
                        variant="standard"
                        />
                </Box>
                <Box sx={{ width: 180 /* 3 columnas de 60px */ }} />
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Cantidad Bolsa:
                        </Typography>
                        <TextField
                        value={productoActivo?.bolsaAntihumedad?.cantidad?? ''}
                        size="small"
                        type="number"
                        variant="standard"
                        />
                </Box>
            </Box>

      </DialogContent>
    </Dialog>
  );
};

export default ModalBolsaAntihumedad;
