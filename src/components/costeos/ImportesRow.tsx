import React from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import {
  Costeo,
  Producto,
  MaterialSuc,
} from '../../config/types';
import {  getPrecioExtra,  handleImporteChange } from '../../hooks/useFetchCosteo';
import { formatoMoneda } from '../../hooks/useUtilsFunctions';
import CurrencyFormatCustom from '../general/InputMoneda';

interface Props {
  producto: Producto;
  costeo: Costeo;
  setCosteo: React.Dispatch<React.SetStateAction<Costeo>>;
  materiales:MaterialSuc[]
  tiposMateriales:Record<string, string[]>
}

const ImportesRow: React.FC<Props> = ({
  producto,
  costeo,
  setCosteo,
  materiales,
}) => {

    const mostrarBolsa = costeo?.productos.some((producto:Producto) => producto.bantihumedad === "Si");
  const mostrarTermo = costeo?.productos.some((producto:Producto) => producto.termo === "Si");

  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Importes Adicionales
          </Typography>
        </Box>
      </Box>
            <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. DESEC"
              name="cantidadDesec"
              type="text"
              value={producto?.cantidadDesec ?? ""}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio DESEC"
              name="precioDesec"
              type="text"
              value={formatoMoneda(producto?.precioDesec??0)||formatoMoneda(getPrecioExtra('DESEC.',materiales))}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe DESEC"
              name="importeDesec"
              type="text"
              value={formatoMoneda(producto?.importeDesec ?? "")}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. S.Golpe"
              name="cantidadSGolpe"
              type="number"
              value={producto?.cantidadSGolpe ?? ''}
              onChange={event => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio S.Golpe"
              name="precioSGolpe"
              type="text"
              value={formatoMoneda(producto?.precioSGolpe??0)||formatoMoneda(getPrecioExtra('S. GOLPE',materiales))}
              onChange={event => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe S.Golpe"
              name="importeSGolpe"
              type="text"
              value={formatoMoneda(producto?.importeSGolpe ?? 0)}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. S.POS"
              name="cantidadSPOS"
              type="text"
              value={producto?.cantidadSPOS ?? ""}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio S.POS"
              name="precioSPOS"
              type="text"
              value={formatoMoneda(producto?.precioSPOS??0)||formatoMoneda(getPrecioExtra('S. POS.',materiales))}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe S.POS"
              name="importeSPOS"
              type="text"
              value={formatoMoneda(producto?.importeSPOS ?? "")}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Cant. SEÑAL"
              name="cantidadSENAL"
              type="text"
              value={producto?.cantidadSENAL ?? ""}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Precio SEÑAL"
              name="precioSENAL"
              type="text"
              value={formatoMoneda(producto?.precioSENAL??0)||formatoMoneda(getPrecioExtra('SEÑAL',materiales))}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
          <Box>
            <TextField
              size="small"
              margin="dense"
              fullWidth
              label="Importe SEÑAL"
              name="importeSENAL"
              type="text"
              value={formatoMoneda(producto?.importeSENAL ?? 0)}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        {mostrarBolsa &&
        <Box>
          <TextField            
            size="small"
            margin="dense"
            fullWidth
            label="Importe Bolsa Antihumedad"
            name="importeBolsaAntihumedad"
            type="text"
            value={producto?.importeBolsaAntihumedad ?? ""}
            onChange={(event) => {
              if (producto) {
                handleImporteChange(event, setCosteo, materiales, producto);
              }
            }}
          />
        </Box>
        }
        {mostrarTermo &&
        <Box>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            label="Importe Termo"
            name="importeTermo"
            type="text"
            value={producto?.importeTermo ?? ""}
            onChange={(event) => {
              if (producto) {
                handleImporteChange(event, setCosteo, materiales, producto);
              }
            }}
          />
        </Box>
        }
      </Box>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={2} mb={1}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold",  mt: 1,  color: "var(--primary-color)", fontSize: "0.75rem" }} >
            Material Directo
          </Typography>
          <CurrencyFormatCustom
            name="importeMaterialDirecto"
            value={(producto.importeMaterialDirecto ?? 0).toString()}
            onChange={({ target }) =>
              handleImporteChange(
                { target } as React.ChangeEvent<HTMLInputElement>,
                setCosteo,
                materiales,
                producto
              )
            }
            style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
          />
        </Box>        
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr 1fr', sm: 'repeat(6, 1fr)' }}
        gap={2}
        mb={1}
        alignItems="center"
      >
        {/* Varios */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Varios (%)
          </Typography>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            
            name="variosPercent"
            type="number"
            value={producto.variosPercent ?? 0}
            onChange={(e) => {
              if (producto) {
                handleImporteChange(
                  { target: { name: 'variosPercent', value: e.target.value } } as any,
                  setCosteo,
                  materiales,
                  producto
                )
              }
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Importe Varios
          </Typography>
          <CurrencyFormatCustom
            name="varios"
            value={(
              (producto.importeMaterialDirecto ?? 0) *
              ((producto.variosPercent ?? 0) / 100)
            ).toString()}
            onChange={({ target }) =>
              handleImporteChange(
                { target } as React.ChangeEvent<HTMLInputElement>,
                setCosteo,
                materiales,
                producto
              )
            }
            style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
          />
        </Box>

        {/* Mano de Obra */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Mano de Obra (%)
          </Typography>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            
            name="manoObraPercent"
            type="number"
            value={producto.manoObraPercent ?? 0}
            onChange={(e) => {
              if (producto) {
                handleImporteChange(
                  { target: { name: 'manoObraPercent', value: e.target.value } } as any,
                  setCosteo,
                  materiales,
                  producto
                )
              }
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Importe Mano de Obra
          </Typography>
          <CurrencyFormatCustom
            name="manoObra"
            value={(
              (producto.importeMaterialDirecto ?? 0) *
              ((producto.manoObraPercent ?? 0) / 100)
            ).toString()}
            onChange={({ target }) =>
              handleImporteChange(
                { target } as React.ChangeEvent<HTMLInputElement>,
                setCosteo,
                materiales,
                producto
              )
            }
            style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
          />
        </Box>

        {/* Flete */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Flete (%)
          </Typography>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            
            name="fletePercent"
            type="number"
            value={producto.fletePercent ?? 0}
            onChange={(e) => {
              if (producto) {
                handleImporteChange(
                  { target: { name: 'fletePercent', value: e.target.value } } as any,
                  setCosteo,
                  materiales,
                  producto
                )
              }
            }}
          />
        </Box>
        <Box>
          <Typography
            variant='body2' sx={{ fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Importe Flete
          </Typography>
          <CurrencyFormatCustom
            name="flete"
            value={(
              (producto.importeMaterialDirecto ?? 0) *
              ((producto.fletePercent ?? 0) / 100)
            ).toString()}
            onChange={({ target }) =>
              handleImporteChange(
                { target } as React.ChangeEvent<HTMLInputElement>,
                setCosteo,
                materiales,
                producto
              )
            }
            style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
          />

        </Box>
        <Box>
          <Typography
            variant='body2' sx={{ fontWeight: 'bold',
              mt: 1,
              color: 'var(--primary-color)',
              fontSize: '0.75rem',
            }}
          >
            Extras
          </Typography>
          <CurrencyFormatCustom
            name="extras"
            value={(
              (producto.extras ?? 0) 
            ).toString()}
            onChange={({ target }) =>
              handleImporteChange(
                { target } as React.ChangeEvent<HTMLInputElement>,
                setCosteo,
                materiales,
                producto
              )
            }
            style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
          />

        </Box>
      </Box>

      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
          
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold",  mt: 1,  color: "var(--primary-color)", fontSize: "0.75rem" }} >
            Importe Directo e Indirecto
          </Typography>
          <CurrencyFormatCustom
              name="importeDirectoIndirecto"
              value={(
                (producto.importeMaterialDirecto ?? 0) +
                (producto.importeMaterialinDirecto ?? 0)
              ).toString()}
              style={{ width: '100%', height: '2.5rem', padding: '0 8px' }}
            />
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box sx={{ gridColumn: 'span 3' }}>
          
        </Box>
        <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold",  mt: 1,  color: "var(--primary-color)", fontSize: "0.75rem" }} >
              Factor
            </Typography>
            <TextField            
              size="small"
              margin="dense"
              fullWidth
              name="factor"
              type="number"
              value={(producto.factor) }
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
        </Box> 
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Total
          </Typography>
          <TextField            
              size="small"
              margin="dense"
              fullWidth
              label="Importe Total"
              name="importeTotal"
              type="text"
              value={formatoMoneda(producto?.importeTotal ?? 0)}
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
        </Box>
        
      </Box>
    </>
  );
};

export default ImportesRow;
