
import {  CorralGeneral, CorralTopes, Costeo , Material, MaterialSuc, Producto, Tacon, TaconCorrido, TaconPieza } from "../config/types";
import {   useMemo } from "react";
import {  useFetchMaterialesSuc } from "./useFetchFunctions";
import { useSucursal } from "../config/context/SucursalContext";


 export const alturasPorTipo: Record<string, number> = {
    P6X4: 14,
    P4X4: 9,
    P4X3: 9,
    P4X2: 4,
  };

  export const calcularCantidadPostes = (largoEmpaque: number) => {
  if (largoEmpaque <= 122) return 4;
  if (largoEmpaque > 122 && largoEmpaque <= 244) return 6;
  if (largoEmpaque > 244 && largoEmpaque <= 366) return 8;
  return 10;
};

export const calcularCantidadLargueros = (altoEmpaque: number) => {
  if (altoEmpaque <= 244) return 4;
  if (altoEmpaque > 244 && altoEmpaque <= 366) return 6;
  if (altoEmpaque > 366 && altoEmpaque <= 448) return 8;
  return 10;
};

export const recalcularCodigosProductos = (
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>
) => {
  setPedidoActivo((prevState) => {
    if (!prevState) return prevState;

    const productosActualizados = prevState.productos.map((producto, index) => {
      return {
        ...producto,
        codigoEquipo: actualizarCodigoEquipo(index + 1, producto.cantidad),
      };
    });

    return { ...prevState, productos: productosActualizados };
  });
};
export const actualizarCodigoEquipo = (index: number, cantidad: number): string => {
  const letra = String.fromCharCode(65 + index - 1).toLowerCase();
  if (cantidad <= 1) {
    return `${letra}1`;
  }
  return `${letra}1-${letra}${cantidad}`;
};
export const actualizarCodigoEnPedido = (
  nuevaCantidad: number,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  productoId: string
) => {
  setPedidoActivo((prevState) => {
    if (!prevState) return prevState;
    const index = prevState.productos.findIndex((p) => p.id === productoId);
    if (index === -1) return prevState;
    const nuevoCodigoEquipo = actualizarCodigoEquipo(index + 1, nuevaCantidad);
    return {
      ...prevState,
      productos: prevState.productos.map((p, i) =>
        i === index ? { ...p, codigoEquipo: nuevoCodigoEquipo } : p
      ),
    };
  });
};
export function calcularTipoPorPeso(
  peso: number,
  materiales: Material[],
  tipoMaterial: string
): string {
  // 1) Nos quedamos sólo con el tipo que nos interesa
  const lista = materiales
    .filter(m => m.tipo === tipoMaterial)
    // 2) Definimos un umbral mínimo: si está nulo lo tratamos como 0
    .map(m => ({
      ...m,
      pesoMinimo: m.pesoMaximo ?? 0
    }))
    // 3) Ordenamos de menor a mayor pesoMinimo
    .sort((a, b) => a.pesoMinimo - b.pesoMinimo)

  if (lista.length === 0) return ''

  // 4) Nos quedamos con los umbrales <= peso actual
  const candidatos = lista.filter(m => peso >= m.pesoMinimo)

  // 5) Si hay candidatos, elegimos el de mayor pesoMinimo; si no, el primero
  const elegido = candidatos.length
    ? candidatos[candidatos.length - 1]
    : lista[0]

  return elegido.nombre
}



export const calcularTipoPolin = (peso: number, materiales: Material[]) =>
  calcularTipoPorPeso(peso, materiales, 'Polines')

export const calcularTipoTabla = (peso: number, materiales: Material[]) =>
  calcularTipoPorPeso(peso, materiales, 'Tablas')

export const calcularTipoDuela = (peso: number, materiales: Material[]) =>
  calcularTipoPorPeso(peso, materiales, 'Duelas')

export const calcularTipoPared = (peso: number, materiales: Material[]) =>
  calcularTipoPorPeso(peso, materiales, 'Paredes')

