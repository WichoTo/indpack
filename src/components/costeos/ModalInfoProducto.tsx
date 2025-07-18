import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Producto, Costeo, Document } from "../../config/types";
import CloseIcon from '@mui/icons-material/Close';
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

  if (!productoActivo) return null;
  const producto = costeo.productos.find(p => p.id === productoActivo.id) || productoActivo;
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

  return (
    <Modal
      open={open}
      onClose={(_, reason) => { if (reason === 'backdropClick') return; onClose(); }}
      disableEnforceFocus
    >
      <Box
        sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 24,
          width: { xs: '90%', sm: '90%', md: '70%' },
          maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--primary-color)' }}>
          Más información del producto
        </Typography>

        {/* Secciones siempre visibles */}
        <InfoGeneralRow
          producto={producto}
          costeo={costeo}
          setCosteo={setCosteo}
          materiales={materiales}
          handleDelete={handleDelete}
          handleUpload={handleUpload}
        />
        <MedidasRow
          producto={producto}
          costeo={costeo}
          setCosteo={setCosteo}
          materiales={materiales}
        />

        {/* Secciones condicionales según Tarima */}
        {isTarima ? (
          <>
            <PolinesAbajoFullRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <TaconesRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <CorralRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <PolinAmarreRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <PolinesFijacionFullRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <TendidoRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <MaderaExtraRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
          </>
        ) : (
          <>
            <PolinesAbajoFullRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <TaconesRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <CorralRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <MaderaExtraRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <PorteriasRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <PolinAmarreRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <PolinesFijacionFullRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <TendidoRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <ParedRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
            <DuelasRow
              producto={producto}
              costeo={costeo}
              setCosteo={setCosteo}
              materiales={materiales}
              tiposMateriales={tiposMateriales}
            />
          </>
        )}

        {/* Totales e importes siempre visibles */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr' }} gap={2} mb={1} alignItems="center">
          <Box sx={{ width: '100%' }}>
            <TotalesTable
              totales={producto.totales}
              materiales={materiales}
              setPedidoActivo={setCosteo}
              producto={producto}
            />
          </Box>
        </Box>
        <ImportesRow
          producto={producto}
          setCosteo={setCosteo}
          materiales={materiales}
        />

      </Box>
    </Modal>
  );
};

export default ModalInfoProducto;
