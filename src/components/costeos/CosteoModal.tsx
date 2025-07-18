// components/costeos/CosteoModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Costeo, Document, Empresa, ModalStyle } from '../../config/types';
import { useFetchClientes, useFetchEmpresas } from '../../hooks/useFetchFunctions';
import { images } from '../../config/variables';
import { fechaActual } from '../../hooks/useDateUtils';
import { Temporal } from '@js-temporal/polyfill';
import DocumentUploadList from '../general/DocumentUploadList';
import TablaProductos from './TablaProductos';
import { useListasMateriales } from '../../hooks/useFetchCosteo';

interface CosteoModalProps {
  open: boolean;
  onClose: () => void;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid: string;
  costeos: Costeo[];
  onSave: (costeo: Costeo) => void;
}

const CosteoModal: React.FC<CosteoModalProps> = ({
  open,
  onClose,
  sucursalid,
  costeo,
  setCosteo,
  costeos,
  onSave
}) => {
  const { tiposMateriales } = useListasMateriales();
  const { empresas } = useFetchEmpresas(sucursalid);
  const { clientes } = useFetchClientes(sucursalid);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const handleChange = (field: keyof Costeo, value: any) => {
    setCosteo(prev => ({ ...prev, [field]: value }));
  };

  // Regenera folio cuando cambia la empresa
  useEffect(() => {
    if (!selectedEmpresa) return;
    const now = Temporal.Now.plainDateTimeISO('America/Mexico_City');
    const yy = String(now.year).slice(-2);
    const mm = String(now.month).padStart(2, '0');
    const prefix = `COT - ${yy} - ${mm} - `;
    const count = costeos.filter(c => c.folio?.startsWith(prefix)).length;
    const folio = `${prefix}${count + 1}-${selectedEmpresa.nombre}`;
    setCosteo(prev => ({ ...prev, folio }));
  }, [selectedEmpresa, costeos, setCosteo]);

  const handleEmpresaChange = (empresaid: string) => {
    const emp = empresas.find(e => e.id === empresaid) || null;
    setSelectedEmpresa(emp);
    handleChange('empresaid', empresaid);
  };

  const handleUploadFormato = async (files: FileList) => {
    const nuevos: Document[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      nombre: file.name,
      file
    }));
    setCosteo(prev => ({
      ...prev,
      referenciasFormatoMedidas: [...(prev.referenciasFormatoMedidas || []), ...nuevos]
    }));
  };

  const handleDeleteFormato = async (doc: Document) => {
    setCosteo(prev => ({
      ...prev,
      referenciasFormatoMedidas: (prev.referenciasFormatoMedidas || []).filter(d => d.id !== doc.id)
    }));
  };
    const handleUploadComunicaciones = async (files: FileList) => {
    const nuevos: Document[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      nombre: file.name,
      file
    }));
    setCosteo(prev => ({
      ...prev,
      referenciasComunicaciones: [...(prev.referenciasComunicaciones || []), ...nuevos]
    }));
  };

  const handleDeleteComunicaciones = async (doc: Document) => {
    setCosteo(prev => ({
      ...prev,
      referenciasComunicaciones: (prev.referenciasComunicaciones || []).filter(d => d.id !== doc.id)
    }));
  };

    const handleUploadImagenes = async (files: FileList) => {
    const nuevos: Document[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      nombre: file.name,
      file
    }));
    setCosteo(prev => ({
      ...prev,
      referenciasImagenes: [...(prev.referenciasImagenes || []), ...nuevos]
    }));
  };

  const handleDeleteImagenes = async (doc: Document) => {
    setCosteo(prev => ({
      ...prev,
      referenciasImagenes: (prev.referenciasImagenes || []).filter(d => d.id !== doc.id)
    }));
  };


  const handleClose = () => {
    onClose();
    setSelectedEmpresa(null);
  };
  const clientesFiltrados = clientes
    .filter(c => c.empresaid === costeo.empresaid)
    .map(c => ({ id: c.id, label: c.nombreCompleto }));

  // Al cambiar el cliente seleccionado (o escribir uno nuevo)
  // Dentro de CosteoModal, justo donde defines handleClienteChange:
