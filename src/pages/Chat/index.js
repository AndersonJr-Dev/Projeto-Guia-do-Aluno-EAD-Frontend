import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import { Send as SendIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Buscar histórico de mensagens
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/chat/history");
        setMessages(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico de mensagens:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const userMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chat/message", { message: newMessage });

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== userMessage.id),
        {
          id: `user-${Date.now()}`,
          content: newMessage,
          isUser: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: response.data.id,
          content: response.data.content,
          isUser: false,
          createdAt: response.data.createdAt,
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      // Adicionar mensagem de erro
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content:
            "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          isUser: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("Tem certeza que deseja limpar o histórico de chat?")) {
      try {
        // Em um cenário real, você teria um endpoint para limpar o histórico
        // await api.delete('/chat/history');
        setMessages([]);
      } catch (error) {
        console.error("Erro ao limpar histórico:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (initialLoading) {
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
          Assistente IA
        </Typography>
        <IconButton color="error" onClick={clearChat} title="Limpar chat">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        Converse com nossa IA para tirar dúvidas sobre suas matérias, organizar
        seus estudos ou obter ajuda com conteúdos acadêmicos.
      </Typography>

      <Paper
        elevation={3}
        sx={{
          height: "calc(100vh - 250px)",
          display: "flex",
          flexDirection: "column",
          mb: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Envie uma mensagem para começar a conversa com a IA.
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.isUser ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "75%",
                    backgroundColor: message.isUser ? "#e3f2fd" : "#fff",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1, textAlign: "right" }}
                  >
                    {formatDate(message.createdAt)}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            backgroundColor: "#fff",
            display: "flex",
          }}
        >
          <TextField
            fullWidth
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !newMessage.trim()}
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Chat;
