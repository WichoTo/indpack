import React, { useState, useMemo, useEffect } from "react";
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
  IconButton,
  Typography,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Costeo,
  PolinFijacion,
  Producto,
  Tacon,
  TipoCorral,
} from "../../config/types.tsx";
import ConfirmDialog from "../general/DialogComponent.tsx";
import { useFetchMaterialesSuc } from "../../hooks/useFetchFunctions.tsx";
import {
  actualizarCodigoEquipo,
  actualizarMedidasParedes,
  calcularCantidadLargueros,
  calcularCantidadPostes,
  calcularImportesProducto,
  calcularTipoPolin,
  calcularTipoTabla,
  handleCalcularMedidaCorral,
  handleCalcularTotales,
  handleMedidasProductoChange,
  handleProductoChange,
  recalcularCodigosProductos,
  recalcularGrosor,
} from "../../hooks/useFetchCosteo.tsx";
import { formatoMoneda } from "../../hooks/useUtilsFunctions.tsx";
import ModalInfoProducto from "./ModalInfoProducto.tsx";

interface TablaProductosProps {
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid: string;
  tiposMateriales: Record<string, string[]>;
}

const TablaProductos: React.FC<TablaProductosProps> = ({
  costeo,
  setCosteo,
  sucursalid,
  tiposMateriales,
}) => {
  const { materiales } = useFetchMaterialesSuc(sucursalid);
useEffect(() => {
  setCosteo(prev => ({
    ...prev,
    productos: prev.productos.map(p => calcularImportesProducto(p, materiales))
  }));
}, [costeo.productos, materiales]);

  const handleAgregarProducto = () => {
    setCosteo((prevState) => {
      if (!prevState) return prevState;

      const nuevoIndex = prevState.productos.length + 1;
      const nuevosProductos = [...prevState.productos];
      const idUnico: string = crypto.randomUUID();

      // Variables de dimensiones base
      const incrLargoBase = 9;
      const incrAnchoBase = 9;
      const incrAltoBase = 10;
      const grosorBase = 3;

      const largoEquipoInicial = 0;
      const anchoEquipoInicial = 0;
      const altoEquipoInicial = 0;

      const largoEmpaque =
        largoEquipoInicial + 2 * grosorBase + 2 * incrLargoBase;
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
        cantidadSGolpe: 0,
        
        importeSGolpe: 0,
        cantidadSPOS: 0,
        importeSPOS: 0,
        cantidadSENAL: 0,
        importeSENAL: 0,
        importeDesec: 0,
        precioBolsa: 0,
        cantidadTermo: 0,
        importeTermo: 0,

        
        detalles: {},

        polinesAbajo: [
          {
            cantidad: 3,
            tipo: calcularTipoPolin(0, materiales),
            medida: largoEmpaque,
          },
        ],
        tipoTacon: "",
        tacon: {} as Tacon,
        tipoCorral: "" as TipoCorral,
        corral: [],
        porterias: {
          cantidad: 0,
          tipoPolin: calcularTipoPolin(0, materiales),
          medida: 2 * altoEmpaque + anchoEmpaque,
        },
        maderaExtra: {
          tipoPolin: calcularTipoPolin(0, materiales),
          medida: 0,
        },
        polinAmarre: {
          cantidad: 0,
          tipoPolin: calcularTipoPolin(0, materiales),
          medida: anchoEmpaque,
        },
        polinesFijacion: [] as PolinFijacion[],
        tendido: {
          tipo: "T7/8",
          cantidad: parseFloat((largoEmpaque / 14).toFixed(2)),
          extra: 0,
          medida: anchoEmpaque,
        },
        paredes: {
          tipoParedes: "OSB12",
          largo2y4: anchoEmpaque,
          alto2y4: altoEmpaque,
          largo1y3: largoEmpaque,
          alto1y3: altoEmpaque + 9,
          largoTecho: largoEmpaque,
          altoTecho: anchoEmpaque + 2 * grosorBase,
          tipoMarco: calcularTipoTabla(0, materiales),
        },
        duelas: {
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
          
        },
        
      };
      if (nuevoProducto.id) {
        handleCalcularTotales(nuevoProducto.id, setCosteo, materiales);
      }
      const nuevoEstado = {
        ...prevState,
        productos: [...nuevosProductos, nuevoProducto],
      };

      return nuevoEstado;
    });
  };

  const montoTotal = useMemo(() => {
    return costeo.productos.reduce((total, producto) => {
      return total + (producto.precioFinal ?? 0);
    }, 0);
  }, [costeo.productos]);

  const mostrarBolsa = costeo.productos.some(
    (producto) => producto.bantihumedad === "Si"
  );
  const mostrarTermo = costeo.productos.some(
    (producto) => producto.termo === "Si"
  );

  const [productoActivo, setProductoSeleccionado] = useState<Producto | null>(
    null
  );
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const handleAbrirModal = (producto: Producto) => {
    setModalProductoOpen(true);
    if (producto?.id) {
      setProductoSeleccionado(producto);
    }
  };

  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
    setModalProductoOpen(false);
  };
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
    null
  );
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
      const productosActualizados = prevPedido.productos.filter(
        (p) => p.id !== productoAEliminar.id
      );
      const nuevoEstado = { ...prevPedido, productos: productosActualizados };
      setTimeout(() => recalcularCodigosProductos(setCosteo), 0);
      return nuevoEstado;
    });
    handleCerrarDialogoEliminar();
  };
