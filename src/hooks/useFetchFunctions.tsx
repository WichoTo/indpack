import { useState, useEffect } from 'react';
import type { User , Sucursal,Document, Material, MaterialHistorico, Cliente, Costeo, MaterialSuc, Empresa } from '../config/types';
import { supabase } from '../config/supabase';
import { normalizeFileName } from './useUtilsFunctions';
//import { normalizeFileName } from './useUtilsFunctions';

const API_BASE = 'https://server-murex-theta.vercel.app';

/////////////////////////////////////////////////USUARIOS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function useFetchUsuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaError } = await supabase
        .from('users')
        .select('*');
      if (supaError) {
      } else {
        setUsuarios(data ?? []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error, fetchUsuarios };
}


export const actualizarUsuario = async (usuario: User): Promise<void> => {
  console.log("CAmbios");

  const { id, email, area, sucursales, telefono, role, nombre } = usuario;
  if (!email) {
    alert("Faltan datos básicos (Correo).");
    return;
  }

  try {
    let userId = id;
    if (!userId) {
      const res = await fetch(
        `${API_BASE}/upsert-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        let msg = `Error ${res.status}`;
        try {
          const err = await res.json();
          msg = err.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data: { userId: string; created: boolean } = await res.json();
      console.log("Server respondió:", data);
      userId = data.userId;
      alert(
        data.created
          ? "✅ Usuario creado en Auth correctamente."
          : "✅ Usuario existente en Auth, contraseña reseteada."
      );
    }
    const payload: User = {
      id:          userId,
      email,
      area,
      sucursales,
      telefono,
      role,
      nombre,
    };

    const { error } = await supabase
      .from("users")
      .upsert([payload], { onConflict: "id" });

    if (error) throw error;

    alert("✅ Usuario sincronizado en la tabla users correctamente.");
  } catch (err: any) {
    console.error("❌ Error en actualizarUsuario:", err.message);
    alert("Hubo un error: " + err.message);
  }
};
export const eliminarUsuario = async (userId: string): Promise<void> => {
  if (!userId) {
    console.error("❌ Error: userId es undefined");
    alert("Error: No se pudo eliminar el usuario.");
    return;
  }

  try {
    console.log(`🛠️ Eliminando usuario ${userId} `);
    const response = await fetch(`${API_BASE}/delete-user/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("No se pudo eliminar el usuario.");
    }
    alert("✅ Usuario eliminado correctamente.");
  } catch (error: any) {
    console.error("❌ Error eliminando usuario:", error.message);
    alert("Hubo un error al eliminar el usuario.");
  }
};

export function useUsuariosService() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addUsuario = async (usuario: Omit<User, 'id'>): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }

      // 2) Recibir el userId del Auth
      const { userId, email } = (await res.json()) as { userId: string; email: string };

      // 3) Upsert en la tabla "users" de Supabase
      const tablePayload = {
        id: userId,
        email,
        nombreCompleto: usuario.nombre,
        telefono: usuario.telefono,
        role: usuario.role,
        area: usuario.area,
        sucursales: usuario.sucursales,
      };

      const { data, error: upsertError } = await supabase
        .from('users')
        .upsert([tablePayload]);

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      // Supabase devuelve el registro upserteado
      return data && data[0];
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (userid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/${userid}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (usuario: User) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaError } = await supabase
        .from('users')
        .upsert([usuario]);
      if (supaError) throw supaError;
      return data ? data[0] : null;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addUsuario, deleteUsuario, updateUsuario, loading, error };
}

/////////////////////////////////////////////////SUCURSALAES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const useFetchSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSucursales = async () => {
    try {
      const { data, error } = await supabase.from("sucursales").select("*");
      if (error) throw error;
      setSucursales(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('sucursales')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sucursales' },
        () => fetchSucursales()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sucursales, loading, error, fetchSucursales };
};


