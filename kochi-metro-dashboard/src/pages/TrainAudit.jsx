import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, Paper, Typography, Chip, TextField, InputAdornment, IconButton, Button, CircularProgress, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { API_BASE } from "../api";

const fitnessColor = {
  Valid: "success",
  "Due Soon": "warning",
  Expired: "error"
};

const statusColor = {
  Active: "success",
  Maintenance: "warning"
};

export default function TrainAudit() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [trainsets, setTrainsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/trainsets/`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load trainsets (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (!alive) return;
        setTrainsets(json || []);
        setError("");
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load data");
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return trainsets.filter(t => `${t.train_id}${t.name || ""}`.toLowerCase().includes(q));
  }, [search, trainsets]);

  const overview = useMemo(() => {
    const active = trainsets.filter(t => (t.status || "").toLowerCase() === "active").length;
    const maint = trainsets.filter(t => (t.status || "").toLowerCase() === "maintenance").length;
    const expired = trainsets.filter(t => (t.fitness || "").toLowerCase() === "expired").length;
    const pendingJobs = trainsets.reduce((acc, t) => acc + (t.jobcards ? t.jobcards.length : 0), 0);
    return { active, maint, expired, pendingJobs };
  }, [trainsets]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", bgcolor: "background.default" }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Train Audit
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Comprehensive train profiles and operational status
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {/* Overview stats */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} sm={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography color="success.main" fontWeight={700} fontSize={28}>{overview.active}</Typography>
            <Typography variant="caption">Active Trains</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography color="warning.main" fontWeight={700} fontSize={28}>{overview.maint}</Typography>
            <Typography variant="caption">In Maintenance</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography color="error.main" fontWeight={700} fontSize={28}>{overview.expired}</Typography>
            <Typography variant="caption">Fitness Expired</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography color="secondary.main" fontWeight={700} fontSize={28}>{overview.pendingJobs}</Typography>
            <Typography variant="caption">Pending Jobs</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography color="primary.main" fontWeight={700} fontSize={28}>$0</Typography>
            <Typography variant="caption">Ad Revenue</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Main audit area */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Fleet Overview</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Complete list of trains with key metrics
            </Typography>
            <TextField
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search trains..."
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <IconButton onClick={() => setSearch("")}>
                    ×
                  </IconButton>
                )
              }}
            />
            {loading ? (
              <Box mt={3} display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
              <Box mt={2}>
                {filtered.map((train, idx) => (
                  <Paper
                    key={train.train_id}
                    sx={{ mb: 2, p: 2, display: "flex", alignItems: "center", cursor: "pointer", bgcolor: selected === idx ? "action.selected" : "background.paper" }}
                    onClick={() => setSelected(idx)}
                    elevation={selected === idx ? 4 : 1}
                  >
                    <DirectionsRailwayIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Box flex={1}>
                      <Typography fontWeight={600}>
                        {train.train_id} <span style={{ fontWeight: 400, color: "#888" }}>{train.name}</span>
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                        <span>
                          Fitness: <Chip size="small" label={train.fitness || "-"} color={fitnessColor[train.fitness] || "default"} />
                        </span>
                        <span>
                          Pending Jobs: <b>{(train.jobcards || []).length}</b>
                        </span>
                        <span>
                          Mileage: <b>{train.mileage || "-"}</b>
                        </span>
                        <span>
                          Bay: <b>{train.bay || (train.cleaning_slot ? train.cleaning_slot.bay : "-")}</b>
                        </span>
                      </Box>
                    </Box>
                    <Chip
                      size="small"
                      label={train.status || "-"}
                      color={statusColor[train.status] || "default"}
                      sx={{ mr: 2 }}
                    />
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: "center", minHeight: 400 }}>
            {selected === null ? (
              <>
                <DirectionsRailwayIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" fontWeight={700}>Select a Train</Typography>
                <Typography color="text.secondary">
                  Click on a train from the list to view detailed information
                </Typography>
              </>
            ) : (
              <>
                <DirectionsRailwayIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" fontWeight={700}>
                  {filtered[selected].train_id} - {filtered[selected].name}
                </Typography>
                <Typography mb={2} color="text.secondary">
                  Mileage: <b>{filtered[selected].mileage || "-"}</b> | Bay: <b>{filtered[selected].bay || (filtered[selected].cleaning_slot ? filtered[selected].cleaning_slot.bay : "-")}</b>
                </Typography>
                <Chip
                  label={`Fitness ${filtered[selected].fitness || "-"}`}
                  color={fitnessColor[filtered[selected].fitness] || "default"}
                  sx={{ mb: 1, mr: 1 }}
                />
                <Chip
                  label={`Status ${filtered[selected].status || "-"}`}
                  color={statusColor[filtered[selected].status] || "default"}
                  sx={{ mb: 1 }}
                />
                <Typography>
                  Pending Jobs: <b>{(filtered[selected].jobcards || []).length}</b>
                </Typography>
                <Box mt={3}>
                  <Button variant="outlined" color="primary">
                    View Full Profile
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
