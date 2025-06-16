// components/costeos/ImportesRow.tsx
import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  InputAdornment
} from '@mui/material';
import CurrencyFormatCustom from '../general/InputMoneda';
import { Costeo, Producto, MaterialSuc } from '../../config/types';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';

interface Props {
  producto: Producto;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: MaterialSuc[];
}

const ImportesRow: React.FC<Props> = ({ producto, setCosteo }) => {
  // 1) Valores base
  const impDirecto   = Number(producto.importeMaterialDirecto ?? 0);
  const pctVarios    = producto.variosPercent   ?? 15;
  const pctMO        = producto.manoObraPercent ?? 50;
  const pctFlete     = producto.fletePercent    ?? 15;
  const impVarios    = producto.varios   ?? impDirecto * (pctVarios  / 100);
  const impMO        = producto.manoObra ?? impDirecto * (pctMO      / 100);
  const impFlete     = producto.flete    ?? impDirecto * (pctFlete   / 100);
  const impExtras    = producto.extras   ?? 0;
  const impIndirecto = impVarios + impMO + impFlete + impExtras;
  const impTotal     = (impDirecto + impIndirecto) * (producto.factor ?? 1);
  const impFin       = impTotal * (producto.factorFinanciamiento ?? 1);

  // 2) Helper para recalcular indirectos y totales
  const recalcAll = (p: Partial<Producto>) => {
    const v        = p.varios      ?? impVarios;
    const m        = p.manoObra    ?? impMO;
    const f        = p.flete       ?? impFlete;
    const e        = p.extras      ?? impExtras;
    const indirect = v + m + f + e;
    const total    = (impDirecto + indirect) * (p.factor ?? producto.factor ?? 1);
    return {
      importeMaterialinDirecto: indirect,
      importeTotal: total,
      importeTotalFinanciamiento: total * (p.factorFinanciamiento ?? producto.factorFinanciamiento ?? 1)
    };
  };

  // 3) Handlers de cambio
  const handlePctChange = (
    field: 'variosPercent' | 'manoObraPercent' | 'fletePercent',
    raw: string
  ) => {
    const pct = parseFloat(raw) || 0;
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p => {
        if (p.id !== producto.id) return p;
        const keyImp = (field.replace('Percent','')) as 'varios'|'manoObra'|'flete';
        const newImp  = impDirecto * (pct / 100);
        return {
          ...p,
          [field]: pct,
          [keyImp]: newImp,
          ...recalcAll({ [keyImp]: newImp })
        };
      })
    }));
  };

  const handleImpChange = (
    field: 'varios' | 'manoObra' | 'flete' | 'extras' | 'factor' | 'factorFinanciamiento',
    raw: string
  ) => {
    const val = parseFloat(raw) || 0;
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p => {
        if (p.id !== producto.id) return p;
        const updated: any = { ...p, [field]: val };
        if (['varios','manoObra','flete'].includes(field)) {
          const pctKey = (field + 'Percent') as 'variosPercent'|'manoObraPercent'|'fletePercent';
          updated[pctKey] = impDirecto ? (val / impDirecto) * 100 : 0;
        }
        return {
          ...updated,
          ...recalcAll(updated)
        };
      })
    }));
  };

  // % sobre total
  const pctSobreTotal = (imp: number) =>
    impTotal ? `${((imp / impTotal) * 100).toFixed(2)}%` : '0.00%';

  // Estilos comunes para inputs
  const inputSx = { 
    '& .MuiInputBase-input': {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>Importes Adicionales</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Concepto</TableCell>
            <TableCell align="right">%</TableCell>
            <TableCell align="right">Importe</TableCell>
            <TableCell align="right">% sobre total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {/* Material Directo */}
          <TableRow>
            <TableCell>Material Directo</TableCell>
            <TableCell />
            <TableCell align="right">
              <CurrencyFormatCustom
                name="importeMaterialDirecto"
                value={impDirecto.toFixed(2)}
                disabled
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impDirecto)}
            </TableCell>
          </TableRow>

          {/* Varios */}
          <TableRow>
            <TableCell>Varios</TableCell>
            <TableCell align="right">
              <TextField
                name="variosPercent"
                size="small"
                type="number"
                value={pctVarios.toFixed(2)}
                onChange={e => handlePctChange('variosPercent', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: '0.01' }
                }}
                sx={inputSx}
                fullWidth
              />
            </TableCell>
            <TableCell align="right">
              <CurrencyFormatCustom
                name="varios"
                value={impVarios.toFixed(2)}
                onChange={e => handleImpChange('varios', e.target.value)}
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impVarios)}
            </TableCell>
          </TableRow>

          {/* Mano de Obra */}
          <TableRow>
            <TableCell>Mano de Obra</TableCell>
            <TableCell align="right">
              <TextField
                name="manoObraPercent"
                size="small"
                type="number"
                value={pctMO.toFixed(2)}
                onChange={e => handlePctChange('manoObraPercent', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: '0.01' }
                }}
                sx={inputSx}
                fullWidth
              />
            </TableCell>
            <TableCell align="right">
              <CurrencyFormatCustom
                name="manoObra"
                value={impMO.toFixed(2)}
                onChange={e => handleImpChange('manoObra', e.target.value)}
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impMO)}
            </TableCell>
          </TableRow>

          {/* Extras */}
          <TableRow>
            <TableCell>Extras</TableCell>
            <TableCell />
            <TableCell align="right">
              <CurrencyFormatCustom
                name="extras"
                value={impExtras.toFixed(2)}
                onChange={e => handleImpChange('extras', e.target.value)}
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impExtras)}
            </TableCell>
          </TableRow>

          {/* Flete */}
          <TableRow>
            <TableCell>Flete</TableCell>
            <TableCell align="right">
              <TextField
                name="fletePercent"
                size="small"
                type="number"
                value={pctFlete.toFixed(2)}
                onChange={e => handlePctChange('fletePercent', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: '0.01' }
                }}
                sx={inputSx}
                fullWidth
              />
            </TableCell>
            <TableCell align="right">
              <CurrencyFormatCustom
                name="flete"
                value={impFlete.toFixed(2)}
                onChange={e => handleImpChange('flete', e.target.value)}
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impFlete)}
            </TableCell>
          </TableRow>

          {/* Directo e Indirecto */}
          <TableRow>
            <TableCell>Directo e Indirecto</TableCell>
            <TableCell />
            <TableCell align="right">
              <CurrencyFormatCustom
                name="importeDirectoIndirecto"
                value={(impDirecto + impIndirecto).toFixed(2)}
                disabled
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impDirecto + impIndirecto)}
            </TableCell>
          </TableRow>

          {/* Factor y Total */}
          <TableRow>
            <TableCell>Factor</TableCell>
            <TableCell align="right">
              <TextField
                name="factor"
                size="small"
                type="number"
                value={producto.factor?.toFixed(2) ?? '1.00'}
                onChange={e => handleImpChange('factor', e.target.value)}
                inputProps={{ step: '0.01' }}
                sx={inputSx}
                fullWidth
              />
            </TableCell>
            <TableCell align="right">
              <CurrencyFormatCustom
                name="importeTotal"
                value={formatoMoneda(impTotal)}
                disabled
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impTotal)}
            </TableCell>
          </TableRow>

          {/* Financiamiento */}
          <TableRow>
            <TableCell>Factor Financiamiento</TableCell>
            <TableCell align="right">
              <TextField
                name="factorFinanciamiento"
                size="small"
                type="number"
                value={(producto.factorFinanciamiento ?? 1).toFixed(2)}
                onChange={e => handleImpChange('factorFinanciamiento', e.target.value)}
                inputProps={{ step: '0.01' }}
                sx={inputSx}
                fullWidth
              />
            </TableCell>
            <TableCell align="right">
              <CurrencyFormatCustom
                name="importeTotalFinanciamiento"
                value={formatoMoneda(impFin)}
                disabled
                style={{ width: '100%' }}
              />
            </TableCell>
            <TableCell align="right">
              {pctSobreTotal(impFin)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImportesRow;