export async function actualizarSucursal(
  sucursal: Sucursal
): Promise<Sucursal> {
  const storage = supabase.storage.from('sucursales')
  const uploaded: string[] = []

  async function uploadDoc(doc?: Document): Promise<Document | null> {
    if (!doc) return null
    if (!doc.file) {
      const { file, ...rest } = doc
      return Object.keys(rest).length ? (rest as Document) : null
    }
    const safeName = normalizeFileName(doc.file.name)
    const path = `${sucursal.id}/${safeName}`

    // Elimina versión anterior y sube la nueva
    await storage.remove([path]).catch(() => {})
    const { error: upErr } = await storage.upload(path, doc.file, { upsert: true })
    if (upErr) throw upErr
    uploaded.push(path)
    return { id: path, nombre: doc.file.name, url: path, path, bucket: 'sucursales' }
  }

  // Procesa todas las imágenes
  const imgs = await Promise.all((sucursal.fotoSucursal || []).map(uploadDoc))
  const payload: Sucursal = { ...sucursal, fotoSucursal: imgs.filter(Boolean) as Document[] }

  try {
    // Inserta o actualiza
    const { data, error } = await supabase
      .from('sucursales')
      .upsert(payload, { onConflict: 'id' })
      .select()
    if (error) throw error
    return data![0]
  } catch (err) {
    // En caso de fallo, limpia todo lo subido
    if (uploaded.length) await storage.remove(uploaded).catch(() => {})
    throw err
  }
}

