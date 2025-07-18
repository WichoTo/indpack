
import {  CorralGeneral, CorralTopes, Costeo , Material, MaterialSuc, MaterialTotalRow, Producto, Tacon, TaconCorrido, TaconPieza ,Totales} from "../config/types";
import {   useEffect, useMemo } from "react";
import {  actualizarCosteo, useFetchMaterialesSuc } from "./useFetchFunctions";
import { useSucursal } from "../config/context/SucursalContext";
import { debounce } from 'lodash'; 

 export const alturasPorTipo: Record<string, number> = {
    P6X4: 14,
    P4X4: 9,
    P4X3: 9,
    P4X2: 4,
  };
export function calcPostesIgualados(
  medida: number,
  espacio: number,
  maxTramo: number 
): number {
  const segmentos = Math.ceil(medida / maxTramo);
  const largoSegmento = medida / segmentos;
  const postesPorSegmento = Math.ceil(largoSegmento / espacio) + 1;
  return segmentos * postesPorSegmento*2;
}

/** Postes para caras 2 y 4 */
export const calcPostesHuacal2y4 = (medida: number): number =>
  calcPostesIgualados(medida, 61, 420);

/** Postes para caras 1 y 3 */
export const calcPostesHuacal1y3 = (medida: number): number =>
  calcPostesIgualados(medida, 61, 420);
export const calcLarguerosHuacal2y4 = (medida: number): number =>
 calcPostesIgualados(medida, 61, 420);
export const calcLarguerosHuacal1y3 = (medida: number): number =>
  calcPostesIgualados(medida, 61, 420);




