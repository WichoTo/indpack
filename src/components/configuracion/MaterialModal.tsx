
// MaterialModal.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Modal,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { MaterialSuc } from '../../config/types'

const ModalClassRx = styled(Box)({
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  backgroundColor: '#fff',
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  borderRadius: 8,
})

const tipos = ['Polines', 'Tablas', 'Duelas', 'Paredes', 'Otros']

interface MaterialModalProps {
  open: boolean
  material: MaterialSuc
  masterList: MaterialSuc[]
  onClose: () => void
  onSave: (m: MaterialSuc) => void
  onSaved?: () => void
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  open, material: initial,  onSave, onSaved, onClose
}) => {
  const [material, setMaterial] = useState<MaterialSuc>(initial)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setMaterial(initial) }, [initial])

  const handleChange = <K extends keyof MaterialSuc>(field: K, value: MaterialSuc[K]) => {
    setMaterial(prev => ({ ...prev, [field]: value }))
  }


  const submit = () => {
    setSaving(true)
    onSave(material)
    onSaved?.()
    onClose()
    setSaving(false)
  }
console.log("MaterialModal",material)
  return (
    <Modal open={open} onClose={(_, r) => r==='backdropClick'?null:onClose()} disableEscapeKeyDown>
      <ModalClassRx>
        <IconButton onClick={onClose} sx={{position:'absolute',top:8,right:8}}><CloseIcon/></IconButton>
        <DialogTitle>{initial.id?'Editar Material':'Agregar Nuevo Material'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select value={material.tipo} label="Tipo" onChange={e=>handleChange('tipo',e.target.value)}>
              {tipos.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="dense" label="Nombre" value={material.nombre} onChange={e=>handleChange('nombre',e.target.value)} />
          <TextField fullWidth margin="dense" label="Precio ($)" type="number" value={material.precio} onChange={e=>handleChange('precio',parseFloat(e.target.value))} />
          <TextField fullWidth margin="dense" label="Peso (kg)" type="number" value={material.peso} onChange={e=>handleChange('peso',parseFloat(e.target.value))} />
          <TextField fullWidth margin="dense" label="Peso Máximo (kg)" type="number" value={material.pesoMaximo} onChange={e=>handleChange('pesoMaximo',parseFloat(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={saving}>Cancelar</Button>
          <Button onClick={submit} variant="contained" disabled={saving}>{saving?'Guardando...':'Guardar'}</Button>
        </DialogActions>
      </ModalClassRx>
    </Modal>
  )
}
export default MaterialModal
