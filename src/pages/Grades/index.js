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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as ChartIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAnalysisDialog, setOpenAnalysisDialog] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    weight: "1",
    subjectId: "",
  });
  const [analysis, setAnalysis] = useState("");
  const [analyzingGrades, setAnalyzingGrades] = useState(false);

  // Carregar notas e matérias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Em um cenário real, você buscaria os dados da API
        // const [gradesRes, subjectsRes] = await Promise.all([
        //   api.get('/grades'),
        //   api.get('/subjects'),
        // ]);
        // setGrades(gradesRes.data);
        // setSubjects(subjectsRes.data);

        // Simulando dados para preview
        setSubjects([
          { id: "1", name: "Cálculo I" },
          { id: "2", name: "Física I" },
          { id: "3", name: "Programação Web" },
          { id: "4", name: "Banco de Dados" },
          { id: "5", name: "Estrutura de Dados" },
        ]);

        setGrades([
          {
            id: "1",
            name: "Prova 1",
            value: 8.5,
            weight: 2,
            subjectId: "1",
          },
          {
            id: "2",
            name: "Trabalho",
            value: 9.0,
            weight: 1,
            subjectId: "1",
          },
          {
            id: "3",
            name: "Prova 1",
            value: 7.0,
            weight: 1,
            subjectId: "2",
          },
          {
            id: "4",
            name: "Projeto Final",
            value: 9.5,
            weight: 2,
            subjectId: "3",
          },
          {
            id: "5",
            name: "Exercícios",
            value: 8.0,
            weight: 1,
            subjectId: "3",
          },
          {
            id: "6",
            name: "Prova 2",
            value: 6.5,
            weight: 1,
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

  // Abrir diálogo para adicionar/editar nota
  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        name: grade.name,
        value: grade.value.toString(),
        weight: grade.weight.toString(),
        subjectId: grade.subjectId,
      });
    } else {
      setEditingGrade(null);
      setFormData({
        name: "",
        value: "",
        weight: "1",
        subjectId: "",
      });
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGrade(null);
  };

  // Atualizar dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salvar nota
  const handleSaveGrade = async () => {
    try {
      const gradeData = {
        ...formData,
        value: parseFloat(formData.value),
        weight: parseFloat(formData.weight),
      };

      if (editingGrade) {
        // Em um cenário real, você atualizaria a nota na API
        // await api.put(`/grades/${editingGrade.id}`, gradeData);

        // Simulando atualização
        setGrades((prev) =>
          prev.map((grade) =>
            grade.id === editingGrade.id ? { ...grade, ...gradeData } : grade
          )
        );
      } else {
        // Em um cenário real, você criaria a nota na API
        // const response = await api.post('/grades', gradeData);

        // Simulando criação
        const newGrade = {
          id: Date.now().toString(),
          ...gradeData,
        };
        setGrades((prev) => [...prev, newGrade]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    }
  };

  // Excluir nota
  const handleDeleteGrade = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      try {
        // Em um cenário real, você excluiria a nota na API
        // await api.delete(`/grades/${id}`);

        // Simulando exclusão
        setGrades((prev) => prev.filter((grade) => grade.id !== id));
      } catch (error) {
        console.error("Erro ao excluir nota:", error);
      }
    }
  };

  // Analisar desempenho com IA
  const handleAnalyzePerformance = async () => {
    try {
      setAnalyzingGrades(true);
      setOpenAnalysisDialog(true);

      // Em um cenário real, você chamaria a API para analisar o desempenho
      // const response = await api.post('/chat/analyze-performance');
      // setAnalysis(response.data.analysis);

      // Simulando resposta da IA
      setTimeout(() => {
        setAnalysis(
          `# Análise de Desempenho Acadêmico

## Desempenho Geral
Seu desempenho geral está **bom**, com uma média ponderada global de **8.2**. Você está acima da média em todas as disciplinas analisadas.

## Áreas Fortes
- **Programação Web**: Média 9.0 - Seu melhor desempenho está nesta disciplina, especialmente no projeto final.
- **Cálculo I**: Média 8.7 - Bom desempenho, demonstrando boa compreensão dos conceitos.

## Áreas para Melhorar
- **Física I**: Média 6.8 - Esta é a disciplina com menor desempenho, especialmente na Prova 2.

## Recomendações
1. **Física I**: Dedique mais tempo aos estudos desta disciplina, focando nos tópicos da Prova 2.
2. **Cálculo I**: Continue com o bom trabalho, mas considere revisar os conceitos para manter o desempenho.
3. **Programação Web**: Seu desempenho é excelente, continue aplicando as mesmas estratégias de estudo.

Mantenha o foco nas áreas que precisam de melhoria sem descuidar das disciplinas em que você já tem bom desempenho.`
        );
        setAnalyzingGrades(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao analisar desempenho:", error);
      setAnalyzingGrades(false);
    }
  };

  // Calcular média por matéria
  const calculateSubjectAverage = (subjectId) => {
    const subjectGrades = grades.filter(
      (grade) => grade.subjectId === subjectId
    );

    if (subjectGrades.length === 0) return 0;

    const totalWeightedValue = subjectGrades.reduce(
      (sum, grade) => sum + grade.value * grade.weight,
      0
    );
    const totalWeight = subjectGrades.reduce(
      (sum, grade) => sum + grade.weight,
      0
    );

    return totalWeightedValue / totalWeight;
  };

  // Calcular média geral
  const calculateOverallAverage = () => {
    if (grades.length === 0) return 0;

    const totalWeightedValue = grades.reduce(
      (sum, grade) => sum + grade.value * grade.weight,
      0
    );
    const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);

    return totalWeightedValue / totalWeight;
  };

  // Encontrar nome da matéria pelo ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "";
  };

  // Agrupar notas por matéria
  const getGradesBySubject = () => {
    const gradesBySubject = {};

    subjects.forEach((subject) => {
      const subjectGrades = grades.filter(
        (grade) => grade.subjectId === subject.id
      );
      if (subjectGrades.length > 0) {
        gradesBySubject[subject.id] = {
          subject,
          grades: subjectGrades,
          average: calculateSubjectAverage(subject.id),
        };
      }
    });

    return gradesBySubject;
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

  const gradesBySubject = getGradesBySubject();
  const overallAverage = calculateOverallAverage();

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
          Notas
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ChartIcon />}
            onClick={handleAnalyzePerformance}
            sx={{ mr: 2 }}
          >
            Analisar Desempenho
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Nota
          </Button>
        </Box>
      </Box>

      {/* Card com média geral */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h6" component="h2">
                Média Geral
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Média ponderada de todas as notas
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color:
                    overallAverage >= 7
                      ? "success.main"
                      : overallAverage >= 5
                      ? "warning.main"
                      : "error.main",
                }}
              >
                {overallAverage.toFixed(1)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notas por matéria */}
      {Object.keys(gradesBySubject).length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">
            Nenhuma nota cadastrada. Adicione notas para visualizar seu
            desempenho.
          </Typography>
        </Paper>
      ) : (
        Object.values(gradesBySubject).map(({ subject, grades, average }) => (
          <Paper
            key={subject.id}
            elevation={3}
            sx={{ mb: 4, overflow: "hidden" }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" component="h2">
                {subject.name}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  bgcolor:
                    average >= 7
                      ? "success.main"
                      : average >= 5
                      ? "warning.main"
                      : "error.main",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                Média: {average.toFixed(1)}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Avaliação</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nota</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Peso</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 120 }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id} hover>
                      <TableCell>{grade.name}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: "medium",
                            color:
                              grade.value >= 7
                                ? "success.main"
                                : grade.value >= 5
                                ? "warning.main"
                                : "error.main",
                          }}
                        >
                          {grade.value.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>{grade.weight}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(grade)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteGrade(grade.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
      )}

      {/* Diálogo para adicionar/editar nota */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingGrade ? "Editar Nota" : "Nova Nota"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome da Avaliação"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="value"
            label="Nota (0-10)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.value}
            onChange={handleChange}
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="weight"
            label="Peso"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.weight}
            onChange={handleChange}
            inputProps={{ min: 0.1, step: 0.1 }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="subject-label">Matéria</InputLabel>
            <Select
              labelId="subject-label"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              label="Matéria"
              required
            >
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
            onClick={handleSaveGrade}
            variant="contained"
            color="primary"
            disabled={
              !formData.name ||
              !formData.value ||
              !formData.weight ||
              !formData.subjectId
            }
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para mostrar análise de desempenho */}
      <Dialog
        open={openAnalysisDialog}
        onClose={() => setOpenAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Análise de Desempenho</DialogTitle>
        <DialogContent>
          {analyzingGrades ? (
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
                A IA está analisando seu desempenho acadêmico...
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
              {analysis}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnalysisDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Grades;
