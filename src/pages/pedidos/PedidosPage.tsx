import React, { useState, useMemo } from 'react'
import {
  Box, Typography, Button, Stack, Tabs, Tab
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { Costeo } from '../../config/types'
import { actualizarCosteo, eliminarCosteo, useFetchCosteos, useFetchEmpresas } from '../../hooks/useFetchFunctions'
import { useAuthRole } from '../../config/auth'
import Spinner from '../../components/general/Spinner'
import { useSucursal } from '../../config/context/SucursalContext'
import CosteoModal from '../../components/costeos/CosteoModal'
import { fechaActual } from '../../hooks/useDateUtils'
import { useAutoSaveCosteo } from '../../hooks/useFetchCosteo'
import ConfirmDialog from '../../components/general/DialogComponent'
import CosteoActivoTab from '../../components/costeos/CosteoActivoTab'
import HistorialCosteoTab from '../../components/costeos/HistorialCosteoTab'


const PedidosPage: React.FC = () => {
  const { user } = useAuthRole()
  const { selectedSucursal } = useSucursal()
  const { costeos } = useFetchCosteos(selectedSucursal?.id ?? '')
  const { empresas } = useFetchEmpresas()
  const sucursalid = selectedSucursal?.id ?? ""
  const userid = user?.id ?? ""

  const makeNewCosteo = (): Costeo => ({
    id: crypto.randomUUID(),
    folio: '',
    userid,
    nombreCompleto: '',
    correoElectronico: '',
    celular: '',
    sucursalid,
    destino: '',
    direccion: '',
    fechaPedido: '',
    fechaCreacion: fechaActual,
    formaEnvio: '',
    fechaEnvio: '',
    tituloPedido: '',
    descripcion: '',
    estatus: 'Costeo',
    productos: [],
    referenciasFormatoMedidas: [],
    referenciasComunicaciones: [],
    referenciasImagenes: [],
  });

  // -------- RESUMEN POR EMPRESA PARA LA GRÁFICA --------
  const resumenPorEmpresa = useMemo(() => {
    const counts: Record<string, number> = {}
    costeos.forEach(c => {
      const empId = c.empresaid || '__sin_empresa__'
      counts[empId] = (counts[empId] || 0) + 1
    })
    return Object.entries(counts).map(([id, cantidad]) => ({
      nombre: id === '__sin_empresa__'
        ? 'Sin empresa'
        : (empresas.find(e => e.id === id)?.nombre || 'Empresa desconocida'),
      cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
  }, [costeos, empresas])

  const [modalOpen, setModalOpen] = useState(false)
  const [costeo, setCosteo] = useState<Costeo>(makeNewCosteo())
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [costeoAEliminar, setCosteoAEliminar] = useState<Costeo | null>(null)
  const [tab, setTab] = useState(0)

  useAutoSaveCosteo(modalOpen ? costeo : undefined, modalOpen);

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

  const handleConfirmDelete = async () => {
    if (!costeoAEliminar) return;
    setLoading(true)
    try {
      await eliminarCosteo(costeoAEliminar.id)
      setCosteoAEliminar(null)
      setConfirmOpen(false)
    } catch (e: any) {
      alert('Error al eliminar: ' + (e.message || e));
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Spinner open />}
      <Box maxWidth="lg" sx={{ mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
        {/* HEADER */}
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-end" justifyContent="space-between" gap={2} mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Pedidos / Costeos
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Resumen: Total de pedidos por empresa
            </Typography>
            {/* GRÁFICA RESUMEN POR EMPRESA */}
            <Box sx={{ height: 220, width: { xs: '100%', sm: 450, md: 600 }, mb: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resumenPorEmpresa}
                  layout="vertical"
                  margin={{ left: 15, right: 20, top: 10, bottom: 10 }}
                >
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    width={120}
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#1976d2" radius={[6, 6, 6, 6]}>
                    <LabelList dataKey="cantidad" position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleAdd}
            sx={{ fontWeight: 600, boxShadow: 2, mb: { xs: 1, md: 0 } }}
          >
            Nuevo Costeo
          </Button>
        </Stack>

        {/* TABS */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Activos" />
          <Tab label="Historial" />
        </Tabs>

        {/* TAB CONTENT */}
        {tab === 0 ? (
          <CosteoActivoTab
            costeos={costeos}
            empresas={empresas}
            onEdit={handleEdit}
            onDelete={c => { setCosteoAEliminar(c); setConfirmOpen(true); }}
          />
        ) : (
          <HistorialCosteoTab
            costeos={costeos}
            empresas={empresas}
            onEdit={handleEdit}
            onDelete={c => { setCosteoAEliminar(c); setConfirmOpen(true); }}
          />
        )}

        {/* MODALES Y DIALOGOS */}
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar costeo?"
          message={`¿Estás seguro de que deseas eliminar el costeo${costeoAEliminar ? ` de ${costeoAEliminar.nombreCompleto || 'sin nombre'}` : ''}? Esta acción no se puede deshacer.`}
        />
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
