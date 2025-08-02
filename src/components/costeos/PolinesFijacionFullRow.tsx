import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { Costeo, Producto, Material } from '../../config/types';
import { alturasPorTipo, calcularTipoPolin, calcularTipoPolinAbajoPorPeso, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import PolinFijacionRow from './PolinFijacionRow';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const PolinesFijacionFullRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales,
}) => {
  const agregarPolinFijacion = () => {
    if (!producto.id) return;
    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(prod => {
          if (prod.id !== producto.id) return prod;
          // 1. Actualiza polinesFijacion
          const updated = {
            ...prod,
            polinesFijacion: [
              ...(prod.polinesFijacion ?? []),
              {
                tipo: calcularTipoPolin(prod.peso ?? 0, materiales),
                cantidad: 1,
                medida: prod.anchoEmpaque
              }
            ]
          };
          // 2. RE-calcula polinesAbajo si corresponde
          return recalcularPolinesAbajoPorPolinesFijacion(updated, materiales);
        }),
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };

  function recalcularPolinesAbajoPorPolinesFijacion(producto: Producto, materiales: Material[]): Producto {
    const llevaPolinFijacion = !!(producto.polinesFijacion && producto.polinesFijacion.length);

    // Si no hay polinesAbajo, regresa igual
    if (!producto.polinesAbajo?.length) return producto;

    const nuevosPolinesAbajo = producto.polinesAbajo.map(pol =>
      ({
        ...pol,
        tipo: calcularTipoPolinAbajoPorPeso(
          producto.peso ?? 0,
          producto.largoEmpaque,
          materiales,
          llevaPolinFijacion
        ),
      })
    );

    return { ...producto, polinesAbajo: nuevosPolinesAbajo };
  }

  const alturaTotalFijacion = producto.polinesFijacion?.reduce(
    (total, polin) =>
      total + (alturasPorTipo[polin.tipo] ?? 0),
    0
  ) ?? 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#f9fafd",
        borderLeft: "4px solid var(--primary-color)",
      }}
    >
      <Stack spacing={2}>
        {/* Header con botón */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight={800} color="var(--primary-color)">
            Polines de Fijación
          </Typography>
          <IconButton size="small" onClick={agregarPolinFijacion} sx={{ color: 'var(--primary-color)' }}>
            <AddIcon fontSize="medium" />
          </IconButton>
        </Box>

        <Divider />

        {/* Fila de Polines de Fijación */}
        <Stack spacing={1}>
          {producto.polinesFijacion?.map((p, i) => (
            <PolinFijacionRow
              key={`${producto.id}-pf-${i}`}
              polin={p}
              index={i}
              productoId={producto.id}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
          ))}
        </Stack>

        <Divider />

        {/* Resumen de altura */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="var(--primary-color)"
            sx={{ minWidth: 180 }}
          >
            Altura total fijación
          </Typography>
          <TextField
            size="small"
            margin="dense"
            label="Altura total (cm)"
            type="number"
            value={alturaTotalFijacion}
            disabled
            InputProps={{ style: { fontWeight: 700, background: "#fff" } }}
            sx={{ maxWidth: 200 }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default PolinesFijacionFullRow;
