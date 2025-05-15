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
  sucursalid:string;
  tipo: string;
  nombre: string;
  precio: number;
  peso: number;
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

export interface Cliente {
  id: string;
  nombreCompleto: string;
  correoElectronico?: string;
  celular: string;
  empresa: string;
  userid: string;
  sucursalid:string
}