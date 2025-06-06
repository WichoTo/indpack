
import {  CorralGeneral, CorralTopes, Costeo , Material, MaterialSuc, MaterialTotalRow, Producto, Tacon, TaconCorrido, TaconPieza ,Totales} from "../config/types";
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


export const handleCalcularTotales = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: Material[],
) => {
  setPedidoActivo(prev => {
    if (!prev) return prev;

    // 1) Buscamos el producto que queremos recalcular
    const producto = prev.productos.find(p => p.id === productoID);
    if (!producto) return prev;

    // 2) Agrupar materiales (solo las “medidas” por tipo) — NO calculamos el precio aún
    interface Agrupado {
      medidaTotal: number;
      tipo: string;
      precioMaterial: number;
    }
    const agrupados: Record<string, Agrupado> = {};

    const agregarAMedidaTotal = (
      tipo: string,
      cantidad: number,
      medida: number,
      usarFormula: boolean = true
    ) => {
      // cálculo de medidaTotal tal como llevabas:
      const medidaTotal = usarFormula
        ? (cantidad * medida / 420) * 1.15
        : cantidad * medida;

      // asumimos que, en tu arreglo `materiales`, el campo que identifica el nombre es `nombre`
      const precioMaterial = materiales.find(m => m.nombre === tipo)?.precio ?? 0;

      if (agrupados[tipo]) {
        agrupados[tipo].medidaTotal += medidaTotal;
      } else {
        agrupados[tipo] = { medidaTotal, tipo, precioMaterial };
      }
    };

    // --- Tu lógica para “polinesAbajo, tacon, corral, etc.”, idéntica a la que ya tenías ---
    producto.polinesAbajo?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    );

    if (producto.tipoTacon === 'Corrido') {
      const t = producto.tacon as any;
      agregarAMedidaTotal(
        t.tipoPolin,
        Number(t.cantidad) || 0,
        Number(t.medida) || 0
      );
    } else if (producto.tipoTacon === 'Pieza') {
      const t = producto.tacon as any;
      agregarAMedidaTotal(
        t.tipoPolin,
        (Number(t.cantidad) * (producto.polinesAbajo?.[0]?.cantidad ?? 0)),
        30,
        true
      );
    }

    if (producto.corral?.length) {
      const c = producto.corral[0];
      const medidaFinal = c.tipoCorral === 'Topes' ? 25 : c.medida;
      agregarAMedidaTotal(c.tipoPolin, 1, medidaFinal);
    }

    if (producto.porterias) {
      agregarAMedidaTotal(
        producto.porterias.tipoPolin,
        producto.porterias.cantidad,
        producto.porterias.medida
      );
    }

    if (producto.maderaExtra?.tipoPolin) {
      agregarAMedidaTotal(
        producto.maderaExtra.tipoPolin,
        1,
        producto.maderaExtra.medida
      );
    }

    if (producto.polinAmarre) {
      agregarAMedidaTotal(
        producto.polinAmarre.tipoPolin,
        producto.polinAmarre.cantidad,
        producto.polinAmarre.medida
      );
    }

    producto.polinesFijacion?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    );

    if (producto.tendido) {
      agregarAMedidaTotal(
        producto.tendido.tipo,
        producto.tendido.cantidad,
        producto.tendido.medida + producto.tendido.extra
      );
    }

    if (producto.duelas) {
      const tipoDuela = producto.duelas.tipoDuela || 'Duela';
      producto.duelas.postes.forEach(ps =>
        agregarAMedidaTotal(tipoDuela, ps.cantidad, ps.medida)
      );
      producto.duelas.largueros.forEach(lg =>
        agregarAMedidaTotal(tipoDuela, lg.cantidad, lg.medida)
      );
      if (producto.duelas.duelate) {
        const d = producto.duelas.duelate;
        agregarAMedidaTotal(tipoDuela, d.postes.cantidad, d.postes.medida);
        agregarAMedidaTotal(tipoDuela, d.largueros.cantidad, d.largueros.medida);
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
      );
      agregarAMedidaTotal(producto.paredes.tipoParedes, 1, hojas, false);
    }

    // 3) Convertir `agrupados` a un array para la UI (solo materiales)
    const resumenMateriales: Totales[] = Object.values(agrupados).map(d => ({
      tipo: d.tipo,
      cantidad: 0,                         // para materiales dejamos 0
      medida: d.medidaTotal,
      precioTotal: d.precioMaterial * d.medidaTotal,
      pesoTotal: 0,
    }));

    // 4) Sumar importes de extras (bolsa, termo, desec, etc.)
    const impBolsa  = Number(producto.importeBolsaAntihumedad ?? 0);
    const impTermo  = Number(producto.importeTermo           ?? 0);
    const impDesec  = Number(producto.importeDesec           ?? 0);
    const impSG     = Number(producto.importeSGolpe          ?? 0);
    const impSPOS   = Number(producto.importeSPOS            ?? 0);
    const impSenal  = Number(producto.importeSENAL           ?? 0);
    const sumaExtras = impBolsa + impTermo + impDesec + impSG + impSPOS + impSenal;

    // 5) Creamos siempre una entrada para cada “extra”, incluso si su importe=0
    const resumenExtras: Totales[] = [
      {
        tipo: 'DESEC.',
        cantidad: Number(producto.cantidadDesec ?? 0),
        medida: 0,
        precioTotal: impDesec,
        pesoTotal: 0,
      },
      {
        tipo: 'S.GOLPE',
        cantidad: producto.cantidadSGolpe ? Number(producto.cantidadSGolpe) : 1,
        medida: 0,
        precioTotal: impSG,
        pesoTotal: 0,
      },
      {
        tipo: 'S.POS.',
        cantidad: producto.cantidadSPOS ? Number(producto.cantidadSPOS) : 1,
        medida: 0,
        precioTotal: impSPOS,
        pesoTotal: 0,
      },
      {
        tipo: 'SEÑAL',
        cantidad: producto.cantidadSENAL ? Number(producto.cantidadSENAL) : 1,
        medida: 0,
        precioTotal: impSenal,
        pesoTotal: 0,
      },
      {
        tipo: 'BolsaAntihumedad',
        cantidad: Number(producto.cantidadBolsa ?? 0),
        medida: 0,
        precioTotal: impBolsa,
        pesoTotal: 0,
      },
      {
        tipo: 'Termo',
        cantidad: Number(producto.cantidadTermo ?? 0),
        medida: 0,
        precioTotal: impTermo,
        pesoTotal: 0,
      },
    ];

    // 6) Unimos “materiales” + “extras” para el arreglo final de totales
    const totales: Totales[] = [
      ...resumenMateriales,
      ...resumenExtras
    ];

    // 7) Calculamos precioTotalMateriales (solo materiales)
    const precioTotalMateriales = resumenMateriales.reduce(
      (acc, r) => acc + r.precioTotal,
      0
    );

    // 8) Calcular importeMaterialDirecto (materiales + extras)
    const importeMaterialDirecto = precioTotalMateriales + sumaExtras;

    // 9) Calcular varios, manoObra y flete sobre importeMaterialDirecto
    const varios   = importeMaterialDirecto * 0.15;
    const manoObra = importeMaterialDirecto * 0.5;
    const flete    = importeMaterialDirecto * 0.15;

    // 10) Aplicar factor
    const factor = Number(producto.factor) || 1.4;

    // 11) Importe total final
    const importeTotal = (importeMaterialDirecto + varios + manoObra + flete) * factor;

    // 12) Devolver el estado actualizado con todos los campos nuevos
    return {
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoID
          ? {
              ...p,
              importeMaterialDirecto,
              totales,      // incluye siempre las 6 filas de “extras”
              varios,
              manoObra,
              flete,
              factor,
              importeTotal,
            }
          : p
      ),
    };
  });
};


