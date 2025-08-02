import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import { Sucursal } from '../../config/types'
import { actualizarSucursal, useFetchSucursales } from '../../hooks/useFetchFunctions'
import SucursalCard from '../../components/configuracion/SucursalCard'
import SucursalModal from '../../components/configuracion/SucursalModal'
import { useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'

const ConfiguracionSucursalesPage: React.FC = () => {
  const { user } = useAuthRole()

  const initialSucursal: Sucursal = {
    id: crypto.randomUUID(),
    userid: user?.id ?? '',
    nombreSucursal: '',
    telefono: '',
    estado: '',
    direccion: '',
    fotoSucursal: [],
    areas: [],
  }

  const [loading, setLoading] = useState(false)
  const { sucursales } = useFetchSucursales()
  const [modalOpen, setModalOpen] = useState(false)
  const [sucursal, setSucursal] = useState<Sucursal>(initialSucursal)

  const handleAdd = () => {
    setSucursal(initialSucursal)
    setModalOpen(true)
  }

  const handleEdit = (s: Sucursal) => {
    setSucursal(s)
    setModalOpen(true)
  }

  const handleSave = async (sucursal: Sucursal) => {
    setLoading(true)
    try {
      if (sucursal.id) {
        await actualizarSucursal(sucursal)
      }
      setModalOpen(false)
    } finally {
      setSucursal(initialSucursal)
      setModalOpen(false)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSucursal(initialSucursal)
    setModalOpen(false)
    setLoading(false)
  }

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      {loading && <Spinner open={true} />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Configuración de Sucursales
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBusinessIcon />}
          onClick={handleAdd}
          sx={{ fontWeight: 600, boxShadow: 2 }}
        >
          Agregar Sucursal
        </Button>
      </Stack>

      {/* Contenedor de tarjetas usando flex con Box */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        alignItems="stretch"
        minHeight={200}
      >
        {sucursales.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', width: 340, m: '0 auto' }}>
            <Typography variant="h6" color="text.secondary">
              No hay sucursales registradas.
            </Typography>
          </Paper>
        ) : (
          sucursales.map((s) => (
            <Box key={s.id} sx={{ minWidth: 320, maxWidth: 360, flex: '1 1 320px' }}>
              <SucursalCard sucursal={s} onEdit={handleEdit} />
            </Box>
          ))
        )}
      </Box>

      <SucursalModal
        open={modalOpen}
        onSave={handleSave}
        onClose={handleClose}
        sucursal={sucursal}
        setSucursal={setSucursal}
      />
    </Box>
  )
}

export default ConfiguracionSucursalesPage
