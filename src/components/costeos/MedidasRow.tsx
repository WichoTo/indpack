import React from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import {
  Costeo,
  Producto,
  Material,
} from '../../config/types';
import { actualizarMedidasParedes,  handleCalcularMedidaCorral,  handleMedidasProductoChange, handleProductoChange } from '../../hooks/useFetchCosteo';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
}

const MedidasRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales
}) => {


  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ gridColumn: 'span 3' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
            MEDIDAS
          </Typography>
          </Box>
          {['largoEquipo', 'anchoEquipo', 'altoEquipo'].map((campo) => (
            <Box key={campo}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label={campo.replace('Equipo', ' Equipo')}
                name={campo}
                type="number"
                value={(producto?.[campo as keyof Producto] as number) ?? 0}
                onChange={(e) => {
                  handleProductoChange(
                    e.target.value,
                    campo,                       
                    setCosteo,
                    producto?.id ?? '',
                    materiales,
                    'numeric'                    
                  );
                  if (producto?.id) {
                    handleMedidasProductoChange(producto.id, setCosteo,materiales);
                    handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                    actualizarMedidasParedes(producto.id, setCosteo);
                  }
                }}
              />
            </Box>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          {["incrLargo", "incrAncho", "incrAlto", "grosor"].map((campo) => (
            <Box key={campo}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label={campo.replace('Equipo', ' Equipo')}
                name={campo}
                type="number"
                value={(producto?.[campo as keyof Producto] as number) ?? 0}
                onChange={(e) => {
                  handleProductoChange(
                    e.target.value,
                    campo,                       
                    setCosteo,
                    producto?.id ?? '',
                    materiales,
                    'numeric'                    
                  );
                  if (producto?.id) {
                    handleMedidasProductoChange(producto.id, setCosteo,materiales);
                    handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                    actualizarMedidasParedes(producto.id, setCosteo);
                  }
                }}
              />
            </Box>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          {["largoEmpaque", "anchoEmpaque", "altoEmpaque"].map((campo) => (
            <Box key={campo}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label={campo.replace('Equipo', ' Equipo')}
                name={campo}
                type="number"
                value={(producto?.[campo as keyof Producto] as number) ?? 0}
                onChange={(e) => {
                  handleProductoChange(
                    e.target.value,
                    campo,                       
                    setCosteo,
                    producto?.id ?? '',
                    materiales,
                    'numeric'                    
                  );
                  if (producto?.id) {
                    handleMedidasProductoChange(producto.id, setCosteo,materiales);
                    handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                    actualizarMedidasParedes(producto.id, setCosteo);
                  }
                }}
              />
            </Box>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField fullWidth label="Peso" name="peso" type="number" size="small" margin="dense" value={producto?.peso ?? 1} 
              onChange={(event) => {
                  handleProductoChange(event.target.value,"peso", setCosteo, producto?.id ?? "",materiales)
                  handleMedidasProductoChange(producto?.id ?? "", setCosteo,materiales);
              }}/>
          </Box>
        </Box>
        </>
  );
};

export default MedidasRow;
