import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Paper,
  Divider,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { evaluate } from 'mathjs';
import { Costeo, Producto, Material } from '../../config/types';
import { calcularTipoPolin, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import { FormulaEditorDialog } from '../general/FormulaInput';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const MaderaExtraRow: React.FC<Props> = ({
  producto, setCosteo, materiales, tiposMateriales
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const scope = {
    largoEmpaque: producto.largoEmpaque,
    anchoEmpaque: producto.anchoEmpaque,
    altoEmpaque: producto.altoEmpaque,
    peso: producto.peso ?? 0,
    factor: Number(producto.factor) || 1,
  };

  const initialFormula = producto.maderaExtra?.formulaMedida ?? `=${producto.maderaExtra?.medida ?? 0}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#f9f9fa",
        borderLeft: "4px solid var(--primary-color)",
      }}
    >
      {/* Título con info */}
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <Typography variant="h6" fontWeight={800} color="var(--primary-color)">
          Madera Extra
        </Typography>
        <Tooltip
          title={
            <Box component="pre" sx={{ whiteSpace:'pre-wrap', fontSize:'0.85rem', maxWidth:250 }}>
              <strong>Variables disponibles:</strong>{'\n'}
              {Object.entries(scope).map(([k, v]) => `${k}: ${v}`).join('\n')}
            </Box>
          }
          arrow
          open={tooltipOpen}
          onClose={() => setTooltipOpen(false)}
          disableHoverListener
          disableFocusListener
          disableTouchListener
        >
          <IconButton size="small" onClick={() => setTooltipOpen(o => !o)}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr'
        }}
        gap={2}
        alignItems="center"
      >
        {/* Tipo de polín */}
        <Box>
          <Typography fontWeight={700} fontSize={14} sx={{ mb: 0.5 }}>
            Tipo de Polín
          </Typography>
          <Select
            size="small"
            fullWidth
            value={producto.maderaExtra?.tipoPolin || calcularTipoPolin(producto.peso ?? 0, materiales)}
            onChange={e => {
              const tipo = e.target.value as string;
              setCosteo(prev => prev && ({
                ...prev,
                productos: prev.productos.map(p =>
                  p.id === producto.id
                    ? { ...p, maderaExtra: { ...(p.maderaExtra || {}), tipoPolin: tipo } }
                    : p
                )
              }));
              if (producto.id) handleCalcularTotales(producto.id, setCosteo, materiales);
            }}
            displayEmpty
          >
            <MenuItem value="">Selecciona tipo de polín</MenuItem>
            {tiposMateriales.Polines.map(v =>
              <MenuItem key={v} value={v}>{v}</MenuItem>
            )}
          </Select>
        </Box>

        {/* Medida con editor de fórmula */}
        <Box>
          <Typography fontWeight={700} fontSize={14} sx={{ mb: 0.5 }}>
            Medida&nbsp;(cm)
          </Typography>
          <Tooltip
            title={
              producto.maderaExtra?.formulaMedida
                ? <span>Fórmula: <strong>{producto.maderaExtra.formulaMedida}</strong></span>
                : "Haz click para editar fórmula"
            }
            arrow
            placement="top"
          >
            <TextField
              value={String(producto.maderaExtra?.medida ?? '')}
              onClick={() => setEditorOpen(true)}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              sx={{
                cursor: "pointer",
                background: "#fff",
                fontWeight: 600,
                '& input': { cursor: 'pointer' }
              }}
            />
          </Tooltip>
          <FormulaEditorDialog
            open={editorOpen}
            onClose={() => setEditorOpen(false)}
            initial={initialFormula}
            variables={scope}
            onAccept={newFormula => {
              let val = 0;
              try {
                const expr = newFormula.startsWith('=') ? newFormula.slice(1) : newFormula;
                val = evaluate(expr, scope) as number;
              } catch {
                val = parseFloat(newFormula) || 0;
              }
              setCosteo(prev => prev && ({
                ...prev,
                productos: prev.productos.map(p =>
                  p.id === producto.id
                    ? {
                        ...p,
                        maderaExtra: {
                          ...(p.maderaExtra || {}),
                          medida: val,
                          formulaMedida: newFormula
                        }
                      }
                    : p
                )
              }));
              if (producto.id) handleCalcularTotales(producto.id, setCosteo, materiales);
              setEditorOpen(false);
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default MaderaExtraRow;
