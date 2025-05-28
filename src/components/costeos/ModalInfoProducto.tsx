import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { Producto,Costeo,Document} from "../../config/types.tsx";
import CloseIcon from '@mui/icons-material/Close';
import {   useFetchMaterialesSuc } from "../../hooks/useFetchFunctions.tsx";
import { TotalesTable } from "./TotalesTable.tsx";
import TaconesRow from "./TaconesRow.tsx";
import CorralRow from "./CorralRow.tsx";
import InfoGeneralRow from "./InfoGeneralRow.tsx";
import MedidasRow from "./MedidasRow.tsx";
import PolinesAbajoFullRow from "./PolinesAbajoFullRow.tsx";
import MaderaExtraRow from "./MaderaExtraRow.tsx";
import PorteriasRow from "./PorteriasRow.tsx";
import PolinAmarreRow from "./PolinAmarreRow.tsx";
import PolinesFijacionFullRow from "./PolinesFijacionFullRow.tsx";
import { getPrecioExtra,  handleImporteChange } from "../../hooks/useFetchCosteo.tsx";
import TendidoRow from "./TendidoRow.tsx";
import ParedRow from "./ParedRow.tsx";
import DuelasRow from "./DuelasRow.tsx";
import { formatoMoneda } from "../../hooks/useUtilsFunctions.tsx";

interface ModalInfoProductoProps {
  open: boolean;
  onClose: () => void;
  costeo: Costeo;
  productoActivo: Producto;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid:string
  tiposMateriales:Record<string, string[]>
}