export const calcularCantidadLargueros = (medida: number) => {
 return calcPostesIgualados(medida, 244, 420);
};
export const calcularCantidadPostes = (medida: number): number => {
  // Si cabe en un solo tramo, aplicamos la fórmula original
  if (medida <= 420) {
    return (Math.ceil(medida / 122) + 1) * 2;
  }

  const tramoMax = 420;
  const segmentos = Math.ceil(medida / tramoMax);
  let totalPostes = 0;

  for (let i = 0; i < segmentos; i++) {
    const largoSegmento =
      i < segmentos - 1
        ? tramoMax
        : medida - tramoMax * (segmentos - 1);

    const nPostesSegmento = (Math.ceil(largoSegmento / 122) + 1) * 2;
    totalPostes += nPostesSegmento;
  }

  return totalPostes;
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

export function calcularTipoPolinAbajoPorPeso(
  peso: number,
  medida: number,
  materiales: Material[],
  llevaPolinFijacion: boolean = false
): string {
  // Helper para buscar el nombre real de cada polín que exista
  const buscarPolin = (codigo: string) => {
    return materiales
      .filter(m => m.tipo === 'Polines')
      .map(m => m.nombre)
      .find(nombre => nombre.replace(/\s+/g, '').toUpperCase().endsWith(codigo))
      || codigo;
  };

  const polinesPermitidosMedida = ['4X4', '6X4']; // Códigos válidos si medida > 420
  const polinesPermitidosFijacion = ['4X3', '4X4', '6X4']; // Si lleva polín de fijación

  // 1. Si medida > 420, manda la medida
  if (medida > 420) {
    // Solo se puede usar 4X4 o 6X4
    // Si también tiene polín de fijación, solo 4X4 o 6X4 (pero igual chequeamos si existe P4X3)
    if (llevaPolinFijacion) {
      // Solo puede ser 4X4 o 6X4, y nunca 4X2 ni 4X3
      for (let codigo of polinesPermitidosMedida) {
        const polin = buscarPolin(codigo);
        if (polin) return polin;
      }
    } else {
      // Sin fijación, igual: 4X4 o 6X4
      for (let codigo of polinesPermitidosMedida) {
        const polin = buscarPolin(codigo);
        if (polin) return polin;
      }
    }
  }

  // 2. Si hay polín de fijación pero la medida no manda:
  if (llevaPolinFijacion) {
    // Puede ser 4X3, 4X4, 6X4, nunca 4X2
    for (let codigo of polinesPermitidosFijacion) {
      const polin = buscarPolin(codigo);
      if (polin) return polin;
    }
  }

  // 3. Si ninguna condición especial, el tipo depende del peso
  // Usamos tu función para determinar el tipo base
  const tipoBase = calcularTipoPorPeso(peso, materiales, 'Polines');
  const codigoBase = tipoBase.replace(/\s+/g, '').toUpperCase();
  // Si por peso tocara uno NO permitido por alguna regla anterior, aquí ya pasa.
  return buscarPolin(codigoBase);
}


export const handleCalcularTotales = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: { nombre: string; precio: number }[],
) => {

  setPedidoActivo(prev => {
    if (!prev) return prev;

    const producto = prev.productos.find(p => p.id === productoID);
    if (!producto) return prev;

    // --- INICIO DEL PATCH: congelar precios extras ---
    // Creamos copia local del producto y aseguramos los precios de extras sólo si están undefined

    const productoActualizado: Producto = { ...producto };

    if (productoActualizado.precioDesec === undefined)
      productoActualizado.precioDesec = getPrecioExtra('DESEC.', materiales);

    if (productoActualizado.precioSGolpe === undefined)
      productoActualizado.precioSGolpe = getPrecioExtra('S.GOLPE', materiales);

    if (productoActualizado.precioSPOS === undefined)
      productoActualizado.precioSPOS = getPrecioExtra('S.POS.', materiales);

    if (productoActualizado.precioSENAL === undefined)
      productoActualizado.precioSENAL = getPrecioExtra('SEÑAL', materiales);

    if (productoActualizado.precioTermo === undefined)
      productoActualizado.precioTermo = getPrecioExtra('Termo', materiales);

    // Bolsa antihumedad como objeto anidado
    if (!productoActualizado.bolsaAntihumedad) {
    productoActualizado.bolsaAntihumedad = {
      cantidad: producto.cantidadBolsa ?? 0,
      cantidadBase: producto.bolsaAntihumedad?.cantidadBase ?? 0,
      cantidadParedes: producto.bolsaAntihumedad?.cantidadParedes ?? 0,
      largobase: producto.bolsaAntihumedad?.largobase ?? 0,
      anchobase: producto.bolsaAntihumedad?.anchobase ?? 0,
      indicebase: producto.bolsaAntihumedad?.indicebase ?? 0,
      largoparedes: producto.bolsaAntihumedad?.largoparedes ?? 0,
      altoparedes: producto.bolsaAntihumedad?.altoparedes ?? 0,
      indiceparedes: producto.bolsaAntihumedad?.indiceparedes ?? 0,
      precioUnitario: producto.bolsaAntihumedad?.precioUnitario ?? getPrecioExtra('BolsaAntihumedad', materiales),
      importeTotal: producto.bolsaAntihumedad?.importeTotal ?? 0,
    }
  }else if (productoActualizado.bolsaAntihumedad.precioUnitario === undefined) {
  // Solo si nunca se había asignado el precio
  productoActualizado.bolsaAntihumedad.precioUnitario = getPrecioExtra('BolsaAntihumedad', materiales);
}


    // --- FIN DEL PATCH ---

    const isTarima = productoActualizado.tipoEquipo === 'Tarima';

    interface Agrupado {
      medidaTotal: number;
      tipo: string;
      precioMaterial: number;
    }
    const agrupados: Record<string, Agrupado> = {};

    const agregar = (
      tipo: string,
      cantidad: number,
      medida: number,
      usarFormula = true
    ) => {
      if (!tipo || cantidad <= 0 || medida <= 0) return;
      const medidaTotal = usarFormula
        ? (cantidad * medida / 420) * 1.15
        : cantidad * medida;
      const precioMaterial = materiales.find(m => m.nombre === tipo)?.precio ?? 0;
      if (agrupados[tipo]) agrupados[tipo].medidaTotal += medidaTotal;
      else agrupados[tipo] = { tipo, medidaTotal, precioMaterial };
    };

    if (isTarima) {
      // --- Solo bloques de Tarima ---
      productoActualizado.polinesAbajo?.forEach(pol =>
        agregar(pol.tipo, pol.cantidad, pol.medida)
      );
      if (productoActualizado.tipoTacon === 'Corrido') {
        const t = productoActualizado.tacon as TaconCorrido;
        agregar(t.tipoPolin, t.cantidad, t.medida);
      } else if (productoActualizado.tipoTacon === 'Pieza') {
        const t = productoActualizado.tacon as TaconPieza;
        const nPolines = productoActualizado.polinesAbajo?.[0]?.cantidad ?? 0;
        agregar(t.tipoPolin, t.cantidad * nPolines, 30);
      }
      if (productoActualizado.polinAmarre) {
        agregar(
          productoActualizado.polinAmarre.tipoPolin,
          productoActualizado.polinAmarre.cantidad,
          productoActualizado.polinAmarre.medida
        );
      }
      productoActualizado.polinesFijacion?.forEach(pol =>
        agregar(pol.tipo, pol.cantidad, pol.medida)
      );
      if (productoActualizado.tendido) {
        agregar(
          productoActualizado.tendido.tipo,
          productoActualizado.tendido.cantidad,
          productoActualizado.tendido.medida + (productoActualizado.tendido.extra ?? 0)
        );
      }
      if (productoActualizado.maderaExtra?.tipoPolin) {
        agregar(
          productoActualizado.maderaExtra.tipoPolin,
          1,
          productoActualizado.maderaExtra.medida
        );
      }
    } else {
      // --- Lógica para Caja, Huacal, Otros ---
      productoActualizado.polinesAbajo?.forEach(pol =>
        agregar(pol.tipo, pol.cantidad, pol.medida)
      );
      if (productoActualizado.tipoTacon === 'Corrido') {
        const t = productoActualizado.tacon as TaconCorrido;
        agregar(t.tipoPolin, t.cantidad, t.medida);
      } else if (productoActualizado.tipoTacon === 'Pieza') {
        const t = productoActualizado.tacon as TaconPieza;
        const nPolines = productoActualizado.polinesAbajo?.[0]?.cantidad ?? 0;
        agregar(t.tipoPolin, t.cantidad * nPolines, 30);
      }
      // Corral
      productoActualizado.corral?.forEach(c => {
        if ('medida' in c) {
          agregar(c.tipoPolin, 1, (c as any).medida);
        }
      });
      // Porterías
      if (productoActualizado.porterias) {
        agregar(
          productoActualizado.porterias.tipoPolin,
          productoActualizado.porterias.cantidad,
          productoActualizado.porterias.medida
        );
      }
      // Madera extra
      if (productoActualizado.maderaExtra?.tipoPolin) {
        agregar(
          productoActualizado.maderaExtra.tipoPolin,
          1,
          productoActualizado.maderaExtra.medida
        );
      }
      // Polín de amarre
      if (productoActualizado.polinAmarre) {
        agregar(
          productoActualizado.polinAmarre.tipoPolin,
          productoActualizado.polinAmarre.cantidad,
          productoActualizado.polinAmarre.medida
        );
      }
      // Polines de fijación
      productoActualizado.polinesFijacion?.forEach(pol =>
        agregar(pol.tipo, pol.cantidad, pol.medida)
      );
      // Tendido
      if (productoActualizado.tendido) {
        agregar(
          productoActualizado.tendido.tipo,
          productoActualizado.tendido.cantidad,
          productoActualizado.tendido.medida + (productoActualizado.tendido.extra ?? 0)
        );
      }
      // Duela
      if (productoActualizado.duelas) {
        const tipoDuela = productoActualizado.duelas.tipoDuela || '';
        productoActualizado.duelas.postes.forEach(ps =>
          agregar(tipoDuela, ps.cantidad, ps.medida)
        );
        productoActualizado.duelas.largueros.forEach(lg =>
          agregar(tipoDuela, lg.cantidad, lg.medida)
        );
        if (productoActualizado.duelas.duelate) {
          const d = productoActualizado.duelas.duelate;
          agregar(tipoDuela, d.postes.cantidad, d.postes.medida);
          agregar(tipoDuela, d.largueros.cantidad, d.largueros.medida);
        }
      }
      // Paredes
      if (productoActualizado.paredes?.tipoParedes) {
        const hojas = calcularHojasNecesarias(
          productoActualizado.paredes.largo1y3 || 0,
          productoActualizado.paredes.alto1y3 || 0,
          productoActualizado.paredes.largo2y4 || 0,
          productoActualizado.paredes.alto2y4 || 0,
          productoActualizado.paredes.largoTecho || 0,
          productoActualizado.paredes.altoTecho || 0,
        );
        agregar(productoActualizado.paredes.tipoParedes, 1, hojas, false);
      }
    }

    // --- Extras comunes: SIEMPRE usar el precio guardado en productoActualizado ---
    const extras: Totales[] = [
      {
        tipo: 'DESEC.',
        cantidad: productoActualizado.cantidadDesec ?? 0,
        medida: 0,
        precioUnitario: productoActualizado.precioDesec,
        precioTotal: Number(productoActualizado.importeDesec ?? 0),
        pesoTotal: 0
      },
      {
        tipo: 'S.GOLPE',
        cantidad: productoActualizado.cantidadSGolpe ?? 1,
        medida: 0,
        precioUnitario: productoActualizado.precioSGolpe,
        precioTotal: Number(productoActualizado.importeSGolpe ?? 0),
        pesoTotal: 0
      },
      {
        tipo: 'S.POS.',
        cantidad: productoActualizado.cantidadSPOS ?? 1,
        medida: 0,
        precioUnitario: productoActualizado.precioSPOS,
        precioTotal: Number(productoActualizado.importeSPOS ?? 0),
        pesoTotal: 0
      },
      {
        tipo: 'SEÑAL',
        cantidad: productoActualizado.cantidadSENAL ?? 1,
        medida: 0,
        precioUnitario: productoActualizado.precioSENAL,
        precioTotal: Number(productoActualizado.importeSENAL ?? 0),
        pesoTotal: 0
      },
      {
        tipo: 'BolsaAntihumedad',
        cantidad: productoActualizado.cantidadBolsa ?? 0,
        medida: 0,
        precioUnitario: productoActualizado.bolsaAntihumedad?.precioUnitario,
        precioTotal: Number(productoActualizado.bolsaAntihumedad?.importeTotal ?? 0),
        pesoTotal: 0
      },
      {
        tipo: 'Termo',
        cantidad: productoActualizado.cantidadTermo ?? 0,
        medida: 0,
        precioUnitario: productoActualizado.precioTermo,
        precioTotal: Number(productoActualizado.importeTermo ?? 0),
        pesoTotal: 0
      },
    ];

    // 1) De “agrupados” a Totales[]
    const prevTotales = productoActualizado.totales ?? [];
    const resumen: Totales[] = Object.values(agrupados).map(d => {
      const prev = prevTotales.find(t => t.tipo === d.tipo);
      const precioUnitarioCongelado = prev?.precioUnitario ?? d.precioMaterial;
      return {
        tipo: d.tipo,
        cantidad: 0,
        medida: d.medidaTotal,
        precioUnitario: precioUnitarioCongelado,
        precioTotal: precioUnitarioCongelado * d.medidaTotal,
        pesoTotal: 0,
      };
    });

    // 2) Unir resumen + extras
    const totales: Totales[] = [...resumen, ...extras];

    // 3) Cálculos finales
    const importeMaterialDirecto = totales.reduce((acc, r) => acc + r.precioTotal, 0);
    const varios = importeMaterialDirecto * 0.15;
    const manoObra = importeMaterialDirecto * 0.50;
    const flete = importeMaterialDirecto * 0.15;
    const factor = Number(productoActualizado.factor) || 1.4;
    const precioUnitario = (importeMaterialDirecto + varios + manoObra + flete) * factor;

    const cantidad = productoActualizado.cantidad ?? 1;

    return {
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoID
          ? {
            ...productoActualizado,
            totales,
            importeMaterialDirecto,
            varios,
            manoObra,
            flete,
            factor,
            precioUnitario,
            importeTotalFinanciamiento: precioUnitario * (p.factorFinanciamiento ?? 1),
            importeTotal: precioUnitario * (p.factorFinanciamiento ?? 1) * cantidad
          }
          : p
      ),
    };
  });
};