const columnasFijas = 15;
const totalColumnas = columnasFijas + (mostrarBolsa ? 1 : 0) + (mostrarTermo ? 1 : 0);


  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          maxWidth: "100vw",
          minWidth: "900px",
          borderRadius: 3,
          boxShadow: 5,
          overflowX: "auto",
          
        }}
      >
        
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--primary-color)", width: '100%' }}>
              <TableCell colSpan={totalColumnas} sx={{ backgroundColor: "var(--primary-color)", p: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
                    <IconButton
                      onClick={handleAgregarProducto}
                      sx={{
                        color: "white",
                        bgcolor: "var(--primary-color)",
                        "&:hover": { bgcolor: "var(--secondary-color)" },
                        mr: 1,
                      }}
                    >
                      <AddIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                    <Typography variant="h6" color="white" fontWeight={600}>
                      Agregar equipo
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    Total:&nbsp;
                    <span style={{ fontWeight: 900 }}>{formatoMoneda(montoTotal)}</span>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "var(--primary-color)" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)" }}>
                CÓDIGO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                CANT.
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                TIPO EQUIPO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                SERVICIO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)",minWidth:260 }}>
                EQUIPO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                LARGO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                ANCHO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                ALTO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                PESO (KG)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                B.ANTIHUMEDAD
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                TERMO
              </TableCell>
              {mostrarBolsa && (
                <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                  IMPORTE B.ANTIHUMEDAD
                </TableCell>
              )}
              {mostrarTermo && (
                <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                  IMPORTE TERMO
                </TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                P. UNIT.
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                IMPORTE TOTAL
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold",backgroundColor: "var(--primary-color)"  }}>
                MÁS INFO
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" ,backgroundColor: "var(--primary-color)" }}>
                ELIMINAR
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costeo.productos.length > 0 &&
              costeo.productos.map((producto) => (
                <TableRow
                  key={producto.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "#f7fafd",
                    },
                  }}
                >
                  <TableCell sx={{ px: 1, py: 0.5, fontWeight: 500 }}>
                    {producto.codigoEquipo || ""}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      name="cantidad"
                      sx={{ minWidth: "90px" }}
                      value={producto.cantidad || ""}
                      onChange={event => {
                        handleProductoChange(
                          event.target.value,
                          "cantidad",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        // Recalcula totales, pero dale un micro-tiempo para que React actualice el state
                        setTimeout(() => {
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          recalcularCodigosProductos(setCosteo);
                        }, 0);
                      }}

                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="tipoEquipo"
                      value={producto.tipoEquipo || ""}
                      onChange={(event) => {
                        const nuevoTipo = event.target.value as string;
                        handleProductoChange(
                          nuevoTipo,
                          "tipoEquipo",
                          setCosteo,
                          producto.id,
                          materiales
                        );
                        setCosteo((prev) => ({
                          ...prev,
                          productos: prev.productos.map((p) =>
                            p.id === producto.id
                              ? {
                                  ...p,
                                  grosor: recalcularGrosor({
                                    ...p,
                                    tipoEquipo: nuevoTipo,
                                  }),
                                }
                              : p
                          ),
                        }));
                        handleMedidasProductoChange(
                          producto.id,
                          setCosteo,
                          materiales
                        );
                        handleCalcularMedidaCorral(
                          producto.id,
                          setCosteo,
                          materiales
                        );
                        handleCalcularTotales(
                          producto.id,
                          setCosteo,
                          materiales
                        );
                        actualizarMedidasParedes(producto.id, setCosteo);
                      }}
                      displayEmpty
                      fullWidth
                      sx={{ minWidth: "110px" }}
                    >
                      <MenuItem value="">Selecciona tipo</MenuItem>
                      <MenuItem value="Caja">Caja</MenuItem>
                      <MenuItem value="Tarima">Tarima</MenuItem>
                      <MenuItem value="Huacal">Huacal</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="servicio"
                      value={producto.servicio || ""}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "servicio",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                        }
                      }}
                      displayEmpty
                      fullWidth
                      sx={{ minWidth: "110px" }}
                    >
                      <MenuItem value="">Servicio</MenuItem>
                      <MenuItem value="Si">Si</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="equipo"
                      value={producto.equipo || ""}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "equipo",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                        }
                      }}
                      sx={{ minWidth:260}}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="largoEquipo"
                      type="number"
                      value={producto.largoEquipo || 0}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "largoEquipo",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleMedidasProductoChange(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularMedidaCorral(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          actualizarMedidasParedes(producto.id, setCosteo);
                        }
                      }}
                      sx={{ minWidth: "90px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="anchoEquipo"
                      type="number"
                      value={producto.anchoEquipo || 0}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "anchoEquipo",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleMedidasProductoChange(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularMedidaCorral(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          actualizarMedidasParedes(producto.id, setCosteo);
                        }
                      }}
                      sx={{ minWidth: "90px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="altoEquipo"
                      type="number"
                      value={producto.altoEquipo || 0}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "altoEquipo",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleMedidasProductoChange(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularMedidaCorral(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          actualizarMedidasParedes(producto.id, setCosteo);
                        }
                      }}
                      sx={{ minWidth: "90px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="peso"
                      type="number"
                      value={producto.peso ?? 0}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "peso",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleMedidasProductoChange(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularMedidaCorral(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                          actualizarMedidasParedes(producto.id, setCosteo);
                        }
                      }}
                      sx={{ minWidth: "90px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="bantihumedad"
                      value={producto.bantihumedad || ""}
                      onChange={(event) => {
                        handleProductoChange(
                          event.target.value,
                          "bantihumedad",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        );
                        if (producto?.id) {
                          handleCalcularTotales(
                            producto.id,
                            setCosteo,
                            materiales
                          );
                        }
                      }}
                      displayEmpty
                      fullWidth
                      sx={{ minWidth: "90px" }}
                    >
                      <MenuItem value="">B.Antihumedad</MenuItem>
                      <MenuItem value="Si">Si</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="termo"
                      value={producto.termo || ""}
                      onChange={(event) =>
                        handleProductoChange(
                          event.target.value,
                          "termo",
                          setCosteo,
                          producto?.id ?? "",
                          materiales
                        )
                      }
                      displayEmpty
                      fullWidth
                      sx={{ minWidth: "90px" }}
                    >
                      <MenuItem value="">Termo</MenuItem>
                      <MenuItem value="Si">Si</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </TableCell>
                  {mostrarBolsa && (
                    <TableCell sx={{ px: 1, py: 0.5 }}>
                      {formatoMoneda(
                        String(producto.bolsaAntihumedad?.importeTotal ?? 0)
                      )}
                    </TableCell>
                  )}
                  {mostrarTermo && (
                    <TableCell sx={{ px: 1, py: 0.5 }}>
                      {formatoMoneda(String(producto.importeTermo))}
                    </TableCell>
                  )}
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    {formatoMoneda(String(producto.importeTotalFinanciamiento))}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5, fontWeight: 700 }}>
                    {formatoMoneda(String(producto.precioFinal))}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Tooltip title="Ver detalle">
                      <IconButton
                        onClick={() => handleAbrirModal(producto)}
                        sx={{ color: "var(--primary-color)" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleAbrirDialogoEliminar(producto)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
