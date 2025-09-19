import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DataPrediction from "./pages/DataPrediction";
import MLAnalysis from "./pages/MLAnalysis";
import Simulation from "./pages/Simulation";
import TrainAudit from "./pages/TrainAudit";
import InputUpload from "./pages/InputUpload";
import Login from "./pages/Login";
import translations from "./locales";

function App() {
  const [mode, setMode] = useState("light");
  const [lang, setLang] = useState("en");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );
  const t = translations[lang];

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} mode={mode} setMode={setMode} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/input-upload"
            element={
              <InputUpload
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/data-prediction"
            element={
              <DataPrediction
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/ml-analysis"
            element={
              <MLAnalysis
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/simulation"
            element={
              <Simulation
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/train-audit"
            element={
              <TrainAudit
                mode={mode}
                setMode={setMode}
                lang={lang}
                setLang={setLang}
                t={t}
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      )}
    </ThemeProvider>
  );
}

export default App;
