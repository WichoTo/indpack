import { useState, useEffect } from 'react';
import type { User , Sucursal,Document } from '../config/types';
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

  const fetchSucusales = async () => {
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
    fetchSucusales();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('sucursales')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sucursales' },
        () => fetchSucusales()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sucursales, loading, error, fetchSucusales };
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