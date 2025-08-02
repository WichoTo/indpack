import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
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
    <Card
      sx={{
        position: 'relative',
        minHeight: 320,
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {sucursal.nombreSucursal}
          </Typography>
        }
        subheader={
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon fontSize="small" color="disabled" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {sucursal.direccion}
            </Typography>
          </Stack>
        }
        action={
          <IconButton onClick={() => onEdit(sucursal)} sx={{ color: 'primary.main' }}>
            <EditIcon />
          </IconButton>
        }
        sx={{ pb: 0, pt: 2 }}
      />

      {imgs.length > 0 && (
        <Box sx={{ position: 'relative', height: 180, mb: 2, background: '#f6fafd' }}>
          <SignedImage
            path={imgs[idx].path!}
            bucket={imgs[idx].bucket!}
            alt={imgs[idx].nombre}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#f6fafd',
            }}
          />

          {imgs.length > 1 && (
            <>
              <IconButton
                onClick={prev}
                disabled={idx === 0}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 10,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.85)',
                  '&:hover': { bgcolor: 'primary.light' },
                  boxShadow: 1,
                }}
                size="small"
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={next}
                disabled={idx === imgs.length - 1}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.85)',
                  '&:hover': { bgcolor: 'primary.light' },
                  boxShadow: 1,
                }}
                size="small"
              >
                <ChevronRightIcon />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0,0,0,0.36)',
                  color: '#fff',
                  borderRadius: 2,
                  px: 1.5,
                  fontSize: 13,
                }}
              >
                {idx + 1} / {imgs.length}
              </Box>
            </>
          )}
        </Box>
      )}

      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <LocalPhoneIcon fontSize="small" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            {sucursal.telefono || <span style={{ color: '#aaa' }}>Sin teléfono</span>}
          </Typography>
        </Stack>
        {sucursal.estado && (
          <Chip
            label={sucursal.estado}
            size="small"
            sx={{
              bgcolor: 'info.light',
              color: 'info.contrastText',
              mr: 1,
              mb: 1,
              fontWeight: 500,
            }}
          />
        )}
        {sucursal.areas?.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {sucursal.areas.map((area: string, i: number) => (
              <Chip
                key={i}
                label={area}
                size="small"
                color="secondary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

export default SucursalCard
