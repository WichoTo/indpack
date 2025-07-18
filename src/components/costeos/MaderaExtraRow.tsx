// MaderaExtraRow.tsx
import React, { useState } from 'react';
import { Box, Select, MenuItem, Typography, Tooltip, IconButton, TextField } from '@mui/material';
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

  // Fórmula base o recuperada
  const initialFormula = producto.maderaExtra?.formulaMedida ?? `=${producto.maderaExtra?.medida ?? 0}`;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs:'1fr', sm:'1fr 1fr 1fr' }}
      gap={2} mb={1}
      alignItems="center"
    >
      {/* Título + info */}
      <Box sx={{ gridColumn:'span 3', display:'flex', alignItems:'center' }}>
        <Typography variant="h6" sx={{ fontWeight:'bold', color:'var(--primary-color)' }}>
          MADERA EXTRA
        </Typography>
        <Tooltip
          title={<Box component="pre" sx={{ whiteSpace:'pre-wrap', fontSize:'0.75rem' }}>
            Variables disponibles:{'\n'}
            {Object.entries(scope).map(([k,v])=>`${k}: ${v}`).join('\n')}
          </Box>}
          arrow
          open={tooltipOpen}
          onClose={()=>setTooltipOpen(false)}
          disableHoverListener
          disableFocusListener
          disableTouchListener
        >
          <IconButton size="small" sx={{ ml:1 }} onClick={()=>setTooltipOpen(o=>!o)}>
            <InfoOutlinedIcon fontSize="inherit"/>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tipo de polín */}
      <Box>
        <Select
          size="small" margin="dense" fullWidth
          value={producto.maderaExtra?.tipoPolin || calcularTipoPolin(producto.peso??0, materiales)}
          onChange={e=>{
            const tipo = e.target.value as string;
            setCosteo(prev=>prev && ({
              ...prev,
              productos: prev.productos.map(p=>
                p.id===producto.id
                  ? { ...p, maderaExtra:{ ...(p.maderaExtra||{}), tipoPolin:tipo } }
                  : p
              )
            }));
            if(producto.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
          displayEmpty
        >
          <MenuItem value="">Selecciona tipo de polín</MenuItem>
          {tiposMateriales.Polines.map(v=> <MenuItem key={v} value={v}>{v}</MenuItem> )}
        </Select>
      </Box>

      {/* Input que muestra el resultado y abre el editor */}
      <Box>
        <TextField
          label="Medida (cm)"
          value={String(producto.maderaExtra?.medida ?? '')}
          onClick={()=>setEditorOpen(true)}
          InputProps={{ readOnly:true }}
          size="small" margin="dense" fullWidth
        />
        <FormulaEditorDialog
          open={editorOpen}
          onClose={()=>setEditorOpen(false)}
          initial={initialFormula}
          variables={scope}
          onAccept={newFormula=>{
            // calcular el valor
            let val=0;
            try {
              const expr = newFormula.startsWith('=') ? newFormula.slice(1) : newFormula;
              val = evaluate(expr, scope) as number;
            } catch {
              val = parseFloat(newFormula) || 0;
            }
            // actualizar estado
            setCosteo(prev=>prev && ({
              ...prev,
              productos: prev.productos.map(p=>
                p.id===producto.id
                  ? { ...p, maderaExtra:{
                      ...(p.maderaExtra||{}),
                      medida: val,
                      formulaMedida: newFormula
                    }}
                  : p
              )
            }));
            if(producto.id) handleCalcularTotales(producto.id, setCosteo, materiales);
            setEditorOpen(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default MaderaExtraRow;
