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
  Document,
} from '../../config/types';
import { actualizarCodigoEnPedido, handleProductoChange } from '../../hooks/useFetchCosteo';
import DocumentUploadList from '../general/DocumentUploadList';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:Material[]
  handleDelete: (doc: Document) => Promise<void>
  handleUpload: (files: FileList) => Promise<void>
  
}

const InfoGeneralRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  handleDelete,
  handleUpload
}) => {


  return (
    <>
    <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, mb: 1, color: "var(--primary-color)" }}>
        INFO GENERAL
    </Typography>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={1} mb={1} alignItems="center">
        <Box>
        <TextField fullWidth 
            label="Código equipo" name="codigoEquipo" size="small" margin="dense"
            value={producto?.codigoEquipo ?? ""} 
            onChange={(e) => handleProductoChange(e.target.value,"codigoEquipo", setCosteo,producto?.id ?? "",materiales,"numeric")}/>          
        </Box>
    </Box>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box>
        <TextField fullWidth label="Cantidad equipos" name="cantidad" type="number" size="small" margin="dense" value={producto?.cantidad ?? 1} 
            onChange={(event) => {
                handleProductoChange(event.target.value,"cantidad", setCosteo, producto?.id ?? "",materiales)
            if (producto?.id ) {
                actualizarCodigoEnPedido(parseFloat(event.target.value), setCosteo, producto?.id);
                }
            }}/>
        </Box>
        <Box>
            <Select
            variant="outlined"
            size="small"
            name="tipoEquipo"
            value={producto.tipoEquipo || ""}
            onChange={(event) => handleProductoChange(event.target.value,"tipoEquipo", setCosteo, producto?.id ?? "",materiales)}
            displayEmpty
            fullWidth
            >
            <MenuItem value="">Selecciona un tipo</MenuItem>
            <MenuItem value="Caja">Caja</MenuItem>
            <MenuItem value="Tarima">Tarima</MenuItem>
            <MenuItem value="Huacal">Huacal</MenuItem>
            </Select>
        </Box>
        <Box>
        <TextField fullWidth label="Equipo" name="equipo" size="small" margin="dense"  value={producto?.equipo ?? ""} onChange={(event) => handleProductoChange(event.target.value,"equipo", setCosteo, producto?.id ?? "",materiales)} />          
        </Box>
    </Box>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box>
        <Select
            variant="outlined"
            size="small"
            name="servicio"
            value={producto.servicio || ""}
            onChange={(event) => handleProductoChange(event.target.value,"servicio", setCosteo, producto?.id ?? "",materiales)}
            displayEmpty
            fullWidth
            >
            <MenuItem value="">Incluye servicio</MenuItem>
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
            </Select>
        </Box>
        <Box>
        <Select
            variant="outlined"
            size="small"
            name="bantihumedad"
            value={producto.bantihumedad || ""}
            onChange={(event) => handleProductoChange(event.target.value,"bantihumedad", setCosteo, producto?.id ?? "",materiales)}
            displayEmpty
            fullWidth
            >
            <MenuItem value="">Incluye Bolsa Antihumedad</MenuItem>
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
            </Select>
        </Box>
        <Box>
        <Select
            variant="outlined"
            size="small"
            name="servicio"
            value={producto.termo || ""}
            onChange={(event) => handleProductoChange(event.target.value,"termo", setCosteo, producto?.id ?? "",materiales)}
            displayEmpty
            fullWidth
            >
            <MenuItem value="">Incluye Termo</MenuItem>
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
            </Select>
        </Box>
    </Box>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box sx={{ display: 'flex', gap: 1 }}>
        <DocumentUploadList
            documents={producto.referenciasEquipo??[]}
            onUpload={handleUpload}
            onDelete={handleDelete}
            maxFiles={10}
        />
        </Box>
            </Box>
        </>
  );
};

export default InfoGeneralRow;
