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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );
  const t = translations[lang];

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
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
                onLogout={() => setIsLoggedIn(false)}
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
                onLogout={() => setIsLoggedIn(false)}
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
                onLogout={() => setIsLoggedIn(false)}
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
                onLogout={() => setIsLoggedIn(false)}
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
                onLogout={() => setIsLoggedIn(false)}
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
                onLogout={() => setIsLoggedIn(false)}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
