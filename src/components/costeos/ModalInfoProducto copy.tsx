import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Producto, Costeo, Document } from "../../config/types";
import { useFetchMaterialesSuc } from "../../hooks/useFetchFunctions";
import { TotalesTable } from "./TotalesTable";
import InfoGeneralRow from "./InfoGeneralRow";
import MedidasRow from "./MedidasRow";
import PolinesAbajoFullRow from "./PolinesAbajoFullRow";
import TaconesRow from "./TaconesRow";
import CorralRow from "./CorralRow";
import MaderaExtraRow from "./MaderaExtraRow";
import PorteriasRow from "./PorteriasRow";
import PolinAmarreRow from "./PolinAmarreRow";
import PolinesFijacionFullRow from "./PolinesFijacionFullRow";
import TendidoRow from "./TendidoRow";
import ParedRow from "./ParedRow";
import DuelasRow from "./DuelasRow";
import ImportesRow from "./ImportesRow";
import { calcularImportesProducto } from "../../hooks/useFetchCosteo";

interface ModalInfoProductoProps {
  open: boolean;
  onClose: () => void;
  costeo: Costeo;
  productoActivo: Producto;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid: string;
  tiposMateriales: Record<string, string[]>;
}

const ModalInfoProducto: React.FC<ModalInfoProductoProps> = ({
  open,
  onClose,
  costeo,
  productoActivo,
  setCosteo,
  sucursalid,
  tiposMateriales
}) => {
  const { materiales } = useFetchMaterialesSuc(sucursalid);

  // Puedes usar un efecto para recalcular importes si quieres, pero siempre fuera del if!
  useEffect(() => {
    if (!productoActivo) return;
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoActivo.id
          ? calcularImportesProducto(p, materiales)
          : p
      )
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(productoActivo), materiales]);

  // Después de los hooks, ahora sí:
  if (!productoActivo) return null;

  const productoParaImportes = costeo.productos.find(p => p.id === productoActivo.id) || productoActivo;
  const producto = calcularImportesProducto(productoParaImportes, materiales);
  const isTarima = producto.tipoEquipo === 'Tarima';

  const handleUpload = async (files: FileList): Promise<void> => {
    const nuevos: Document[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      nombre: file.name,
      file
    }));
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(prod =>
        prod.id === producto.id
          ? { ...prod, referenciasEquipo: [...(prod.referenciasEquipo ?? []), ...nuevos] }
          : prod
      )
    }));
  };

  const handleDelete = async (doc: Document): Promise<void> => {
    setCosteo(prev => ({
      ...prev,
      productos: prev.productos.map(prod =>
        prod.id === producto.id
          ? { ...prod, referenciasEquipo: (prod.referenciasEquipo ?? []).filter(d => d.id !== doc.id) }
          : prod
      )
    }));
  };

console.log("Producto al abrir modal:", producto);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => { if (reason === 'backdropClick') return; onClose(); }}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: { xs: "98vw", sm: "90vw", md: "72vw", lg: "62vw" },
          minWidth: { xs: "98vw", sm: 0 },
          maxHeight: "93vh",
          borderRadius: 3,
          overflowY: "auto",
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "var(--primary-color)",
          color: "white",
          pr: 5,
          position: 'relative',
          minHeight: 60,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Detalle de Producto
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 18,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="subtitle2" fontWeight={500} color="white" mt={0.5}>
          {productoActivo.codigoEquipo ? `Código: ${productoActivo.codigoEquipo}` : ""}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          {/* Secciones siempre visibles */}
          <Box>
            <InfoGeneralRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              handleDelete={handleDelete}
              handleUpload={handleUpload}
            />
          </Box>
          <Box>
            <MedidasRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
            />
          </Box>
          <Divider flexItem />

          {/* Secciones condicionales según tipo */}
          {isTarima ? (
            <Stack spacing={2}>
              <PolinesAbajoFullRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <TaconesRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <CorralRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <PolinAmarreRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <PolinesFijacionFullRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <TendidoRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <MaderaExtraRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <PolinesAbajoFullRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <TaconesRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <CorralRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <MaderaExtraRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <PorteriasRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <PolinAmarreRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <PolinesFijacionFullRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <TendidoRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <ParedRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
              <DuelasRow {...{ producto, costeo, setCosteo, materiales, tiposMateriales }} />
            </Stack>
          )}
          {/* Totales e importes */}
          <Divider flexItem sx={{ mt: 3 }} />
          <Box>
            <TotalesTable
              totales={producto.totales}
              materiales={materiales}
              setPedidoActivo={setCosteo}
              producto={producto}
            />
          </Box>
          <Box>
            
            <ImportesRow
              producto={producto}
              setCosteo={setCosteo}
              materiales={materiales}
            />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInfoProducto;
