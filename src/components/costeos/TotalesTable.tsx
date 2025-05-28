import React from 'react';
import {
  TableContainer, Paper, Table,
  TableHead, TableRow, TableCell,
  TableBody, Typography
} from '@mui/material';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';
import { Totales } from '../../config/types';

interface TotalesTableProps {
  totales: Totales[];
}

export const TotalesTable: React.FC<TotalesTableProps> = ({ totales }) => (
  <>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1, color: 'var(--primary-color)' }}>
      Totales
    </Typography>
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Polín</TableCell>
            <TableCell>Medida Total</TableCell>
            <TableCell>Costo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totales.map((total, index) => (
            <TableRow key={index}>
              <TableCell>{total.tipo}</TableCell>
              <TableCell>{total.medida.toFixed(2)}</TableCell>
              <TableCell>{formatoMoneda(total.precioTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);
