import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { SentimentDissatisfied as SadIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <SadIcon sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />

          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Página não encontrada
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 500 }}
          >
            A página que você está procurando não existe ou foi movida.
          </Typography>

          <Button
            component={Link}
            to={isAuthenticated ? "/" : "/login"}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            {isAuthenticated ? "Voltar para o Dashboard" : "Ir para o Login"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
