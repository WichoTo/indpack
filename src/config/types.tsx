export const ModalStyle = {
  width: '90vw',
  height: '90vh',
  margin: 0,
  padding: 0,
  borderRadius: 4,
}

export interface Route {
  path: string;
  name: string;
  rol?: string | string[];
  element?: React.LazyExoticComponent<React.FC>;
  icon?: React.ElementType; // Usamos React.ElementType
  children?: Route[];
}

export const Role: Array<"Dirección" | "Administración" | "Gerencia" | "Operación"> = [
  "Dirección",
  "Administración",
  "Gerencia",
  "Operación"
];
export interface Role {
  id: string;        
  name: string;     
}
export interface Document {
  id: string;
  nombre: string;
  path?: string; 
  url?: string;
  file?: File; 
  bucket?: string; 
}
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: number;
  role: string;
  area?: string[];
  sucursales?: Sucursal[];
}
export interface Sucursal {
  id: string;
  userid: string;
  nombreSucursal:string;
  telefono: string;
  direccion: string;
  estado: string;
  areas:string[]
  fotoSucursal: Document[];

}
export interface Material {
  id?: string;
  userid: string;
  tipo: string;
  nombre: string;
  precio: number;
  peso: number;
  pesoMaximo: number
  historico?:MaterialHistorico[]
}
export interface MaterialSuc {
  id?: string;
  idMaterial?: string;
  userid: string;
  sucursalid:string;
  tipo: string;
  nombre: string;
  precio: number;
  peso: number;
  pesoMaximo: number
  historico?:MaterialHistorico[]
}
export interface MaterialHistorico {
  id?: string;  
  sucursalid:string;
  tipo: string;
  nombre: string;
  precio: number;
  peso: number;
  fecha: string;
}
export interface Empresa {
  id: string;
  nombre: string;
  nombrecontacto: string;
  correoconctacto?: string;
  telefono: string;
  userid: string;
  sucursalid:string
}
export interface Cliente {
  id: string;
  nombreCompleto: string;
  correoElectronico?: string;
  celular: string;
  empresa: string;
  empresaid:string
  userid: string;
  sucursalid:string
}


export interface Costeo {
  id: string;
  folio: string;
  userid: string;
  empresaid: string;
  nombreCompleto:string;
  clienteid?:string;
  correoElectronico:string;
  celular:string;
  sucursalid: string;
  destino: string;
  direccion: string;
  fechaPedido: string;
  formaEnvio?: string;
  fechaEnvio?: string;
  tituloPedido: string;
  descripcion?: string;
  estado: string;
  fechaCreacion: string;
  
  productos: Producto[];
  referenciasCosteo?:Document[];
}



export interface Producto {
  id: string;
  codigoEquipo: string;
  equipo: string;
  cantidad: number;
  tipoEquipo: string;
  servicio?: string;
  peso?: number;
  bantihumedad?: string;
  termo?: string;
  detalles?: Record<string, any>;
  referenciasEquipo?: Document[];

  largoEquipo: number;
  anchoEquipo: number;
  altoEquipo: number;

  incrLargo: number;
  incrAncho: number;
  incrAlto: number;
  grosor: number;

  largoEmpaque: number;
  anchoEmpaque: number;
  altoEmpaque: number;

  precioUnitario: number;

  cantidadDesec?: number;
  precioDesec?: number;
  importeDesec?: number;

  cantidadSGolpe?: number;
  precioSGolpe?: number;
  importeSGolpe?: number;

  cantidadSPOS?: number;
  precioSPOS?: number;
  importeSPOS?: number;

  cantidadSENAL?: number;
  precioSENAL?: number;
  importeSENAL?: number;

  importeBolsaAntihumedad?: number;
  importeTermo?: number;

  importeMaterialDirecto?: number;
  importeMaterialinDirecto?: number;

  variosPercent?: number;
  manoObraPercent?: number;
  fletePercent?: number;

  varios?: number;
  manoObra?: number;
  flete?: number;
  extras?: number;

  factor?: number;

  importeTotal: number;

  factorFinanciamiento?: number;

  importeTotalFinanciamiento?: number;

  totales: Totales[];

  polinesAbajo: PolinAbajo[];
  tipoTacon: TipoTacon;
  tacon: Tacon;
  tipoCorral: TipoCorral;
  corral: Corral[];
  maderaExtra: MaderaExtra;
  porterias: Porterias;
  polinAmarre: PolinAmarre;
  polinesFijacion: PolinFijacion[];
  tendido: Tendido;
  paredes: Paredes;
  duelas: Duelas;
  [key: string]: any;

}


export interface PolinAbajo {
    cantidad: number;
    tipo: string;
    medida: number;
}
export interface PolinFijacion {
    cantidad: number;
    tipo: string;
    medida: number;
}
export type TipoTacon = "Corrido" | "Pieza" | "";
export interface TaconCorrido {
  tipoPolin: string;
  medida: number;
  cantidad: number;
}
export interface TaconPieza {
  tipoPolin: string;
  cantidad: number;
}
export type Tacon = TaconPieza | TaconCorrido;
export type TipoCorral = "Corrido" | "Parcial Largo" | "Parcial Ancho" | "Topes" ;
export interface CorralGeneral {
  tipoCorral: TipoCorral;
  tipoPolin: string;
  medida: number;
}
export interface CorralTopes {
  tipoCorral: "Topes";
  tipoPolin: string;
  cantidad: number;
}
export type Corral = CorralGeneral | CorralTopes;
export interface MaderaExtra {
  tipoPolin: string;
  medida: number;
};
export interface Porterias  {
  cantidad: number;
  tipoPolin: string;
  medida: number;
};
export interface PolinAmarre {
    cantidad: number;
    tipoPolin: string;
    medida: number;
}; 
export interface PolinFijacion {
  cantidad: number;
  tipo: string;
  medida: number;
};
export interface Tendido {
  tipo: string;
  cantidad: number;
  extra: number;
  medida: number;
};
export interface Paredes{
  tipoParedes: string;
  largo2y4: number;
  alto2y4: number;
  largo1y3: number;
  alto1y3: number;
  largoTecho: number;
  altoTecho: number;

  tipoMarco?: string;
};
export interface Duelas{
  tipoDuela: string;
  postes: {
    cantidad: number;
    medida: number;
  }[];
  largueros: {
    cantidad: number;
    medida: number;
  }[];
  duelate?: {
    postes: {
      cantidad: number;
      medida: number;
    };
    largueros: {
      cantidad: number;
      medida: number;
    };
  };
}





export interface Totales {
   tipo: string;
  cantidad?: number;
  medida?: number;
  precioUnitario?: number;
  precioTotal: number;
  pesoTotal: number;
}
export type MaterialTotalRow = {
  tipo: string;
  cantidad?: number;
  medida?: number;
  precioUnitario?: number;
  precioTotal: number;
};