export const obtenerPrecioMaterial = (nombre: string, materiales: Material[]): number => {
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
    if (name === 'tipoEquipo') {
    calcularDuelas(productoID, setPedidoActivo, materiales);
  }
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
  materiales: any[]
) => {
  handleCalcularTotales(productoId, setPedidoActivo, materiales);

  setPedidoActivo(prev => {
    if (!prev) return prev;

    return {
      ...prev,
      productos: prev.productos.map(producto => {
        if (producto.id !== productoId) return producto;

        const esHuacal = producto.tipoEquipo === 'Huacal';


        const { anchoEmpaque, largoEmpaque, altoEmpaque, incrAlto = 9, grosor } = producto;
        const nuevoDuelas = {
          tipoDuela: producto.duelas?.tipoDuela || '',

          // D.2y4
          postes: [
            {
              cantidad: esHuacal
                ? calcPostesHuacal2y4(anchoEmpaque)
                : calcularCantidadPostes(anchoEmpaque),
              medida: altoEmpaque,
            },
            {
              cantidad: esHuacal
                ? calcPostesHuacal2y4(largoEmpaque)
                : calcularCantidadPostes(largoEmpaque),
              medida: altoEmpaque + 9,
              
            },
          ],

          // Largueros D.2y4
          largueros: [
            {
              cantidad: esHuacal
                ? calcLarguerosHuacal2y4(altoEmpaque)
                : calcularCantidadLargueros(altoEmpaque),
              medida: anchoEmpaque,
            },
            {
              cantidad: esHuacal
                ? calcLarguerosHuacal2y4(altoEmpaque + incrAlto)
                : calcularCantidadLargueros(altoEmpaque + incrAlto),
              medida: largoEmpaque,
            },
          ],

          // Duelate (techo)
          duelate: {
            postes: {
              cantidad: esHuacal
                ? Math.max(2, Math.ceil(calcPostesHuacal1y3(anchoEmpaque) / 2))
                : Math.max(2, Math.ceil(calcularCantidadPostes(largoEmpaque) / 2)),
              medida: anchoEmpaque + 2 * grosor,
            },
            largueros: {
              cantidad: esHuacal
                ? Math.max(2, Math.ceil(calcLarguerosHuacal1y3(largoEmpaque) / 2))
                : Math.max(2, Math.ceil(calcularCantidadLargueros(anchoEmpaque) / 2)),
              medida: largoEmpaque,
            },
          },
        };

        const iguales = JSON.stringify(producto.duelas) === JSON.stringify(nuevoDuelas);
        if (iguales) return producto;

        return {
          ...producto,
          duelas: nuevoDuelas,
        };
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
          tipoPolin:  calcularTipoPolinAbajoPorPeso(peso ?? 0,nuevoLargoEmpaque,materiales, !!prod.polinesFijacion?.length),
          medida:     nuevoAnchoEmpaque,
          cantidad:   cantidadTacon,
        } as TaconCorrido;
      } else if (tipoTacon === "Pieza") {
        nuevoTacon = {
          tipoCorral: "Pieza",
          tipoPolin:  calcularTipoPolinAbajoPorPeso(peso ?? 0,nuevoLargoEmpaque,materiales, !!prod.polinesFijacion?.length),
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
          tipo:   calcularTipoPolinAbajoPorPeso(peso ?? 0,nuevoLargoEmpaque,materiales, !!prod.polinesFijacion?.length),
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
          medida:    nuevoAnchoEmpaque,
        },
        maderaExtra:{
            ...prod.maderaExtra,
            tipoPolin: nuevoTipoPolin,

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
actualizarMedidasParedes(productoId, setPedidoActivo)
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
export function recalcularGrosor(producto: Producto): number {
  if (producto.tipoEquipo === "Tarima") {
    return 0;
  }
  if (producto.tipoEquipo === "Huacal") {
    return 4;
  }
  if (producto.tipoEquipo === "Caja") {
    const t = producto.paredes?.tipoParedes?.toLowerCase() ?? "";
    return ["tripl9", "osb12", "tripl12"].includes(t) ? 3 : 2.5;
  }
  return producto.grosor; // deja como estaba
}
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

      const updated: Producto = { ...p } as any;

      updated[name as keyof Producto] = parsed as any;

      if (name === 'cantidadDesec' || name === 'precioDesec') {
        const cantNew = updated.cantidadDesec ?? 0;
        const precNew = updated.precioDesec ?? getPrecioExtra('DESEC.', materiales);
        const nuevoImporteDesec = cantNew * precNew;
        const viejoImporteDesec = p.importeDesec ?? 0;
        updated.importeDesec = nuevoImporteDesec;
        const delta = nuevoImporteDesec - viejoImporteDesec;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }
      if (name === 'cantidadSGolpe' || name === 'precioSGolpe') {
        const cantNew = updated.cantidadSGolpe ?? 0;
        const precNew = updated.precioSGolpe ?? getPrecioExtra('S.GOLPE', materiales);
        const nuevoImporteSGolpe = cantNew * precNew;
        const viejoImporteSGolpe = p.importeSGolpe ?? 0;
        updated.importeSGolpe = nuevoImporteSGolpe;
        const delta = nuevoImporteSGolpe - viejoImporteSGolpe;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }
      if (name === 'cantidadSPOS' || name === 'precioSPOS') {
        const cantNew = updated.cantidadSPOS ?? 0;
        const precNew = updated.precioSPOS ?? getPrecioExtra('S.POS.', materiales);
        const nuevoImporteSPOS = cantNew * precNew;
        const viejoImporteSPOS = p.importeSPOS ?? 0;
        updated.importeSPOS = nuevoImporteSPOS;
        const delta = nuevoImporteSPOS - viejoImporteSPOS;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }
      if (name === 'cantidadSENAL' || name === 'precioSENAL') {
        const cantNew = updated.cantidadSENAL ?? 0;
        const precNew = updated.precioSENAL ?? getPrecioExtra('SEÑAL', materiales);
        const nuevoImporteSENAL = cantNew * precNew;
        const viejoImporteSENAL = p.importeSENAL ?? 0;
        updated.importeSENAL = nuevoImporteSENAL;
        const delta = nuevoImporteSENAL - viejoImporteSENAL;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }if (name === "cantidadBolsa") {
        // 1) Tomamos la cantidad nueva
        const nuevaCantBolsa = parsed;
        // 2) Obtenemos el precio unitario de la bolsa (de tu array “materiales”)
        const precioBolsa =
          p.precioBolsa ??
          materiales.find((m) => m.nombre === "BolsaAntihumedad")?.precio ??
          0;
        // 3) Calculamos el nuevo importe de la bolsa
        const nuevoImpBolsa = nuevaCantBolsa * precioBolsa;
        // 4) Extraemos cuánto tenía antes la bolsa de antihumedad
        const viejoImpBolsa = p.bolsaAntihumedad?.importeTotal ?? 0;
        // 5) Asignamos el importe recién calculado
        updated.bolsaAntihumedad!.importeTotal = nuevoImpBolsa;
        // 6) Calculamos el delta y actualizamos “importeMaterialDirecto”
        const delta = nuevoImpBolsa - viejoImpBolsa;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }

      if (name === 'importeTermo') {
        const nuevoImpTermo = updated.importeTermo ?? 0;
        const viejoImpTermo = p.importeTermo ?? 0;
        const delta = nuevoImpTermo - viejoImpTermo;
        updated.importeTermo = nuevoImpTermo;
        updated.importeMaterialDirecto = (p.importeMaterialDirecto ?? 0) + delta;
      }


      // 6) Recalcular “indirectos” si cambian flete/manoObra/varios directamente
      if (name === 'varios' || name === 'manoObra' || name === 'flete') {
        const impDir    = p.importeMaterialDirecto ?? 0;
        // Definimos el porcentaje por defecto
        const defaultPorc = {
          varios:   0.15,
          manoObra: 0.50,
          flete:    0.15,
        } as const;

        // Creamos los tres valores, usando el “parsed” solo para el que editaste
        const nuevos = {
          varios:   name === 'varios'   ? parsed : impDir * defaultPorc.varios,
          manoObra: name === 'manoObra' ? parsed : impDir * defaultPorc.manoObra,
          flete:    name === 'flete'    ? parsed : impDir * defaultPorc.flete,
        };

        // Asignamos
        updated.varios   = nuevos.varios;
        updated.manoObra = nuevos.manoObra;
        updated.flete    = nuevos.flete;

        // Recalculamos el bloque indirecto y el total general
        const indirecto = nuevos.varios + nuevos.manoObra + nuevos.flete;
        updated.importeMaterialinDirecto = indirecto;
        const baseTotal = impDir + indirecto;
        updated.importeTotal = baseTotal * (updated.factor ?? 1);

        return updated;
      }

      // 8) Si no cambiaron flete/manoObra/varios, recalculamos todos los indirectos a partir de importeMaterialDirecto actualizado
      const impDir = updated.importeMaterialDirecto ?? 0;
      updated.varios   = impDir * 0.15;
      updated.manoObra = impDir * 0.50;
      updated.flete    = impDir * 0.15;

      const extras = updated.extras ?? 0;
      updated.importeMaterialinDirecto =
        (updated.varios   ?? 0) +
        (updated.manoObra ?? 0) +
        (updated.flete    ?? 0) +
        extras;

      // Recalcular importeTotal = (directo + indirecto) * factor
      const baseTotal = impDir + (updated.importeMaterialinDirecto ?? 0);
      const factor = updated.factor ?? 1;
      updated.importeTotal = baseTotal * factor;

      // 9) Recalcular importeTotalFinanciamiento si cambió importeTotal o ya existía un factorFinanciamiento
      if (name === 'factorFinanciamiento') {
        // El usuario acaba de editar el factor de financiamiento
        const nuevoFacFin = updated.factorFinanciamiento ?? 1;
        updated.importeTotalFinanciamiento = (p.importeTotal ?? 0) * nuevoFacFin;
      } else {
        // Si no cambió factorFinanciamiento, usar el factor que ya existía
        const factorFin = updated.factorFinanciamiento ?? p.factorFinanciamiento ?? 1;
        updated.importeTotalFinanciamiento = updated.importeTotal * factorFin;
      }

      return updated;
    })
  }));
}


