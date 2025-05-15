import { useState, useEffect } from 'react';
import type { User , Sucursal,Document, Material, MaterialHistorico, Cliente } from '../config/types';
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
export const useFetchMateriales = (sucursalid?: string) => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriales = async () => {
    setLoading(true);
    try {
      let query = supabase.from('materiales').select('*');
      if (sucursalid) {
        query = query.eq('sucursalid', sucursalid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setMateriales(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, [sucursalid]);

  useEffect(() => {
    if (!sucursalid) return;
    const channel = supabase
      .channel(`materiales_suc_${sucursalid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'materiales',
          filter: `sucursalid=eq.${sucursalid}`,
        },
        () => {
          fetchMateriales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sucursalid]);

  return { materiales, loading, error, fetchMateriales };
};
export const useFetchMaterialesGeneral = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriales = async () => {
    try {
      const { data, error } = await supabase.from("materiales").select("*");
      if (error) throw error;
      setMateriales(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('materiales')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'materiales' },
        () => fetchMateriales()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { materiales, loading, error, fetchMateriales };
};

export async function actualizarMaterial(
  material: Material
): Promise<Material> {
  if (!material.id) {
    // Si no hay ID, es un insert nuevo: simplemente inicializa el historico vacío
    const { data, error } = await supabase
      .from('materiales')
      .upsert({ ...material, historico: [] }, { onConflict: 'id' })
      .select()
    if (error) throw error
    return data![0]
  }

  // 1) Recupera el histórico actual
  const { data: current, error: fetchErr } = await supabase
    .from('materiales')
    .select('historico')
    .eq('id', material.id)
    .maybeSingle()
  if (fetchErr) throw fetchErr

  const previo: MaterialHistorico[] = current?.historico ?? []

  // 2) Construye la nueva entrada de histórico con fecha
  const nuevoRegistro: MaterialHistorico = {
    tipo: material.tipo,
    nombre: material.nombre,
    precio: material.precio,
    peso: material.peso,
    sucursalid:material.sucursalid,
    fecha: new Date().toISOString(),
  }

  // 3) Upsert incluyendo el historial extendido
  const { data, error } = await supabase
    .from('materiales')
    .upsert(
      {
        ...material,
        historico: [...previo, nuevoRegistro],
      },
      { onConflict: 'id' }
    )
    .select()

  if (error) throw error
  return data![0]
}


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