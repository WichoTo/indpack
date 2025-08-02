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
  Typography,
  Stack,
  Divider,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Costeo, Document, Empresa } from '../../config/types';
import { useFetchClientes, useFetchEmpresas } from '../../hooks/useFetchFunctions';
import { images } from '../../config/variables';
import { fechaActual } from '../../hooks/useDateUtils';
import { Temporal } from '@js-temporal/polyfill';
import DocumentUploadList from '../general/DocumentUploadList';
import TablaProductos from './TablaProductos';
import { useListasMateriales } from '../../hooks/useFetchCosteo';
import { pdf } from '@react-pdf/renderer';
import CotizacionPDF from './CotizacionPDF';

interface CosteoModalProps {
  open: boolean;
  onClose: () => void;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  sucursalid: string;
  costeos: Costeo[];
  onSave: (costeo: Costeo) => void;
}
const estatusOptions = [
  'Costeo',
  'Cancelado',
  'Cotizado',
  'Pagado',
  'Produccion',
  'Entregado'
];


// --- ESTILO DEL MODAL PARA OCUPAR 80% ---
const ModalStyleFull = {
  width: '80vw',
  minWidth: 340,
  maxWidth: '98vw',
  height: '80vh',
  maxHeight: '98vh',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  // Opcional: agrega sombra
  boxShadow: '0 4px 32px 4px #0002',
  background: '#fff',
};