export function getRowsForTotalesTable(
  producto: Producto,
  materiales: MaterialSuc[]
): MaterialTotalRow[] {
   if (!producto || !materiales) return [];
  // Materiales normales de la propiedad totales
  // Materiales extras
  const extras: MaterialTotalRow[] = [
    {
      tipo: "DESEC.",
      cantidad: producto.cantidadDesec ?? 0,
      precioUnitario: producto.precioDesec ?? 0,
      precioTotal: producto.importeDesec ?? 0,
    },
    {
      tipo: "S.GOLPE",
      cantidad: producto.cantidadSGolpe ?? 0,
      precioUnitario: producto.precioSGolpe ?? 0,
      precioTotal: producto.importeSGolpe ?? 0,
    },
    {
      tipo: "S.POS.",
      cantidad: producto.cantidadSPOS ?? 0,
      precioUnitario: producto.precioSPOS ?? 0,
      precioTotal: producto.importeSPOS ?? 0,
    },
    {
      tipo: "SEÑAL",
      cantidad: producto.cantidadSENAL ?? 0,
      precioUnitario: producto.precioSENAL ?? 0,
      precioTotal: producto.importeSENAL ?? 0,
    },
    ...(producto.bantihumedad === "Si" && producto.bolsaAntihumedad
      ? [{
          tipo: "Bolsa Antihumedad",
          cantidad: producto.bolsaAntihumedad.cantidad??0,
          precioUnitario: producto.bolsaAntihumedad.precioUnitario,
          precioTotal: producto.bolsaAntihumedad.importeTotal,
        }]
      : []),
    ...(producto.termo === "Si" && producto.importeTermo
      ? [{
          tipo: "Termo",
          cantidad: 1,
          precioUnitario: producto.importeTermo,
          precioTotal: producto.importeTermo,
        }]
      : []),
  ];

  // Solo incluye extras que tengan importe > 0
  return [
    ...producto.totales,
    ...extras.filter(e => !!e.precioTotal),
  ];
}



export const getPrecioExtra = (
  nombre: string,
  materiales: { nombre: string; precio: number }[]
): number =>
  materiales.find(m => m.nombre === nombre)?.precio ?? 0;
export function useAutoSaveCosteo(costeo?: Costeo, enabled = true) {
  useEffect(() => {
    if (!enabled || !costeo?.id) return;
    const debouncedSave = debounce(() => {
      actualizarCosteo(costeo);
    }, 1000);
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [costeo]);
}