import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { Candidate } from '../../../types/candidate.types';
import { formatDate } from '../../../utils/validation.utils';
import candidateService from '../../../services/candidate.service';

interface CandidateViewProps {
  candidate: Candidate;
  open: boolean;
  onClose: () => void;
  onEdit: (candidate: Candidate) => void;
}

const CandidateView: React.FC<CandidateViewProps> = ({
  candidate,
  open,
  onClose,
  onEdit
}) => {
  const [downloadingDocuments, setDownloadingDocuments] = useState<Set<number>>(new Set());
  const [downloadError, setDownloadError] = useState<string>('');

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      setDownloadingDocuments(prev => new Set(prev).add(documentId));
      setDownloadError('');

      const result = await candidateService.getDownloadUrl(documentId);
      
      if (result.success && result.data) {
        // Crear enlace temporal para descarga
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setDownloadError(result.error?.message || 'Error al descargar el archivo');
      }
    } catch (error: any) {
      setDownloadError('Error de conexión al descargar el archivo');
    } finally {
      setDownloadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const getDocumentTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      'CV': 'Curriculum Vitae',
      'COVER_LETTER': 'Carta de Presentación',
      'CERTIFICATE': 'Certificado',
      'OTHER': 'Otro'
    };
    return types[type] || type;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, any> = {
      'CV': 'primary',
      'COVER_LETTER': 'secondary',
      'CERTIFICATE': 'success',
      'OTHER': 'default'
    };
    return colors[type] || 'default';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {getInitials(candidate.firstName, candidate.lastName)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {candidate.firstName} {candidate.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {candidate.id} • Registrado: {formatDate(candidate.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => onEdit(candidate)}
            >
              Editar
            </Button>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {downloadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {downloadError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información Personal */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6">Información Personal</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={candidate.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Teléfono"
                      secondary={candidate.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dirección"
                      secondary={candidate.address}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Reclutador */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PersonIcon color="secondary" />
                  <Typography variant="h6">Reclutador Asignado</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={candidate.recruiter.name || 'Sin nombre'}
                      secondary={candidate.recruiter.email}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Educación */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <SchoolIcon color="primary" />
                  <Typography variant="h6">
                    Educación ({candidate.educations.length})
                  </Typography>
                </Box>
                {candidate.educations.length === 0 ? (
                  <Typography color="text.secondary">
                    No hay registros de educación
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {candidate.educations.map((education, index) => (
                      <Grid item xs={12} md={6} key={education.id || index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {education.institution}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {education.degree}
                          </Typography>
                          {education.fieldOfStudy && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {education.fieldOfStudy}
                            </Typography>
                          )}
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <CalendarIcon fontSize="small" />
                            <Typography variant="body2">
                              {education.startDate ? formatDate(education.startDate) : 'Sin fecha'} - {' '}
                              {education.isCurrent 
                                ? 'Actual' 
                                : education.endDate 
                                  ? formatDate(education.endDate) 
                                  : 'Sin fecha'
                              }
                            </Typography>
                          </Box>
                          {education.isCurrent && (
                            <Chip label="Actualmente estudiando" size="small" color="primary" />
                          )}
                          {education.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {education.description}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Experiencia Laboral */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <WorkIcon color="secondary" />
                  <Typography variant="h6">
                    Experiencia Laboral ({candidate.experiences.length})
                  </Typography>
                </Box>
                {candidate.experiences.length === 0 ? (
                  <Typography color="text.secondary">
                    No hay registros de experiencia laboral
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {candidate.experiences.map((experience, index) => (
                      <Grid item xs={12} md={6} key={experience.id || index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {experience.position}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {experience.company}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <CalendarIcon fontSize="small" />
                            <Typography variant="body2">
                              {formatDate(experience.startDate)} - {' '}
                              {experience.isCurrent 
                                ? 'Actual' 
                                : experience.endDate 
                                  ? formatDate(experience.endDate) 
                                  : 'Sin fecha'
                              }
                            </Typography>
                          </Box>
                          {experience.isCurrent && (
                            <Chip label="Trabajo actual" size="small" color="secondary" />
                          )}
                          {experience.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {experience.description}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Documentos */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <FileIcon color="success" />
                  <Typography variant="h6">
                    Documentos ({candidate.documents.length})
                  </Typography>
                </Box>
                {candidate.documents.length === 0 ? (
                  <Typography color="text.secondary">
                    No hay documentos subidos
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {candidate.documents.map((document) => (
                      <Grid item xs={12} md={6} key={document.id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                            <Box flex={1}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {document.originalName}
                              </Typography>
                              <Box display="flex" gap={1} mt={1}>
                                <Chip
                                  label={getDocumentTypeLabel(document.documentType)}
                                  size="small"
                                  color={getDocumentTypeColor(document.documentType)}
                                />
                                <Chip
                                  label={document.uploadStatus}
                                  size="small"
                                  color={document.uploadStatus === 'UPLOADED' ? 'success' : 'warning'}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Tamaño: {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Subido: {formatDate(document.createdAt)}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadDocument(document.id, document.originalName)}
                              disabled={downloadingDocuments.has(document.id) || document.uploadStatus !== 'UPLOADED'}
                            >
                              {downloadingDocuments.has(document.id) ? 'Descargando...' : 'Descargar'}
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} size="large">
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={() => onEdit(candidate)}
          startIcon={<EditIcon />}
          size="large"
        >
          Editar Candidato
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidateView; 