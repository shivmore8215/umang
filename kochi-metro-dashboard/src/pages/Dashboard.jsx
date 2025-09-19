import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { API_BASE } from "../api";

export default function Dashboard({ mode, setMode, lang, setLang, t, onLogout }) {
  const [stats, setStats] = useState({ trainsReady: null, maintenanceAlerts: null, adDeadlines: null, systemHealth: null });

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch(`${API_BASE}/stats/overview/`)
        .then(async (res) => { if (!res.ok) throw new Error(); return res.json(); })
        .then((json) => { if (!alive) return; setStats(json || {}); })
        .catch(() => { if (!alive) return; });
    };
    load();
    const id = setInterval(load, 10000); // 10s polling for near real-time updates
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar t={t} />
      <Box sx={{ flex: 1 }}>
        <Topbar
          mode={mode}
          setMode={setMode}
          lang={lang}
          setLang={setLang}
          t={t}
          onLogout={onLogout}
        />
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
          {/* MAIN HEADINGS */}
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {t.dashboardOverview}
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            {t.dashboardOverviewSubtitle}
          </Typography>
          {/* STATS GRID */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard label={t.trainsReady} value={stats.trainsReady ?? "-"} sublabel="180" icon="train" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard label={t.maintenanceAlerts} value={stats.maintenanceAlerts ?? "-"} sublabel={t.active} icon="build" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard label={t.adDeadlines} value={stats.adDeadlines ?? "-"} sublabel={t.thisWeek} icon="timer" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard label={t.systemHealth} value={stats.systemHealth ? `${stats.systemHealth}%` : "-"} sublabel={t.uptime} icon="check_circle" />
            </Grid>
          </Grid>
          {/* QUICK ACTIONS */}
          <Typography variant="h6" fontWeight={700} mt={3} mb={1}>
            {t.quickActions}
          </Typography>
          <Typography color="text.secondary" mb={2} variant="body2">
            {t.quickActionsSubtitle}
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                label={t.dataPrediction}
                description={t.dataPredictionDesc}
                icon="chart"
                component={RouterLink}
                to="/data-prediction"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                label={t.maintenanceHub}
                description={t.maintenanceHubDesc}
                icon="build"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                label={t.trainAudit}
                description={t.trainAuditDesc}
                icon="audit"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                label={t.stablingStatus}
                description={t.stablingStatusDesc}
                icon="stabling"
              />
            </Grid>
          </Grid>
          {/* STATUS / PRIORITIES PANELS */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.todaysPriorities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.samplePriority1}<br />{t.samplePriority2}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.systemStatus}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.operational} / {t.secure}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.loginSuccessful}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.welcomeMessage}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
