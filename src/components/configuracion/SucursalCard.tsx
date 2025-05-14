// ============================================================================
// Archivo: src/components/configuracion/SucursalCard.tsx
// ============================================================================
import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SignedImage from '../general/SignedImage'
import { Sucursal } from '../../config/types'

interface SucursalCardProps {
  sucursal: Sucursal
  onEdit: (s: Sucursal) => void
}

const SucursalCard: React.FC<SucursalCardProps> = ({ sucursal, onEdit }) => {
  const [idx, setIdx] = useState(0)
  const imgs = sucursal.fotoSucursal || []

  const prev = () => setIdx(i => Math.max(i - 1, 0))
  const next = () => setIdx(i => Math.min(i + 1, imgs.length - 1))

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title={sucursal.nombreSucursal}
        subheader={sucursal.direccion}
        action={
          <IconButton onClick={() => onEdit(sucursal)}>
            <EditIcon />
          </IconButton>
        }
      />

      {imgs.length > 0 && (
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <SignedImage
            path={imgs[idx].path!}
            bucket={imgs[idx].bucket!}
            alt={imgs[idx].nombre}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {imgs.length > 1 && (
            <>
              <IconButton
                onClick={prev}
                disabled={idx === 0}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
              >
                ‹
              </IconButton>
              <IconButton
                onClick={next}
                disabled={idx === imgs.length - 1}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
              >
                ›
              </IconButton>
            </>
          )}
        </Box>
      )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Teléfono: {sucursal.telefono}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SucursalCard
