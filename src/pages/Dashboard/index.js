import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Book as BookIcon,
  Alarm as AlarmIcon,
  Grade as GradeIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    reminders: 0,
    pendingReminders: 0,
    grades: 0,
    averageGrade: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Em um cenário real, você teria um endpoint para buscar os dados do dashboard
        // Aqui estamos simulando com chamadas separadas

        const [subjectsRes, remindersRes, gradesRes] = await Promise.all([
          api.get("/subjects"),
          api.get("/reminders"),
          api.get("/grades"),
        ]);

        const subjects = subjectsRes.data;
        const reminders = remindersRes.data;
        const grades = gradesRes.data;

        // Calcular estatísticas
        const pendingReminders = reminders.filter((r) => !r.completed).length;

        let averageGrade = 0;
        if (grades.length > 0) {
          const totalWeightedGrade = grades.reduce(
            (sum, grade) => sum + grade.value * grade.weight,
            0
          );
          const totalWeight = grades.reduce(
            (sum, grade) => sum + grade.weight,
            0
          );
          averageGrade = totalWeightedGrade / totalWeight;
        }

        setStats({
          subjects: subjects.length,
          reminders: reminders.length,
          pendingReminders,
          grades: grades.length,
          averageGrade: averageGrade.toFixed(2),
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardItems = [
    {
      title: "Matérias",
      icon: <BookIcon fontSize="large" color="primary" />,
      value: stats.subjects,
      text: `${stats.subjects} matéria(s) cadastrada(s)`,
      action: () => navigate("/subjects"),
      buttonText: "Gerenciar Matérias",
    },
    {
      title: "Lembretes",
      icon: <AlarmIcon fontSize="large" color="secondary" />,
      value: stats.reminders,
      text: `${stats.pendingReminders} lembrete(s) pendente(s)`,
      action: () => navigate("/reminders"),
      buttonText: "Ver Lembretes",
    },
    {
      title: "Notas",
      icon: <GradeIcon fontSize="large" color="success" />,
      value: stats.averageGrade,
      text: `Média geral: ${stats.averageGrade}`,
      action: () => navigate("/grades"),
      buttonText: "Gerenciar Notas",
    },
    {
      title: "Assistente IA",
      icon: <ChatIcon fontSize="large" color="info" />,
      value: "",
      text: "Tire suas dúvidas com a IA",
      action: () => navigate("/chat"),
      buttonText: "Conversar com IA",
    },
  ];

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Bem-vindo ao seu painel de controle. Aqui você pode visualizar um
          resumo das suas atividades acadêmicas.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                {item.value && (
                  <Typography variant="h3" color="text.primary" gutterBottom>
                    {item.value}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.text}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={item.action}
                  sx={{ mt: "auto" }}
                >
                  {item.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard;
