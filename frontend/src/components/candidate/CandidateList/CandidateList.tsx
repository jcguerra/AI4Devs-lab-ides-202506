import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { Candidate } from '../../../types/candidate.types';
import candidateService from '../../../services/candidate.service';
import { formatDate } from '../../../utils/validation.utils';

interface CandidateListProps {
  onEditCandidate: (candidate: Candidate) => void;
  onViewCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidateId: number) => void;
  refreshTrigger?: number; // Para forzar refresh desde componente padre
}

const CandidateList: React.FC<CandidateListProps> = ({
  onEditCandidate,
  onViewCandidate,
  onDeleteCandidate,
  refreshTrigger
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadCandidates = async (searchQuery = '', currentPage = 0, limit = 10) => {
    try {
      setLoading(true);
      setError('');

      let result;
      if (searchQuery.trim()) {
        result = await candidateService.searchCandidates(searchQuery, {
          page: currentPage + 1,
          limit
        });
      } else {
        result = await candidateService.getAllCandidates({
          page: currentPage + 1,
          limit
        });
      }

      if (result.success && result.data) {
        setCandidates(result.data);
        setTotalCount(result.meta?.total || 0);
      } else {
        setError(result.error?.message || 'Error al cargar candidatos');
        setCandidates([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      setError('Error de conexión con el servidor');
      setCandidates([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(searchTerm, page, rowsPerPage);
  }, [page, rowsPerPage, refreshTrigger]);

  useEffect(() => {
    // Resetear página cuando cambie el término de búsqueda
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setPage(0);
        loadCandidates(searchTerm, 0, rowsPerPage);
      } else if (searchTerm === '') {
        setPage(0);
        loadCandidates('', 0, rowsPerPage);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: rowsPerPage }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
          <TableCell><Skeleton variant="text" width={150} /></TableCell>
          <TableCell><Skeleton variant="text" width={200} /></TableCell>
          <TableCell><Skeleton variant="text" width={120} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Paper elevation={3}>
      {/* Header con búsqueda */}
      <Box p={3} borderBottom="1px solid #e0e0e0">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Lista de Candidatos ({totalCount})
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Buscar candidatos por nombre, email o empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
        />
      </Box>

      {/* Mensaje de error */}
      {error && (
        <Box p={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Tabla de candidatos */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Educación</TableCell>
              <TableCell>Experiencia</TableCell>
              <TableCell>Documentos</TableCell>
              <TableCell>Fecha Registro</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? renderLoadingSkeleton() : (
              candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchTerm ? 'No se encontraron candidatos' : 'No hay candidatos registrados'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm 
                        ? 'Intenta con otros términos de búsqueda' 
                        : 'Comienza añadiendo el primer candidato al sistema'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {candidate.firstName} {candidate.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {candidate.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{candidate.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{candidate.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {candidate.educations.length > 0 ? (
                        <Chip
                          icon={<SchoolIcon />}
                          label={`${candidate.educations.length} registro${candidate.educations.length > 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin registros</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.experiences.length > 0 ? (
                        <Chip
                          icon={<WorkIcon />}
                          label={`${candidate.experiences.length} puesto${candidate.experiences.length > 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin registros</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.documents.length > 0 ? (
                        <Chip
                          icon={<FileIcon />}
                          label={`${candidate.documents.length} archivo${candidate.documents.length > 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                          color="success"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin archivos</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(candidate.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => onViewCandidate(candidate)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEditCandidate(candidate)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => onDeleteCandidate(candidate.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {!loading && candidates.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default CandidateList; 