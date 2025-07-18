import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Candidate } from '../../types/candidate.types';
import CandidateForm from '../candidate/CandidateForm/CandidateForm';
import CandidateList from '../candidate/CandidateList/CandidateList';
import CandidateView from '../candidate/CandidateView/CandidateView';
import candidateService from '../../services/candidate.service';

type ViewMode = 'list' | 'add' | 'edit' | 'view';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    candidateId: number | null;
    candidateName: string;
  }>({
    open: false,
    candidateId: null,
    candidateName: ''
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: 'success', message: '' });
    }, 5000);
  };

  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setViewMode('add');
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('edit');
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('view');
  };

  const handleDeleteCandidate = (candidateId: number) => {
    // Buscar el candidato para mostrar su nombre en el diálogo
    const candidate = selectedCandidate || { firstName: 'Candidato', lastName: '' };
    setDeleteDialog({
      open: true,
      candidateId,
      candidateName: `${candidate.firstName} ${candidate.lastName}`.trim()
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.candidateId || isDeleting) return;

    // Prevenir múltiples eliminaciones del mismo candidato
    const candidateId = deleteDialog.candidateId;
    
    setIsDeleting(true);
    
    // Cerrar el diálogo inmediatamente para prevenir doble clic
    setDeleteDialog({ open: false, candidateId: null, candidateName: '' });

    try {
      const result = await candidateService.deleteCandidate(candidateId);
      
      if (result.success) {
        showAlert('success', 'Candidato eliminado exitosamente');
        // Forzar refresh de la lista con un pequeño delay
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 100);
        setViewMode('list');
      } else {
        // Si hay error, mostrar el mensaje pero no reabrir el diálogo
        showAlert('error', result.error?.message || 'Error al eliminar el candidato');
      }
    } catch (error: any) {
      showAlert('error', 'Error de conexión al eliminar el candidato');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = (candidate: Candidate) => {
    const isEdit = viewMode === 'edit';
    showAlert('success', `Candidato ${isEdit ? 'actualizado' : 'creado'} exitosamente`);
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
    setSelectedCandidate(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedCandidate(null);
  };

  const getPageTitle = (): string => {
    switch (viewMode) {
      case 'add':
        return 'Añadir Nuevo Candidato';
      case 'edit':
        return 'Editar Candidato';
      case 'view':
        return 'Detalles del Candidato';
      default:
        return 'LTI Sistema ATS - Gestión de Candidatos';
    }
  };

  const getBreadcrumbs = () => {
    const items = [
      {
        label: 'Dashboard',
        icon: <HomeIcon fontSize="small" />,
        onClick: () => setViewMode('list')
      }
    ];

    if (viewMode === 'add') {
      items.push({ label: 'Añadir Candidato', icon: <AddIcon fontSize="small" />, onClick: () => {} });
    } else if (viewMode === 'edit' && selectedCandidate) {
      items.push({ 
        label: `Editar: ${selectedCandidate.firstName} ${selectedCandidate.lastName}`, 
        icon: <PersonIcon fontSize="small" />, 
        onClick: () => {} 
      });
    }

    return items;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <PersonIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      {getBreadcrumbs().length > 1 && (
        <Box sx={{ bgcolor: 'background.paper', px: 3, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Breadcrumbs>
            {getBreadcrumbs().map((item, index) => (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={item.onClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  color: index === getBreadcrumbs().length - 1 ? 'text.primary' : 'primary.main',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      )}

      {/* Alert */}
      {alert.show && (
        <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1300, minWidth: 300 }}>
          <Alert 
            severity={alert.type} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ boxShadow: 3 }}
          >
            {alert.message}
          </Alert>
        </Box>
      )}

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {viewMode === 'list' && (
          <CandidateList
            onEditCandidate={handleEditCandidate}
            onViewCandidate={handleViewCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onAddCandidate={handleAddCandidate}
            refreshTrigger={refreshTrigger}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <CandidateForm
            candidate={selectedCandidate || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isEdit={viewMode === 'edit'}
          />
        )}

        {viewMode === 'view' && selectedCandidate && (
          <CandidateView
            candidate={selectedCandidate}
            open={true}
            onClose={handleCancel}
            onEdit={handleEditCandidate}
          />
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 3,
          px: 2,
          bgcolor: 'background.default',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          LTI Sistema ATS - LIDR Academy 2025
        </Typography>
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al candidato{' '}
            <strong>{deleteDialog.candidateName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer. Se eliminarán todos los datos asociados, 
            incluyendo documentos y registros de educación/experiencia.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            color="primary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : undefined}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 