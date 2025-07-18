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
} from '@mui/material';
import InputMoneda from '../general/InputMoneda';
import InputPorcentaje from '../general/InputPorcentaje';
import { Costeo, Producto, MaterialSuc } from '../../config/types';

interface Props {
  producto: Producto;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: MaterialSuc[];
}

const round = (n: number) => Math.round(n * 100) / 100;

const ImportesRow: React.FC<Props> = ({ producto, setCosteo }) => {
  // SIEMPRE lee de producto.* y solo calcula si está indefinido
  const impDirecto = Number(producto.importeMaterialDirecto ?? 0);

  const pctVarios  = Number(producto.variosPercent ?? 15);
  const pctMO      = Number(producto.manoObraPercent ?? 50);
  const pctFlete   = Number(producto.fletePercent ?? 15);

  // Solo se recalculan si NO existen como valor editado por el usuario
  const impVarios  = producto.varios !== undefined ? round(Number(producto.varios)) : round(impDirecto * (pctVarios / 100));
  const impMO      = producto.manoObra !== undefined ? round(Number(producto.manoObra)) : round(impDirecto * (pctMO / 100));
  const impFlete   = producto.flete !== undefined ? round(Number(producto.flete)) : round(impDirecto * (pctFlete / 100));
  const impExtras  = round(
  Number(producto.extras        ?? 0) 
);
  const factor     = Number(producto.factor ?? 1);
  const factorFin  = Number(producto.factorFinanciamiento ?? 1);

  const impIndirecto = impVarios + impMO + impFlete + impExtras;
  const impTotal     = round((impDirecto + impIndirecto) * factor);
  const impFin       = round(impTotal * factorFin);

  const pctSobreTotal = (imp: number) =>
    impTotal ? `${((imp / impTotal) * 100).toFixed(2)}%` : '0.00%';

  // Si cambia el porcentaje, sobrescribe ambos valores (redondeados)
  const handlePctChange = (
    field: 'variosPercent' | 'manoObraPercent' | 'fletePercent',
    raw: string
  ) => {
    const pct = parseFloat(raw) || 0;
    const impField = field.replace('Percent', '') as 'varios' | 'manoObra' | 'flete';
    const val = round(impDirecto * (pct / 100));
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p =>
        p.id !== producto.id
          ? p
          : {
              ...p,
              [field]: pct,
              [impField]: val,
            }
      ),
    }));
  };

  const handleImpChange = (
  field: 'varios' | 'manoObra' | 'flete' | 'extras' | 'factor' | 'factorFinanciamiento',
  raw: string
) => {
  const val = Math.round((parseFloat(raw) || 0) * 100) / 100;
  if (['varios', 'manoObra', 'flete'].includes(field)) {
    const pctField = (field + 'Percent') as 'variosPercent' | 'manoObraPercent' | 'fletePercent';
    const pct = impDirecto ? Math.round((val / impDirecto) * 10000) / 100 : 0;
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p =>
        p.id !== producto.id
          ? p
          : {
              ...p,
              [field]: val,
              [pctField]: pct,
            }
      ),
    }));
  } else {
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p =>
        p.id !== producto.id ? p : { ...p, [field]: val }
      ),
    }));
  }
};


  // Common input styling
  const inputSx = {
    '& .MuiInputBase-input': {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      fontSize: 18,
      minWidth: 80,
      p: '7px 8px'
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
              <TextField
                name="importeMaterialDirecto"
                value={impDirecto}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
                disabled
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
                value={pctVarios}
                onChange={e => handlePctChange('variosPercent', e.target.value)}
                InputProps={{ inputComponent: InputPorcentaje as any }}
                size="small"
                fullWidth
                sx={inputSx}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                name="varios"
                value={impVarios}
                onChange={e => handleImpChange('varios', e.target.value)}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
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
                value={pctMO}
                onChange={e => handlePctChange('manoObraPercent', e.target.value)}
                InputProps={{ inputComponent: InputPorcentaje as any }}
                size="small"
                fullWidth
                sx={inputSx}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                name="manoObra"
                value={impMO}
                onChange={e => handleImpChange('manoObra', e.target.value)}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
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
              <TextField
                name="extras"
                value={impExtras}
                onChange={e => handleImpChange('extras', e.target.value)}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
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
                value={pctFlete}
                onChange={e => handlePctChange('fletePercent', e.target.value)}
                InputProps={{ inputComponent: InputPorcentaje as any }}
                size="small"
                fullWidth
                sx={inputSx}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                name="flete"
                value={impFlete}
                onChange={e => handleImpChange('flete', e.target.value)}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
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
              <TextField
                name="importeDirectoIndirecto"
                value={impDirecto + impIndirecto}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
                disabled
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
                value={factor}
                onChange={e => handleImpChange('factor', e.target.value)}
                InputProps={{ inputComponent: InputPorcentaje as any }}
                size="small"
                fullWidth
                sx={inputSx}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                name="importeTotal"
                value={impTotal}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
                disabled
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
                value={factorFin}
                onChange={e => handleImpChange('factorFinanciamiento', e.target.value)}
                InputProps={{ inputComponent: InputPorcentaje as any }}
                size="small"
                fullWidth
                sx={inputSx}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                name="importeTotalFinanciamiento"
                value={impFin}
                InputProps={{ inputComponent: InputMoneda as any }}
                size="small"
                fullWidth
                sx={inputSx}
                disabled
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
