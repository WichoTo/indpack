import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Costeo, Producto, Material } from '../../config/types';
import { handleCalcularTotales, handleDuelasChange } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: Material[];
  tiposMateriales: Record<string, string[]>;
}

const DuelasRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 2, background: "#fafbfc" }}>
      <Typography variant="h6" fontWeight={900} color="var(--primary-color)" mb={1}>
        Duelas
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Tipo de duela */}
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight={700} color="var(--primary-color)">
          Tipo de Duela
        </Typography>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Tipo Duela</InputLabel>
          <Select
            name="tipoDuela"
            value={producto.duelas?.tipoDuela || ""}
            label="Tipo Duela"
            onChange={e => {
              const nuevoTipoDuela = e.target.value;
              setCosteo(prevPedido => {
                if (!prevPedido) return prevPedido;
                return {
                  ...prevPedido,
                  productos: prevPedido.productos.map(prod =>
                    prod.id === producto?.id
                      ? {
                          ...prod,
                          duelas: {
                            ...(prod.duelas || { postes: [], largueros: [] }),
                            tipoDuela: nuevoTipoDuela
                          }
                        }
                      : prod
                  )
                };
              });
              if (producto?.id) {
                handleCalcularTotales(producto.id, setCosteo, materiales);
              }
            }}
            displayEmpty
          >
            <MenuItem value="">Selecciona tipo de duela</MenuItem>
            {tiposMateriales.Duelas.map(valor => (
              <MenuItem key={valor} value={valor}>{valor}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección D.2y4 */}
      <Typography variant="subtitle2" fontWeight={800} color="var(--primary-color)" mb={1}>
        D. 2 y 4
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr 1fr' }}
        gap={2}
        mb={2}
      >
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Postes"
          fullWidth
          value={producto.duelas?.postes?.[0]?.cantidad ?? 0}
          onChange={e =>
            handleDuelasChange(
              producto.id!,
              "postes",
              "cantidad",
              0,
              Number(e.target.value),
              setCosteo,
              materiales
            )
          }
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Postes"
          fullWidth
          value={producto.duelas?.postes?.[0]?.medida ?? 0}
          onChange={e =>
            handleDuelasChange(
              producto.id!,
              "postes",
              "medida",
              0,
              Number(e.target.value),
              setCosteo,
              materiales
            )
          }
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Largueros"
          fullWidth
          value={producto.duelas?.largueros?.[0]?.cantidad ?? 0}
          onChange={e => {
            handleDuelasChange(
              producto.id!,
              "largueros",
              "cantidad",
              0,
              Number(e.target.value),
              setCosteo,
              materiales
            );
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Largueros"
          fullWidth
          value={producto.duelas?.largueros?.[0]?.medida ?? 0}
          onChange={e => {
            handleDuelasChange(
              producto.id!,
              "largueros",
              "medida",
              0,
              Number(e.target.value),
              setCosteo,
              materiales
            );
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
      </Box>

      {/* Sección D.1y3 */}
      <Typography variant="subtitle2" fontWeight={800} color="var(--primary-color)" mb={1}>
        D. 1 y 3
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr 1fr' }}
        gap={2}
        mb={2}
      >
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Largueros"
          fullWidth
          value={producto.duelas?.largueros?.[1]?.cantidad ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "largueros", "cantidad", 1, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Largueros"
          fullWidth
          value={producto.duelas?.largueros?.[1]?.medida ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "largueros", "medida", 1, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Postes"
          fullWidth
          value={producto.duelas?.postes?.[1]?.cantidad ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "postes", "cantidad", 1, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Postes"
          fullWidth
          value={producto.duelas?.postes?.[1]?.medida ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "postes", "medida", 1, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
      </Box>

      {/* Sección Duela Techo */}
      <Typography variant="subtitle2" fontWeight={800} color="var(--primary-color)" mb={1}>
        Duela Techo
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr 1fr' }}
        gap={2}
      >
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Largueros"
          fullWidth
          value={producto.duelas?.duelate?.largueros?.cantidad ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "duelateLargueros", "cantidad", null, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Largueros"
          fullWidth
          value={producto.duelas?.duelate?.largueros?.medida ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "duelateLargueros", "medida", null, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Cant. Bastidor"
          fullWidth
          value={producto.duelas?.duelate?.postes?.cantidad ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "duelatePostes", "cantidad", null, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Medidas Bastidor"
          fullWidth
          value={producto.duelas?.duelate?.postes?.medida ?? 0}
          onChange={e => {
            handleDuelasChange(producto.id!, "duelatePostes", "medida", null, Number(e.target.value), setCosteo,
              materiales);
            if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
          }}
        />
      </Box>
    </Paper>
  );
};

export default DuelasRow;
