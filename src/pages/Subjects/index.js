import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openOrganizeDialog, setOpenOrganizeDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [organization, setOrganization] = useState("");
  const [organizingSubjects, setOrganizingSubjects] = useState(false);

  // Carregar matérias
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // Em um cenário real, você buscaria as matérias da API
        // const response = await api.get('/subjects');
        // setSubjects(response.data);

        // Simulando dados para preview
        setSubjects([
          {
            id: "1",
            name: "Cálculo I",
            description: "Limites, derivadas e integrais",
          },
          { id: "2", name: "Física I", description: "Mecânica clássica" },
          {
            id: "3",
            name: "Programação Web",
            description: "HTML, CSS e JavaScript",
          },
          { id: "4", name: "Banco de Dados", description: "Modelagem e SQL" },
          {
            id: "5",
            name: "Estrutura de Dados",
            description: "Arrays, listas, árvores e grafos",
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar matérias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Abrir diálogo para adicionar/editar matéria
  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubject(null);
  };

  // Atualizar dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salvar matéria
  const handleSaveSubject = async () => {
    try {
      if (editingSubject) {
        // Em um cenário real, você atualizaria a matéria na API
        // await api.put(`/subjects/${editingSubject.id}`, formData);

        // Simulando atualização
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === editingSubject.id
              ? { ...subject, ...formData }
              : subject
          )
        );
      } else {
        // Em um cenário real, você criaria a matéria na API
        // const response = await api.post('/subjects', formData);

        // Simulando criação
        const newSubject = {
          id: Date.now().toString(),
          ...formData,
        };
        setSubjects((prev) => [...prev, newSubject]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar matéria:", error);
    }
  };

  // Excluir matéria
  const handleDeleteSubject = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta matéria?")) {
      try {
        // Em um cenário real, você excluiria a matéria na API
        // await api.delete(`/subjects/${id}`);

        // Simulando exclusão
        setSubjects((prev) => prev.filter((subject) => subject.id !== id));
      } catch (error) {
        console.error("Erro ao excluir matéria:", error);
      }
    }
  };

  // Organizar matérias com IA
  const handleOrganizeSubjects = async () => {
    try {
      setOrganizingSubjects(true);
      setOpenOrganizeDialog(true);

      // Em um cenário real, você chamaria a API para organizar as matérias
      // const response = await api.post('/chat/organize-subjects');
      // setOrganization(response.data.organization);

      // Simulando resposta da IA
      setTimeout(() => {
        setOrganization(
          `Baseado nas matérias cadastradas, sugiro a seguinte ordem de estudos:

1. **Cálculo I** - Fundamento para várias outras disciplinas
2. **Física I** - Depende de conhecimentos de Cálculo
3. **Estrutura de Dados** - Base para programação avançada
4. **Banco de Dados** - Complementa conhecimentos de estrutura de dados
5. **Programação Web** - Aplicação prática dos conhecimentos anteriores

Esta ordem considera a interdependência dos conteúdos e a progressão do nível de dificuldade.`
        );
        setOrganizingSubjects(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao organizar matérias:", error);
      setOrganizingSubjects(false);
    }
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
          Matérias
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SchoolIcon />}
            onClick={handleOrganizeSubjects}
            sx={{ mr: 2 }}
          >
            Organizar com IA
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Matéria
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: 120 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhuma matéria cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.description || "-"}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(subject)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo para adicionar/editar matéria */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSubject ? "Editar Matéria" : "Nova Matéria"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome da Matéria"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveSubject}
            variant="contained"
            color="primary"
            disabled={!formData.name}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para mostrar organização de matérias */}
      <Dialog
        open={openOrganizeDialog}
        onClose={() => setOpenOrganizeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Organização de Matérias</DialogTitle>
        <DialogContent>
          {organizingSubjects ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 3,
              }}
            >
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>
                A IA está analisando suas matérias e criando uma sugestão de
                organização...
              </Typography>
            </Box>
          ) : (
            <Typography
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                my: 2,
              }}
            >
              {organization}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrganizeDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Subjects;
