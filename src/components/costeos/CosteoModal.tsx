// components/costeos/CosteoModal.tsx
import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Cliente, Costeo, ModalStyle,Document } from '../../config/types'
import {  useFetchClientes } from '../../hooks/useFetchFunctions'
import Grid from '@mui/material/Grid'
import DocumentUploadList from '../general/DocumentUploadList'
import { images } from '../../config/variables'
import { fechaActual } from '../../hooks/useDateUtils'
import { Temporal } from '@js-temporal/polyfill'
import TablaProductos from './TablaProductos'
import { useListasMateriales } from '../../hooks/useFetchCosteo'

interface CosteoModalProps {
  open: boolean
  onClose: () => void
  costeo: Costeo
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>
  sucursalid:string
  costeos: Costeo[]
  onSave: (costeo:Costeo) => void;
}

const CosteoModal: React.FC<CosteoModalProps> = ({ open, onClose,sucursalid,costeo,setCosteo,costeos ,onSave}) => {
    const {tiposMateriales } = useListasMateriales()
    const {clientes} =useFetchClientes(sucursalid)
    const [selectedCliente,setSelectedCliente]=useState<Cliente|null>(null)
    const handleChange = (field: keyof Costeo, value: any) => {
        setCosteo(prev => ({ ...prev, [field]: value }))
    }
useEffect(() => {
  if (!selectedCliente) return;
  const now = Temporal.Now.plainDateTimeISO('America/Mexico_City');
  const year2 = String(now.year).slice(-2);
  const month2 = String(now.month).padStart(2, '0');
  const prefijo = `COT - ${year2} - ${month2} - `;
  const contador = costeos.filter(c => c.folio?.startsWith(prefijo)).length;
  const base = `${prefijo}${contador + 1}`;
  const nuevoFolio = `${base}-${selectedCliente.empresa}`;
  setCosteo(prev => ({ ...prev, folio: nuevoFolio }));
}, [selectedCliente, costeos]);

    useEffect(() => {
    if (costeo.clienteid && clientes.length > 0) {
      const c = clientes.find(c => c.id === costeo.clienteid) || null
      setSelectedCliente(c)
    }
  }, [costeo.clienteid, clientes])
    const handleClienteChange = (clienteid:string)=>{
        const cliente = clientes.find(c => c.id === clienteid)
        if (!cliente) return
        setSelectedCliente(cliente)
        setCosteo(prev=>({...prev,clienteid:clienteid}))
        handleGenerarFolioCosteo()
    }
    const handleUpload = async (files: FileList): Promise<void> => {
        const nuevos: Document[] = Array.from(files).map(file => ({
            id: crypto.randomUUID(),
            nombre: file.name,
            file
        }))
        setCosteo(prev => ({
            ...prev,
            referenciasCosteo: [...(prev.referenciasCosteo || []), ...nuevos]
        }))
    }

    const handleDelete = async (doc: Document): Promise<void> => {
        setCosteo(prev => ({
            ...prev,
            referenciasCosteo: (prev.referenciasCosteo || []).filter(d => d.id !== doc.id)
        }))
    }
    const handleGenerarFolioCosteo = ()=> {
        const now = Temporal.Now.plainDateTimeISO('America/Mexico_City')
        const year2 = String(now.year).slice(-2)            
        const month2 = String(now.month).padStart(2, '0')   

        const prefijo = `COT - ${year2} - ${month2} - `
        const contador = costeos.filter(c =>
            c.folio?.startsWith(prefijo)
        ).length

        const base = `${prefijo}${contador + 1}`
        setCosteo(prev => ({ ...prev, folio: `${base}-${selectedCliente?.empresa}`  }))
        return  `${base}-${selectedCliente?.empresa}` 
        }
const handleClose = () => {
  onClose()
  setSelectedCliente(null)
}  

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => { if (reason === 'backdropClick' || reason === 'escapeKeyDown') { return } handleClose }}
      disableEscapeKeyDown
      maxWidth={false}
      PaperProps={{style: ModalStyle}}
    >
      <IconButton
        onClick={handleClose}
        size="small"
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Box>
                <img src={images.logo} alt="Logo" className="logo" />
                <Typography variant="body2" sx={{  color: "var(--secondary-color)" }}>Paseo de las Lomas # 6383, Col. Lomas del Colli.</Typography>
                <Typography variant="body2" sx={{  color: "var(--secondary-color)" }}>Zapopan, Jal. - 45010 CP</Typography>
                <Typography variant="body2" sx={{  color: "var(--secondary-color)" }}>Tel. +52 (33)-3165-0414</Typography>
            </Box>
            <Box sx={{ textAlign: "right" ,mr:5}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--secondary-color)" }}>
                    COTIZACIÓN
                </Typography>
                <Typography variant="body2" sx={{  color: "var(--secondary-color)" }}>{costeo.folio}</Typography>
                <Typography variant="body2" sx={{  color: "var(--secondary-color)" }}>{fechaActual}</Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'center', gap: 2 }}>
          <Grid>
            <FormControl fullWidth
              size="small" margin="normal">
              <InputLabel id="cliente-select-label">Cliente</InputLabel>
              <Select
                labelId="cliente-select-label"
                value={selectedCliente?.id || ''}
                label="Cliente"
                onChange={(e)=>handleClienteChange(e.target.value)}
              >
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombreCompleto}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Celular"
              value={selectedCliente?.celular || ''}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Empresa"
              value={selectedCliente?.empresa || ''}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Correo"
              value={selectedCliente?.correoElectronico || ''}
            />
          </Grid>

          {/* Columna 2 */}
          <Grid>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Dirección Destino"
              value={costeo.direccion || ''}
              onChange={((e)=>handleChange("direccion",e.target.value))}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Forma Envío"
              value={costeo.formaEnvio || ''}
              onChange={((e)=>handleChange("formaEnvio",e.target.value))}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Fecha Envío"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={costeo.fechaEnvio || ''}
              onChange={((e)=>handleChange("fechaEnvio",e.target.value))}
            />
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel id="destino-select-label">Destino</InputLabel>
              <Select
                labelId="destino-select-label"
                label="Destino"
                name="destino"
                value={costeo.destino || ''}
                onChange={(e) => handleChange("destino", e.target.value)}
              >
                <MenuItem value="">Selecciona destino</MenuItem>
                <MenuItem value="Nacional">Nacional</MenuItem>
                <MenuItem value="Internacional">Internacional</MenuItem>
              </Select>
            </FormControl>

          </Grid>
        </Box>
         <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    margin="normal"
                    label="Proyecto"
                    value={costeo.tituloPedido || ''}
                    onChange={e => handleChange("tituloPedido", e.target.value)}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        label="Descripcion"
                        value={costeo.descripcion || ''}
                        onChange={e => handleChange("descripcion", e.target.value)}
                    />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                    <DocumentUploadList
                        documents={costeo.referenciasCosteo??[]}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        maxFiles={10}
                    />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TablaProductos costeo={costeo} setCosteo={setCosteo} sucursalid={sucursalid} tiposMateriales={tiposMateriales}/>
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>onSave(costeo)}
                >
                  Guardar Costeo
                </Button>
              </DialogActions>
        </Dialog>
  )
}

export default CosteoModal
