import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { Candidate, CreateCandidateDto, Education, WorkExperience } from '../../../types/candidate.types';
import { validateEmail, validatePhone, validateAddress, validateRequired } from '../../../utils/validation.utils';
import candidateService from '../../../services/candidate.service';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import FileUpload from '../../common/FileUpload/FileUpload';

interface CandidateFormProps {
  candidate?: Candidate;
  onSubmit: (candidate: Candidate) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  general?: string;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<CreateCandidateDto>({
    firstName: candidate?.firstName || '',
    lastName: candidate?.lastName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    address: candidate?.address || '',
    educations: candidate?.educations || [],
    experiences: candidate?.experiences || []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = 'El nombre no puede exceder 100 caracteres';
    }

    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = 'El apellido no puede exceder 100 caracteres';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    } else if (formData.email.length > 255) {
      newErrors.email = 'El email no puede exceder 255 caracteres';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener entre 7 y 15 caracteres y puede incluir espacios, paréntesis, guiones y símbolo +';
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'La dirección es obligatoria';
    } else if (!validateAddress(formData.address)) {
      newErrors.address = 'La dirección no puede exceder 255 caracteres y solo puede contener letras, números, espacios y los signos: . , - # /';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateCandidateDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEducationChange = (educations: Education[]) => {
    setFormData(prev => ({ ...prev, educations }));
  };

  const handleExperienceChange = (experiences: WorkExperience[]) => {
    setFormData(prev => ({ ...prev, experiences }));
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    setUploadError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Función para limpiar campos de base de datos de educación
      const cleanEducation = (education: any) => {
        const { id, candidateId, createdAt, updatedAt, ...cleanEducation } = education;
        return {
          ...cleanEducation,
          endDate: education.isCurrent ? null : (education.endDate || null),
          startDate: education.startDate || null,
          fieldOfStudy: education.fieldOfStudy || undefined,
          description: education.description || undefined
        };
      };

      // Función para limpiar campos de base de datos de experiencia
      const cleanExperience = (experience: any) => {
        const { id, candidateId, createdAt, updatedAt, ...cleanExperience } = experience;
        return {
          ...cleanExperience,
          endDate: experience.isCurrent ? null : (experience.endDate || null),
          description: experience.description || undefined
        };
      };

      // Limpiar datos antes de enviar - ELIMINAR CAMPOS DE BD
      const cleanedFormData: CreateCandidateDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        educations: formData.educations?.map(cleanEducation),
        experiences: formData.experiences?.map(cleanExperience)
      };

      let result;
      if (isEdit && candidate) {
        result = await candidateService.updateCandidate(candidate.id, cleanedFormData);
      } else {
        result = await candidateService.createCandidate(cleanedFormData);
      }

      if (!result.success) {
        setErrors({ general: result.error?.message || 'Error al guardar el candidato' });
        return;
      }

      // Si hay un archivo seleccionado, subirlo
      if (selectedFile && result.data) {
        const uploadResult = await candidateService.uploadDocument(
          result.data.id,
          selectedFile,
          'CV'
        );

        if (!uploadResult.success) {
          setUploadError(uploadResult.error?.message || 'Error al subir el archivo');
          // Aún así, consideramos exitosa la creación del candidato
        }
      }

      onSubmit(result.data!);
    } catch (error: any) {
      setErrors({ general: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <PersonIcon color="primary" />
        <Typography variant="h4" component="h1">
          {isEdit ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
        </Typography>
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Información Personal */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon />
              <Typography variant="h6">Información Personal</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre *"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido *"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono *"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={loading}
                  placeholder="+34 123 456 789"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección *"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  error={!!errors.address}
                  helperText={errors.address}
                  disabled={loading}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Educación */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <SchoolIcon />
              <Typography variant="h6">
                Educación ({formData.educations?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <EducationForm
              educations={formData.educations || []}
              onChange={handleEducationChange}
              disabled={loading}
            />
          </AccordionDetails>
        </Accordion>

        {/* Experiencia Laboral */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <WorkIcon />
              <Typography variant="h6">
                Experiencia Laboral ({formData.experiences?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ExperienceForm
              experiences={formData.experiences || []}
              onChange={handleExperienceChange}
              disabled={loading}
            />
          </AccordionDetails>
        </Accordion>

        {/* Subida de CV */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <UploadIcon />
              <Typography variant="h6">Curriculum Vitae</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FileUpload
              onFileSelected={handleFileSelected}
              disabled={loading}
              error={uploadError}
              helperText="Sube el CV del candidato en formato PDF o DOCX"
              currentFile={candidate?.documents?.find(d => d.documentType === 'CV')?.originalName}
            />
          </AccordionDetails>
        </Accordion>

        {/* Botones de acción */}
        <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            size="large"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Candidato'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CandidateForm; 