export const handleCalcularTotales2 = (
  productoID: string,
  setPedidoActivo: React.Dispatch<React.SetStateAction<Costeo>>,
  materiales: Material[],
) => {
  setPedidoActivo(prev => {
    if (!prev) return prev;

    // 1) Buscamos el producto que queremos recalcular
    const producto = prev.productos.find(p => p.id === productoID);
    if (!producto) return prev;

    // 2) Agrupar materiales (solo las “medidas” por tipo) — NO calculamos el precio aún
    interface Agrupado {
      medidaTotal: number;
      tipo: string;
      precioMaterial: number;
    }
    const agrupados: Record<string, Agrupado> = {};

    const agregarAMedidaTotal = (
      tipo: string,
      cantidad: number,
      medida: number,
      usarFormula: boolean = true
    ) => {
      // cálculo de medidaTotal tal como llevabas:
      const medidaTotal = usarFormula
        ? (cantidad * medida / 420) * 1.15
        : cantidad * medida;

      // aquí asumimos que, en tu arreglo materiales, el campo que identifica el nombre es `nombre`
      const precioMaterial = materiales.find(m => m.nombre === tipo)?.precio ?? 0;

      if (agrupados[tipo]) {
        agrupados[tipo].medidaTotal += medidaTotal;
      } else {
        agrupados[tipo] = { medidaTotal, tipo, precioMaterial };
      }
      // **OJO**: ya no acumulamos precioTotalMateriales aquí. Lo haremos después, a partir de `agrupados`.
    };

    // --- Tu lógica para “polinesAbajo, tacon, corral, etc.” exactamente igual que antes ---
    producto.polinesAbajo?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    );

    if (producto.tipoTacon === 'Corrido') {
      const t = producto.tacon as any;
      agregarAMedidaTotal(
        t.tipoPolin,
        Number(t.cantidad) || 0,
        Number(t.medida) || 0
      );
    } else if (producto.tipoTacon === 'Pieza') {
      const t = producto.tacon as any;
      agregarAMedidaTotal(
        t.tipoPolin,
        Number(t.cantidad) * producto.polinesAbajo![0].cantidad,
        30,
        true
      );
      console.log((Number(t.cantidad) * producto.polinesAbajo![0].cantidad));
    }

    if (producto.corral?.length) {
      const c = producto.corral[0];
      const medidaFinal = c.tipoCorral === 'Topes' ? 25 : c.medida;
      agregarAMedidaTotal(c.tipoPolin, 1, medidaFinal);
    }

    if (producto.porterias) {
      agregarAMedidaTotal(
        producto.porterias.tipoPolin,
        producto.porterias.cantidad,
        producto.porterias.medida
      );
    }

    if (producto.maderaExtra?.tipoPolin) {
      agregarAMedidaTotal(
        producto.maderaExtra.tipoPolin,
        1,
        producto.maderaExtra.medida
      );
    }

    if (producto.polinAmarre) {
      agregarAMedidaTotal(
        producto.polinAmarre.tipoPolin,
        producto.polinAmarre.cantidad,
        producto.polinAmarre.medida
      );
    }

    producto.polinesFijacion?.forEach(pol =>
      agregarAMedidaTotal(pol.tipo, pol.cantidad, pol.medida)
    );

    if (producto.tendido) {
      agregarAMedidaTotal(
        producto.tendido.tipo,
        producto.tendido.cantidad,
        producto.tendido.medida + producto.tendido.extra
      );
    }

    if (producto.duelas) {
      const tipoDuela = producto.duelas.tipoDuela || 'Duela';
      producto.duelas.postes.forEach(ps =>
        agregarAMedidaTotal(tipoDuela, ps.cantidad, ps.medida)
      );
      producto.duelas.largueros.forEach(lg =>
        agregarAMedidaTotal(tipoDuela, lg.cantidad, lg.medida)
      );
      if (producto.duelas.duelate) {
        const d = producto.duelas.duelate;
        agregarAMedidaTotal(tipoDuela, d.postes.cantidad, d.postes.medida);
        agregarAMedidaTotal(tipoDuela, d.largueros.cantidad, d.largueros.medida);
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
      );
      agregarAMedidaTotal(producto.paredes.tipoParedes, 1, hojas, false);
    }

    // 3) Convertir `agrupados` a un array para la UI (**resumen**) y ahí ya sí calculamos precioTotalMateriales
    const resumen = Object.values(agrupados).map(d => ({
      tipo: d.tipo,
      cantidad: 0,
      medida: d.medidaTotal,
      precioTotal: d.precioMaterial * d.medidaTotal,
      pesoTotal: 0,
    }));

    // ---------- AQUÍ EMPIEZA LA PARTE NUEVA PARA AGREGAR EXTRAS AL RESUMEN ----------

    // 4) Sumar importes adicionales (bolsa, termo, desec, etc.)
    const impBolsa  = Number(producto.importeBolsaAntihumedad ?? 0);
    const impTermo  = Number(producto.importeTermo           ?? 0);
    const impDesec  = Number(producto.importeDesec           ?? 0);
    const impSG     = Number(producto.importeSGolpe          ?? 0);
    const impSPOS   = Number(producto.importeSPOS            ?? 0);
    const impSenal  = Number(producto.importeSENAL           ?? 0);

    // Vamos a crear un arreglo con cada extra, pero solo si su importe es mayor a cero
    const extras: {
      tipo: string;
      cantidad: number;
      medida: number;
      precioTotal: number;
      pesoTotal: number;
    }[] = [];

    if (impBolsa > 0) {
      extras.push({
        tipo: 'Bolsa Antihumedad',
        cantidad: 1,
        medida: 0,
        precioTotal: impBolsa,
        pesoTotal: 0,
      });
    }
    if (impTermo > 0) {
      extras.push({
        tipo: 'Termo',
        cantidad: 1,
        medida: 0,
        precioTotal: impTermo,
        pesoTotal: 0,
      });
    }
    if (impDesec > 0) {
      extras.push({
        tipo: 'DESEC',
        cantidad: 1,
        medida: 0,
        precioTotal: impDesec,
        pesoTotal: 0,
      });
    }
    if (impSG > 0) {
      extras.push({
        tipo: 'S. Golpe',
        cantidad: 1,
        medida: 0,
        precioTotal: impSG,
        pesoTotal: 0,
      });
    }
    if (impSPOS > 0) {
      extras.push({
        tipo: 'S. POS',
        cantidad: 1,
        medida: 0,
        precioTotal: impSPOS,
        pesoTotal: 0,
      });
    }
    if (impSenal > 0) {
      extras.push({
        tipo: 'SEÑAL',
        cantidad: 1,
        medida: 0,
        precioTotal: impSenal,
        pesoTotal: 0,
      });
    }

    // Mezclamos los materiales agrupados (resumen) con los extras
    const totalesCompletos = [...resumen, ...extras];

    // 5) Calcular precioTotalMateriales + extras
    const precioTotalMaterialesYNExtras = totalesCompletos.reduce(
      (acc, r) => acc + r.precioTotal,
      0
    );

    // 6) Calcular varios, manoObra y flete sobre importeMaterialDirecto (ahora incluye extras)
    const varios   = precioTotalMaterialesYNExtras * 0.15;
    const manoObra = precioTotalMaterialesYNExtras * 0.5;
    const flete    = precioTotalMaterialesYNExtras * 0.15;

    // 7) Aplicar factor
    const factor = Number(producto.factor) || 1.4;

    // 8) Importe total final
    const importeTotal = (precioTotalMaterialesYNExtras + varios + manoObra + flete) * factor;

    // 9) Devolver el estado actualizado con todos los campos nuevos
    return {
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoID
          ? {
              ...p,
              importeMaterialDirecto: precioTotalMaterialesYNExtras,
              totales: totalesCompletos, // aquí asignamos ya el arreglo con materiales + extras
              varios,
              manoObra,
              flete,
              factor,
              importeTotal,
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
        const calcularCantidadPostes = (anchoEmpaque: number) => {
          if (anchoEmpaque <= 122) return 4;
          if (anchoEmpaque > 122 && anchoEmpaque <= 244) return 6;
          if (anchoEmpaque > 244 && anchoEmpaque <= 366) return 8;          
          if (anchoEmpaque > 366 && anchoEmpaque <= 448) return 10;
          if (anchoEmpaque > 448 && anchoEmpaque <= 600) return 12;
          if (anchoEmpaque > 600 && anchoEmpaque <= 722) return 14;
          if (anchoEmpaque > 722 && anchoEmpaque <= 844) return 16;
          if (anchoEmpaque > 966 && anchoEmpaque <= 1088) return 18;
          if (anchoEmpaque > 1088 && anchoEmpaque <= 1210) return 20; 
          return 22;
        };

        const calcularCantidadLargueros = (altoEmpaque: number) => {
          if (altoEmpaque <= 244) return 4;
          if (altoEmpaque > 244 && altoEmpaque <= 488) return 6; 
          return 8;
        };

        const nuevoDuelas = {
          tipoDuela: producto.duelas?.tipoDuela || "",

          // 🔹 Postes
          postes: [
            //d13
            { cantidad: calcularCantidadPostes(producto.anchoEmpaque), medida: producto.altoEmpaque },
            //d24
            { cantidad: calcularCantidadPostes(producto.largoEmpaque), medida: producto.altoEmpaque + 9 },
          ],

          // 🔹 Largueros
          largueros: [
            //d13
            { cantidad: calcularCantidadLargueros(producto.anchoEmpaque), medida: producto.anchoEmpaque },
            //d24
            { cantidad: calcularCantidadLargueros(producto.altoEmpaque + 9 ), medida: producto.largoEmpaque},
          ],

          // 🔹 Duelate
          duelate: {
            postes: { cantidad: calcularCantidadPostes(producto.largoEmpaque)/2, medida: producto.anchoEmpaque + 2 * producto.grosor },
            largueros: {
              cantidad: calcularCantidadPostes(producto.anchoEmpaque) / 2,
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
          medida:    nuevoAnchoEmpaque,
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
        const viejoImpBolsa = p.importeBolsaAntihumedad ?? 0;
        // 5) Asignamos el importe recién calculado
        updated.importeBolsaAntihumedad = nuevoImpBolsa;
        // 6) Calculamos el delta y actualizamos “importeMaterialDirecto”
        const delta = nuevoImpBolsa - viejoImpBolsa;
        console.log(nuevoImpBolsa)
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
      if (name === 'flete' || name === 'manoObra' || name === 'varios') {
        // Ya tenemos updated.flete/manoObra/varios = parsed
        // Dejamos importeMaterialDirecto como estaba en p
        console.log(name, parsed);
        const impDir = p.importeMaterialDirecto ?? 0;
        const nuevosVar = name === 'varios'   ? parsed : (p.varios   ?? 0);
        const nuevosMan = name === 'manoObra' ? parsed : (p.manoObra ?? 0);
        const nuevoFle = name === 'flete'     ? parsed : (p.flete    ?? 0);
        const extras = updated.extras ?? 0;

        // Asignar valores directos si cambiaron
        updated.varios   = nuevosVar;
        updated.manoObra = nuevosMan;
        updated.flete    = nuevoFle;

        // Recalcular importeMaterialinDirecto = varios + manoObra + flete + extras
        updated.importeMaterialinDirecto = nuevosVar + nuevosMan + nuevoFle + extras;
console.log(updated.importeMaterialinDirecto);
console.log(nuevosVar , nuevosMan , nuevoFle , extras);
        // El importeTotalFinanciamiento actual se recalculará al final, después de actualizar importeTotal
        // Recalcular importeTotal = (directo + indirecto) * factor
        const baseTotal = impDir + (updated.importeMaterialinDirecto ?? 0);
        const factor = updated.factor ?? 1;
        updated.importeTotal = baseTotal * factor;

        // 7) Si existe factorFinanciamiento previo, recalculamos el Total Financiamiento
        const factorFin = updated.factorFinanciamiento ?? 1;
        updated.importeTotalFinanciamiento = updated.importeTotal * factorFin;

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
  const rows: MaterialTotalRow[] = (producto.totales ?? []).map((t) => ({
    tipo: t.tipo,
    cantidad: t.cantidad,
    medida: t.medida,
    precioUnitario: materiales.find(m => m.nombre === t.tipo)?.precio ?? 0,
    precioTotal: t.precioTotal,
  }));

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
    ...(producto.bantihumedad === "Si" && producto.importeBolsaAntihumedad
      ? [{
          tipo: "Bolsa Antihumedad",
          cantidad: 1,
          precioUnitario: producto.importeBolsaAntihumedad,
          precioTotal: producto.importeBolsaAntihumedad,
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
    ...rows,
    ...extras.filter(e => !!e.precioTotal),
  ];
}



export const getPrecioExtra = (nombre: string,materiales:MaterialSuc[]): number =>
  materiales.find(m => m.nombre === nombre)?.precio ?? 0
