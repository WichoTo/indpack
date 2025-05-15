import React from 'react'
import {
  Box,
  TextField,
  Button,
  Modal,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { Material } from '../../config/types'
import { listasDesplegables } from '../../config/variables'

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

interface MaterialModalProps {
  open: boolean
  material: Material
  setMaterial: React.Dispatch<React.SetStateAction<Material>>
  onSave: (material: Material) => void
  onClose: () => void
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  open,
  material,
  setMaterial,
  onSave,
  onClose,
}) => {

  const handleChange = (field: keyof Material, value: any) => {
    setMaterial(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(material)
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
        <DialogTitle>{material.id ? "Editar Material" : "Agregar Nuevo Material"}</DialogTitle>
        <DialogContent>
        <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
                name="tipo"
                value={material?.tipo ?? ""}
                onChange={((e)=>handleChange("tipo",e.target.value))}// ✅ Usa la función corregida
                label="Tipo"
            >
                {Object.keys(listasDesplegables.tiposMateriales).map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                    {tipo}
                </MenuItem>
                ))}
            </Select>
        </FormControl>

            <TextField
                margin="dense"
                label="Nombre"
                name="nombre"
                fullWidth
                value={material.nombre}
                onChange={((e)=>handleChange("nombre",e.target.value))}
            />
            <TextField
                margin="dense"
                label="Peso (kg)"
                name="peso"
                type="number"
                fullWidth
                value={material.peso}
                onChange={((e)=>handleChange("peso",e.target.value))}
            />
            <TextField
                margin="dense"
                label="Precio ($)"
                name="precio"
                type="number"
                fullWidth
                value={material.precio}
                onChange={((e)=>handleChange("precio",e.target.value))}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Cancelar
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
                Guardar Cambios
            </Button>
        </DialogActions>
    </ModalClassRx>
</Modal>
  )
}

export default MaterialModal