const CosteoModal: React.FC<CosteoModalProps> = ({
  open,
  onClose,
  sucursalid,
  costeo,
  setCosteo,
  costeos,
  onSave,
}) => {
  const { tiposMateriales } = useListasMateriales();
  const { empresas } = useFetchEmpresas(sucursalid);
  const { clientes } = useFetchClientes(sucursalid);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const handleChange = (field: keyof Costeo, value: any) => {
    setCosteo(prev => ({ ...prev, [field]: value }));
  };

  // Genera folio automático al cambiar empresa
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

  // Archivos: formato, comunicaciones, imágenes
  const handleUploadArchivo = (tipo: keyof Pick<Costeo, "referenciasFormatoMedidas" | "referenciasComunicaciones" | "referenciasImagenes">) =>
    (files: FileList) => {
      const nuevos: Document[] = Array.from(files).map(file => ({
        id: crypto.randomUUID(),
        nombre: file.name,
        file,
      }));
      setCosteo(prev => ({
        ...prev,
        [tipo]: [...(prev[tipo] || []), ...nuevos]
      }));
    };

  const handleDeleteArchivo = (tipo: keyof Pick<Costeo, "referenciasFormatoMedidas" | "referenciasComunicaciones" | "referenciasImagenes">) =>
    (doc: Document) => {
      setCosteo(prev => ({
        ...prev,
        [tipo]: (prev[tipo] || []).filter(d => d.id !== doc.id)
      }));
    };

  const handleClose = () => {
    onClose();
    setSelectedEmpresa(null);
  };

  const clientesFiltrados = clientes
    .filter(c => c.empresaid === costeo.empresaid)
    .map(c => ({ id: c.id, label: c.nombreCompleto }));

  const handleClienteChange = (
    _e: any,
    newValue: { id?: string; label: string } | string
  ) => {
    if (typeof newValue === 'string') {
      handleChange('nombreCompleto', newValue);
      handleChange('clienteid', undefined);
      handleChange('correoElectronico', '');
      handleChange('celular', '');
    } else {
      const clienteObj = clientes.find(c => c.id === newValue.id);
      if (!clienteObj) return;
      handleChange('nombreCompleto', clienteObj.nombreCompleto);
      handleChange('clienteid', clienteObj.id);
      handleChange('correoElectronico', clienteObj.correoElectronico);
      handleChange('celular', clienteObj.celular);
    }
  };

const handleDownloadCotizacionPdf = async (costeo:Costeo) => {
  // Si tienes imágenes dinámicas (logos, etc), aquí conviértelas a Base64 si lo deseas

  // 1. Generar el PDF como blob
  const blobPdf = await pdf(
    <CotizacionPDF costeo={costeo} />
  ).toBlob();

  // 2. Crear URL temporal y forzar descarga
  const blobUrl = URL.createObjectURL(blobPdf);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${costeo.folio || 'Cotizacion_IndPack'}.pdf`;
  document.body.appendChild(a); // Algunos browsers lo requieren
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, 100);
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
      fullWidth
      PaperProps={{ style: ModalStyleFull }}
    >
      <DialogTitle sx={{display: 'flex', justifyContent: 'end' ,backgroundColor:'var(--primary-color)',color:'white',pr: 5 }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      {/* Header - logo y cotización */}
      <DialogContent
        sx={{
          p: { xs: 1, md: 3 },
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={3} mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box>
              <img src={images.logo} alt="Logo" style={{ height: 44, marginBottom: 3 }} />
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
          </Stack>
          <Stack alignItems="flex-end" mr={1}>
            <Typography variant="h6" fontWeight={700} color="var(--secondary-color)">
              COTIZACIÓN
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)" fontWeight={500}>
              {costeo.folio}
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)">
              {fechaActual}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Formulario de cliente y empresa */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Columna 1 */}
          <Stack spacing={2} flex={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="empresa-select-label">Empresa</InputLabel>
              <Select
                labelId="empresa-select-label"
                label="Empresa"
                value={costeo.empresaid ?? ""}
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
              value={{
                id: costeo.clienteid,
                label: costeo.nombreCompleto,
              }}
              onChange={handleClienteChange}
              onInputChange={(_e, input) => {
                handleChange('nombreCompleto', input);
                handleChange('clienteid', undefined);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Cliente"
                  size="small"
                  fullWidth
                />
              )}
            />
            <TextField
              fullWidth size="small"
              label="Correo"
              value={costeo.correoElectronico}
              onChange={e => handleChange('correoElectronico', e.target.value)}
            />
            <TextField
              fullWidth size="small"
              label="Celular"
              value={costeo.celular}
              onChange={e => handleChange('celular', e.target.value)}
            />
          </Stack>

          {/* Columna 2 */}
          <Stack spacing={2} flex={1}>
            <TextField
              fullWidth size="small"
              label="Dirección Destino"
              value={costeo.direccion || ''}
              onChange={e => handleChange('direccion', e.target.value)}
            />
            <TextField
              fullWidth size="small"
              label="Forma Envío"
              value={costeo.formaEnvio || ''}
              onChange={e => handleChange('formaEnvio', e.target.value)}
            />
            <TextField
              fullWidth size="small"
              label="Fecha Envío"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={costeo.fechaEnvio || ''}
              onChange={e => handleChange('fechaEnvio', e.target.value)}
            />
            <FormControl fullWidth size="small">
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
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={2}>
          <TextField
            fullWidth size="small"
            label="Proyecto"
            value={costeo.tituloPedido || ''}
            onChange={e => handleChange('tituloPedido', e.target.value)}
          />
          <TextField
            fullWidth size="small"
            label="Descripción"
            value={costeo.descripcion || ''}
            onChange={e => handleChange('descripcion', e.target.value)}
          />
        </Stack>

        {/* Documentos y tabla de productos */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={3}>
          <Box flex={1}>
            <Typography variant="subtitle1" color="var(--primary-color)" mb={1}>
              Formato Medida
            </Typography>
            <DocumentUploadList
              documents={costeo.referenciasFormatoMedidas || []}
              onUpload={files => Promise.resolve(handleUploadArchivo('referenciasFormatoMedidas')(files))}
              onDelete={doc => Promise.resolve(handleDeleteArchivo('referenciasFormatoMedidas')(doc))}
              maxFiles={10}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" color="var(--primary-color)" mb={1}>
              Referencias Comunicaciones
            </Typography>            
            <DocumentUploadList
              documents={costeo.referenciasComunicaciones || []}
              onUpload={files => Promise.resolve(handleUploadArchivo('referenciasComunicaciones')(files))}
              onDelete={doc => Promise.resolve(handleDeleteArchivo('referenciasComunicaciones')(doc))}
              maxFiles={10}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" color="var(--primary-color)" mb={1}>
              Imágenes
            </Typography>            
            <DocumentUploadList
              documents={costeo.referenciasImagenes || []}
              onUpload={files => Promise.resolve(handleUploadArchivo('referenciasImagenes')(files))}
              onDelete={doc => Promise.resolve(handleDeleteArchivo('referenciasImagenes')(doc))}
              maxFiles={10}
            />
          </Box>
        </Stack>

        <Box mt={3}>
          <TablaProductos
            costeo={costeo}
            setCosteo={setCosteo}
            sucursalid={sucursalid}
            tiposMateriales={tiposMateriales}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        pb: 3,
        justifyContent: 'flex-end',
        background: '#f6f6f9'
      }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="estatus-label">Estatus</InputLabel>
          <Select
            labelId="estatus-label"
            value={costeo.estatus}
            label="Estatus"
            onChange={e => handleChange('estatus', e.target.value)}
          >
            {estatusOptions.map(estatus => (
              <MenuItem key={estatus} value={estatus}>{estatus}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => handleDownloadCotizacionPdf(costeo)}>
          Descargar Cotización PDF
        </Button>
        <Button variant="outlined" size="large" color="primary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" size="large" color="primary" onClick={() => onSave(costeo)}>
          Guardar Costeo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CosteoModal;