const handleClienteChange = (
  _e: any,
  newValue: { id?: string; label: string } | string
) => {
  if (typeof newValue === 'string') {
    // Texto libre: cliente nuevo
    handleChange('nombreCompleto', newValue);
    handleChange('clienteid', undefined);
    handleChange('correoElectronico', '');
    handleChange('celular', '');
  } else {
    // Seleccionado de la lista: cliente existente
    const clienteObj = clientes.find(c => c.id === newValue.id);
    if (!clienteObj) return;

    handleChange('nombreCompleto', clienteObj.nombreCompleto);
    handleChange('clienteid', clienteObj.id);
    handleChange('correoElectronico', clienteObj.correoElectronico);
    handleChange('celular', clienteObj.celular);
    // Si tu cliente tiene más campos, p. ej. dirección:
    // handleChange('direccion', clienteObj.direccion);
  }
};

  
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        handleClose();
      }}
      disableEscapeKeyDown
      maxWidth={false}
      PaperProps={{ style: ModalStyle }}
    >
      <IconButton
        onClick={handleClose}
        size="small"
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 2 }}>
        {/* Encabezado */}
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Box>
            <img src={images.logo} alt="Logo" className="logo" />
            <Typography variant="body2" color="var(--secondary-color)">
              Paseo de las Lomas # 6383, Col. Lomas del Colli.
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)">
              Zapopan, Jal. - 45010 CP
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)">
              Tel. +52 (33)-3165-0414
            </Typography>
          </Box>
          <Box textAlign="right" mr={5}>
            <Typography variant="h6" fontWeight="bold" color="var(--secondary-color)">
              COTIZACIÓN
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)">
              {costeo.folio}
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)">
              {fechaActual}
            </Typography>
          </Box>
        </Box>

        {/* Dos columnas: Empresa/Cliente/Correo/Celular y Dirección/Envio/Fecha/Destino */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
          {/* Columna Izquierda */}
          <Box display="grid" gridTemplateColumns="1fr" gap={2}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel id="empresa-select-label">Empresa</InputLabel>
              <Select
                labelId="empresa-select-label"
                label="Empresa"
                value={costeo.empresaid??""}
                onChange={e => handleEmpresaChange(e.target.value)}
              >
                {empresas.map(e => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
             <Autocomplete
                freeSolo
                disableClearable
                options={clientesFiltrados}
                getOptionLabel={opt =>
                  typeof opt === 'string' ? opt : opt.label
                }
                value={
                  { id: costeo.clienteid, label: costeo.nombreCompleto }
                }
                onChange={handleClienteChange}
                onInputChange={(_e, input) => {
                  // Para que al escribir vaya cambiando el nombre
                  handleChange('nombreCompleto', input);
                  handleChange('clienteid', undefined);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Cliente"
                    size="small"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            <TextField
              fullWidth size="small" margin="normal"
              label="Correo"
              value={costeo.correoElectronico}
              onChange={e => handleChange('correoElectronico', e.target.value)}
            />
            <TextField
              fullWidth size="small" margin="normal"
              label="Celular"
              value={costeo.celular}
              onChange={e => handleChange('celular', e.target.value)}
            />
          </Box>

          {/* Columna Derecha */}
          <Box display="grid" gridTemplateColumns="1fr" gap={2}>
            <TextField
              fullWidth size="small" margin="normal"
              label="Dirección Destino"
              value={costeo.direccion || ''}
              onChange={e => handleChange('direccion', e.target.value)}
            />
            <TextField
              fullWidth size="small" margin="normal"
              label="Forma Envío"
              value={costeo.formaEnvio || ''}
              onChange={e => handleChange('formaEnvio', e.target.value)}
            />
            <TextField
              fullWidth size="small" margin="normal"
              label="Fecha Envío"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={costeo.fechaEnvio || ''}
              onChange={e => handleChange('fechaEnvio', e.target.value)}
            />
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel id="destino-select-label">Destino</InputLabel>
              <Select
                labelId="destino-select-label"
                label="Destino"
                value={costeo.destino || ''}
                onChange={e => handleChange('destino', e.target.value)}
              >
                <MenuItem value="">Selecciona destino</MenuItem>
                <MenuItem value="Nacional">Nacional</MenuItem>
                <MenuItem value="Internacional">Internacional</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Proyecto y Descripción */}
        <Box display="flex" gap={1} mt={2}>
          <TextField
            fullWidth size="small" margin="normal"
            label="Proyecto"
            value={costeo.tituloPedido || ''}
            onChange={e => handleChange('tituloPedido', e.target.value)}
          />
        </Box>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth size="small" margin="normal"
            label="Descripción"
            value={costeo.descripcion || ''}
            onChange={e => handleChange('descripcion', e.target.value)}
          />
        </Box>

        {/* Documentos y tabla de productos */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
            gap={2}
            width="100%"
          >
            <Box> 
              <Typography variant="body1" color="var(--primary-color)">
                Formato Medida
              </Typography>
              <DocumentUploadList
                documents={costeo.referenciasFormatoMedidas || []}
                onUpload={handleUploadFormato}
                onDelete={handleDeleteFormato}
                maxFiles={10}
              />
            </Box>
            <Box> 
              <Typography variant="body1" color="var(--primary-color)">
                Referencias Comunicaciones
              </Typography>
              <DocumentUploadList
                documents={costeo.referenciasComunicaciones || []}
                onUpload={handleUploadComunicaciones}
                onDelete={handleDeleteComunicaciones}
                maxFiles={10}
              />
            </Box>
            <Box> 
              <Typography variant="body1" color="var(--primary-color)">
                Imagenes
              </Typography>
              <DocumentUploadList
                documents={costeo.referenciasImagenes || []}
                onUpload={handleUploadImagenes}
                onDelete={handleDeleteImagenes}
                maxFiles={10}
              />
            </Box>
          </Box>
        <Box mt={2}>
          <TablaProductos
            costeo={costeo}
            setCosteo={setCosteo}
            sucursalid={sucursalid}
            tiposMateriales={tiposMateriales}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => onSave(costeo)}>
          Guardar Costeo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CosteoModal;
