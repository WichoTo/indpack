import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import { Sucursal, Document } from '../../config/types'
import FileUploadPreview from '../general/FileUploadPreviewFiles' // Nuevo componente

// Clase reusable para estilos de modal
const ModalClassRx = styled(Box)(
  {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#fff',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    borderRadius: '8px',
  }
)

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
  useEffect(() => {
    // Reiniciar índice de preview al cambiar sucursal
  }, [sucursal])

  // Handlers genéricos
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

  // Agrega archivos a fotoSucursal usando FileUploadPreview
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

  const handleSubmit = () => {
    onSave(sucursal)
  }

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
        onClose()
      }}
      disableEscapeKeyDown
    >
      <ModalClassRx>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          {sucursal.nombreSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </Typography>

        <Grid container spacing={2}>
          {/* Campos básicos */}
          <Grid >
            <TextField
              label="Nombre"
              value={sucursal.nombreSucursal}
              onChange={e => handleField('nombreSucursal', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid >
            <TextField
              label="Dirección"
              value={sucursal.direccion || ''}
              onChange={e => handleField('direccion', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid >
            <TextField
              label="Teléfono"
              value={sucursal.telefono}
              onChange={e => handleField('telefono', e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Áreas */}
          <Grid >
            <Typography variant="subtitle1" gutterBottom>
              Áreas
            </Typography>
            {(sucursal.areas || []).map((area, idx) => (
              <Grid container spacing={1} alignItems="center" key={idx}>
                <Grid >
                  <TextField
                    label={`Área ${idx + 1}`}
                    value={area}
                    onChange={e => handleAreaField(idx, e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <IconButton onClick={() => handleRemoveArea(idx)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddArea} sx={{ mt: 1 }}>
              Agregar Área
            </Button>
          </Grid>

          {/* FileUploadPreview para fotos/documentos */}
          <Grid >
            <Typography variant="subtitle1" gutterBottom>
              Imágenes / Documentos
            </Typography>
            <FileUploadPreview
              value={sucursal.fotoSucursal}
              onChange={handleImageFiles}
              multiple
              accept="image/*,.pdf"
              width={150}
              height={150}
              disabled={false}
            />
          </Grid>
        </Grid>

        <Box textAlign="right" mt={3}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </ModalClassRx>
    </Modal>
  )
}

export default SucursalModal
