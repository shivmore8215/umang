import React from "react";
import ActionCard from "../components/ActionCard";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import TrainIcon from "@mui/icons-material/Train";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

// DASHBOARD CARDS DATA
const dashboardCards = [
  {
    title: "Trains Ready",
    main: "147",
    sub: "180",
    icon: <TrainIcon color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: "Maintenance Alerts",
    main: "8",
    sub: "Active",
    icon: <WarningAmberIcon color="warning" sx={{ fontSize: 40 }} />
  },
  {
    title: "Ad Deadlines",
    main: "3",
    sub: "This Week",
    icon: <AccessTimeIcon color="secondary" sx={{ fontSize: 40 }} />
  },
  {
    title: "System Health",
    main: "98.2%",
    sub: "Uptime",
    icon: <HealthAndSafetyIcon color="success" sx={{ fontSize: 40 }} />
  }
];

export default function Dashboard({ t }) {
  // Brand palette
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
            minHeight: "100vh",
            background: isDark
              ? `linear-gradient(180deg, #0b1416 0%, #0b1416 100%)`
              : `linear-gradient(180deg, ${PRIMARY}11 0%, #ffffff 35%)`,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          {/* MAIN HEADINGS */}
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, color: 'text.primary' }}>
            {t.dashboardOverview}
          </Typography>
          <Typography variant="body1" mb={3} sx={{ color: 'text.secondary' }}>
            {t.dashboardOverviewSubtitle}
          </Typography>
          {/* DASHBOARD CARDS - Even, Responsive, Identical Dimensions */}
          <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
            {dashboardCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={card.title} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
                    borderRadius: 2,
                    p: 3,
                    minHeight: 160,
                    height: '100%',
                    width: '100%',
                    boxShadow: isDark
                      ? "0 8px 20px rgba(0,0,0,0.5)"
                      : "0 10px 24px rgba(48,213,200,0.14)",
                    transition: 'transform .15s ease, box-shadow .2s ease, border-color .2s ease',
                    "&:hover": {
                      borderColor: isDark ? '#30D5C844' : '#30D5C8',
                      boxShadow: isDark 
                        ? "0 16px 32px rgba(0,0,0,0.65)" 
                        : "0 14px 28px rgba(48,213,200,0.33)",
                      transform: "translateY(-3px)"
                    }
                  }}
                >
                  {card.icon}
                  <Typography variant="h4" fontWeight={800} mt={1}>{card.main}</Typography>
                  <Typography fontWeight={600} color="text.primary">{card.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{card.sub}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {/* QUICK ACTIONS */}
          <Box sx={{ height: 6, borderRadius: 2, background: `linear-gradient(90deg, ${PRIMARY}, ${HIGHLIGHT})`, mb: 2 }} />
          <Typography variant="h6" fontWeight={800} mt={1} mb={0.5} sx={{ color: 'text.primary' }}>
            {t.quickActions}
          </Typography>
          <Typography mb={2} variant="body2" sx={{ color: 'text.secondary' }}>
            {t.quickActionsSubtitle}
          </Typography>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ActionCard
                label={t.dataPrediction}
                description={t.dataPredictionDesc}
                icon="chart"
                component={RouterLink}
                to="/data-prediction"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ActionCard
                label={t.maintenanceHub}
                description={t.maintenanceHubDesc}
                icon="build"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ActionCard
                label={t.trainAudit}
                description={t.trainAuditDesc}
                icon="audit"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ActionCard
                label={t.stablingStatus}
                description={t.stablingStatusDesc}
                icon="stabling"
              />
            </Grid>
          </Grid>
          {/* STATUS / PRIORITIES PANELS */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{
                bgcolor: isDark ? '#0f1a1d' : '#ffffff',
                p: 3,
                borderRadius: 2,
                boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
                border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
                position: 'relative',
                height: '100%',
                transition: 'transform .15s ease, box-shadow .2s ease, border-color .2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: isDark ? '0 16px 32px rgba(0,0,0,0.65)' : '0 14px 28px rgba(48,213,200,0.33)',
                  borderColor: isDark ? '#30D5C844' : '#30D5C8'
                }
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: PRIMARY, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.todaysPriorities}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t.samplePriority1}<br />{t.samplePriority2}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{
                bgcolor: isDark ? '#0f1a1d' : '#ffffff',
                p: 3,
                borderRadius: 2,
                boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
                border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
                position: 'relative',
                height: '100%',
                transition: 'transform .15s ease, box-shadow .2s ease, border-color .2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: isDark ? '0 16px 32px rgba(0,0,0,0.65)' : '0 14px 28px rgba(48,213,200,0.33)',
                  borderColor: isDark ? '#30D5C844' : '#30D5C8'
                }
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: HIGHLIGHT, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.systemStatus}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t.operational} / {t.secure}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{
                bgcolor: isDark ? '#0f1a1d' : '#ffffff',
                p: 3,
                borderRadius: 2,
                boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
                border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
                position: 'relative',
                height: '100%',
                transition: 'transform .15s ease, box-shadow .2s ease, border-color .2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: isDark ? '0 16px 32px rgba(0,0,0,0.65)' : '0 14px 28px rgba(48,213,200,0.33)',
                  borderColor: isDark ? '#30D5C844' : '#30D5C8'
                }
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: HEADINGS, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.loginSuccessful}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t.welcomeMessage}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
    </Box>
  );
}
