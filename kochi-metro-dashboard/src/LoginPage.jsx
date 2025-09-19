import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment
} from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo logic - replace with Django API call later
    if (username === "admin" && password === "railway123") {
      // Store auth data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', username);
      if (onLogin) onLogin(username);
    } else {
      alert("Invalid credentials. (Demo: admin / railway123)");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: "background.default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Paper elevation={2} sx={{ p: 5, width: 360, textAlign: "center" }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mx: "auto", mb: 2 }}>
          <TrainIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Railway Operations
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Management System Access Portal
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            sx={{ mt: 2, mb: 1.5 }}
          >
            Sign In
          </Button>
          <Typography variant="caption" color="text.secondary">
            Demo credentials: admin / railway123
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