/**
 * Actualiza el pedido activo recalculando:
 * - precioUnitario = suma de materiales + importes adicionales
 * - totales de materiales agrupados
 * - varios, manoObra, flete (15%, 50%, 15% de precioUnitario)
 * - importeTotal = (precioUnitario + varios + manoObra + flete) * factor
 */
export const handleCalcularTotales = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: Material[],
) => {
  setPedidoActivo(prev => {
    if (!prev) return prev

    const producto = prev.productos.find(p => p.id === productoID)
    if (!producto) return prev

    // 1) Agrupar materiales y calcular precioTotalMateriales
    const agrupados: Record<string, { medidaTotal: number; tipo: string; precioMaterial: number }> = {}
    let precioTotalMateriales = 0

    const agregarAMedidaTotal = (
      tipo: string,
      cantidad: number,
      medida: number,
      usarFormula: boolean = true,
    ) => {
      const medidaTotal = usarFormula
        ? (cantidad * medida / 420) * 1.15
        : cantidad * medida
      const precioMaterial = materiales.find(m => m.nombre === tipo)?.precio ?? 0

      if (agrupados[tipo]) {
        agrupados[tipo].medidaTotal += medidaTotal
      } else {
        agrupados[tipo] = { medidaTotal, tipo, precioMaterial }
      }
      precioTotalMateriales += medidaTotal * precioMaterial
    }

    // --- aquí tu lógica existente para polinesAbajo, tacon, corral, etc. ---
    producto.polinesAbajo?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    )
    if (producto.tipoTacon === 'Corrido') {
      const t = producto.tacon as any
      agregarAMedidaTotal(t.tipoPolin, Number(t.cantidad) || 0, Number(t.medida) || 0)
    } else if (producto.tipoTacon === 'Pieza') {
      const t = producto.tacon as any
      agregarAMedidaTotal(t.tipoPolin, Number(t.cantidad) || 0, 0.3, false)
    }
    if (producto.corral?.length) {
      const c = producto.corral[0]
      const medidaFinal = c.tipoCorral === 'Topes' ? 25 : c.medida
      agregarAMedidaTotal(c.tipoPolin, 1, medidaFinal)
    }
    if (producto.porterias)
      agregarAMedidaTotal(
        producto.porterias.tipoPolin,
        producto.porterias.cantidad,
        producto.porterias.medida
      )
    if (producto.maderaExtra?.tipoPolin)
      agregarAMedidaTotal(
        producto.maderaExtra.tipoPolin,
        1,
        producto.maderaExtra.medida
      )
    if (producto.polinAmarre)
      agregarAMedidaTotal(
        producto.polinAmarre.tipoPolin,
        producto.polinAmarre.cantidad,
        producto.polinAmarre.medida
      )
    producto.polinesFijacion?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    )
    if (producto.tendido)
      agregarAMedidaTotal(
        producto.tendido.tipo,
        producto.tendido.cantidad,
        producto.tendido.medida + producto.tendido.extra
      )
    if (producto.duelas) {
      const tipoDuela = producto.duelas.tipoDuela || 'Duela'
      producto.duelas.postes.forEach(ps =>
        agregarAMedidaTotal(tipoDuela, ps.cantidad, ps.medida)
      )
      producto.duelas.largueros.forEach(lg =>
        agregarAMedidaTotal(tipoDuela, lg.cantidad, lg.medida)
      )
      if (producto.duelas.duelate) {
        const d = producto.duelas.duelate
        agregarAMedidaTotal(tipoDuela, d.postes.cantidad, d.postes.medida)
        agregarAMedidaTotal(tipoDuela, d.largueros.cantidad, d.largueros.medida)
      }
    }
    if (producto.paredes.tipoParedes) {
      const hojas = calcularHojasNecesarias(
        producto.paredes.largo1y3 || 0,
        producto.paredes.alto1y3 || 0,
        producto.paredes.largo2y4 || 0,
        producto.paredes.alto2y4 || 0,
        producto.paredes.largoTecho || 0,
        producto.paredes.altoTecho || 0,
      )
      agregarAMedidaTotal(
        producto.paredes.tipoParedes,
        1,
        hojas,
        false
      )
    }

    // 2) Convertir agrupados a array para UI
    const resumen = Object.values(agrupados).map(d => ({
      tipo: d.tipo,
      cantidad: 0,
      medida: d.medidaTotal,
      precioTotal: d.precioMaterial * d.medidaTotal,
      pesoTotal: 0,
    }))

    // 3) Sumar importes adicionales
    const impBolsa  = Number(producto.importeBolsaAntihumedad ?? 0)
    const impTermo  = Number(producto.importeTermo           ?? 0)
    const impDesec  = Number(producto.importeDesec           ?? 0)
    const impSG     = Number(producto.importeSGolpe          ?? 0)
    const impSPOS   = Number(producto.importeSPOS            ?? 0)
    const impSenal  = Number(producto.importeSENAL           ?? 0)
    const sumaExtras = impBolsa + impTermo + impDesec + impSG + impSPOS + impSenal

    // 4) Calcular importeMaterialDirecto (materiales + extras)
    const importeMaterialDirecto = precioTotalMateriales + sumaExtras

    // 5) Calcular varios, manoObra y flete sobre importeMaterialDirecto
    const varios   = importeMaterialDirecto * 0.15
    const manoObra = importeMaterialDirecto * 0.5
    const flete    = importeMaterialDirecto * 0.15

    // 6) Aplicar factor
    const factor = Number(producto.factor) || 1.4

    // 7) Importe total final
    const importeTotal = (importeMaterialDirecto + varios + manoObra + flete) * factor

    // 8) Devolver estado actualizado con importeMaterialDirecto incluido
    return {
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoID
          ? {
              ...p,
              importeMaterialDirecto,
              totales: resumen,
              varios,
              manoObra,
              flete,
              factor,
              importeTotal,
            }
          : p
      ),
    }
  })
}



