// src/components/context/SucursalContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Sucursal } from '../../config/types'
import { useFetchSucursales } from '../../hooks/useFetchFunctions'

// 1) Define el tipo de contexto
export interface SucursalContextType {
  sucursales: Sucursal[]
  selectedSucursal: Sucursal | null
  setSelectedSucursal: (s: Sucursal) => void
  fetchSucursales: () => Promise<void>
}


const SucursalContext = createContext<SucursalContextType | undefined>(undefined)


export const SucursalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { sucursales, fetchSucursales } = useFetchSucursales()
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)

  useEffect(() => {
    if (sucursales.length > 0 && !selectedSucursal) {
      setSelectedSucursal(sucursales[0])
    }
  }, [sucursales])

  return (
    <SucursalContext.Provider
      value={{ sucursales, selectedSucursal, setSelectedSucursal, fetchSucursales }}
    >
      {children}
    </SucursalContext.Provider>
  )
}

export const useSucursal = (): SucursalContextType => {
  const context = useContext(SucursalContext)
  if (!context) {
    throw new Error('useSucursal debe usarse dentro de <SucursalProvider>')
  }
  return context
}
