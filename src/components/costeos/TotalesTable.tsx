import React from 'react';
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
} from '@mui/material';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';
import { Totales, Material, Producto, Costeo, MaterialSuc } from '../../config/types';
import { handleImporteChange, handleCalcularTotales } from '../../hooks/useFetchCosteo';
// Asegúrate de ajustar la ruta de importación a tu proyecto

// Función para extraer el precio unitario a partir del nombre
const obtenerPrecioMaterial = (nombre: string, materiales: Material[]): number => {
  const material = materiales.find((m) => m.nombre === nombre);
  return material ? material.precio : 0;
};

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
  // Asumimos que producto.bantihumedad y producto.termo son "Si" o "No" (o undefined).
  // Mapeo que relaciona el tipo de extra con la propiedad de cantidad en producto:
  const mapeoExtras: Record<string, string> = {
    'DESEC.':           'cantidadDesec',
    'S.GOLPE':          'cantidadSGolpe',
    'S.POS.':           'cantidadSPOS',
    'SEÑAL':            'cantidadSENAL',
    'BolsaAntihumedad': 'cantidadBolsa',   // Usaremos cantidadBolsa
    'Termo':            'cantidadTermo',
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mt: 3,
          mb: 1,
          color: 'var(--primary-color)',
        }}
      >
        Totales
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo de Polín / Extra</TableCell>
              <TableCell align="right">Cant. / Medida</TableCell>
              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="right">Costo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {totales.map((total, idx) => {
              // 1) Precio unitario según el nombre
              const precioUnitario = obtenerPrecioMaterial(total.tipo, materiales);

              // 2) ¿Es alguno de los extras?
              const campoCantidad = mapeoExtras[total.tipo];
              const esExtra = Boolean(campoCantidad);

              // 3) Valor actual de la cantidad en producto (solo si es extra)
              const valorCantidad = esExtra
                ? (producto as any)[campoCantidad] || ''
                : 0;

              // 4) Medida para materiales normales
              const medidaFormateada = (total.medida ?? 0).toFixed(2);

              // 5) Detectar si la fila corresponde a “BolsaAntihumedad” o a “Termo”
              const esBolsa = total.tipo === 'BolsaAntihumedad';
              const esTermo = total.tipo === 'Termo';

              // 6) Si es “BolsaAntihumedad” pero producto.bantihumedad !== "Si", no mostrar
              if (esBolsa && producto.bantihumedad !== 'Si') {
                return null;
              }
              // 7) Si es “Termo” pero producto.termo !== "Si", no mostrar
              if (esTermo && producto.termo !== 'Si') {
                return null;
              }

              return (
                <TableRow key={idx}>
                  {/* COLUMNA 1: Tipo de Polín / Extra */}
                  <TableCell>{total.tipo}</TableCell>

                  {/* COLUMNA 2: Cantidad (input si es extra) o Medida (texto) */}
                  <TableCell align="right">
                    {esExtra ? (
                      <Box sx={{ width: 60, marginLeft: 'auto' }}>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                          name={campoCantidad}
                          value={valorCantidad}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // 1) Actualizamos la cantidad en producto
                            handleImporteChange(e, setPedidoActivo, materiales, producto);
                            // 2) Recalculamos todos los totales
                            handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography>{medidaFormateada}</Typography>
                    )}
                  </TableCell>

                  {/* COLUMNA 3: Precio Unitario */}
                  <TableCell align="right">
                    {formatoMoneda(precioUnitario)}
                  </TableCell>

                  {/* COLUMNA 4: Costo */}
                  <TableCell align="right">
                    {esBolsa
                      ? formatoMoneda(producto.importeBolsaAntihumedad ?? 0)
                      : esTermo
                      ? formatoMoneda(producto.importeTermo ?? 0)
                      : formatoMoneda(total.precioTotal)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
