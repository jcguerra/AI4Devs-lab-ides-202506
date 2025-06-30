import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { validateFileType, validateFileSize, formatFileSize } from '../../../utils/validation.utils';

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  currentFile?: string; // Nombre del archivo actual si existe
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  acceptedTypes = ['.pdf', '.docx'],
  maxSizeInMB = 10,
  disabled = false,
  error,
  helperText,
  currentFile
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    setValidationError('');

    // Validar tipo de archivo
    if (!validateFileType(file)) {
      setValidationError(`Tipo de archivo no permitido. Solo se aceptan: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validar tamaño de archivo
    if (!validateFileSize(file, maxSizeInMB)) {
      setValidationError(`El archivo excede el tamaño máximo de ${maxSizeInMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError('');
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || validationError;

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderColor: displayError ? 'error.main' : dragOver ? 'primary.main' : 'grey.300',
          backgroundColor: dragOver ? 'action.hover' : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': disabled ? {} : {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? handleButtonClick : undefined}
      >
        {selectedFile ? (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <FileIcon color="primary" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              disabled={disabled}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : currentFile ? (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <FileIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Archivo actual: {currentFile}
              </Typography>
            </Box>
            <Chip label="Reemplazar" size="small" variant="outlined" />
          </Box>
        ) : (
          <Box textAlign="center">
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Arrastra un archivo aquí o haz click para seleccionar
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tipos permitidos: {acceptedTypes.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tamaño máximo: {maxSizeInMB}MB
            </Typography>
          </Box>
        )}
      </Paper>

      {displayError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {displayError}
        </Alert>
      )}

      {helperText && !displayError && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload; 