const ModalInfoProducto: React.FC<ModalInfoProductoProps> = ({ open, onClose, costeo ,productoActivo ,setCosteo,sucursalid,tiposMateriales}) => {
  const { materiales } = useFetchMaterialesSuc(sucursalid);
  
  
  if (!productoActivo) return null;
  const producto = costeo.productos.find(p => p.id === productoActivo.id) || productoActivo;


  const mostrarBolsa = costeo?.productos.some((producto) => producto.bantihumedad === "Si");
  const mostrarServicio = costeo?.productos.some((producto) => producto.servicio === "Si");
  const mostrarTermo = costeo?.productos.some((producto) => producto.termo === "Si");
  
const handleUpload = async (files: FileList): Promise<void> => {
  const nuevos: Document[] = Array.from(files).map((file) => ({
    id: crypto.randomUUID(),
    nombre: file.name,
    file,
  }));

  setCosteo((prev) => ({
    ...prev,
    productos: prev.productos.map((prod) =>
      prod.id === producto.id
        ? {
            ...prod,
            referenciasEquipo: [
              ...(prod.referenciasEquipo ?? []),
              ...nuevos,
            ],
          }
        : prod
    ),
  }));
};
const handleDelete = async (doc: Document): Promise<void> => {
  setCosteo((prev) => ({
    ...prev,
    productos: prev.productos.map((prod) =>
      prod.id === producto.id
        ? {
            ...prod,
            referenciasEquipo: (prod.referenciasEquipo ?? []).filter(
              (d) => d.id !== doc.id
            ),
          }
        : prod
    ),
  }));
};


  return (
    <Modal 
      open={open} 
      onClose={(_, reason) => {
        if (reason === "backdropClick") return; 
        onClose();
      }}
      disableEnforceFocus >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: "90%", sm: "90%", md: "70%" }, 
          maxHeight: "90vh", 
          overflowY: "auto", 
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 8, right: 8,}} onClick={onClose} >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "var(--primary-color)" }}>
          Más información del producto
        </Typography>
 
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
        


        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr'}} gap={2} mb={1} alignItems="center">
          <Box sx={{ width: '100%' }}>
            <TotalesTable totales={producto.totales} />
          </Box>
        </Box>




      <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Importes Adicionales
          </Typography>
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        {mostrarServicio &&
        <Box>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            label="Importe Servicio"
            name="importeServicio"
            type="text"
            value={producto?.importeServicio ?? ""}
            onChange={(event) => {
              if (productoActivo) {
                handleImporteChange(event, setCosteo, materiales, producto);
              }
            }}
          />
        </Box>
        }
        {mostrarBolsa &&
        <Box>
          <TextField            
            size="small"
            margin="dense"
            fullWidth
            label="Importe Bolsa Antihumedad"
            name="importeBolsaAntihumedad"
            type="text"
            value={producto?.importeBolsaAntihumedad ?? ""}
            onChange={(event) => {
              if (productoActivo) {
                handleImporteChange(event, setCosteo, materiales, producto);
              }
            }}
          />
        </Box>
        }
        {mostrarTermo &&
        <Box>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            label="Importe Termo"
            name="importeTermo"
            type="text"
            value={producto?.importeTermo ?? ""}
            onChange={(event) => {
              if (productoActivo) {
                handleImporteChange(event, setCosteo, materiales, producto);
              }
            }}
          />
        </Box>
        }
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. DESEC"
              name="cantidadDesec"
              type="text"
              value={producto?.cantidadDesec ?? ""}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio DESEC"
              name="precioDesec"
              type="text"
              value={formatoMoneda(producto?.precioDesec??0)||formatoMoneda(getPrecioExtra('DESEC.',materiales))}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe DESEC"
              name="importeDesec"
              type="text"
              value={formatoMoneda(producto?.importeDesec ?? "")}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. S.Golpe"
              name="cantidadSGolpe"
              type="number"
              value={producto?.cantidadSGolpe ?? ''}
              onChange={event => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio S.Golpe"
              name="precioSGolpe"
              type="text"
              value={formatoMoneda(producto?.precioSGolpe??0)||formatoMoneda(getPrecioExtra('S. GOLPE',materiales))}
              onChange={event => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe S.Golpe"
              name="importeSGolpe"
              type="text"
              value={formatoMoneda(producto?.importeSGolpe ?? 0)}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. S.POS"
              name="cantidadSPOS"
              type="text"
              value={producto?.cantidadSPOS ?? ""}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio S.POS"
              name="precioSPOS"
              type="text"
              value={formatoMoneda(producto?.precioSPOS??0)||formatoMoneda(getPrecioExtra('S. POS.',materiales))}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe S.POS"
              name="importeSPOS"
              type="text"
              value={formatoMoneda(producto?.importeSPOS ?? "")}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. SEÑAL"
              name="cantidadSENAL"
              type="text"
              value={producto?.cantidadSENAL ?? ""}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio SEÑAL"
              name="precioSENAL"
              type="text"
              value={formatoMoneda(producto?.precioSENAL??0)||formatoMoneda(getPrecioExtra('SEÑAL',materiales))}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe SEÑAL"
              name="importeSENAL"
              type="text"
              value={formatoMoneda(producto?.importeSENAL ?? 0)}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={1}>
        {/* Material Directo (editable si quieres) */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Material Directo"
          name="precioUnitario"
          type="number"
          value={producto.precioUnitario}
          onChange={e => {
            if (!productoActivo) return;
            handleImporteChange(e, setCosteo, materiales, producto)
          }}
        />

        {/* Varios */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Varios"
          name="varios"
          type="number"
          value={producto.varios ?? 0}
          onChange={e => {
            if (!productoActivo) return;
            handleImporteChange(e, setCosteo, materiales, producto)
          }}
        />

        {/* Mano de Obra */}
        <TextField
          size="small"
          margin="dense"
          fullWidth
          label="Mano de Obra"
          name="manoObra"
          value={(producto.manoObra) }
          onChange={e => {
            if (!productoActivo) return;
            handleImporteChange(e, setCosteo, materiales, producto)
          }}
        />
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Flete"
              name="flete"
              value={producto.flete }
              onChange={e => {
                if (!productoActivo) return;
                handleImporteChange(e, setCosteo, materiales, producto)
              }}
            />
          </Box>
          <Box>
            <TextField            
              size="small"
              margin="dense"
              fullWidth
              label="Factor"
              name="factor"
              type="number"
              value={(producto.factor) }
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Importe Total
          </Typography>
        </Box>
        <Box>
          <TextField            
              size="small"
              margin="dense"
              fullWidth
              label="Importe Total"
              name="importeTotal"
              type="text"
              value={formatoMoneda(producto?.importeTotal ?? 0)}
              onChange={(event) => {
                if (productoActivo) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
        </Box>
      </Box>

    </Box>
        
  </Modal>
  );
};

export default ModalInfoProducto;