export const handleCalcularTotales2 = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: Material[],
) => {
  //calcularDuelas(productoID, setPedidoActivo);

  setPedidoActivo((prevPedido) => {
    if (!prevPedido) return prevPedido;
    
    const producto = prevPedido.productos.find((p) => p.id === productoID);
    if (!producto) return prevPedido;

    const agrupados: Record<string, { medidaTotal: number; tipo: string; precioMaterial: number }> = {};
    let precioTotalMateriales = 0;

    const agregarAMedidaTotal = (
      tipo: string,
      cantidad: number,
      medida: number,
      usarFormula: boolean = true
    ) => {
      // 🔥 Solo aplicar la fórmula si `usarFormula` es `true`
      let medidaTotal = usarFormula ? (cantidad * medida / 420) * 1.15 : cantidad * medida;
      const precioMaterial = obtenerPrecioMaterial(tipo, materiales);
    
      if (agrupados[tipo]) {
        agrupados[tipo].medidaTotal += medidaTotal;
      } else {
        agrupados[tipo] = { medidaTotal, tipo, precioMaterial };
      }
    
      precioTotalMateriales += medidaTotal * precioMaterial;
    };

    // 🔹 Agregar materiales aunque el corral no esté definido
    producto.polinesAbajo?.forEach((polin) => agregarAMedidaTotal(polin.tipo, polin.cantidad, polin.medida));

    if (producto.tipoTacon === "Corrido") {
      const t = producto.tacon as TaconCorrido;
      const cantidad = Number(t.cantidad) ||  0;
      const medida   = Number(t.medida)   || 0;
      agregarAMedidaTotal(t.tipoPolin, cantidad, medida /*usarFormula por defecto*/);
    }
    if (producto.tipoTacon === "Pieza") {
      const t = producto.tacon as TaconPieza;
      const cantidad = Number(t.cantidad) || 0;
      agregarAMedidaTotal(t.tipoPolin, (cantidad), .3, /*usarFormula*/ );
    }

    // 🔹 Verificar si el corral existe antes de acceder a sus datos
    if (producto.corral?.length > 0) {
      const corralItem = producto.corral[0];
      const medidaFinal = corralItem.tipoCorral === "Topes" ? 25 : corralItem.medida;
      agregarAMedidaTotal(corralItem.tipoPolin, 1, medidaFinal);
    }

    if (producto.porterias) {
      agregarAMedidaTotal(producto.porterias.tipoPolin, producto.porterias.cantidad, producto.porterias.medida);
    }
    if (producto.maderaExtra?.tipoPolin) {
      agregarAMedidaTotal(producto.maderaExtra.tipoPolin, 1, producto.maderaExtra.medida);
    }
    if (producto.polinAmarre) {
      agregarAMedidaTotal(producto.polinAmarre.tipoPolin, producto.polinAmarre.cantidad, producto.polinAmarre.medida);
    }
    producto.polinesFijacion?.forEach((polin) => agregarAMedidaTotal(polin.tipo, polin.cantidad, polin.medida));
    if (producto.tendido) {
      agregarAMedidaTotal(producto.tendido.tipo, producto.tendido.cantidad, producto.tendido.medida + producto.tendido.extra);
    }

    // 🔹 Agregar duelas
    if (producto.duelas) {
      const tipoDuela = producto.duelas.tipoDuela || "Duela";

      producto.duelas.postes.forEach((poste) => {
        agregarAMedidaTotal(tipoDuela, poste.cantidad, poste.medida);
      });

      producto.duelas.largueros.forEach((larguero) => {
        agregarAMedidaTotal(tipoDuela, larguero.cantidad, larguero.medida);
      });

      if (producto.duelas.duelate) {
        agregarAMedidaTotal(tipoDuela, producto.duelas.duelate.postes.cantidad, producto.duelas.duelate.postes.medida);
        agregarAMedidaTotal(tipoDuela, producto.duelas.duelate.largueros.cantidad, producto.duelas.duelate.largueros.medida);
      }
    }

    // 🔹 Agregar paredes
    if (producto.paredes.tipoParedes) {
      const hojasNecesarias = calcularHojasNecesarias(
        producto.paredes?.largo1y3 || 0,
        producto.paredes?.alto1y3 || 0,
        producto.paredes?.largo2y4 || 0,
        producto.paredes?.alto2y4 || 0,
        producto.paredes?.largoTecho || 0,
        producto.paredes?.altoTecho || 0
      );
      agregarAMedidaTotal(producto.paredes.tipoParedes, 1, hojasNecesarias,false);
    }

    // 🔹 Convertir en array para la tabla con el precio total
    const resumen = Object.entries(agrupados).map(([tipo, data]) => ({
      tipo,
      cantidad: 0,
      medida: data.medidaTotal,
      precioTotal: data.precioMaterial * data.medidaTotal,
      pesoTotal: 0,
    }));

    // 🔹 Calcular el importe total del producto
    const importeTotal =
  (precioTotalMateriales +
    (isNaN(parseFloat((producto.importeTermo ?? 0).toString())) ? 0 : parseFloat((producto.importeTermo ?? 0).toString())) +
    (isNaN(parseFloat((producto.importeBolsaAntihumedad ?? 0).toString())) ? 0 : parseFloat((producto.importeBolsaAntihumedad ?? 0).toString()))) *
  producto.cantidad;


    // 🔹 Actualizar el `pedidoActivo` modificando el producto específico
    return {
      ...prevPedido,
      productos: prevPedido.productos.map((p) =>
        p.id === productoID
          ? {
              ...p,
              precioUnitario: precioTotalMateriales,
              totales: resumen,
              importeTotal, // 🔥 Agregamos `importeTotal` al producto
            }
          : p
      ),
    };
  });
};



