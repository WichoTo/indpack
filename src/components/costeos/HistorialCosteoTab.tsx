import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Costeo, Empresa } from '../../config/types';

interface HistorialCosteoTabProps {
  costeos: Costeo[];
  empresas: Empresa[];
  onEdit: (c: Costeo) => void;
  onDelete: (c: Costeo) => void;
}

const HistorialCosteoTab: React.FC<HistorialCosteoTabProps> = ({ costeos, empresas, onEdit, onDelete }) => {
  const historial = costeos.filter(c => c.estatus === 'Entregado' || c.estatus === 'Cancelado');

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Folio</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Cliente</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Empresa</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Dirección</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Fecha Envío</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }}>Estatus</TableCell>
            <TableCell sx={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700 }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historial.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No hay historial de costeos registrado.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            historial.map(c => {
              const cli = empresas.find(x => x.id === c.empresaid)
              return (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer', transition: 'background 0.2s' }}>
                  <TableCell>{c.folio}</TableCell>
                  <TableCell>{c.nombreCompleto || '–'}</TableCell>
                  <TableCell>{cli?.nombre || '–'}</TableCell>
                  <TableCell>{c.direccion}</TableCell>
                  <TableCell>{c.fechaEnvio || '–'}</TableCell>
                  <TableCell>{c.estatus || '–'}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEdit(c)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error" onClick={e => { e.stopPropagation(); onDelete(c); }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistorialCosteoTab;
