import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { MaterialSuc } from '../../config/types'

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
  open,
  material: initial,
  onSave,
  onSaved,
  onClose,
}) => {
  const [material, setMaterial] = useState<MaterialSuc>(initial)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setMaterial(initial) }, [initial])

  const handleChange = <K extends keyof MaterialSuc>(field: K, value: MaterialSuc[K]) => {
    setMaterial(prev => ({ ...prev, [field]: value }))
  }

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    onSave(material)
    onSaved?.()
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
        onClose()
      }}
      maxWidth="xs"
      fullWidth
    >
      <Box component="form" onSubmit={submit}>
        <DialogTitle sx={{backgroundColor:'var(--primary-color)',color:'white',pr: 5 }}>
          {initial.id ? 'Editar Material' : 'Agregar Nuevo Material'}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 18, right: 20, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />

        <DialogContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={material.tipo}
                label="Tipo"
                onChange={e => handleChange('tipo', e.target.value)}
                required
              >
                {tipos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Nombre"
              value={material.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              required
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Precio ($)"
                type="number"
                value={material.precio}
                onChange={e => handleChange('precio', Number(e.target.value))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
                required
              />
              <TextField
                label="Peso (kg)"
                type="number"
                value={material.peso}
                onChange={e => handleChange('peso', Number(e.target.value))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Peso Máximo (kg)"
              type="number"
              value={material.pesoMaximo}
              onChange={e => handleChange('pesoMaximo', Number(e.target.value))}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit" startIcon={<CancelIcon />} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
export default MaterialModal
