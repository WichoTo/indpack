// PolinesFijacionFullRow.tsx
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField
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
        producto.largoEmpaque,  // o la medida que uses para polinesAbajo
        materiales,
        llevaPolinFijacion
      ),
    })
  );

  return { ...producto, polinesAbajo: nuevosPolinesAbajo };
}
  const alturaTotalFijacion = producto.polinesFijacion?.reduce(
    (total, polin) =>
      total +  (alturasPorTipo[polin.tipo] ?? 0),
    0
  ) ?? 0;

  return (
    <>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr' }} gap={2} mb={1} alignItems="center">
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
            POLINES FIJACIÓN
          </Typography>
          <IconButton size="small" onClick={agregarPolinFijacion}>
            <AddIcon fontSize="small" />
          </IconButton>
          <Box display="flex" flexDirection="column" gap={1}>
            {producto.polinesFijacion?.map((p, i) => (
              <PolinFijacionRow
                key={`${producto.id}-pf-${i}`}  // ← key único aquí (índice si no tienes id)
                polin={p}
                index={i}
                productoId={producto.id}
                setCosteo={setCosteo}
                materiales={materiales}
                tiposMateriales={tiposMateriales}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
            Altura P. Fijación
          </Typography>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            label="Altura Fijación"
            type="number"
            value={alturaTotalFijacion}
            disabled
          />
        </Box>
      </Box>
    </>
  );
};

export default PolinesFijacionFullRow;
