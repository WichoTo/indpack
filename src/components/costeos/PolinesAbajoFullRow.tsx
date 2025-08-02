import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { Costeo, Producto, Material } from '../../config/types';
import { calcularTipoPolinAbajoPorPeso, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import PolinAbajoRow from './PolinAbajoRow';

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
                    tipo: calcularTipoPolinAbajoPorPeso(
                      producto.peso ?? 0,
                      producto.largoEmpaque,
                      materiales,
                      !!producto.polinesFijacion?.length
                    ),
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
    <Box mt={2}>
      {/* Título con botón */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "var(--primary-color)",
            letterSpacing: 1,
            borderLeft: "4px solid var(--primary-color)",
            pl: 1.2,
          }}
        >
          Polines Abajo
        </Typography>
        <Tooltip title="Agregar polín">
          <IconButton
            size="small"
            sx={{
              backgroundColor: "var(--primary-color)",
              color: "#fff",
              '&:hover': { backgroundColor: "var(--primary-color-dark, #1976d2)" }
            }}
            onClick={agregarPolinAbajo}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Lista de polines */}
      <Stack spacing={1}>
        {producto.polinesAbajo && producto.polinesAbajo.length > 0 ? (
          producto.polinesAbajo.map((p, i) => (
            <Paper
              key={`${producto.id}-pa-${i}`}
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "#fafbfc",
                borderLeft: "4px solid var(--primary-color)",
                mb: 1,
              }}
            >
              <PolinAbajoRow
                producto={producto}
                polin={p}
                index={i}
                productoId={producto.id}
                setCosteo={setCosteo}
                materiales={materiales}
                tiposMateriales={tiposMateriales}
              />
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary" fontSize="0.95rem" px={2}>
            No hay polines agregados. Usa el botón <b>+</b> para agregar.
          </Typography>
        )}
      </Stack>
      <Divider sx={{ mt: 2, mb: 1 }} />
    </Box>
  );
};

export default PolinesAbajoFullRow;