const obtenerPrecioMaterial = (nombre: string, materiales: Material[]): number => {
  const material = materiales.find((mat) => mat.nombre === nombre);
  
  return material ? material.precio : 0; 
};

export const handleDuelasChange = (
  productoID: string,
  tipo: "largueros" | "postes" | "duelatePostes" | "duelateLargueros",
  propiedad: "cantidad" | "medida",
  index: number | null,
  nuevoValor: number,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>
) => {
  setPedidoActivo((prevPedido) => {
    if (!prevPedido) return prevPedido;

    return {
      ...prevPedido,
      productos: prevPedido.productos.map((producto) => {
        if (producto.id !== productoID) return producto;

        // 🔹 Asegurar que `duelas` y sus propiedades existan
        const nuevasDuelas = {
          tipoDuela: producto.duelas?.tipoDuela ?? "",
          postes: producto.duelas?.postes ?? [{ cantidad: 0, medida: 0 }],
          largueros: producto.duelas?.largueros ?? [{ cantidad: 0, medida: 0 }],
          duelate: producto.duelas?.duelate ?? {
            postes: { cantidad: 0, medida: 0 },
            largueros: { cantidad: 0, medida: 0 },
          },
        };

        if (tipo === "duelatePostes") {
          nuevasDuelas.duelate = {
            ...nuevasDuelas.duelate,
            postes: {
              ...nuevasDuelas.duelate.postes,
              [propiedad]: nuevoValor,
            },
          };
        } else if (tipo === "duelateLargueros") {
          nuevasDuelas.duelate = {
            ...nuevasDuelas.duelate,
            largueros: {
              ...nuevasDuelas.duelate.largueros,
              [propiedad]: nuevoValor,
            },
          };
        } else {
          // 🔹 Asegurar que hay suficientes elementos en `postes` o `largueros`
          while (nuevasDuelas[tipo].length <= (index ?? 0)) {
            nuevasDuelas[tipo].push({ cantidad: 0, medida: 0 });
          }

          // 🔹 Actualizar el valor en la lista de `postes` o `largueros`
          nuevasDuelas[tipo][index ?? 0] = {
            ...nuevasDuelas[tipo][index ?? 0],
            [propiedad]: nuevoValor,
          };
        }

        return { ...producto, duelas: nuevasDuelas };
      }),
    };
  });
};


