// MaterialesPage.tsx
import React, { useState, useMemo } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  IconButton, Tabs, Tab, Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useFetchMaterialesMaster, useFetchMaterialesSuc, actualizarMaterial } from '../../hooks/useFetchFunctions'
import { MaterialSuc } from '../../config/types'
import MaterialModal from '../../components/configuracion/MaterialModal'
import { useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'
import { formatoMoneda } from '../../hooks/useUtilsFunctions'
import { useSucursal } from '../../config/context/SucursalContext'

const tipos = ['Polines', 'Tablas', 'Duelas', 'Paredes', 'Otros']

const MaterialesPage: React.FC = () => {
  const { user } = useAuthRole()
  const { selectedSucursal } = useSucursal()

  // Fetch data
  const { materiales: masterMaterials } = useFetchMaterialesMaster()
  const { materiales: sucMaterials } = useFetchMaterialesSuc(selectedSucursal?.id)

  // Local state
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MaterialSuc | null>(null)
  const [selectedTipo, setSelectedTipo] = useState<string>(tipos[0])

  // Combine master and branch data
  const combined = useMemo<MaterialSuc[]>(() =>
    masterMaterials
      .filter(mat => selectedTipo === 'Otros'
        ? !tipos.slice(0, -1).includes(mat.tipo)
        : mat.tipo === selectedTipo
      )
      .map(mat => {
        const suc = sucMaterials.find(s => s.idMaterial === mat.id)
        return {
          id: suc?.id,
          idMaterial: mat.id,
          userid: user?.id || '',
          sucursalid: selectedSucursal?.id || '',
          nombre: mat.nombre,
          tipo: mat.tipo,
          precio: suc?.precio ?? 0,
          peso: suc?.peso ?? 0,
          pesoMaximo: suc?.pesoMaximo ?? 0,
          historico: suc?.historico ?? []
        }
      })
  , [masterMaterials, sucMaterials, selectedTipo, user, selectedSucursal])

  // Open modal for new material
  const handleAdd = () => {
    const newMaterial: MaterialSuc = {
      id: crypto.randomUUID(),
      idMaterial: crypto.randomUUID(),
      userid: user?.id || '',
      sucursalid: selectedSucursal?.id || '',
      nombre: '',
      tipo: '',
      precio: 0,
      peso: 0,
      pesoMaximo: 0,
      historico: []
    }
    setEditing(newMaterial)
    setModalOpen(true)
  }

  // Open modal for editing
  const handleOpen = (item: MaterialSuc) => {
    setEditing(item)
    setModalOpen(true)
  }

  // Save new or updated material
  const handleSave = async (mat: MaterialSuc) => {
    setLoading(true)
    try {
      await actualizarMaterial(mat)
    } finally {
      setLoading(false)
      setModalOpen(false)
      setEditing(null)
    }
  }

  return (
    <>
      {loading && <Spinner open />}
      <Box>
        <Typography variant="h4" gutterBottom>
          Configuración de Materiales
        </Typography>

        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
          Agregar Material
        </Button>

        <Tabs value={selectedTipo} onChange={(_, val) => setSelectedTipo(val)} sx={{ mb: 2 }}>
          {tipos.map(t => <Tab key={t} label={t} value={t} />)}
        </Tabs>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--primary-color)' }}>
                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">Precio</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">Peso</TableCell>
                <TableCell sx={{ color: 'white' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combined.map(m => (
                <TableRow key={m.idMaterial} hover>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>{m.tipo}</TableCell>
                  <TableCell align="right">{formatoMoneda(m.precio)}</TableCell>
                  <TableCell align="right">{m.peso}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(m)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {editing && (
          <MaterialModal
            open={modalOpen}
            material={editing}
            masterList={combined}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            onSaved={() => {/* opcional: recargar lógica si es necesario */}}
          />
        )}
      </Box>
    </>
  )
}

export default MaterialesPage