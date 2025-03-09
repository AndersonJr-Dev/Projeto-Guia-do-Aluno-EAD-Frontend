import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  ListItemIcon,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBR from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Alarm as AlarmIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    subjectId: "",
  });

  // Carregar lembretes e matérias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Em um cenário real, você buscaria os dados da API
        // const [remindersRes, subjectsRes] = await Promise.all([
        //   api.get('/reminders'),
        //   api.get('/subjects'),
        // ]);
        // setReminders(remindersRes.data);
        // setSubjects(subjectsRes.data);

        // Simulando dados para preview
        setSubjects([
          { id: "1", name: "Cálculo I" },
          { id: "2", name: "Física I" },
          { id: "3", name: "Programação Web" },
          { id: "4", name: "Banco de Dados" },
          { id: "5", name: "Estrutura de Dados" },
        ]);

        setReminders([
          {
            id: "1",
            title: "Entrega do Trabalho de Programação Web",
            description: "Projeto final de React",
            date: new Date(2025, 2, 15, 23, 59),
            completed: false,
            subjectId: "3",
          },
          {
            id: "2",
            title: "Prova de Cálculo I",
            description: "Capítulos 1-5: Limites e Derivadas",
            date: new Date(2025, 2, 10, 14, 0),
            completed: false,
            subjectId: "1",
          },
          {
            id: "3",
            title: "Estudar Banco de Dados",
            description: "Revisão de SQL e Normalização",
            date: new Date(2025, 2, 5, 10, 0),
            completed: true,
            subjectId: "4",
          },
          {
            id: "4",
            title: "Exercícios de Física",
            description: "Lista 3 - Leis de Newton",
            date: new Date(2025, 2, 8, 18, 0),
            completed: false,
            subjectId: "2",
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Abrir diálogo para adicionar/editar lembrete
  const handleOpenDialog = (reminder = null) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFormData({
        title: reminder.title,
        description: reminder.description || "",
        date: reminder.date,
        subjectId: reminder.subjectId || "",
      });
    } else {
      setEditingReminder(null);
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        subjectId: "",
      });
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReminder(null);
  };

  // Atualizar dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Atualizar data
  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // Salvar lembrete
  const handleSaveReminder = async () => {
    try {
      if (editingReminder) {
        // Em um cenário real, você atualizaria o lembrete na API
        // await api.put(`/reminders/${editingReminder.id}`, formData);

        // Simulando atualização
        setReminders((prev) =>
          prev.map((reminder) =>
            reminder.id === editingReminder.id
              ? {
                  ...reminder,
                  ...formData,
                  completed: reminder.completed,
                }
              : reminder
          )
        );
      } else {
        // Em um cenário real, você criaria o lembrete na API
        // const response = await api.post('/reminders', formData);

        // Simulando criação
        const newReminder = {
          id: Date.now().toString(),
          ...formData,
          completed: false,
        };
        setReminders((prev) => [...prev, newReminder]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
    }
  };

  // Excluir lembrete
  const handleDeleteReminder = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lembrete?")) {
      try {
        // Em um cenário real, você excluiria o lembrete na API
        // await api.delete(`/reminders/${id}`);

        // Simulando exclusão
        setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
      } catch (error) {
        console.error("Erro ao excluir lembrete:", error);
      }
    }
  };

  // Alternar status de conclusão
  const handleToggleComplete = async (id) => {
    try {
      // Em um cenário real, você atualizaria o status na API
      // await api.patch(`/reminders/${id}/toggle`);

      // Simulando atualização
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === id
            ? { ...reminder, completed: !reminder.completed }
            : reminder
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Encontrar nome da matéria pelo ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "";
  };

  // Formatar data
  const formatDateTime = (date) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Verificar se o lembrete está próximo (menos de 24h)
  const isUpcoming = (date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diffMs = reminderDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 24;
  };

  // Verificar se o lembrete está atrasado
  const isOverdue = (date, completed) => {
    if (completed) return false;
    const now = new Date();
    const reminderDate = new Date(date);
    return reminderDate < now;
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Separar lembretes por status
  const pendingReminders = reminders.filter((reminder) => !reminder.completed);
  const completedReminders = reminders.filter((reminder) => reminder.completed);

  return (
    <Layout>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Lembretes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Lembrete
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 0, mb: 4 }}>
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" component="h2">
            Pendentes ({pendingReminders.length})
          </Typography>
        </Box>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {pendingReminders.length === 0 ? (
            <ListItem>
              <ListItemText primary="Nenhum lembrete pendente" />
            </ListItem>
          ) : (
            pendingReminders.map((reminder) => (
              <React.Fragment key={reminder.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog(reminder)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={reminder.completed}
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      onChange={() => handleToggleComplete(reminder.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          color: isOverdue(reminder.date, reminder.completed)
                            ? "error.main"
                            : "text.primary",
                        }}
                      >
                        {reminder.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {reminder.description}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <EventIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mr: 1 }}
                          >
                            {formatDateTime(reminder.date)}
                          </Typography>
                          {reminder.subjectId && (
                            <Chip
                              label={getSubjectName(reminder.subjectId)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {isUpcoming(reminder.date) && (
                            <Chip
                              label="Próximo"
                              size="small"
                              color="warning"
                              sx={{ ml: 1 }}
                            />
                          )}
                          {isOverdue(reminder.date, reminder.completed) && (
                            <Chip
                              label="Atrasado"
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 0 }}>
        <Box sx={{ p: 2, bgcolor: "success.main", color: "white" }}>
          <Typography variant="h6" component="h2">
            Concluídos ({completedReminders.length})
          </Typography>
        </Box>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {completedReminders.length === 0 ? (
            <ListItem>
              <ListItemText primary="Nenhum lembrete concluído" />
            </ListItem>
          ) : (
            completedReminders.map((reminder) => (
              <React.Fragment key={reminder.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog(reminder)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={reminder.completed}
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      onChange={() => handleToggleComplete(reminder.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        {reminder.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {reminder.description}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <EventIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mr: 1 }}
                          >
                            {formatDateTime(reminder.date)}
                          </Typography>
                          {reminder.subjectId && (
                            <Chip
                              label={getSubjectName(reminder.subjectId)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Diálogo para adicionar/editar lembrete */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingReminder ? "Editar Lembrete" : "Novo Lembrete"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <DateTimePicker
              label="Data e Hora"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} />
              )}
              sx={{ width: "100%", mb: 2 }}
            />
          </LocalizationProvider>
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="subject-label">Matéria (opcional)</InputLabel>
            <Select
              labelId="subject-label"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              label="Matéria (opcional)"
            >
              <MenuItem value="">
                <em>Nenhuma</em>
              </MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveReminder}
            variant="contained"
            color="primary"
            disabled={!formData.title || !formData.date}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Reminders;