const calcularHojasNecesarias = (
l13: number,
a13: number,
l24: number,
a24: number,
lt: number,
at: number
): number => {
const safeNum = (num: number) => (isNaN(num) ? 0 : num);

const escenarios = [
(safeNum(l13) + safeNum(l13) + safeNum(l24) + safeNum(l24) + safeNum(lt)) / 122 * (Math.max(safeNum(a13), safeNum(a24), safeNum(at)) / 244) * 1.15,
(safeNum(l13) + safeNum(l13) + safeNum(a24) + safeNum(a24) + safeNum(lt)) / 122 * (Math.max(safeNum(a13), safeNum(l24), safeNum(at)) / 244) * 1.15,
(safeNum(l13) + safeNum(l13) + safeNum(l24) + safeNum(l24) + safeNum(at)) / 122 * (Math.max(safeNum(a13), safeNum(a24), safeNum(lt)) / 244) * 1.15,
(safeNum(l13) + safeNum(l13) + safeNum(a24) + safeNum(a24) + safeNum(at)) / 122 * (Math.max(safeNum(a13), safeNum(l24), safeNum(lt)) / 244) * 1.15,
(safeNum(a13) + safeNum(a13) + safeNum(l24) + safeNum(l24) + safeNum(lt)) / 122 * (Math.max(safeNum(l13), safeNum(a24), safeNum(at)) / 244) * 1.15,
(safeNum(a13) + safeNum(a13) + safeNum(a24) + safeNum(a24) + safeNum(lt)) / 122 * (Math.max(safeNum(l13), safeNum(l24), safeNum(at)) / 244) * 1.15,
(safeNum(a13) + safeNum(a13) + safeNum(l24) + safeNum(l24) + safeNum(at)) / 122 * (Math.max(safeNum(l13), safeNum(a24), safeNum(lt)) / 244) * 1.15,
(safeNum(a13) + safeNum(a13) + safeNum(a24) + safeNum(a24) + safeNum(at)) / 122 * (Math.max(safeNum(l13), safeNum(l24), safeNum(lt)) / 244) * 1.15,
];

return Math.min(...escenarios);
};
export const handleProductoChange = (
  value: string,
  name:string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  productoID: string |undefined,
  materiales:Material[],
  numeric?:string
) => {
  
  if(productoID){
    handleCalcularTotales(productoID,setPedidoActivo,materiales)
  }
  let parsedValue: string | number = value;
  if (numeric) {
    parsedValue = value === "" ? 0 : Number(value);
  }
  setPedidoActivo((prevPedido) => {
    if (!prevPedido) return prevPedido;

    return {
      ...prevPedido,
      productos: prevPedido.productos.map((prod) =>
        prod.id === productoID ? { ...prod, [name]: parsedValue } : prod
      ),
    };
  });
};
export const calcularDuelas = (
  productoId: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales:Material[]
) => {
  handleCalcularTotales(productoId,setPedidoActivo,materiales)
  setPedidoActivo((prevPedido) => {
    if (!prevPedido) return prevPedido;

    return {
      ...prevPedido,
      productos: prevPedido.productos.map((producto) => {
        if (producto.id !== productoId) return producto;

        // 📌 Función para evitar re-renderizados innecesarios
        const objetosIguales = (obj1: any, obj2: any) => JSON.stringify(obj1) === JSON.stringify(obj2);

        // 📌 Calcular cantidad y medidas de postes y largueros
        const calcularCantidadPostes = (largoEmpaque: number) => {
          if (largoEmpaque <= 122) return 4;
          if (largoEmpaque > 122 && largoEmpaque <= 244) return 6;
          if (largoEmpaque > 244 && largoEmpaque <= 366) return 8;
          return 10;
        };

        const calcularCantidadLargueros = (altoEmpaque: number) => {
          if (altoEmpaque <= 244) return 4;
          if (altoEmpaque > 244 && altoEmpaque <= 366) return 6;
          if (altoEmpaque > 366 && altoEmpaque <= 448) return 8;
          return 10;
        };

        const nuevoDuelas = {
          tipoDuela: producto.duelas?.tipoDuela || "",

          // 🔹 Postes
          postes: [
            { cantidad: calcularCantidadPostes(producto.altoEmpaque), medida: producto.altoEmpaque },
            { cantidad: calcularCantidadPostes(producto.largoEmpaque), medida: producto.largoEmpaque },
          ],

          // 🔹 Largueros
          largueros: [
            { cantidad: calcularCantidadLargueros(producto.anchoEmpaque), medida: producto.anchoEmpaque },
            { cantidad: calcularCantidadLargueros(producto.altoEmpaque + 9), medida: producto.altoEmpaque + 9 },
          ],

          // 🔹 Duelate
          duelate: {
            postes: { cantidad: 2, medida: producto.anchoEmpaque + 2 * producto.grosor },
            largueros: {
              cantidad: calcularCantidadLargueros(producto.altoEmpaque) / 2,
              medida: producto.largoEmpaque,
            },
          },
        };

        // 📌 Evitar actualización si los valores no han cambiado
        if (objetosIguales(producto.duelas, nuevoDuelas)) return producto;

        return { ...producto, duelas: nuevoDuelas };
      }),
    };
  });
};

