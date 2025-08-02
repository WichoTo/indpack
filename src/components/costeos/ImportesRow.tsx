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
  Box,
  Tooltip,
  Typography
} from '@mui/material';
import InputMoneda from '../general/InputMoneda';
import InputPorcentaje from '../general/InputPorcentaje';
import { Costeo, Producto, MaterialSuc } from '../../config/types';
import { handleCalcularTotales } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: MaterialSuc[];
}

const round = (n: number) => Math.round(n * 100) / 100;

const ImportesRow: React.FC<Props> = ({ producto, setCosteo,materiales }) => {
  const impDirecto = Number(producto.importeMaterialDirecto ?? 0);
  const pctVarios = Number(producto.variosPercent ?? 15);
  const pctMO = Number(producto.manoObraPercent ?? 50);
  const pctFlete = producto.fletePercent !== undefined ? Number(producto.fletePercent) : 15;


  const impVarios = producto.varios !== undefined ? round(Number(producto.varios)) : round(impDirecto * (pctVarios / 100));
  const impMO = producto.manoObra !== undefined ? round(Number(producto.manoObra)) : round(impDirecto * (pctMO / 100));
  
const impFlete = producto.flete !== undefined 
  ? round(Number(producto.flete)) 
  : round(impDirecto * (pctFlete / 100));
  const impExtras = round(Number(producto.extras ?? 0));
  const factor = Number(producto.factor ?? 1);
  const factorFin = Number(producto.factorFinanciamiento ?? 1);

  const impIndirecto = impVarios + impMO + impFlete + impExtras;
  const impTotal = round((impDirecto + impIndirecto) * factor);
  const impFin = round(impTotal * factorFin);

  const pctSobreTotal = (imp: number) =>
    impTotal ? `${((imp / impTotal) * 100).toFixed(2)}%` : '0.00%';

  const handlePctChange = (
  field: 'variosPercent' | 'manoObraPercent' | 'fletePercent',
  raw: string
) => {
  const pct = parseFloat(raw) || 0;
  setCosteo(prev => ({
    ...prev,
    productos: prev.productos.map(p => {
      if (p.id !== producto.id) return p;
      const impDirecto = Number(p.importeMaterialDirecto ?? 0);
      // Calcula los nuevos porcentajes
      const pctVarios = field === 'variosPercent'   ? pct : Number(p.variosPercent ?? 15);
      const pctMO     = field === 'manoObraPercent' ? pct : Number(p.manoObraPercent ?? 50);
      const pctFlete  = field === 'fletePercent'    ? pct : Number(p.fletePercent ?? 15);

      // Calcula los nuevos importes
      const impVarios = Math.round(impDirecto * (pctVarios/100) * 100) / 100;
      const impMO     = Math.round(impDirecto * (pctMO/100) * 100) / 100;
      const impFlete  = Math.round(impDirecto * (pctFlete/100) * 100) / 100;
      const impExtras = Number(p.extras ?? 0);

      const impIndirecto = impVarios + impMO + impFlete + impExtras;
      const factor = Number(p.factor ?? 1);
      const factorFin = Number(p.factorFinanciamiento ?? 1);

      const impTotal = Math.round((impDirecto + impIndirecto) * factor * 100) / 100;
      const impFin = Math.round(impTotal * factorFin * 100) / 100;

      return {
        ...p,
        variosPercent: pctVarios,
        manoObraPercent: pctMO,
        fletePercent: pctFlete,
        varios: impVarios,
        manoObra: impMO,
        flete: impFlete,
        importeMaterialinDirecto: impIndirecto,
        importeTotal: impTotal,
        factor:factor,
        factorFinanciamiento:factorFin,
        importeTotalFinanciamiento: impFin,
      };
    }),
  }));
  handleCalcularTotales(producto.id, setCosteo, materiales);

};


  const handleImpChange = (
  field: 'varios' | 'manoObra' | 'flete' | 'extras' | 'factor' | 'factorFinanciamiento',
  raw: string
) => {
  const val = Math.round((parseFloat(raw) || 0) * 100) / 100;

  setCosteo(prev => ({
    ...prev,
    productos: prev.productos.map(p => {
      if (p.id !== producto.id) return p;

      // Toma los valores actuales o los nuevos, según cuál se esté editando
      const impDirecto = Number(p.importeMaterialDirecto ?? 0);
      const varios = field === 'varios' ? val : Number(p.varios ?? 0);
      const manoObra = field === 'manoObra' ? val : Number(p.manoObra ?? 0);
      const flete = field === 'flete' ? val : Number(p.flete ?? 0);
      const extras = field === 'extras' ? val : Number(p.extras ?? 0);

      // % solo si cambia el importe
      const variosPercent = impDirecto ? Math.round((varios / impDirecto) * 10000) / 100 : 0;
      const manoObraPercent = impDirecto ? Math.round((manoObra / impDirecto) * 10000) / 100 : 0;
      const fletePercent = impDirecto ? Math.round((flete / impDirecto) * 10000) / 100 : 0;

      // Calcula el total indirecto y aplica factores
      const impIndirecto = varios + manoObra + flete + extras;
      const factor = field === 'factor' ? val : Number(p.factor ?? 1);
      const factorFin = field === 'factorFinanciamiento' ? val : Number(p.factorFinanciamiento ?? 1);

      // Calcula totales
      const impTotal = Math.round((impDirecto + impIndirecto) * factor * 100) / 100;
      const impFin = Math.round(impTotal * factorFin * 100) / 100;

      return {
        ...p,
        varios,
        manoObra,
        flete,
        extras,
        factor,
        factorFinanciamiento: factorFin,
        variosPercent,
        manoObraPercent,
        fletePercent,
        importeMaterialinDirecto: impIndirecto,
        importeTotal: impTotal,
        importeTotalFinanciamiento: impFin,
      };
    }),
  }));
};


  const inputSx = {
    '& .MuiInputBase-input': {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      fontSize: 17,
      minWidth: 70,
      p: '7px 8px',
      bgcolor: '#fafafa'
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: 'var(--primary-color)',
          mb: 2,
        }}
      >
        Resumen de Importes
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: "var(--secondary-color-light, #f2f2f2)" }}>
              <TableCell colSpan={4} sx={{ fontWeight: 700, fontSize: 16 }}>Importes Adicionales</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>%</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Importe</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>% sobre total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ background: "#f8fafd" }}>
              <TableCell>Material Directo</TableCell>
              <TableCell />
              <TableCell align="right">
                <TextField
                  name="importeMaterialDirecto"
                  value={impDirecto}
                  InputProps={{ inputComponent: InputMoneda as any }}
                  size="small"
                  fullWidth
                  sx={{ ...inputSx, bgcolor: "#f2f2f2" }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                {pctSobreTotal(impDirecto)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Varios</TableCell>
              <TableCell align="right">
                <Tooltip title="Porcentaje sobre Material Directo">
                  <TextField
                    name="variosPercent"
                    value={pctVarios}
                    onChange={e => handlePctChange('variosPercent', e.target.value)}
                    InputProps={{ inputComponent: InputPorcentaje as any }}
                    size="small"
                    fullWidth
                    sx={inputSx}
                  />
                </Tooltip>
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

            <TableRow>
              <TableCell>Mano de Obra</TableCell>
              <TableCell align="right">
                <Tooltip title="Porcentaje sobre Material Directo">
                  <TextField
                    name="manoObraPercent"
                    value={pctMO}
                    onChange={e => handlePctChange('manoObraPercent', e.target.value)}
                    InputProps={{ inputComponent: InputPorcentaje as any }}
                    size="small"
                    fullWidth
                    sx={inputSx}
                  />
                </Tooltip>
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

            <TableRow>
              <TableCell>Flete</TableCell>
              <TableCell align="right">
                <Tooltip title="Porcentaje sobre Material Directo">
                  <TextField
                    name="fletePercent"
                    value={pctFlete}
                    onChange={e => handlePctChange('fletePercent', e.target.value)}
                    InputProps={{ inputComponent: InputPorcentaje as any }}
                    size="small"
                    fullWidth
                    sx={inputSx}
                  />
                </Tooltip>
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

            {/* DIRECTO + INDIRECTO */}
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell colSpan={2} sx={{ fontWeight: 700, color: "#444" }}>
                <b>Directo + Indirecto</b>
              </TableCell>
              <TableCell align="right">
                <TextField
                  name="importeDirectoIndirecto"
                  value={impDirecto + impIndirecto}
                  InputProps={{ inputComponent: InputMoneda as any }}
                  size="small"
                  fullWidth
                  sx={{ ...inputSx, bgcolor: "#f2f2f2" }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                {pctSobreTotal(impDirecto + impIndirecto)}
              </TableCell>
            </TableRow>

            {/* FACTOR y TOTAL */}
            <TableRow>
              <TableCell>Factor</TableCell>
              <TableCell align="right">
                <Tooltip title="Factor para utilidad o contingencia. Ejemplo: 1.07 = 7% extra">
                  <TextField
                    name="factor"
                    value={factor}
                    onChange={e => handleImpChange('factor', e.target.value)}
                    InputProps={{ inputComponent: InputPorcentaje as any }}
                    size="small"
                    fullWidth
                    sx={inputSx}
                  />
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <TextField
                  name="importeTotal"
                  value={impTotal}
                  InputProps={{ inputComponent: InputMoneda as any }}
                  size="small"
                  fullWidth
                  sx={{ ...inputSx, bgcolor: "#f2f2f2" }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                {pctSobreTotal(impTotal)}
              </TableCell>
            </TableRow>

            {/* FACTOR FINANCIAMIENTO y TOTAL FINAL */}
            <TableRow sx={{ background: "#e8f5e9" }}>
              <TableCell sx={{ fontWeight: 700, color: "var(--primary-color)" }}>
                <b>Factor Financiamiento</b>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Aplica para pago a crédito, comisión bancaria, etc.">
                  <TextField
                    name="factorFinanciamiento"
                    value={factorFin}
                    onChange={e => handleImpChange('factorFinanciamiento', e.target.value)}
                    InputProps={{ inputComponent: InputPorcentaje as any }}
                    size="small"
                    fullWidth
                    sx={inputSx}
                  />
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <TextField
                  name="importeTotalFinanciamiento"
                  value={impFin}
                  InputProps={{ inputComponent: InputMoneda as any }}
                  size="small"
                  fullWidth
                  sx={{ ...inputSx, bgcolor: "#f2f2f2", fontWeight: 900, color: "var(--primary-color)" }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: 900, color: "var(--primary-color)" }}>
                  {pctSobreTotal(impFin)}
                </Typography>
              </TableCell>
            </TableRow>
            
            {/* Precio FINAL */}
            <TableRow sx={{ background: "#e8f5e9" }}>
              <TableCell sx={{ fontWeight: 700, color: "var(--primary-color)" }}>
                <b>Precio Final</b>
              </TableCell>
              <TableCell align="right">
              </TableCell>
              <TableCell align="right">
                <TextField
                  name="precioFinal"
                  value={producto.precioFinal}
                  InputProps={{ inputComponent: InputMoneda as any }}
                  size="small"
                  fullWidth
                  sx={{ ...inputSx, bgcolor: "#f2f2f2", fontWeight: 900, color: "var(--primary-color)" }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: 900, color: "var(--primary-color)" }}>
                  {pctSobreTotal(impFin)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ImportesRow;
