import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Costeo,
  Producto,
  TaconCorrido,
  TaconPieza,
  TipoTacon,
  Tacon
} from '../../config/types';

import { calcularTipoPolinAbajoPorPeso, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface TaconesRowProps {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: any[];
  tiposMateriales: Record<string, string[]>;
}

const TaconesRow: React.FC<TaconesRowProps> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {
  const theme = useTheme();

  const onTipoChange = (nuevoTipo: TipoTacon) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(p => {
          if (p.id !== producto.id) return p;
          if (nuevoTipo === 'Corrido') {
            const tipoPolin = calcularTipoPolinAbajoPorPeso(
              producto.peso ?? 0,
              producto.largoEmpaque,
              materiales,
              !!producto.polinesFijacion?.length
            );
            return {
              ...p,
              tipoTacon: 'Corrido',
              tacon: {
                tipoCorral: 'Corrido',
                tipoPolin,
                cantidad: 3,
                medida: p.anchoEmpaque
              } as TaconCorrido
            };
          }
          if (nuevoTipo === 'Pieza') {
            const tipoPolin = calcularTipoPolinAbajoPorPeso(
              producto.peso ?? 0,
              producto.largoEmpaque,
              materiales,
              !!producto.polinesFijacion?.length
            );
            return {
              ...p,
              tipoTacon: 'Pieza',
              tacon: {
                tipoPolin,
                cantidad: 0
              } as TaconPieza
            };
          }
          return { ...p, tipoTacon: '', tacon: {} as Tacon };
        })
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  const onCantidadChange = (valor: number) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(p => {
          if (p.id !== producto.id) return p;
          const t = { ...(p.tacon as any) };
          t.cantidad = valor;
          return { ...p, tacon: t };
        })
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  const onTipoPolinChange = (valor: string) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(p => {
          if (p.id !== producto.id) return p;
          const t = { ...(p.tacon as any) };
          t.tipoPolin = valor;
          return { ...p, tacon: t };
        })
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  const onMedidaChange = (valor: number) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(p => {
          if (p.id !== producto.id) return p;
          const t = { ...(p.tacon as any) };
          t.medida = valor;
          return { ...p, tacon: t };
        })
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#f6f8fa",
        borderLeft: `5px solid ${theme.palette.primary.main}`,
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" fontWeight={900} color="var(--primary-color)">
          Tacones
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1.5 }} />
      </Box>

      {/* Fila 1: Tipo Tacón SIEMPRE arriba */}
      <Box display="grid" gridTemplateColumns="1fr" mb={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="label-tipo-tacon">Tipo de Tacón</InputLabel>
          <Select
            labelId="label-tipo-tacon"
            value={producto.tipoTacon || ''}
            label="Tipo de Tacón"
            onChange={e => onTipoChange(e.target.value as TipoTacon)}
          >
            <MenuItem value="">Sin Tacones</MenuItem>
            <MenuItem value="Corrido">Tacón Corrido</MenuItem>
            <MenuItem value="Pieza">Tacón por Pieza</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Fila 2: Campos dependientes */}
      {producto.tipoTacon && (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: producto.tipoTacon === "Corrido" ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          }}
          gap={2}
          alignItems="center"
        >
          {/* Cantidad */}
          <TextField
            fullWidth
            size="small"
            label="Cantidad"
            type="number"
            value={
              producto.tipoTacon === "Corrido"
                ? (producto.tacon as TaconCorrido).cantidad ?? ""
                : (producto.tacon as TaconPieza).cantidad ?? ""
            }
            onChange={e => onCantidadChange(Number(e.target.value) || 0)}
            inputProps={{ min: 0 }}
          />
          {/* Tipo Polin */}
          <FormControl fullWidth size="small">
            <InputLabel id="label-polin">
              {producto.tipoTacon === "Corrido" ? "Tipo Polín" : "Tipo Polín"}
            </InputLabel>
            <Select
              labelId="label-polin"
              value={
                producto.tipoTacon === "Corrido"
                  ? (producto.tacon as TaconCorrido).tipoPolin ?? ""
                  : (producto.tacon as TaconPieza).tipoPolin ?? ""
              }
              label="Tipo Polín"
              onChange={e => onTipoPolinChange(e.target.value)}
            >
              {tiposMateriales.Polines.map(v => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Medida SOLO en Corrido */}
          {producto.tipoTacon === "Corrido" && (
            <TextField
              fullWidth
              size="small"
              label="Medida"
              type="number"
              value={(producto.tacon as TaconCorrido).medida ?? ""}
              onChange={e => onMedidaChange(Number(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default TaconesRow;