export const handleMedidasProductoChange = (
  productoId: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales:Material[]
) => {
  setPedidoActivo(prev => {
    if (!prev) return prev;

    const productosActualizados = prev.productos.map(prod => {
      if (prod.id !== productoId) return prod;

      // 1) Recolectar datos base
      const {
        largoEquipo,
        anchoEquipo,
        altoEquipo,
        incrLargo,
        incrAncho,
        incrAlto,
        grosor,
        peso,
        tipoTacon,
        tacon,
      } = prod;

      // 2) Recalcular dimensiones y polín
      const nuevoTipoPolin    = calcularTipoPolin(peso ?? 0,materiales);
      const nuevoLargoEmpaque = Number(largoEquipo) + 2 * grosor + 2 * incrLargo;
      const nuevoAnchoEmpaque = Number(anchoEquipo) + 2 * incrAncho;
      const nuevoAltoEmpaque  = Number(altoEquipo) + incrAlto;

      // 3) Reconstruir el objeto `tacon` según su tipo
      const cantidadTacon = (tacon as TaconCorrido | TaconPieza)?.cantidad ?? 0;
      let nuevoTacon: Tacon;
      if (tipoTacon === "Corrido") {
        nuevoTacon = {
          tipoCorral: "Corrido",
          tipoPolin:  nuevoTipoPolin,
          medida:     nuevoAnchoEmpaque,
          cantidad:   cantidadTacon,
        } as TaconCorrido;
      } else if (tipoTacon === "Pieza") {
        nuevoTacon = {
          tipoCorral: "Topes",
          tipoPolin:  nuevoTipoPolin,
          cantidad:   cantidadTacon,
        } as TaconPieza;
      } else {
        // Ningún tacón seleccionado
        nuevoTacon = {} as Tacon;
      }

      return {
        ...prod,

        // A) Empaque y polín
        largoEmpaque: nuevoLargoEmpaque,
        anchoEmpaque: nuevoAnchoEmpaque,
        altoEmpaque:  nuevoAltoEmpaque,
        tipoPolin:    nuevoTipoPolin,

        // B) Polines abajo
        polinesAbajo: prod.polinesAbajo.map(p => ({
          ...p,
          tipo:   nuevoTipoPolin,
          medida: nuevoLargoEmpaque,
        })),

        // C) Tacón (un solo objeto discriminado)
        tacon: nuevoTacon,

        // D) Porterías
        porterias: {
          cantidad:  prod.porterias?.cantidad ?? 0,
          tipoPolin: nuevoTipoPolin,
          medida:    2 * nuevoAltoEmpaque + nuevoAnchoEmpaque,
        },

        // E) Polín de amarre
        polinAmarre: {
          cantidad:  prod.polinAmarre?.cantidad ?? 0,
          tipoPolin: nuevoTipoPolin,
          medida:    nuevoLargoEmpaque,
        },

        // F) Tendido
        tendido: {
          cantidad: parseFloat((nuevoLargoEmpaque / 14).toFixed(2)),
          tipo:     calcularTipoTabla(prod.peso??0,materiales),
          medida:   nuevoAnchoEmpaque + (prod.tendido?.extra ?? 0),
          extra:    prod.tendido?.extra  ?? 0,
        },

        // G) Corral (Topes o General)
        corral: prod.corral?.map(c =>
          c.tipoCorral === "Topes"
            ? ({
                tipoCorral: "Topes",
                tipoPolin:  nuevoTipoPolin,
                cantidad:   (c as CorralTopes).cantidad ?? 0,
              } as CorralTopes)
            : ({
                tipoCorral: (c as CorralGeneral).tipoCorral,
                tipoPolin:  nuevoTipoPolin,
                medida:     (c as CorralGeneral).medida,
              } as CorralGeneral)
        ) ?? [],

        // H) Polines de fijación
        polinesFijacion: prod.polinesFijacion?.map(f => ({
          ...f,
          tipo:   nuevoTipoPolin,
          medida: nuevoAnchoEmpaque,
        })) ?? [],
      };
    });
calcularDuelas(productoId, setPedidoActivo,materiales)
handleCalcularTotales(productoId, setPedidoActivo, materiales);
    return {
      ...prev,
      productos: productosActualizados,
    };
  });
};




