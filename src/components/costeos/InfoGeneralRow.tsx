import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Costeo,
  Producto,
  Document,
  MaterialSuc,
} from '../../config/types';
import { actualizarCodigoEnPedido, calcularDuelas, handleImporteChange, handleMedidasProductoChange, handleProductoChange, recalcularGrosor, triggerCalculoYTotales } from '../../hooks/useFetchCosteo';
import DocumentUploadList from '../general/DocumentUploadList';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales: MaterialSuc[];
  handleDelete: (doc: Document) => Promise<void>;
  handleUpload: (files: FileList) => Promise<void>;
}

const InfoGeneralRow: React.FC<Props> = ({
  producto,
  setCosteo,
  materiales,
  handleDelete,
  handleUpload
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          mb: 2,
          letterSpacing: 1,
          color: "var(--primary-color)",
          borderLeft: "4px solid var(--primary-color)",
          pl: 1.3,
        }}
      >
        Información General del Equipo
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Fila Código y Cantidad */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
        alignItems="center"
        mb={1}
      >
        <TextField
          fullWidth
          label="Código equipo"
          name="codigoEquipo"
          size="small"
          margin="dense"
          value={producto?.codigoEquipo ?? ""}
          onChange={e =>
            handleProductoChange(
              e.target.value,
              "codigoEquipo",
              setCosteo,
              producto?.id ?? "",
              materiales,
              "numeric"
            )
          }
          InputProps={{
            sx: { fontWeight: 600, letterSpacing: 1 }
          }}
        />
        <TextField
          fullWidth
          label="Cantidad"
          name="cantidad"
          type="number"
          size="small"
          margin="dense"
          value={producto?.cantidad ?? 1}
          onChange={event => {
            handleProductoChange(
              event.target.value,
              "cantidad",
              setCosteo,
              producto?.id ?? "",
              materiales
            );
            if (producto?.id) {
              actualizarCodigoEnPedido(
                parseFloat(event.target.value),
                setCosteo,
                producto?.id
              );
              triggerCalculoYTotales(producto.id, setCosteo, materiales);

            }
          }}
          inputProps={{ min: 1 }}
        />
      </Box>

      {/* Fila Tipo, Nombre/Equipo, Servicio */}
      {/* Fila Tipo, Equipo, Servicio */}
<Box
  display="flex"
  gap={2}
  mb={1}
  alignItems="center"
  flexWrap="wrap"
>
  <Box flex={1} minWidth={210}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Tipo</InputLabel>
      <Select
        name="tipoEquipo"
        value={producto.tipoEquipo || ""}
        label="Tipo"
        onChange={event => {
          const nuevoTipo = event.target.value as "Caja" | "Tarima" | "Huacal";
          setCosteo(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              productos: prev.productos.map(p => {
                if (p.id !== producto.id) return p;
                const newGrosor = recalcularGrosor({ ...p, tipoEquipo: nuevoTipo });
                return {
                  ...p,
                  tipoEquipo: nuevoTipo,
                  grosor: newGrosor,
                };
              }),
            };
          });
          handleProductoChange(
            nuevoTipo,
            "tipoEquipo",
            setCosteo,
            producto.id,
            materiales
          );
          handleMedidasProductoChange(producto.id, setCosteo, materiales);
          calcularDuelas(producto.id, setCosteo, materiales);
        }}
        displayEmpty
      >
        <MenuItem value="Caja">Caja</MenuItem>
        <MenuItem value="Tarima">Tarima</MenuItem>
        <MenuItem value="Huacal">Huacal</MenuItem>
      </Select>
    </FormControl>
  </Box>

  <Box flex={1} minWidth={210}>
    <TextField
      fullWidth
      label="Nombre/Equipo"
      name="equipo"
      size="small"
      margin="dense"
      value={producto?.equipo ?? ""}
      onChange={event =>
        handleProductoChange(
          event.target.value,
          "equipo",
          setCosteo,
          producto?.id ?? "",
          materiales
        )
      }
    />
  </Box>

  <Box flex={1} minWidth={210}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Servicio</InputLabel>
      <Select
        name="servicio"
        value={producto.servicio || ""}
        label="Servicio"
        onChange={event => {
          const nuevaBand = event.target.value as string;
          handleProductoChange(nuevaBand, "servicio", setCosteo, producto?.id ?? "", materiales);
          if (nuevaBand !== "Si") {
            const fakeEvent = {
              target: {
                name: "importeServicio",
                value: "0",
              },
            } as React.ChangeEvent<HTMLInputElement>;
            handleImporteChange(fakeEvent, setCosteo, materiales, producto);
          }
        }}
        displayEmpty
      >
        <MenuItem value="Si">Sí</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  </Box>
</Box>

{/* Fila Bolsa Antihumedad, Termo */}
<Box
  display="flex"
  gap={2}
  mb={1}
  alignItems="center"
  flexWrap="wrap"
>
  <Box flex={1} minWidth={210}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Bolsa</InputLabel>
      <Select
        name="bantihumedad"
        value={producto.bantihumedad || ""}
        label="Bolsa"
        onChange={event => {
          const nuevaBand = event.target.value as string;
          handleProductoChange(nuevaBand, "bantihumedad", setCosteo, producto?.id ?? "", materiales);
          if (nuevaBand !== "Si") {
            const fakeEvent = {
              target: {
                name: "cantidadBolsa",
                value: "0",
              },
            } as React.ChangeEvent<HTMLInputElement>;
            handleImporteChange(fakeEvent, setCosteo, materiales, producto);
          }
        }}
        displayEmpty
      >
        <MenuItem value="Si">Sí</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  </Box>

  <Box flex={1} minWidth={210}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Termo</InputLabel>
      <Select
        name="termo"
        value={producto.termo || ""}
        label="Termo"
        onChange={event =>
          handleProductoChange(
            event.target.value,
            "termo",
            setCosteo,
            producto?.id ?? "",
            materiales
          )
        }
        displayEmpty
      >
        <MenuItem value="Si">Sí</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  </Box>

  {/* Espacio reservado por si agregas campo futuro */}
  <Box flex={1} minWidth={210} />
</Box>


      {/* Subtítulo y documentos */}
      <Typography
        variant="subtitle1"
        sx={{ color: "var(--primary-color)", mt: 2, mb: 1, fontWeight: 700 }}
      >
        Documentos y Referencias
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <DocumentUploadList
          documents={producto.referenciasEquipo ?? []}
          onUpload={handleUpload}
          onDelete={handleDelete}
          maxFiles={10}
        />
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }} />
    </>
  );
};

export default InfoGeneralRow;
