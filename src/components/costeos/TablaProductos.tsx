import React, { useState, useMemo } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,  
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete"; 


import { Costeo,PolinFijacion,Producto, Tacon, TipoCorral } from "../../config/types.tsx"
import ConfirmDialog from "../general/DialogComponent.tsx";
import {  useFetchMaterialesSuc } from "../../hooks/useFetchFunctions.tsx";
import { actualizarCodigoEquipo, actualizarMedidasParedes, calcularCantidadLargueros, calcularCantidadPostes, calcularTipoPolin, calcularTipoTabla, handleCalcularMedidaCorral, handleCalcularTotales, handleMedidasProductoChange, handleProductoChange, recalcularCodigosProductos } from "../../hooks/useFetchCosteo.tsx";
import { formatoMoneda } from "../../hooks/useUtilsFunctions.tsx";
import ModalInfoProducto from "./ModalInfoProducto.tsx";

interface TablaProductosProps {
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid:string
  tiposMateriales:Record<string, string[]>
  
}

const TablaProductos: React.FC<TablaProductosProps> = ({ costeo, setCosteo ,sucursalid,tiposMateriales}) => {
  const { materiales } = useFetchMaterialesSuc(sucursalid)
  
  

  const handleAgregarProducto = () => {
    setCosteo((prevState) => {
      if (!prevState) return prevState;
  
      const nuevoIndex = prevState.productos.length + 1;
      const nuevosProductos = [...prevState.productos];
      const idUnico: string = crypto.randomUUID();
  
      const incrLargoBase = 9;
      const incrAnchoBase = 9;
      const incrAltoBase = 8;
      const grosorBase = 3;
  
      const largoEquipoInicial = 0;
      const anchoEquipoInicial = 0;
      const altoEquipoInicial = 0;
  
      const largoEmpaque = largoEquipoInicial + 2 * grosorBase + 2 * incrLargoBase;
      const anchoEmpaque = anchoEquipoInicial + 2 * incrAnchoBase;
      const altoEmpaque = altoEquipoInicial + incrAltoBase;
  
      const nuevoProducto: Producto = {
        id: idUnico, 
        codigoEquipo: actualizarCodigoEquipo(nuevoIndex, 1),
        equipo: "",
        cantidad: 1,
        precioUnitario: 0,
        importeTotal: 0,
        totales: [],
  
        largoEquipo: largoEquipoInicial,
        anchoEquipo: anchoEquipoInicial,
        altoEquipo: altoEquipoInicial,
  
        incrLargo: incrLargoBase,
        incrAncho: incrAnchoBase,
        incrAlto: incrAltoBase,
        grosor: grosorBase,
  
        largoEmpaque,
        anchoEmpaque,
        altoEmpaque,
  
        tipoEquipo: "",
        servicio: "",
        peso: 0,
        bantihumedad: "",
        termo: "",
        detalles: {},
  
  
        polinesAbajo: [
          {
            cantidad: 3, 
            tipo: calcularTipoPolin(0,materiales), 
            medida: largoEmpaque, 
          },
        ],
  
        tipoTacon: "",
        tacon:{} as Tacon,
        tipoCorral: "" as TipoCorral,
        corral: [],
  
        porterias: {
          cantidad: 0,
          tipoPolin: calcularTipoPolin(0,materiales),
          medida: 2 * altoEmpaque + anchoEmpaque,
        },
  
        maderaExtra: {
          tipoPolin: calcularTipoPolin(0,materiales),
          medida: 0,
        },
  
        polinAmarre: {
          cantidad: 0,
          tipoPolin: calcularTipoPolin(0,materiales),
          medida: largoEmpaque,
        },
  
        polinesFijacion: [] as PolinFijacion[],
        tendido: {
          tipo: calcularTipoTabla(0,materiales),
          cantidad: parseFloat((largoEmpaque / 14).toFixed(2)),
          extra: 0,
          medida: anchoEmpaque,
        },
        paredes: {
        tipoParedes: "",
        largo2y4: anchoEmpaque,
        alto2y4: altoEmpaque,
        largo1y3: largoEmpaque,
        alto1y3: altoEmpaque + 9,
        largoTecho: largoEmpaque,
        altoTecho: anchoEmpaque + (2 * grosorBase),

        tipoMarco:  calcularTipoTabla(0,materiales),
      },
      duelas:{
        tipoDuela: "D7",
        postes: [
            { cantidad: calcularCantidadPostes(altoEmpaque), medida: altoEmpaque },
            { cantidad: calcularCantidadPostes(largoEmpaque), medida: largoEmpaque },
          ],
          largueros: [
            { cantidad: calcularCantidadLargueros(anchoEmpaque), medida: anchoEmpaque },
            { cantidad: calcularCantidadLargueros(altoEmpaque), medida: altoEmpaque + 9 },
          ],
          duelate: {
            postes: { cantidad: 2, medida: largoEmpaque },
            largueros: {
              cantidad: calcularCantidadLargueros(altoEmpaque) / 2,
              medida: anchoEmpaque + 2 * grosorBase,
            },
          },
      }
        
      };if(nuevoProducto.id){
        handleCalcularTotales(nuevoProducto.id, setCosteo, materiales);
      }
      const nuevoEstado = { ...prevState, productos: [...nuevosProductos, nuevoProducto] };
      
        return nuevoEstado;
    });
  };
  
  const montoTotal = useMemo(() => {
    return costeo.productos.reduce((total, producto) => {
      const precioUnitario = producto.precioUnitario || 0;
      const importeBolsaAntihumedad = producto.importeBolsaAntihumedad || 0;
      const cantidad = producto.cantidad || 0;
      
      return total + (precioUnitario + importeBolsaAntihumedad) * cantidad;
    }, 0);
  }, [costeo.productos]);
  
      

  const mostrarBolsa = costeo.productos.some((producto) => producto.bantihumedad === "Si");
  const mostrarServicio = costeo.productos.some((producto) => producto.servicio === "Si");
  const mostrarTermo = costeo.productos.some((producto) => producto.termo === "Si");

  
  
  
  const [productoActivo, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalProductoOpen , setModalProductoOpen] = useState(false)
  const handleAbrirModal = (producto: Producto) => {
    setModalProductoOpen(true)
      if (producto?.id) {
        setProductoSeleccionado(producto);
        handleCalcularTotales(producto.id, setCosteo, materiales);
      }
  };

  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
    setModalProductoOpen(false)
  };
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


  const handleAbrirDialogoEliminar = (producto: Producto) => {
    setProductoAEliminar(producto);
    setConfirmDialogOpen(true);
  };

  const handleCerrarDialogoEliminar = () => {
    setProductoAEliminar(null);
    setConfirmDialogOpen(false);
  };

  const handleEliminarProducto = () => {
    if (!productoAEliminar) return;
    setCosteo((prevPedido) => {
      if (!prevPedido) return prevPedido;
      const productosActualizados = prevPedido.productos.filter((p) => p.id !== productoAEliminar.id);
      const nuevoEstado = { ...prevPedido, productos: productosActualizados };
      setTimeout(() => recalcularCodigosProductos(setCosteo), 0);
      return nuevoEstado;
    });
    handleCerrarDialogoEliminar();
  };
  
  
  return (
    <>
      

      <TableContainer
        component={Paper}
        sx={{
            mb: 4,
            maxWidth: '90vw',    // que no sobrepase el 90% del viewport
            overflowX: 'auto'    // scroll horizontal si es necesario
        }}
        >
        

        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--primary-color)",minHeight: 0,       }}>
                <TableCell colSpan={16 + (mostrarBolsa?1:0) + (mostrarServicio?1:0) + (mostrarTermo?1:0)} sx={{ p: 0 }}>
                    <Toolbar
                        sx={{
                        backgroundColor: 'var(--primary-color)',
                        minHeight: 0,       // para que no añada padding extra
                        height: 40,         // ajusta a tu gusto
                        }}
                    >
                        <IconButton onClick={handleAgregarProducto}>
                        <AddIcon sx={{ fontSize: 30, color: 'white' }} />
                        <Typography sx={{ color: 'white', ml: 1 }}>Equipo</Typography>
                        </IconButton>
                        <Box sx={{ ml: 'auto', color: 'white', fontWeight: 'bold' }}>
                        Total: {formatoMoneda(montoTotal)}
                        </Box>
                    </Toolbar>
                    </TableCell>
            </TableRow>            
            <TableRow sx={{ backgroundColor: "var(--primary-color)" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CÓDIGO EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CANT.</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>TIPO EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>SERVICIO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>LARGO EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ANCHO EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ALTO EQUIPO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>PESO (K)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>B.ANTIHUMEDAD</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>TERMO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>P. UNIT.</TableCell>
              {mostrarBolsa && <TableCell sx={{ color: "white", fontWeight: "bold" }}>IMPORTE B.ANTIHUMEDAD</TableCell>}
              {mostrarTermo && <TableCell sx={{ color: "white", fontWeight: "bold" }}>IMPORTE TERMO</TableCell>}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>IMPORTE TOTAL</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>MAS INFO</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ELIMINAR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costeo.productos.length >0 && costeo.productos.map((producto, index) => (
              <TableRow key={index}>
                <TableCell padding="none" sx={{ px: 1, py: 0.5, color: '', fontWeight: 'bold' }}>{producto.codigoEquipo || ""}</TableCell>
                <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    name="cantidad"
                    sx={{minWidth: "120px"}}
                    value={producto.cantidad || ""}
                    onChange={(event) => {
                      handleProductoChange(event.target.value,"cantidad", setCosteo, producto?.id ?? "",materiales)
                      if (producto?.id) {
                        recalcularCodigosProductos(setCosteo);
                      }
                    }}
                  />
                </TableCell>
                <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
                <Select
                  variant="outlined"
                  size="small"
                  name="tipoEquipo"
                  value={producto.tipoEquipo || ""}
                  onChange={(event) => handleProductoChange(event.target.value,"tipoEquipo", setCosteo, producto?.id ?? "",materiales)}
                  displayEmpty
                  fullWidth
                  sx={{minWidth: "120px"}}
                >
                  <MenuItem value="">Selecciona un tipo</MenuItem>
                  <MenuItem value="Caja">Caja</MenuItem>
                  <MenuItem value="Tarima">Tarima</MenuItem>
                  <MenuItem value="Huacal">Huacal</MenuItem>
                </Select>

              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
                <Select
                  variant="outlined"
                  size="small"
                  name="servicio"
                  value={producto.servicio || ""}
                  onChange={(event) => handleProductoChange(event.target.value,"servicio", setCosteo, producto?.id ?? "",materiales)}
                  displayEmpty
                  fullWidth
                  sx={{minWidth: "120px"}}
                >
                  <MenuItem value="">Incluye Servicio</MenuItem>
                  <MenuItem value="Si">Si</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="equipo"
                  value={producto.equipo || ""}
                  onChange={(event) => handleProductoChange(event.target.value,"equipo", setCosteo, producto?.id ?? "",materiales)}
                  sx={{minWidth: "320px"}}
                />
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                size="small"
                name="largoEquipo"
                value={producto.largoEquipo || 0}
                onChange={(event) => {
                  handleProductoChange(event.target.value,"largoEquipo", setCosteo, producto?.id ?? "",materiales);
                  if(producto?.id){
                    handleMedidasProductoChange(producto.id, setCosteo,materiales);
                    handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                    actualizarMedidasParedes(producto.id, setCosteo);
                  }
                }}
                sx={{minWidth: "120px"}}
              />
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                name="anchoEquipo"
                type="number"
                value={producto.anchoEquipo || 0}
                onChange={(event) => {
                  handleProductoChange(event.target.value,"anchoEquipo", setCosteo, producto?.id ?? "",materiales);
                  if(producto?.id){
                    handleMedidasProductoChange(producto.id, setCosteo,materiales);
                    handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                    handleCalcularTotales(producto.id, setCosteo, materiales);
                    actualizarMedidasParedes(producto.id, setCosteo);
                  }
                }}
                sx={{minWidth: "120px"}}
              />
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'white', fontWeight: 'bold' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="altoEquipo"
                  type="number"
                  value={producto.altoEquipo || 0}
                  onChange={(event) => {
                    handleProductoChange(event.target.value,"altoEquipo", setCosteo, producto?.id ?? "",materiales);
                    if(producto?.id){
                      handleMedidasProductoChange(producto.id, setCosteo,materiales);
                      handleCalcularMedidaCorral(producto.id, setCosteo,materiales);
                      handleCalcularTotales(producto.id, setCosteo, materiales);
                      actualizarMedidasParedes(producto.id, setCosteo);
                    }
                  }}
                  sx={{minWidth: "120px"}}
                />
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  name="peso"
                  type="number"
                  value={producto.peso?? 0}
                  onChange={(event) => handleProductoChange(event.target.value,"peso", setCosteo, producto?.id ?? "",materiales)}
                  sx={{minWidth: "120px"}}
                />
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <Select
                  variant="outlined"
                  size="small"
                  name="bantihumedad"
                  value={producto.bantihumedad || ""}
                  onChange={(event) => handleProductoChange(event.target.value,"bantihumedad", setCosteo, producto?.id ?? "",materiales)}
                  displayEmpty
                  fullWidth
                  sx={{minWidth: "120px"}}
                >
                  <MenuItem value="">Bolsa Antihumedad</MenuItem>
                  <MenuItem value="Si">Si</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <Select
                  variant="outlined"
                  size="small"
                  name="termo"
                  value={producto.termo || ""}
                  onChange={(event) => handleProductoChange(event.target.value,"termo", setCosteo, producto?.id ?? "",materiales)}
                  displayEmpty
                  fullWidth
                  sx={{minWidth: "120px"}}
                >
                  <MenuItem value="">Termo</MenuItem>
                  <MenuItem value="Si">Si</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatoMoneda(producto.precioUnitario)}</TableCell>
              {mostrarBolsa && (
                <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatoMoneda(String(producto.importeBolsaAntihumedad ?? 0))}</TableCell>
              )}


              {mostrarTermo && (
                <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatoMoneda(String(producto.importeTermo))}</TableCell>
              )}
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatoMoneda( producto.importeTotal)}</TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <IconButton onClick={() => handleAbrirModal(producto)} sx={{ color: "gray" }}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
              <TableCell padding="none" sx={{ px: 1, py: 0.5, color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <IconButton onClick={() => handleAbrirDialogoEliminar(producto)} sx={{ color: "gray" }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalInfoProducto
          open={modalProductoOpen}
          onClose={handleCerrarModal}
          productoActivo={productoActivo!}
          setCosteo={setCosteo}
          costeo={costeo}
          sucursalid={sucursalid}
          tiposMateriales={tiposMateriales}

      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCerrarDialogoEliminar}
        onConfirm={handleEliminarProducto}
        title="¿Eliminar Producto?"
        message={`¿Estás seguro de que quieres eliminar el producto "${productoAEliminar?.codigoEquipo}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default TablaProductos;
