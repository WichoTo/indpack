import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Costeo,
  Producto,
  TaconCorrido,
  TaconPieza,
  TipoTacon,
  Tacon,
  Material
} from '../../config/types';
import { calcularTipoPolin, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface TaconEditorProps {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const TaconesRow: React.FC<TaconEditorProps> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {
    


  return (
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr '}} gap={2} mb={1} alignItems="center">
        <Box sx={{ gridColumn: 'span 3' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
            TACONES
        </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
        <FormControl fullWidth>
            <Select
            size="small" margin="dense"
            value={producto?.tipoTacon ?? ''}
            onChange={(e) => {
                const nuevoTipo = e.target.value as TipoTacon;
                if (!producto?.id) return;
                setCosteo((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    productos: prev.productos.map((prod) => {
                    if (prod.id !== producto.id) return prod;
                    if (nuevoTipo === 'Corrido') {
                        return {
                        ...prod,
                        tipoTacon: 'Corrido',
                        tacon: {
                            tipoCorral: 'Corrido',
                            tipoPolin: calcularTipoPolin(prod.peso ?? 0,materiales),
                            cantidad: 3,
                            medida: prod.anchoEmpaque,
                        } as TaconCorrido,
                        };
                    }

                    // Si es "Pieza" o vacío, reseteamos tacon
                    return {
                        ...prod,
                        tipoTacon: nuevoTipo,
                        tacon: {} as Tacon,
                    };
                    }),
                };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            displayEmpty
            >
            <MenuItem value="">Sin Tacones</MenuItem>
            <MenuItem value="Corrido">Tacon Corrido</MenuItem>
            <MenuItem value="Pieza">Tacon por Pieza</MenuItem>
            </Select>
        </FormControl>
        </Box>

        {/* Campos solo si es Corrido */}
        {producto?.tipoTacon === 'Corrido' && (
        <>
            {/* Cantidad */}
            <TextField
            fullWidth
            size="small" margin="dense"
            label="Cantidad Tacón Corrido"
            type="number"
            value={(producto.tacon as TaconCorrido).cantidad}
            onChange={(e) => {
                const nuevaCantidad = parseFloat(e.target.value) || 0;
                if (!producto.id) return;
                setCosteo((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    productos: prev.productos.map((prod) => {
                    if (prod.id !== producto.id) return prod;
                    return {
                        ...prod,
                        tacon: {
                        ...(prod.tacon as TaconCorrido),
                        cantidad: nuevaCantidad,
                        } as TaconCorrido,
                    };
                    }),
                };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            sx={{ mt: 2 }}
            />

            {/* Tipo de Polín */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="label-tipo-polin">Tipo de Polín</InputLabel>
            <Select
                size="small" margin="dense"
                labelId="label-tipo-polin"
                id="select-tipo-polin"
                label="Tipo de Polín"
                value={
                (producto.tacon as TaconCorrido).tipoPolin ||
                calcularTipoPolin(producto.peso ?? 0,materiales)
                }
                onChange={(e) => {
                const nuevoPolin = e.target.value;
                if (!producto.id) return;
                setCosteo((prev) => {
                    if (!prev) return prev;
                    return {
                    ...prev,
                    productos: prev.productos.map((prod) => {
                        if (prod.id !== producto.id) return prod;
                        return {
                        ...prod,
                        tacon: {
                            ...(prod.tacon as TaconCorrido),
                            tipoPolin: nuevoPolin,
                        } as TaconCorrido,
                        };
                    }),
                    };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
                displayEmpty
            >
                <MenuItem value="">Selecciona tipo</MenuItem>
                {tiposMateriales.Polines.map((valor) => (
                <MenuItem key={valor} value={valor}>
                    {valor}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            {/* Medida */}
            <TextField
            fullWidth
            size="small" margin="dense"
            label="Medida Tacón Corrido"
            type="number"
            InputLabelProps={{ shrink: true }}             
            value={(producto.tacon as TaconCorrido).medida ?? producto.anchoEmpaque}
            onChange={(e) => {
                const nuevaMedida = parseFloat(e.target.value) || 0;
                if (!producto.id) return;
                setCosteo((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    productos: prev.productos.map((prod) => {
                    if (prod.id !== producto.id) return prod;
                    return {
                        ...prod,
                        tacon: {
                        ...(prod.tacon as TaconCorrido),
                        medida: nuevaMedida,
                        } as TaconCorrido,
                    };
                    }),
                };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            sx={{ mt: 2 }}
            />
        </>
        )}
        {producto?.tipoTacon === 'Pieza' && (
        <>
            {/* Cantidad de Tacón Pieza */}
            <TextField
            size="small" margin="dense"
            fullWidth
            label="Cantidad Tacón Pieza"
            type="number"
            value={(producto.tacon as TaconPieza).cantidad}
            onChange={(e) => {
                const nuevaCantidad = parseFloat(e.target.value) || 0;
                if (!producto.id) return;
                setCosteo(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    productos: prev.productos.map(prod => {
                    if (prod.id !== producto.id) return prod;
                    return {
                        ...prod,
                        tacon: {
                        // Como TaconPieza sólo tiene tipoPolin & cantidad
                        ...(prod.tacon as TaconPieza),
                        cantidad: nuevaCantidad,
                        } as TaconPieza,
                    };
                    }),
                };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            sx={{ mt: 2 }}
            />

            {/* Tipo de Polín para Tacón Pieza */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="label-tipo-polin-pieza">
                Tipo de Polín
            </InputLabel>
            <Select
                size="small" margin="dense"
                labelId="label-tipo-polin-pieza"
                id="select-tipo-polin-pieza"
                label="Tipo de Polín"
                value={(producto.tacon as TaconPieza).tipoPolin || calcularTipoPolin(producto.peso??0,materiales)}
                onChange={(e) => {
                const nuevoPolin = e.target.value;
                if (!producto.id) return;
                setCosteo(prev => {
                    if (!prev) return prev;
                    return {
                    ...prev,
                    productos: prev.productos.map(prod => {
                        if (prod.id !== producto.id) return prod;
                        return {
                        ...prod,
                        tacon: {
                            ...(prod.tacon as TaconPieza),
                            tipoPolin: nuevoPolin,
                        } as TaconPieza,
                        };
                    }),
                    };
                });
                handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
                displayEmpty
            >
                <MenuItem value="">Selecciona tipo</MenuItem>
                {tiposMateriales.Polines.map(valor => (
                <MenuItem key={valor} value={valor}>
                    {valor}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
        </>
        )}



    </Box>
  );
};

export default TaconesRow;
