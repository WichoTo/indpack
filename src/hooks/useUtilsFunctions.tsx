import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { Document } from "../config/types";


export const getRandomInt = (max: number): number => {
    if (typeof max !== "number" || max <= 0) {
      throw new Error("El parámetro 'max' debe ser un número positivo.");
    }
    return Math.floor(Math.random() * max);
  };
  
  // 🔹 Formatea un valor como moneda MXN
  export const formatoMoneda = (value: string | number): string => {
    if (!value) return ""; // Si está vacío, devuelve cadena vacía
  
    // 🔹 Convertir a string y eliminar caracteres no numéricos ni puntos decimales
    const numericValue = value.toString().replace(/[^0-9.]/g, "");
  
    // 🔹 Convertir a número flotante
    const parsedValue = parseFloat(numericValue);
  
    // 🔹 Si el valor es NaN, retorna cadena vacía
    if (isNaN(parsedValue)) return "";
  
    // 🔹 Formatear como moneda MXN
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(parsedValue);
  };
  // Función para formatear valores en millones (divide el valor entre 1,000,000)
export const formatCurrencyMillions = (value: number): string => {
  return `$${(value / 1_000_000).toFixed(2)}M`;
};

export const normalizeFileName = (filename: string): string => {
  const normalized = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9_.-]/g, "_");
};

export const handleVerDocumento = async (
  path: string,
  bucket: string 
) => {
  console.log("Path:", path);
  console.log("Bucket:", bucket); 
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("Error al generar la URL firmada:", error.message);
    return;
  }

  window.open(data.signedUrl, "_blank");
};

export async function getSignedUrl(
  path: string,
  bucket: string,
  expires = 60 * 60
): Promise<string | null> {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, expires)

  if (error) {
    console.error('Error generando URL firmada:', error.message)
    return null
  }
  return data.signedUrl
}

export const eliminarLetras = (valor: string): string => {
  return valor.replace(/\D/g, ""); // Elimina todo lo que no sea dígito (0–9)
};


export function useSignedUrl(path?: string, bucket?: string) {
  const [url, setUrl] = useState<string|null>(null);

  useEffect(() => {
    if (!path || !bucket) return;
    let mounted = true;
    getSignedUrl(path, bucket).then(signed => {
      if (mounted && signed) setUrl(signed);
    });
    return () => { mounted = false; };
  }, [path, bucket]);

  return url;
}
export const percentFormatter = (v: number) => `${(v * 100).toFixed(2)}%`;
export const prepararArchivos = (
  files: File[]
): Document[] => {
  return files.map(file => ({
    id: crypto.randomUUID(),
    nombre: file.name,
    file,
    url: URL.createObjectURL(file),
  }));
};