export const handleCalcularMedidaCorral = (
  productoId: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales:Material[]
) => {
  setPedidoActivo((prevPedido) => {
    if (!prevPedido) return prevPedido;

    return {
      ...prevPedido,
      productos: prevPedido.productos.map((prod) =>
        prod.id === productoId
          ? {
              ...prod,
              corral: prod.tipoCorral
                ? [
                    prod.tipoCorral === "Topes"
                      ? {
                          tipoCorral: "Topes",
                          tipoPolin: calcularTipoPolin(prod.peso || 0,materiales),
                          cantidad: 2, // Ajustar según necesidad
                        }
                      : {
                          tipoCorral: prod.tipoCorral as "Corrido" | "Parcial Largo" | "Parcial Ancho",
                          tipoPolin: calcularTipoPolin(prod.peso || 0,materiales),
                          medida: calcularMedidaCorral(prod),
                        },
                  ]
                : [], // Si el usuario borra la selección, el array queda vacío
            }
          : prod
      ),
    };
  });
};



export const calcularMedidaCorral = (producto: Producto) => {
    switch (producto.tipoCorral) {
        case "Corrido":
            return 2 * producto.anchoEmpaque + 2 * producto.largoEmpaque;
        case "Parcial Largo":
            return 2 * producto.largoEmpaque;
        case "Parcial Ancho":
            return 2 * producto.anchoEmpaque;
        case "Topes":
            return 0;
        default:
            return 0;
    }
};

