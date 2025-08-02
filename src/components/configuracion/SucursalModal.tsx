import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import { Sucursal, Document } from '../../config/types'
import FileUploadPreview from '../general/FileUploadPreviewFiles'

interface SucursalModalProps {
  open: boolean
  sucursal: Sucursal
  setSucursal: React.Dispatch<React.SetStateAction<Sucursal>>
  onSave: (sucursal: Sucursal) => void
  onClose: () => void
}

const SucursalModal: React.FC<SucursalModalProps> = ({
  open,
  sucursal,
  setSucursal,
  onSave,
  onClose,
}) => {
  // Handlers
  const handleField = (field: keyof Sucursal, value: any) => {
    setSucursal(prev => ({ ...prev, [field]: value }))
  }

  // Áreas
  const handleAddArea = () => {
    setSucursal(prev => ({ ...prev, areas: [...(prev.areas || []), ''] }))
  }

  const handleRemoveArea = (idx: number) => {
    setSucursal(prev => ({
      ...prev,
      areas: prev.areas?.filter((_, i) => i !== idx) || [],
    }))
  }

  const handleAreaField = (idx: number, value: string) => {
    setSucursal(prev => ({
      ...prev,
      areas: prev.areas?.map((a, i) => (i === idx ? value : a)) || [],
    }))
  }

  // Manejo de archivos de imagen/documento
  const handleImageFiles = (files: File | File[]) => {
    const docs: Document[] = (Array.isArray(files) ? files : [files]).map(file => ({
      id: '',
      nombre: file.name,
      file,
    }))
    setSucursal(prev => ({
      ...prev,
      fotoSucursal: [...(prev.fotoSucursal || []), ...docs],
    }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    onSave(sucursal)
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
        onClose()
      }}
      maxWidth="sm"
      fullWidth
      
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{backgroundColor:'var(--primary-color)',color:'white',pr: 5 }}>
          {sucursal.nombreSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 18,
              right: 20,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />

        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={sucursal.nombreSucursal}
              onChange={e => handleField('nombreSucursal', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Dirección"
              value={sucursal.direccion || ''}
              onChange={e => handleField('direccion', e.target.value)}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={sucursal.telefono || ''}
              onChange={e => handleField('telefono', e.target.value)}
              fullWidth
            />
          </Stack>

          <Box mt={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Áreas
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddArea}
                sx={{ minWidth: 0, px: 1 }}
                variant="outlined"
              >
                Agregar
              </Button>
            </Stack>
            <Stack spacing={1}>
              {(sucursal.areas && sucursal.areas.length > 0) ? (
                sucursal.areas.map((area, idx) => (
                  <Stack direction="row" alignItems="center" spacing={1} key={idx}>
                    <TextField
                      size="small"
                      label={`Área ${idx + 1}`}
                      value={area}
                      onChange={e => handleAreaField(idx, e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <IconButton onClick={() => handleRemoveArea(idx)} color="error" size="small">
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
                  No hay áreas agregadas.
                </Typography>
              )}
            </Stack>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Imágenes / Documentos
            </Typography>
            <FileUploadPreview
              value={sucursal.fotoSucursal}
              onChange={handleImageFiles}
              multiple
              accept="image/*,.pdf"
              width={140}
              height={140}
              disabled={false}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default SucursalModal
