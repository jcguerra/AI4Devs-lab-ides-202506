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
  Work as WorkIcon
} from '@mui/icons-material';
import { WorkExperience } from '../../../types/candidate.types';
import { formatDateForInput } from '../../../utils/validation.utils';

interface ExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  disabled?: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  disabled = false
}) => {
  const addExperience = () => {
    const newExperience: WorkExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    onChange([...experiences, newExperience]);
  };

  const removeExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    onChange(newExperiences);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    
    // Si se marca como actual, limpiar fecha de fin
    if (field === 'isCurrent' && value === true) {
      newExperiences[index].endDate = '';
    }
    
    onChange(newExperiences);
  };

  return (
    <Box>
      {experiences.length === 0 ? (
        <Box textAlign="center" py={3}>
          <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No hay registros de experiencia laboral añadidos
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Añade la experiencia profesional del candidato
          </Typography>
        </Box>
      ) : (
        <Box>
          {experiences.map((experience, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h3">
                    Experiencia #{index + 1}
                  </Typography>
                  {experiences.length > 1 && (
                    <IconButton
                      onClick={() => removeExperience(index)}
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
                      label="Empresa *"
                      value={experience.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      disabled={disabled}
                      placeholder="Ej: Google España"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Puesto *"
                      value={experience.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      disabled={disabled}
                      placeholder="Ej: Desarrollador Frontend Senior"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fecha de inicio *"
                      type="date"
                      value={experience.startDate ? formatDateForInput(experience.startDate) : ''}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <TextField
                        fullWidth
                        label="Fecha de finalización"
                        type="date"
                        value={experience.endDate ? formatDateForInput(experience.endDate) : ''}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={disabled || experience.isCurrent}
                        InputLabelProps={{ shrink: true }}
                        helperText={experience.isCurrent ? 'Trabajo actual' : ''}
                      />
                      <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                          <Checkbox
                            checked={experience.isCurrent}
                            onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                            disabled={disabled}
                            size="small"
                          />
                        }
                        label="Trabajo actual"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción del puesto"
                      value={experience.description || ''}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      disabled={disabled}
                      multiline
                      rows={4}
                      placeholder="Describe las responsabilidades, logros y tecnologías utilizadas en este puesto..."
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
          onClick={addExperience}
          disabled={disabled}
          fullWidth
        >
          Añadir Experiencia Laboral
        </Button>
      </Box>
    </Box>
  );
};

export default ExperienceForm; 