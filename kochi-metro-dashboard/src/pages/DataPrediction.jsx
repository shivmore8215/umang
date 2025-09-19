import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Grid, Paper, Chip, CircularProgress, Alert } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShieldIcon from "@mui/icons-material/Shield";
import { API_BASE } from "../api";

// Metric cards (could fetch later if needed)
const stats = [
  { label: "Active Predictions", value: 24, icon: <ShowChartIcon color="primary" fontSize="large" /> },
  { label: "Risk Alerts", value: 8, icon: <WarningAmberIcon color="warning" fontSize="large" /> },
  { label: "Data Sources", value: 6, icon: <ShieldIcon color="success" fontSize="large" /> },
];

const modules = [
  { label: "Fitness" },
  { label: "Job Cards" },
  { label: "Branding" },
  { label: "Mileage" },
  { label: "Cleaning" },
  { label: "Stabling" },
];

const statusColor = {
  Valid: "success",
  Expired: "error",
  "Due Soon": "warning",
  Open: "error",
  Closed: "success",
  Active: "success",
  "In Progress": "warning",
  Completed: "default",
  Available: "success",
  Occupied: "default",
};

const riskColor = {
  Low: "success",
  Medium: "warning",
  High: "error"
};

function useEndpoint(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}${endpoint}`)
      .then(async (res) => { if (!res.ok) throw new Error(`${res.status}`); return res.json(); })
      .then((json) => { if (!alive) return; setData(json || []); setError(""); })
      .catch((e) => { if (!alive) return; setError(`Failed to load ${endpoint}: ${e.message}`); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [endpoint]);
  return { data, loading, error };
}

function FitnessTable() {
  const { data, loading, error } = useEndpoint("/prediction/fitness/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Fitness Certificates</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for fitness certificates</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Train ID</th>
                <th align="left">Status</th>
                <th align="left">Expiry Date</th>
                <th align="left">Certificate Type</th>
                <th align="left">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.trainId}>
                  <td>{row.trainId}</td>
                  <td>
                    <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                  </td>
                  <td>{row.expiry}</td>
                  <td>{row.type}</td>
                  <td>
                    <Chip size="small" label={row.risk} color={riskColor[row.risk] || "default"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

function JobCardsTable() {
  const { data, loading, error } = useEndpoint("/prediction/jobcards/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Job-Card Status</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for job-card status</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Job ID</th>
                <th align="left">Train</th>
                <th align="left">Work Type</th>
                <th align="left">Status</th>
                <th align="left">Priority</th>
                <th align="left">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.jobId}>
                  <td>{row.jobId}</td>
                  <td>{row.train}</td>
                  <td>{row.type}</td>
                  <td>
                    <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                  </td>
                  <td>
                    <Chip size="small" label={row.priority} color={row.priority === "High" ? "error" : row.priority === "Medium" ? "warning" : "success"} />
                  </td>
                  <td>{row.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

function BrandingTable() {
  const { data, loading, error } = useEndpoint("/prediction/branding/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Branding Priorities</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for branding priorities</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Campaign</th>
                <th align="left">Train</th>
                <th align="left">Status</th>
                <th align="left">Expiry</th>
                <th align="left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.campaign}</td>
                  <td>{row.train}</td>
                  <td>
                    <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                  </td>
                  <td>{row.expiry}</td>
                  <td>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

function MileageTable() {
  const { data, loading, error } = useEndpoint("/prediction/mileage/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Mileage Balancing</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for mileage balancing</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Train ID</th>
                <th align="left">Current Mileage</th>
                <th align="left">Target</th>
                <th align="left">Variance</th>
                <th align="left">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.trainId}</td>
                  <td>{row.mileage}</td>
                  <td>{row.target}</td>
                  <td>{row.variance}</td>
                  <td>{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

function CleaningTable() {
  const { data, loading, error } = useEndpoint("/prediction/cleaning/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Cleaning & Detailing Slots</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for cleaning & detailing slots</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Train ID</th>
                <th align="left">Bay/Slot</th>
                <th align="left">Scheduled Time</th>
                <th align="left">Status</th>
                <th align="left">Cleaning Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.trainId}</td>
                  <td>{row.bay}</td>
                  <td>{row.time}</td>
                  <td>
                    <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                  </td>
                  <td>{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

function StablingTable() {
  const { data, loading, error } = useEndpoint("/prediction/stabling/");
  return (
    <div>
      <Typography variant="h6" mb={1}>Stabling Geometry</Typography>
      <Typography variant="body2" mb={2}>Operational data and analytics for stabling geometry</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                <th align="left">Train ID</th>
                <th align="left">Bay</th>
                <th align="left">Position</th>
                <th align="left">Occupied Since</th>
                <th align="left">Departure Time</th>
                <th align="left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.trainId}</td>
                  <td>{row.bay}</td>
                  <td>{row.position}</td>
                  <td>{row.occupied}</td>
                  <td>{row.depart}</td>
                  <td>
                    <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );
}

export default function DataPrediction() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        Data Prediction & Analytics
      </Typography>
      <Typography variant="body1" mb={3} color="text.secondary">
        Operational data analysis and predictive insights
      </Typography>
      <Grid container spacing={2} mb={2}>
        {stats.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Paper elevation={1} sx={{ p: 2, display: "flex", alignItems: "center", minHeight: 76 }}>
              <Box sx={{ mr: 2 }}>{s.icon}</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {modules.map((mod) => (
          <Tab key={mod.label} label={mod.label} />
        ))}
      </Tabs>
      <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper" }}>
        {tab === 0 && <FitnessTable />}
        {tab === 1 && <JobCardsTable />}
        {tab === 2 && <BrandingTable />}
        {tab === 3 && <MileageTable />}
        {tab === 4 && <CleaningTable />}
        {tab === 5 && <StablingTable />}
      </Paper>
    </Box>
  );
}
