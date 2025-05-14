import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import { getSignedUrl } from '../../hooks/useUtilsFunctions'
import { Document } from '../../config/types'

interface FileUploadPreviewProps {
  value?: Document | Document[]
  onChange: (file: File | File[]) => void
  multiple?: boolean
  accept?: string
  width?: number
  height?: number
  disabled?: boolean
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
  value,
  onChange,
  accept = 'image/*,.pdf',
  width = 100,
  height = 100,
  multiple = false,
  disabled,
}) => {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const values = Array.isArray(value) ? value : value ? [value] : []
    values.forEach((val) => {
      if (val && val.path && val.bucket && !(val.file instanceof File)) {
        getSignedUrl(val.path, val.bucket)
          .then((url) => {
            if (url) {
              setSignedUrls((prev) => ({ ...prev, [val.id]: url }))
            }
          })
          .catch((error) => {
            console.error('Error al obtener URL firmada:', error)
          })
      }
    })
  }, [value])

  const values = Array.isArray(value) ? value : value ? [value] : []

  return (
    <Box>
      {onChange && (
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (disabled) return
            const files = e.target.files
            if (files) {
              onChange(multiple ? Array.from(files) : files[0])
            }
          }}
        />
      )}

      {values.map((val, idx) => {
        const key = val.id || idx.toString()
        const localUrl = val.file instanceof File ? URL.createObjectURL(val.file) : ''
        const previewUrl = localUrl || signedUrls[val.id]
        const isPDF = val.nombre.toLowerCase().endsWith('.pdf')

        return previewUrl ? (
          isPDF ? (
            <object
              key={key}
              data={previewUrl}
              type="application/pdf"
              width={width}
              height={height}
            >
              <Typography variant="caption">PDF no compatible</Typography>
            </object>
          ) : (
            <img
              key={key}
              src={previewUrl}
              alt={val.nombre || 'preview'}
              width={width}
              height={height}
              style={{ objectFit: 'cover', marginRight: 8, marginBottom: 8 }}
            />
          )
        ) : (
          val.path && (
            <Typography key={key} variant="caption">
              Cargando...
            </Typography>
          )
        )
      })}
    </Box>
  )
}

export default FileUploadPreview
