import React, {  useState } from 'react'
import { Box, Typography, Button, Grid } from '@mui/material'
import { Sucursal } from '../../config/types'
import {actualizarSucursal, useFetchSucursales} from '../../hooks/useFetchFunctions'
import SucursalCard from '../../components/configuracion/SucursalCard'
import SucursalModal from '../../components/configuracion/SucursalModal'
import {  useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'

const ConfiguracionSucursalesPage: React.FC = () => {
    const{user} = useAuthRole()
   
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

  const handleSave = async (sucursal:Sucursal) => {
    setLoading(true)
    try {
    if (sucursal.id) {
      await actualizarSucursal(sucursal as Sucursal)
    } 
    setModalOpen(false)
  }finally {
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
    <>
     {loading && (<Spinner open={true}/>)}
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración de Sucursales
      </Typography>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Agregar Sucursal
      </Button>

      <Grid container spacing={2}>
        {sucursales.map(s => (
          <Grid key={s.id} >
            <SucursalCard key={s.id} sucursal={s} onEdit={handleEdit} />
          </Grid>
        ))}
      </Grid>

      <SucursalModal
        open={modalOpen}
        onSave={handleSave}
        onClose={handleClose}
        sucursal={sucursal!}
        setSucursal={setSucursal} // Assuming you want to set the selected sucursal here
      />
    </Box>
    </>
  )
  
}

export default ConfiguracionSucursalesPage