import React, { useState } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';
import { Totales,  Producto, Costeo, MaterialSuc } from '../../config/types';
import { handleImporteChange, handleCalcularTotales } from '../../hooks/useFetchCosteo';
import ModalBolsaAntihumedad from './ModalBolsaAntihumedad';

interface TotalesTableProps {
  totales: Totales[];
  materiales: MaterialSuc[];
  producto: Producto;
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>;
}

export const TotalesTable: React.FC<TotalesTableProps> = ({
  totales,
  materiales,
  producto,
  setPedidoActivo,
}) => {
  const [modalBolsaOpen, setModalBolsaOpen] = useState(false);

  // Asumimos que producto.bantihumedad y producto.termo son "Si" o "No" (o undefined).
  // Mapeo que relaciona el tipo de extra con la propiedad de cantidad en producto:
  const mapeoExtras: Record<string, string> = {
    'DESEC.':           'cantidadDesec',
    'S.GOLPE':          'cantidadSGolpe',
    'S.POS.':           'cantidadSPOS',
    'SEÑAL':            'cantidadSENAL',
    'BolsaAntihumedad': 'cantidadBolsa',   // Usaremos cantidadBolsa
    'Termo':            'cantidadTermo',
  };
const actualizarPreciosTotales = () => {
  setPedidoActivo(prev => {
    if (!prev) return prev;

    return {
      ...prev,
      productos: prev.productos.map(p => {
        if (p.id !== producto.id) return p;

        // 1) Precios base de extras:
        const precioBolsa  = materiales.find(m => m.nombre === 'BolsaAntihumedad')?.precio;
        const precioDesec  = materiales.find(m => m.nombre === 'DESEC.')?.precio;
        const precioSGolpe = materiales.find(m => m.nombre === 'S.GOLPE')?.precio;
        const precioSPOS   = materiales.find(m => m.nombre === 'S.POS.')?.precio;
        const precioSenal  = materiales.find(m => m.nombre === 'SEÑAL')?.precio;
        const precioTermo  = materiales.find(m => m.nombre === 'Termo')?.precio;

        // 2) Reconstrucción completa de bolsaAntihumedad:
        const prevBolsa = p.bolsaAntihumedad ?? {} as any;
        const nuevaBolsaAntihumedad = {
          cantidad:        prevBolsa.cantidad ?? 0,
          cantidadBase:    prevBolsa.cantidadBase ?? 0,
          cantidadParedes: prevBolsa.cantidadParedes ?? 0,
          largobase:       prevBolsa.largobase ?? 0,
          anchobase:       prevBolsa.anchobase ?? 0,
          indicebase:      prevBolsa.indicebase ?? 0,
          largoparedes:    prevBolsa.largoparedes ?? 0,
          altoparedes:     prevBolsa.altoparedes ?? 0,
          indiceparedes:   prevBolsa.indiceparedes ?? 0,
          precioUnitario:  precioBolsa ?? prevBolsa.precioUnitario ?? 0,
          importeTotal:    Math.round((precioBolsa ?? prevBolsa.precioUnitario ?? 0) * (prevBolsa.cantidad ?? 0) * 100) / 100,
        };

        // 3) Recalcular catálogo completo de totales (polines, duelas, extras…)
        const totalesActualizados: Totales[] = p.totales.map(t => {
          // nuevo precio según tipo
          const nuevoPrecio = materiales.find(m => m.nombre === t.tipo)?.precio
                              ?? t.precioUnitario!;
          // definimos factor: si tiene 'medida' > 0 la usamos, sino 'cantidad'
          const factor = t.medida && t.medida > 0 ? t.medida : t.cantidad!;
          return {
            ...t,
            precioUnitario: nuevoPrecio,
            precioTotal:    Math.round(nuevoPrecio * factor * 100) / 100,
          };
        });

        return {
          ...p,
          // 4) sustituir bolsa y extras
          bolsaAntihumedad: nuevaBolsaAntihumedad,
          precioDesec:      precioDesec  ?? p.precioDesec   ?? 0,
          precioSGolpe:     precioSGolpe ?? p.precioSGolpe  ?? 0,
          precioSPOS:       precioSPOS   ?? p.precioSPOS    ?? 0,
          precioSENAL:      precioSenal  ?? p.precioSENAL   ?? 0,
          precioTermo:      precioTermo  ?? p.precioTermo   ?? 0,
          // 5) reemplazar totales
          totales: totalesActualizados,
        };
      })
    };
  });

  // 6) volver a generar importes generales (directo, indirecto, factor…)
  handleCalcularTotales(producto.id, setPedidoActivo, materiales);
};



  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mt: 3,
          mb: 1,
          color: 'var(--primary-color)',
        }}
      >
        Totales
      </Typography>
       <button
        onClick={actualizarPreciosTotales}
        style={{
          background: 'var(--secondary-color)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '6px 16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        title="Actualizar precios de materiales"
      >
        Actualizar precios
      </button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo de Polín / Extra</TableCell>
              <TableCell align="right">Cant. / Medida</TableCell>
              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="right">Costo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {totales.map((total, idx) => {


              // 2) ¿Es alguno de los extras?
              const campoCantidad = mapeoExtras[total.tipo];
              const esExtra = Boolean(campoCantidad);
              const esDesec = total.tipo === 'DESEC.';
              const largo = (producto.largoEmpaque || 0)/100;
              const alto  = (producto.altoEmpaque  || 0)/100;
              const ancho = (producto.anchoEmpaque || 0)/100;
              const volumen = largo * alto * ancho;
              const cantidadDesecAuto = Math.ceil(((volumen) ?? 0)) + 1;


              // 3) Valor actual de la cantidad en producto (solo si es extra)
              const valorCantidad = esExtra
                ? (producto as any)[campoCantidad] || ''
                : 0;

              // 4) Medida para materiales normales
              const medidaFormateada = (total.medida ?? 0).toFixed(2);

              // 5) Detectar si la fila corresponde a “BolsaAntihumedad” o a “Termo”
              const esBolsa = total.tipo === 'BolsaAntihumedad';
              const esTermo = total.tipo === 'Termo';

              // 6) Si es “BolsaAntihumedad” pero producto.bantihumedad !== "Si", no mostrar
              if (esBolsa && producto.bantihumedad !== 'Si') {
                return null;
              }
              // 7) Si es “Termo” pero producto.termo !== "Si", no mostrar
              if (esTermo && producto.termo !== 'Si') {
                return null;
              }

              return (
                <TableRow key={idx}>
                  {/* COLUMNA 1: Tipo de Polín / Extra */}
                  <TableCell sx={{ width: 90, marginLeft: 'auto' }}>{total.tipo}</TableCell>

                  {/* COLUMNA 2: Cantidad (input si es extra) o Medida (texto) */}
                  <TableCell align="right">
                  
                    {esBolsa ? (
                          <Box sx={{ width: 90, marginLeft: 'auto' }}>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ min: 0, step: 1, readOnly: true }} // Ojo: readOnly para bloquear edición directa
                              name={campoCantidad}
                              value={producto.bolsaAntihumedad?.cantidad}
                              onClick={() => {
                                setModalBolsaOpen(true);
                              }}
                            />
                          </Box>
                        ) : esDesec ? (
                      <Box sx={{ width: 90, marginLeft: 'auto' }}>
                       <Box sx={{ width: 90, marginLeft: 'auto' }}>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                          name="cantidadDesec"
                          value={producto.cantidadDesec ?? cantidadDesecAuto}
                          onChange={(e) => {
                            const raw = e.target.value;
                            // si está vacío usamos la cantidad automática
                            const nuevaCant = raw === '' ? cantidadDesecAuto : parseInt(raw, 10);
                            setPedidoActivo(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                productos: prev.productos.map(p => {
                                  if (p.id !== producto.id) return p;
                                  // precio unitario actual de desec
                                  const precioUnit = p.precioDesec ?? 0;
                                  return {
                                    ...p,
                                    cantidadDesec: nuevaCant,
                                    automaticoDesec: raw === '',
                                    importeDesec: Math.round(precioUnit * nuevaCant * 100) / 100,
                                  };
                                })
                              };
                            });
                            // vuelves a recalcualar el resto de totales
                            handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                          }}
                          onBlur={(e) => {
                            // si el usuario borró todo, restauramos el modo automático
                            if (e.target.value === '') {
                              setPedidoActivo(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  productos: prev.productos.map(p => {
                                    if (p.id !== producto.id) return p;
                                    return {
                                      ...p,
                                      cantidadDesec: cantidadDesecAuto,
                                      automaticoDesec: true,
                                      importeDesec: Math.round((p.precioDesec ?? 0) * cantidadDesecAuto * 100) / 100,
                                    };
                                  })
                                };
                              });
                              handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                            }
                          }}
                        />
                      </Box>

                      </Box>
                    ) :esExtra ? (
                      <Box sx={{ width: 90, marginLeft: 'auto' }}>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                          name={campoCantidad}
                          value={valorCantidad}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // 1) Actualizamos la cantidad en producto
                            handleImporteChange(e, setPedidoActivo, materiales, producto);
                            // 2) Recalculamos todos los totales
                            handleCalcularTotales(producto.id, setPedidoActivo, materiales);
                          }}
                        />
                      </Box>
                    ) :(
                      <Typography>{medidaFormateada}</Typography>
                    )}
                  </TableCell>

                  {/* COLUMNA 3: Precio Unitario */}
                  <TableCell align="right">
                    {formatoMoneda(total.precioUnitario! )}
                  </TableCell>

                  {/* COLUMNA 4: Costo */}
                  <TableCell align="right">
                    {esBolsa
                      ? formatoMoneda(producto.bolsaAntihumedad?.importeTotal ?? 0)
                      : esTermo
                      ? formatoMoneda(producto.importeTermo ?? 0)
                       : esDesec
                      ? formatoMoneda(producto.importeDesec ?? 0)
                      : formatoMoneda(total.precioTotal)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalBolsaAntihumedad
        open={modalBolsaOpen}
        onClose={() => setModalBolsaOpen(false)}
        productoActivo={producto}
        setPedidoActivo={setPedidoActivo}
        materiales={materiales}
      />
    </>
  );
};
