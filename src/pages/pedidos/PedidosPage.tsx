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
import { Costeo } from '../../config/types'
import { actualizarCosteo, useFetchClientes, useFetchCosteos } from '../../hooks/useFetchFunctions'
import { useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'
import { useSucursal } from '../../config/context/SucursalContext'
import CosteoModal from '../../components/costeos/CosteoModal'
import { fechaActual } from '../../hooks/useDateUtils'

const PedidosPage: React.FC = () => {
  const { user } = useAuthRole()
  const { selectedSucursal } = useSucursal()
  const { costeos } = useFetchCosteos(selectedSucursal?.id ?? '')
  const { clientes } = useFetchClientes()
  const sucursalid = selectedSucursal?.id ?? ""
  
  const userid = user?.id ?? ""
  
  const makeNewCosteo = (): Costeo => ({
  id: crypto.randomUUID(),
  folio: '',
  userid,
  clienteid: '',
  sucursalid,
  destino: '',
  direccion: '',
  fechaPedido: '',
  fechaCreacion: fechaActual,
  formaEnvio: '',
  fechaEnvio: '',
  tituloPedido: '',
  descripcion: '',
  estado: '',
  productos: [],
  referenciasCosteo: [],
});



  

  const [modalOpen, setModalOpen] = useState(false)
  const [costeo, setCosteo] = useState<Costeo>(makeNewCosteo())
  const [loading, setLoading] = useState(false)

  const handleAdd = () => {
    setModalOpen(true)
    setCosteo(makeNewCosteo())
  }

  const handleEdit = (c: Costeo) => {
    setCosteo(c)
    setModalOpen(true)
  }

  const handleSave = async (p: Costeo) => {
    setLoading(true)
    try {
      if (p.id) {
        await actualizarCosteo(p)
      }
      setModalOpen(false)
    } finally {
      setCosteo(makeNewCosteo())
      setModalOpen(false)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCosteo(makeNewCosteo())
    setModalOpen(false)
    setLoading(false)
  }

  return (
    <>
      {loading && <Spinner open />}
      <Box>
        <Typography variant="h4" gutterBottom>
          Costeos
        </Typography>

        <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
          Nuevo Costeo
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--primary-color)' }}>
                <TableCell sx={{ color: 'white' }}>Folio</TableCell>
                <TableCell sx={{ color: 'white' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white' }}>Empresa</TableCell>
                <TableCell sx={{ color: 'white' }}>Dirección</TableCell>
                <TableCell sx={{ color: 'white' }}>Fecha Envío</TableCell>
                <TableCell sx={{ color: 'white' }}>Estatus</TableCell>
                <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costeos.map(c => {
                const cli = clientes.find(x => x.id === c.clienteid)
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.folio}</TableCell>
                    <TableCell>{cli?.nombreCompleto || '–'}</TableCell>
                    <TableCell>{cli?.empresa || '–'}</TableCell>
                    <TableCell>{c.direccion}</TableCell>
                    <TableCell>{c.fechaEnvio || '–'}</TableCell>
                    <TableCell>{c.estado || '–'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(c)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>


        <CosteoModal
          onClose={handleClose}
          open={modalOpen}
          costeo={costeo}
          setCosteo={setCosteo}
          sucursalid={sucursalid}
          costeos={costeos}
          onSave={handleSave}
        />

      
      </Box>
    </>
  )
}

export default PedidosPage
