import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Material } from '../../config/types'
import { actualizarMaterial, useFetchMateriales } from '../../hooks/useFetchFunctions'
import MaterialModal from '../../components/configuracion/MaterialModal'
import { useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'
import { formatoMoneda } from '../../hooks/useUtilsFunctions'

const MaterialesPage: React.FC = () => {
  const { user } = useAuthRole()

  const initialMaterial: Material = {
    id: crypto.randomUUID(),
    userid: user?.id ?? '',
    sucursalid:'',
    nombre: '',
    tipo: '',
    precio: 0,
    peso: 0,
  }

  const [loading, setLoading] = useState(false)
  const { materiales } = useFetchMateriales()
  const [modalOpen, setModalOpen] = useState(false)
  const [material, setMaterial] = useState<Material>(initialMaterial)

  const handleAdd = () => {
    setMaterial(initialMaterial)
    setModalOpen(true)
  }

  const handleEdit = (m: Material) => {
    setMaterial(m)
    setModalOpen(true)
  }

  const handleSave = async (material: Material) => {
    setLoading(true)
    try {
      if (material.id) {
        await actualizarMaterial(material)
      }
      setModalOpen(false)
    } finally {
      setMaterial(initialMaterial)
      setModalOpen(false)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMaterial(initialMaterial)
    setModalOpen(false)
    setLoading(false)
  }

  return (
    <>
      {loading && <Spinner open />}
      <Box>
        <Typography variant="h4" gutterBottom>
          Configuración de Materiales
        </Typography>

        <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
          Agregar Material
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor:"var(--primary-color)"}}>
                <TableCell sx={{color:"white"}}>Nombre</TableCell>
                <TableCell sx={{color:"white"}}>Tipo</TableCell>
                <TableCell sx={{color:"white"}} align="right">Precio</TableCell>
                <TableCell sx={{color:"white"}} align="right">Peso</TableCell>
                <TableCell sx={{color:"white"}} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiales.map(m => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>{m.tipo}</TableCell>
                  <TableCell align="right">{formatoMoneda(m.precio)}</TableCell>
                  <TableCell align="right">{m.peso}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(m)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <MaterialModal
          open={modalOpen}
          onSave={handleSave}
          onClose={handleClose}
          material={material}
          setMaterial={setMaterial}
        />
      </Box>
    </>
  )
}

export default MaterialesPage