export const actualizarMedidasParedes = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>
) => {
  setPedidoActivo((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      productos: prev.productos.map((producto) =>
        producto.id === productoID
          ? {
              ...producto,
              paredes: {
                tipoParedes:producto.paredes.tipoParedes,
                largo2y4: producto.anchoEmpaque,
                alto2y4: producto.altoEmpaque,
                largo1y3: producto.largoEmpaque,
                alto1y3: producto.altoEmpaque + 9,
                largoTecho: producto.largoEmpaque,
                altoTecho: producto.anchoEmpaque + 2 * producto.grosor,
              },
            }
          : producto
      ),
    };
  });
};

export const useListasMateriales = () => {
  const { selectedSucursal } = useSucursal()
  const { materiales } = useFetchMaterialesSuc(selectedSucursal?.id)

  const tiposMateriales = useMemo(() =>
    materiales.reduce<Record<string, string[]>>((acc, mat) => {
      const { tipo, nombre } = mat
      if (!acc[tipo]) acc[tipo] = []
      if (!acc[tipo].includes(nombre)) acc[tipo].push(nombre)
      return acc
    }, {}), [materiales]
  )

  return { tiposMateriales }
}


export function handleImporteChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: MaterialSuc[],
  producto: Producto
) {
  const { name, value } = e.target;
  const parsed = parseFloat(value) || 0;

  setCosteo(prev => ({
    ...prev,
    productos: prev.productos.map(p => {
      if (p.id !== producto.id) return p;

      // Aplicar el cambio en el campo correspondiente
      const updated: Producto = { ...p, [name]: parsed } as any;

      // 1) Recalcula importes de sub‐materiales
      if (name === 'cantidadDesec' || name === 'precioDesec') {
        const cant = updated.cantidadDesec ?? 0;
        const prec = updated.precioDesec ?? getPrecioExtra('DESEC.', materiales);
        updated.importeDesec = cant * prec;
      }
      if (name === 'cantidadSGolpe' || name === 'precioSGolpe') {
        const cant = updated.cantidadSGolpe ?? 0;
        const prec = updated.precioSGolpe ?? getPrecioExtra('S. GOLPE', materiales);
        updated.importeSGolpe = cant * prec;
      }
      if (name === 'cantidadSPOS' || name === 'precioSPOS') {
        const cant = updated.cantidadSPOS ?? 0;
        const prec = updated.precioSPOS ?? getPrecioExtra('S. POS.', materiales);
        updated.importeSPOS = cant * prec;
      }
      if (name === 'cantidadSENAL' || name === 'precioSENAL') {
        const cant = updated.cantidadSENAL ?? 0;
        const prec = updated.precioSENAL ?? getPrecioExtra('SEÑAL', materiales);
        updated.importeSENAL = cant * prec;
      }

      // 2) Recalcula importeMaterialDirecto (precioUnitario + sub‐materiales)
      const impDirecto =
        (updated.precioUnitario ?? 0) +
        (updated.importeDesec ?? 0) +
        (updated.importeSGolpe ?? 0) +
        (updated.importeSPOS ?? 0) +
        (updated.importeSENAL ?? 0);
      updated.importeMaterialDirecto = impDirecto;

      // 3) Calcula importeMaterialinDirecto = varios + manoObra + flete + extras
      const impIndirecto =
        (updated.varios ?? 0) +
        (updated.manoObra ?? 0) +
        (updated.flete ?? 0) +
        (updated.extras ?? 0);
      updated.importeMaterialinDirecto = impIndirecto;

      // 4) Recalcula importeTotal = (directo + indirecto) * factor
      const base = impDirecto + impIndirecto;
      updated.importeTotal = base * (updated.factor ?? 1);

      return updated;
    })
  }));
}



export const getPrecioExtra = (nombre: string,materiales:MaterialSuc[]): number =>
  materiales.find(m => m.nombre === nombre)?.precio ?? 0
