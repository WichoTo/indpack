// PolinesAbajoFullRow.tsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Costeo, Producto, Material } from '../../config/types';
import { calcularTipoPolinAbajoPorPeso, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import PolinAbajoRow from './PolinAbajoRow';
import AddIcon from "@mui/icons-material/Add";

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const PolinesAbajoFullRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales,
}) => {
  const agregarPolinAbajo = () => {
    if (!producto.id) return;

    setCosteo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        productos: prev.productos.map(prod =>
          prod.id === producto.id
            ? {
                ...prod,
                polinesAbajo: [
                  ...(prod.polinesAbajo ?? []),
                  {
                    id: crypto.randomUUID(),
                    tipo: calcularTipoPolinAbajoPorPeso(producto.peso ?? 0,producto.largoEmpaque,materiales, !!producto.polinesFijacion?.length),
                    cantidad: 3,
                    medida: prod.largoEmpaque
                  }
                ]
              }
            : prod
        )
      };
    });
    handleCalcularTotales(producto.id, setCosteo, materiales);
  };


  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
          POLINES ABAJO
        </Typography>
        <IconButton size="small" onClick={agregarPolinAbajo}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        {producto.polinesAbajo?.map((p, i) => (
          <PolinAbajoRow
            key={`${producto.id}-pa-${i}`}   // aquí ya no usas p.id
            producto={producto}
            polin={p}
            index={i}
            productoId={producto.id}
            setCosteo={setCosteo}
            materiales={materiales}
            tiposMateriales={tiposMateriales}
          />
        ))}        
      </Box>
    </>
  );
};

export default PolinesAbajoFullRow;