/////////////////////////////////////////////////MATERIALES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFetchMaterialesMaster = () => {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaster = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('*')
      if (error) throw error
      setMateriales(data ?? [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaster()
    const channel = supabase
      .channel('master_materiales')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materiales' }, fetchMaster)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  return { materiales, loading, error, fetchMaster }
}

/**
 * Fetch branch-specific materials (tabla "materialesSuc").
 */
export const useFetchMaterialesSuc = (sucursalid?: string) => {
  const [materiales, setMateriales] = useState<MaterialSuc[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuc = async () => {
    setLoading(true)
    try {
      let query = supabase.from('materialesSuc').select('*')
      if (sucursalid) query = query.eq('sucursalid', sucursalid)
      const { data, error } = await query
      if (error) throw error
      setMateriales(data ?? [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuc()
  }, [sucursalid])

  useEffect(() => {
    if (!sucursalid) return
    const channel = supabase
      .channel(`materialesSuc_${sucursalid}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materialesSuc', filter: `sucursalid=eq.${sucursalid}` }, fetchSuc)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sucursalid])

  return { materiales, loading, error, fetchSuc }
}

/**
 * Upsert a branch-specific material with history
 */
export async function actualizarMaterial(
  data: MaterialSuc
): Promise<MaterialSuc> {
  // --- 1) MASTER UPSERT (como antes) ---
  const { data: masterCurrent, error: masterFetchErr } = await supabase
    .from('materiales')
    .select('*')
    .eq('id', data.idMaterial)
    .maybeSingle()
  if (masterFetchErr) throw masterFetchErr
  if (!masterCurrent) throw new Error(`Material maestro ${data.idMaterial} no encontrado`)

  // siempre reescribimos el master con nuevo pesoMaximo y histórico
  const masterPrev: MaterialHistorico[] = masterCurrent.historico ?? []
  const masterEntry: MaterialHistorico = {
    sucursalid: data.sucursalid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    fecha:      new Date().toISOString(),
  }

  const masterPayload: Partial<Material> = {
    id:         data.idMaterial,
    userid:     data.userid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    pesoMaximo: data.pesoMaximo,
    historico:  [...masterPrev, masterEntry],
  }

  const { data: masterResult, error: masterUpsertErr } = await supabase
    .from('materiales')
    .upsert(masterPayload, { onConflict: 'id' })
    .select()
  if (masterUpsertErr) throw masterUpsertErr
  const updatedMaster = masterResult![0]

  // --- 2) BRANCH UPSERT: sólo para la sucursal actual ---
  // 2.1) Leer histórico previo de esta sucursal (si existe)
  let sucPrev: MaterialHistorico[] = []
  if (data.id) {
    const { data: sucCurrent, error: sucFetchErr } = await supabase
      .from('materialesSuc')
      .select('historico')
      .eq('id', data.id)
      .maybeSingle()
    if (sucFetchErr) throw sucFetchErr
    sucPrev = sucCurrent?.historico ?? []
  }

  // 2.2) Crear entrada de histórico para esta sucursal
  const sucEntry: MaterialHistorico = {
    sucursalid: data.sucursalid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    fecha:      new Date().toISOString(),
  }

  // 2.3) Generar id si se está creando
  const branchId = data.id ?? crypto.randomUUID()

  // 2.4) Upsert de la sucursal actual
  const branchPayload: MaterialSuc = {
    id:         branchId,
    idMaterial: updatedMaster.id,
    userid:     data.userid,
    sucursalid: data.sucursalid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    pesoMaximo: data.pesoMaximo,
    historico:  [...sucPrev, sucEntry],
  }

  const { data: sucResult, error: sucUpsertErr } = await supabase
    .from('materialesSuc')
    .upsert(branchPayload, { onConflict: 'id' })
    .select()
  if (sucUpsertErr) throw sucUpsertErr

  const currentBranch = sucResult![0]

  // --- 3) SINCRONIZAR pesoMaximo EN TODAS LAS SUCURSALES ---
  // Actualiza el pesoMaximo en *todas* las filas de materialesSuc
  const { error: syncErr } = await supabase
    .from('materialesSuc')
    .update({ pesoMaximo: data.pesoMaximo })
    .eq('idMaterial', updatedMaster.id)
  if (syncErr) throw syncErr

  // devolvemos el registro de la sucursal en la que el usuario estaba trabajando
  return currentBranch
}






export async function actualizarMaterial1(
  data: MaterialSuc
): Promise<MaterialSuc> {
  // --- 1) MASTER UPSERT: 'materiales' table ---

  // 1.1) Leer el historial existente
  const { data: masterCurrent, error: masterFetchErr } = await supabase
    .from('materiales')
    .select('historico')
    .eq('id', data.idMaterial)
    .maybeSingle()
  if (masterFetchErr) throw masterFetchErr

  const masterPrev: MaterialHistorico[] = masterCurrent?.historico ?? []

  // 1.2) Crear nueva entrada de historial
  const masterEntry: MaterialHistorico = {
    sucursalid: data.sucursalid,
    tipo:        data.tipo,
    nombre:      data.nombre.replace(/\s+/g, ''),
    precio:      data.precio,
    peso:        data.peso,
    fecha:       new Date().toISOString(),
  }

  // 1.3) Preparar payload y hacer upsert
  const masterPayload: Partial<Material> = {
    id:         data.idMaterial,
    userid:     data.userid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    pesoMaximo: data.pesoMaximo,
    historico:  [...masterPrev, masterEntry],
  }

  const { data: masterResult, error: masterUpsertErr } = await supabase
    .from('materiales')
    .upsert(masterPayload, { onConflict: 'id' })
    .select()
  if (masterUpsertErr) throw masterUpsertErr

  const updatedMaster = masterResult![0]

  // --- 2) BRANCH UPSERT: 'materialesSuc' table ---

  // 2.1) Leer historial de sucursal sólo si ya existía
  let sucPrev: MaterialHistorico[] = []
  if (data.id) {
    const { data: sucCurrent, error: sucFetchErr } = await supabase
      .from('materialesSuc')
      .select('historico')
      .eq('id', data.id)
      .maybeSingle()
    if (sucFetchErr) throw sucFetchErr
    sucPrev = sucCurrent?.historico ?? []
  }

  // 2.2) Nueva entrada de historial para sucursal
  const sucEntry: MaterialHistorico = {
    sucursalid: data.sucursalid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    fecha:      new Date().toISOString(),
  }

  // 2.3) Generar un nuevo id si es creación
  const branchId = data.id ?? crypto.randomUUID()

  // 2.4) Preparar payload y hacer upsert
  const branchPayload: MaterialSuc = {
    id:         branchId,
    idMaterial: updatedMaster.id,
    userid:     data.userid,
    sucursalid: data.sucursalid,
    tipo:       data.tipo,
    nombre:     data.nombre.replace(/\s+/g, ''),
    precio:     data.precio,
    peso:       data.peso,
    pesoMaximo: data.pesoMaximo,
    historico:  [...sucPrev, sucEntry],
  }

  const { data: sucResult, error: sucUpsertErr } = await supabase
    .from('materialesSuc')
    .upsert(branchPayload, { onConflict: 'id' })
    .select()
  if (sucUpsertErr) throw sucUpsertErr

  return sucResult![0]
}
/////////////////////////////////////////////////Empresas////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFetchEmpresas = (sucursalid?: string) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      let query = supabase.from('empresas').select('*');
      if (sucursalid) {
        query = query.eq('sucursalid', sucursalid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setEmpresas(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [sucursalid]);

  useEffect(() => {
    if (!sucursalid) return;
    const channel = supabase
      .channel(`empresas_suc_${sucursalid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'empresas',
          filter: `sucursalid=eq.${sucursalid}`,
        },
        () => {
          fetchEmpresas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sucursalid]);

  return { empresas, loading, error, fetchEmpresas };
};
export const actualizarEmpresa = async (empresa: Empresa): Promise<void> => {
  const { error } = await supabase
    .from('empresas')
    .upsert(empresa, { onConflict: 'id' })

  if (error) {
    console.error('Error guardando empresa:', error.message)
    throw error
  }
}

export const deleteEmpresa = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('empresas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error eliminando empresa:', error.message)
    throw error
  }
}

/////////////////////////////////////////////////////CLIENTES//////////////////////////////////////////////////////
export const useFetchClientes = (sucursalid?: string) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      let query = supabase.from('clientes').select('*');
      if (sucursalid) {
        query = query.eq('sucursalid', sucursalid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [sucursalid]);

  useEffect(() => {
    if (!sucursalid) return;
    // Creamos un canal específico para esta sucursal
    const channel = supabase
      .channel(`clientes_suc_${sucursalid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clientes',
          filter: `sucursalid=eq.${sucursalid}`,
        },
        () => {
          fetchClientes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sucursalid]);

  return { clientes, loading, error, fetchClientes };
};



export const actualizarCliente = async (programa: Cliente) => {
  const { data, error } = await supabase
    .from('clientes')
    .upsert([programa], { onConflict: 'id' });

  if (error) {
    console.error('Error al upsert ProgramaGeneral:', error);
    throw error;
  }

  return data;
};
export const deleteCliente = async (clienteId: string) => {
  try {
    const { error } = await supabase
      .from("clientes")
      .update({ usuario: null , usuarioEmail:null}) // 🔹 Remueve la asociación del usuario con el cliente
      .eq("id", clienteId); // 🔹 Encuentra al cliente por su ID

    if (error) throw error;

    console.log(`Cliente con ID ${clienteId} desvinculado correctamente.`);
    return true;
  } catch (err) {
    console.error("Error al desvincular cliente:", err);
    return false;
  }
};

/////////////////////////////////////////////////COSTEOS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFetchCosteos = (sucursalid?: string) => {
  const [costeos, setCosteos] = useState<Costeo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCosteos = async () => {
    setLoading(true);
    try {
      let query = supabase.from('costeo').select('*');
      if (sucursalid) {
        query = query.eq('sucursalid', sucursalid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setCosteos(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosteos();
  }, [sucursalid]);

  useEffect(() => {
    if (!sucursalid) return;
    const channel = supabase
      .channel(`costeo_suc_${sucursalid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'costeo',
          filter: `sucursalid=eq.${sucursalid}`,
        },
        () => {
          fetchCosteos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sucursalid]);

  return { costeos, loading, error, fetchCosteos };
};
export const useFetchCosteosGeneral = () => {
  const [costeos, setCosteos] = useState<Costeo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCosteos = async () => {
    try {
      const { data, error } = await supabase.from("costeo").select("*");
      if (error) throw error;
      setCosteos(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosteos();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('costeo')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'costeo' },
        () => fetchCosteos()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { costeos, loading, error, fetchCosteos };
};
export async function actualizarCosteo(
  costeo: Costeo
): Promise<Costeo> {
  const storage = supabase.storage.from('costeos');
  const uploadedPaths: string[] = [];

  // Sube un documento, o lo devuelve si ya existe (igual que antes)
  async function uploadDoc(doc: Document): Promise<Document> {
    if (!doc.file) return doc;
    const safeName = normalizeFileName(doc.file.name);
    const path = `${costeo.id}/${safeName}`;
    await storage.remove([path]).catch(() => {});
    const { error: uploadError } = await storage.upload(path, doc.file, {
      upsert: true,
    });
    if (uploadError) throw uploadError;
    uploadedPaths.push(path);
    return { id: path, nombre: doc.file.name, url: path, path, bucket: 'costeos' };
  }

  // 1) Procesamos referenciasCosteo
  const refs = costeo.referenciasCosteo ?? [];
  const referenciasProcesadas = await Promise.all(refs.map(uploadDoc));

  // 2) Procesamos el cliente único
  let clienteid = costeo.clienteid;
const clienteData = {
  nombreCompleto: costeo.nombreCompleto,
  correoElectronico: costeo.correoElectronico,
  celular: costeo.celular,
  empresaid: costeo.empresaid,
  sucursalid: costeo.sucursalid
};

if (clienteid) {
  // Si ya venía con ID, actualizamos
  const { error: errUpd } = await supabase
    .from('clientes')
    .update(clienteData)
    .eq('id', clienteid);
  if (errUpd) throw errUpd;
} else {
  // Nuevo cliente: insert + select
  const insertResult = await supabase
    .from('clientes')
    .insert(clienteData)
    .select();
  if (insertResult.error) throw insertResult.error;

  const nuevos = insertResult.data;
  if (nuevos && nuevos.length > 0) {
    // Todo OK, recuperamos el id
    clienteid = nuevos[0].id;
  } else {
    // Fallback: buscamos por correo+empresaid
    const { data: found, error: errFind } = await supabase
      .from('clientes')
      .select('id')
      .eq('correo', costeo.correoElectronico)
      .eq('empresaid', costeo.empresaid)
      .limit(1)
      .single();
    if (errFind) throw errFind;
    clienteid = found.id;
  }
}

// 3) Creamos el payload e incluimos clienteid…
const payload: Costeo = {
  ...costeo,
  clienteid,
  referenciasCosteo: referenciasProcesadas
};

  try {
    // 4) Hacemos upsert en costeo
    const { data, error } = await supabase
      .from('costeo')
      .upsert(payload, { onConflict: 'id' })
      .select();
    if (error) throw error;
    return data![0];
  } catch (err) {
    // Si algo falla, limpiamos los archivos recién subidos
    if (uploadedPaths.length) {
      await storage.remove(uploadedPaths).catch(() => {});
    }
    throw err;
  }
}

export async function actualizarCosteo2(
  costeo: Costeo
): Promise<Costeo> {
  const storage = supabase.storage.from('costeos')
  const uploadedPaths: string[] = []

  // Sube un documento, o lo devuelve si ya existe (no tiene .file)
  async function uploadDoc(doc: Document): Promise<Document> {
    if (!doc.file) {
      // ya era un documento existente en el bucket
      return doc
    }
    const safeName = normalizeFileName(doc.file.name)
    const path = `${costeo.id}/${safeName}`

    // elimina la versión anterior (si la hay) y sube la nueva
    await storage.remove([path]).catch(() => {})
    const { error: uploadError } = await storage.upload(path, doc.file, {
      upsert: true,
    })
    if (uploadError) throw uploadError

    uploadedPaths.push(path)
    return {
      id: path,
      nombre: doc.file.name,
      url: path,
      path,
      bucket: 'costeos',
    }
  }

  // 1) Procesamos referenciasCosteo
  const refs = costeo.referenciasCosteo ?? []
  const referenciasProcesadas = await Promise.all(refs.map(uploadDoc))

  // 2) Armamos el payload con las referencias ya subidas
  const payload: Costeo = {
    ...costeo,
    referenciasCosteo: referenciasProcesadas,
  }

  try {
    // 3) Upsert en Supabase (conflicto por id)
    const { data, error } = await supabase
      .from('costeo')
      .upsert(payload, { onConflict: 'id' })
      .select()
    if (error) throw error

    // devolvemos la fila resultante
    return data![0]
  } catch (err) {
    // En caso de fallo, limpiamos los archivos recién subidos
    if (uploadedPaths.length) {
      await storage.remove(uploadedPaths).catch(() => {})
    }
    throw err
  }
}


