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
import {    handleImporteChange } from '../../hooks/useFetchCosteo';
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
  setCosteo,
  materiales,
}) => {

console.log(producto)
  return (
    <>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center">
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Importes Adicionales
          </Typography>
        </Box>
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
        <Box></Box>
        

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
      <Box sx={{ gridColumn: 'span 3' }} display="grid" gridTemplateColumns={{ xs: '1fr',  sm: '1fr 1fr 1fr'}} gap={2} mb={1} alignItems="center" >
        <Box sx={{ gridColumn: 'span 3' }}>
          
        </Box>
        <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold",  mt: 1,  color: "var(--primary-color)", fontSize: "0.75rem" }} >
              Factor Financiamiento
            </Typography>
            <TextField            
              size="small"
              margin="dense"
              fullWidth
              name="factorFinanciamiento"
              type="number"
              value={(producto.factorFinanciamiento) }
              onChange={(event) => {
                if (producto) {
                  handleImporteChange(event, setCosteo, materiales, producto);
                }
              }}
            />
        </Box> 
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt:1, color: "var(--primary-color)" }}>
              Total Financiamiento
          </Typography>
          <TextField            
              size="small"
              margin="dense"
              fullWidth
              label="Importe Total"
              name="importeTotalFinanciamiento"
              type="text"
              value={formatoMoneda(producto?.importeTotalFinanciamiento ?? 0)}
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
