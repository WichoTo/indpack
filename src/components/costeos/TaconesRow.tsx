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
  Tacon
} from '../../config/types';
import {  calcularTipoPolinAbajoPorPeso, handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface TaconesRowProps {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: any[];
  tiposMateriales: Record<string, string[]>;
}

const TaconesRow: React.FC<TaconesRowProps> = ({ producto,  setCosteo, materiales, tiposMateriales }) => {
  //const tipoPolinComun = producto.polinesAbajo?.[0]?.tipo || '';
  const onTipoChange = (nuevoTipo: TipoTacon) => {
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(p => {
          if (p.id !== producto.id) return p;
          if (nuevoTipo === 'Corrido') {
            // inicializar tacon corrido
            const tipoPolin = calcularTipoPolinAbajoPorPeso(producto.peso ?? 0,producto.largoEmpaque,materiales, !!producto.polinesFijacion?.length);
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
            // inicializar tacon por pieza con default cantidad 0 y polin calculado
            const tipoPolin = calcularTipoPolinAbajoPorPeso(producto.peso ?? 0,producto.largoEmpaque,materiales, !!producto.polinesFijacion?.length);
            return {
              ...p,
              tipoTacon: 'Pieza',
              tacon: {
                tipoPolin,
                cantidad: 0
              } as TaconPieza
            };
          }
          // Sin tacones
          return { ...p, tipoTacon: '', tacon: {} as Tacon };
        })
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  // cuando cambia cantidad en pieza o corrido, siempre existe tacon inicial
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
    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={1}>

      <Box sx={{ gridColumn: 'span 3' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
          TACONES
        </Typography>
      </Box>

      <FormControl fullWidth size="small" margin="dense">
        <InputLabel id="label-tipo-tacon">Tipo Tacón</InputLabel>
        <Select
          labelId="label-tipo-tacon"
          value={producto.tipoTacon || ''}
          label="Tipo Tacón"
          onChange={e => onTipoChange(e.target.value as TipoTacon)}
        >
          <MenuItem value="">Sin Tacones</MenuItem>
          <MenuItem value="Corrido">Tacon Corrido</MenuItem>
          <MenuItem value="Pieza">Tacon por Pieza</MenuItem>
        </Select>
      </FormControl>

      {producto.tipoTacon === 'Corrido' && (
        <>
          <TextField
            size="small"
            margin="dense"
            label="Cantidad"
            type="number"
            value={(producto.tacon as TaconCorrido).cantidad}
            onChange={e => onCantidadChange(Number(e.target.value) || 0)}
          />
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel id="label-polin-corrido">Tipo Polín</InputLabel>
            <Select
              labelId="label-polin-corrido"
              value={(producto.tacon as TaconCorrido).tipoPolin}
              label="Tipo Polín"
              onChange={e => onTipoPolinChange(e.target.value)}
            >
              {tiposMateriales.Polines.map(v => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            margin="dense"
            label="Medida"
            type="number"
            value={(producto.tacon as TaconCorrido).medida}
            onChange={e => onMedidaChange(Number(e.target.value) || 0)}
          />
        </>
      )}

      {producto.tipoTacon === 'Pieza' && (
        <>
          <TextField
            size="small"
            margin="dense"
            label="Cantidad"
            type="number"
            value={(producto.tacon as TaconPieza).cantidad}
            onChange={e => onCantidadChange(Number(e.target.value) || 0)}
          />
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel id="label-polin-pieza">Tipo Polín</InputLabel>
            <Select
              labelId="label-polin-pieza"
              value={(producto.tacon as TaconPieza).tipoPolin}
              label="Tipo Polín"
              onChange={e => onTipoPolinChange(e.target.value)}
            >
              {tiposMateriales.Polines.map(v => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

    </Box>
  );
};

export default TaconesRow;
