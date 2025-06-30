import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { Education } from '../../../types/candidate.types';
import { formatDateForInput } from '../../../utils/validation.utils';

interface EducationFormProps {
  educations: Education[];
  onChange: (educations: Education[]) => void;
  disabled?: boolean;
}

const EducationForm: React.FC<EducationFormProps> = ({
  educations,
  onChange,
  disabled = false
}) => {
  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    onChange([...educations, newEducation]);
  };

  const removeEducation = (index: number) => {
    const newEducations = educations.filter((_, i) => i !== index);
    onChange(newEducations);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const newEducations = [...educations];
    newEducations[index] = { ...newEducations[index], [field]: value };
    
    // Si se marca como actual, limpiar fecha de fin
    if (field === 'isCurrent' && value === true) {
      newEducations[index].endDate = '';
    }
    
    onChange(newEducations);
  };

  return (
    <Box>
      {educations.length === 0 ? (
        <Box textAlign="center" py={3}>
          <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No hay registros de educación añadidos
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Añade la formación académica del candidato
          </Typography>
        </Box>
      ) : (
        <Box>
          {educations.map((education, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h3">
                    Educación #{index + 1}
                  </Typography>
                  {educations.length > 1 && (
                    <IconButton
                      onClick={() => removeEducation(index)}
                      disabled={disabled}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Institución *"
                      value={education.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      disabled={disabled}
                      placeholder="Ej: Universidad Complutense de Madrid"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Título/Grado *"
                      value={education.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      disabled={disabled}
                      placeholder="Ej: Grado en Ingeniería Informática"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Campo de estudio"
                      value={education.fieldOfStudy || ''}
                      onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                      disabled={disabled}
                      placeholder="Ej: Desarrollo de Software"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={education.isCurrent}
                          onChange={(e) => updateEducation(index, 'isCurrent', e.target.checked)}
                          disabled={disabled}
                        />
                      }
                      label="Actualmente estudiando"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fecha de inicio"
                      type="date"
                      value={education.startDate ? formatDateForInput(education.startDate) : ''}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fecha de finalización"
                      type="date"
                      value={education.endDate ? formatDateForInput(education.endDate) : ''}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      disabled={disabled || education.isCurrent}
                      InputLabelProps={{ shrink: true }}
                      helperText={education.isCurrent ? 'Actualmente estudiando' : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      value={education.description || ''}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      disabled={disabled}
                      multiline
                      rows={3}
                      placeholder="Describe el programa de estudios, logros destacados, etc."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box mt={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addEducation}
          disabled={disabled}
          fullWidth
        >
          Añadir Educación
        </Button>
      </Box>
    </Box>
  );
};

export default EducationForm; 