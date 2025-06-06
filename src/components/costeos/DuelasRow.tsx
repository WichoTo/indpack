import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import {
  Costeo,
  Producto,
  Material,
} from '../../config/types';
import {   handleCalcularTotales, handleDuelasChange } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  tiposMateriales:Record<string, string[]>
}

const DuelasRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  tiposMateriales
}) => {



  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1, color: "var(--primary-color)" }}>
                DUELAS
            </Typography>
          </Box>  
          <Box sx={{ gridColumn: 'span 2' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "var(--primary-color)" }}>
              Tipo Duelas
            </Typography>
              <Select
              size="small"
              margin="dense"
                fullWidth
                name="tipoMarco"
                value={producto.duelas.tipoDuela || "D7"}
                onChange={(e) => {
                  const nuevoTipoDuela = e.target.value;
                  setCosteo((prevPedido) => {
                    if (!prevPedido) return prevPedido;
                    return {
                      ...prevPedido,
                      productos: prevPedido.productos.map((prod) =>
                        prod.id === producto?.id
                          ? {
                              ...prod,
                              duelas: {
                                ...(prod.duelas || { postes: [], largueros: [] }), // Asegurar estructura inicial
                                tipoDuela: nuevoTipoDuela,
                              },
                            }
                          : prod
                      ),
                    };
                  });
                  if (producto?.id) {
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                  }
                }}
                displayEmpty
              >
                <MenuItem value=""></MenuItem>
                {tiposMateriales.Duelas.map((valor) => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          <Box>
          </Box>
          
          <Box>
          </Box>
          
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold",  color: "var(--primary-color)" }}>
              D.2y4
            </Typography>
          </Box>
          <Box>
            <TextField
              type="number"
              size="small"
              margin="dense"
              fullWidth
              label="Cant Postes"
              value={producto.duelas.postes[0].cantidad}
              onChange={e => {
                handleDuelasChange(
                  producto.id!,
                  "postes",
                  "cantidad",
                  0,
                  Number(e.target.value),
                  setCosteo
                );
              }}
            />

          </Box>
          <Box>
            <TextField
              type="number"
              size="small"
              margin="dense"
              fullWidth
              label="Medidas Postes"
              value={producto.duelas.postes[0].medida}
              onChange={e => {
                handleDuelasChange(
                  producto.id!,
                  "postes",
                  "medida",
                  0,
                  Number(e.target.value),
                  setCosteo
                );
              }}
            />
          </Box>          
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Cant Largueros"
                value={producto?.duelas?.largueros?.[0]?.cantidad ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "largueros", "cantidad", 0, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Medidas Largueros"
                value={producto?.duelas?.largueros?.[0]?.medida ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "largueros", "medida", 0, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
              D.1y3
            </Typography>
          </Box>          
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Cant Largueros"
                value={producto?.duelas?.largueros?.[1]?.cantidad ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "postes", "cantidad", 1, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Medidas Largueros"
                value={producto?.duelas?.largueros?.[1]?.medida ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "postes", "medida", 1, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Cant Postes"
                value={producto?.duelas?.postes?.[1]?.cantidad ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "largueros", "cantidad", 1, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Medidas Postes"
                value={producto?.duelas?.postes?.[1]?.medida ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "largueros", "medida", 1, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>

          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold",  color: "var(--primary-color)" }}>
              Duela Techo
            </Typography>
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Cant Largueros"
                value={producto?.duelas?.duelate?.largueros?.cantidad ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "duelateLargueros", "cantidad", null, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Medidas Largueros"
                value={producto?.duelas?.duelate?.largueros?.medida ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "duelateLargueros", "medida", null, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>          
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Cant Bastidor"
                value={producto?.duelas?.duelate?.postes?.cantidad ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "duelatePostes", "cantidad", null, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
                fullWidth
                label="Medidas Bastidor"
                value={producto?.duelas?.duelate?.postes?.medida ?? 0}
                onChange={(e) => {
                  handleDuelasChange(producto?.id ?? "", "duelatePostes", "medida", null, Number(e.target.value), setCosteo);
                  if (producto?.id) handleCalcularTotales(producto.id, setCosteo, materiales);
                }}
              />
          </Box>
          
        </Box>
    </>
  );
};

export default DuelasRow;
