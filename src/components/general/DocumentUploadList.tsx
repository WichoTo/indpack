// components/general/DocumentUploadList.tsx
import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Typography,
  CircularProgress,
  Collapse,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Document } from '../../config/types';
import { supabase } from '../../config/supabase';

interface DocumentUploadListProps {
  documents: Document[];
  onUpload: (files: FileList) => Promise<void>;
  onDelete?: (doc: Document) => Promise<void>;
  maxFiles?: number;
}

const DocumentUploadList: React.FC<DocumentUploadListProps> = ({
  documents,
  onUpload,
  onDelete,
  maxFiles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleButtonClick = () => inputRef.current?.click();

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      await onUpload(e.target.files);
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (doc: Document) => {
    let url: string | null = null;

    // 1) Local blob
    if (doc.file) {
      url = URL.createObjectURL(doc.file);
    }
    // 2) Otherwise always generate a fresh signed URL
    else if (doc.bucket && doc.path) {
      const { data, error } = await supabase
        .storage
        .from(doc.bucket)
        .createSignedUrl(doc.path, 60); // 60s
      if (error) {
        console.error('Error generating signed URL:', error.message);
        return;
      }
      url = data.signedUrl;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <IconButton onClick={() => setExpanded(x => !x)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Archivos
        </Typography>
        <Tooltip title="Subir archivos">
          <span>
            <IconButton
              onClick={handleButtonClick}
              disabled={uploading || (maxFiles != null && documents.length >= maxFiles)}
            >
              {uploading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2" color="textSecondary">
          {documents.length} / {maxFiles ?? '∞'}
        </Typography>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleFilesSelected}
        />
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List dense>
          {documents.map(doc => (
            <ListItem key={doc.id} divider>
              <ListItemIcon>
                <IconButton onClick={() => handleView(doc)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>

              <ListItemText
                primary={doc.nombre}
                secondary={doc.path} 
              />

              {onDelete && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => onDelete(doc)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default DocumentUploadList;
