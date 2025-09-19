import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ScienceIcon from "@mui/icons-material/Science";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { API_BASE } from "../api";

const MetricCards = ({ modelStatus, schedule }) => [
  {
    label: "Model Status",
    value: modelStatus === "trained" ? "Active" : "Inactive",
    icon: <ScienceIcon color={modelStatus === "trained" ? "primary" : "action"} fontSize="large" />
  },
  {
    label: "Schedules Generated",
    value: schedule ? schedule.length : 0,
    icon: <ShowChartIcon color="warning" fontSize="large" />
  },
  {
    label: "Optimization Rate",
    value: modelStatus === "trained" ? "87%" : "0%",
    icon: <TrendingUpIcon color="success" fontSize="large" />
  },
  {
    label: "Efficiency Gain",
    value: modelStatus === "trained" ? "24.5%" : "0%",
    icon: <BoltIcon color="primary" fontSize="large" />
  }
];

const failurePredictions = [
  {
    title: "Brake System Failure", train: "TR-4521", timeframe: "7-10 days", probability: 78, risk: "High", subtitle: "Schedule immediate inspection"
  },
  {
    title: "Engine Performance Drop", train: "TR-4522", timeframe: "14-21 days", probability: 65, risk: "Medium", subtitle: "Monitor closely and plan maintenance"
  },
  {
    title: "Door Mechanism Issue", train: "TR-4523", timeframe: "30-45 days", probability: 45, risk: "Low", subtitle: "Include in next scheduled maintenance"
  }
];

const riskColor = {
  High: "error",
  Medium: "warning",
  Low: "success"
};

const trendData = [
  { label: "Overall System Health", value: 92, change: "+2.3%", status: "Improving", color: "primary" },
  { label: "Predictive Accuracy", value: 87, change: "+1.8%", status: "Stable", color: "primary" },
  { label: "Maintenance Efficiency", value: 74, change: "-0.5%", status: "Declining", color: "primary" }
];

const changeChipColor = (change) =>
  change.startsWith("+") ? "primary" : change.startsWith("-") ? "error" : "default";

const maintenanceSuggestions = [
  {
    train: "TR-4521", component: "Brake Pads", action: "Replace within 5 days", priority: "High", savings: 2400
  },
  {
    train: "TR-4522", component: "Oil Filter", action: "Service within 2 weeks", priority: "Medium", savings: 800
  },
  {
    train: "TR-4523", component: "Door Seals", action: "Inspect and lubricate", priority: "Low", savings: 350
  }
];

const priorityColor = {
  High: "error",
  Medium: "warning",
  Low: "success"
};

export default function MLAnalysis() {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [modelStatus, setModelStatus] = useState("untrained");

  const trainModel = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/ml/schedule/train/`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.status === "success") {
        setModelStatus("trained");
        alert("Model trained successfully!");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Failed to train model: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/ml/schedule/generate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setSchedule(data.schedule);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Failed to generate schedule: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (task) => {
    switch (task) {
      case "run":
        return "success";
      case "maintenance":
        return "error";
      case "branding":
        return "info";
      case "cleaning":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", bgcolor: "background.default" }}>
      <Typography variant="h4" fontWeight={700} mb={0.5} display="flex" alignItems="center">
        ML-Powered Train Scheduling
        <Tooltip title="Uses DeepSeek model to optimize train schedules based on multiple criteria">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Intelligent scheduling using DeepSeek ML model
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Control Panel */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Status
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={modelStatus === "trained" ? "Trained" : "Untrained"}
                  color={modelStatus === "trained" ? "success" : "warning"}
                />
                <Button variant="contained" onClick={trainModel} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Train Model"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Schedule Generation
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  onClick={generateSchedule}
                  disabled={loading || modelStatus !== "trained"}
                >
                  Generate Schedule
                </Button>
                <IconButton onClick={generateSchedule} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metric Cards */}
      <Grid container spacing={2} mb={1}>
        {MetricCards({ modelStatus, schedule }).map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card elevation={1}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                {card.icon}
                <Box ml={2}>
                  <Typography color="text.secondary" variant="subtitle2">
                    {card.label}
                  </Typography>
                  <Typography fontWeight={700} variant="h5">
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Schedule Table */}
      {schedule && (
        <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper" }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Generated Schedule
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Train ID</TableCell>
                  <TableCell>Time Slot</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Reasoning</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.train_id}</TableCell>
                    <TableCell>{item.time_slot}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.task}
                        color={getStatusColor(item.task)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.reasoning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
