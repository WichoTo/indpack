// FormulaEditorDialog.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, TextField, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { evaluate } from 'mathjs';

export interface FormulaEditorDialogProps {
  open: boolean;
  onClose: () => void;
  initial: string;
  variables: Record<string, number>;
  onAccept: (formula: string) => void;
}

export const FormulaEditorDialog: React.FC<FormulaEditorDialogProps> = ({
  open, onClose, initial, variables, onAccept
}) => {
  const [formula, setFormula] = useState(initial);
  const [computed, setComputed] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cada vez que cambie la fórmula, tratamos de evaluarla
  useEffect(() => {
    try {
      const expr = formula.startsWith('=') ? formula.slice(1) : formula;
      setComputed(evaluate(expr, variables) as number);
    } catch {
      setComputed(NaN);
    }
  }, [formula, variables]);

  const insertAtCursor = (token: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const next = formula.slice(0, start) + token + formula.slice(end);
    setFormula(next);
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + token.length;
      ta.focus();
    });
  };

  const operators = ['+', '-', '*', '/', '(', ')'];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography variant="h6">Editor de Fórmula</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon/></IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Barra de operadores */}
        <Box mb={2} sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
          {operators.map(op => (
            <Button key={op} size="small" variant="outlined" onClick={() => insertAtCursor(op)}>
              {op}
            </Button>
          ))}
        </Box>

        {/* Resultado en tiempo real */}
        <Typography sx={{ mb:1 }}>
          Resultado: {isNaN(computed) ? <em>err</em> : computed.toFixed(2)}
        </Typography>

        <Box sx={{ display:'flex', gap:2 }}>
          {/* Variables a la izquierda */}
          <Box sx={{ width:'25%', maxHeight:200, overflowY:'auto' }}>
            <Typography variant="subtitle2">Variables</Typography>
            {Object.keys(variables).map(key => (
              <Button
                key={key}
                size="small"
                fullWidth
                onClick={() => insertAtCursor(key)}
                sx={{ textTransform:'none', mb:1 }}
              >
                {key}
              </Button>
            ))}
          </Box>
          {/* Área de texto */}
          <Box sx={{ flexGrow:1 }}>
            <TextField
              inputRef={textareaRef}
              label="Fórmula"
              multiline
              minRows={4}
              fullWidth
              value={formula}
              onChange={e => setFormula(e.target.value)}
              placeholder="Escribe o pulsa botones…"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => {
            onAccept(formula);
            onClose();
          }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
