import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

// Sample data - in real app this would come from API
const jobCardData = [
  { jobId: "JC-2024-001", train: "TR-4521", type: "Brake System", status: "Open", priority: "High", assigned: "Team A" },
  { jobId: "JC-2024-002", train: "TR-4522", type: "Engine Check", status: "Closed", priority: "Medium", assigned: "Team B" },
  { jobId: "JC-2024-003", train: "TR-4523", type: "Cleaning", status: "Open", priority: "Low", assigned: "Team C" },
  { jobId: "JC-2024-004", train: "TR-4524", type: "Brake System", status: "Open", priority: "High", assigned: "Team A" },
  { jobId: "JC-2024-005", train: "TR-4525", type: "Engine Check", status: "Closed", priority: "Medium", assigned: "Team B" },
  { jobId: "JC-2024-006", train: "TR-4526", type: "Electrical", status: "In Progress", priority: "High", assigned: "Team A" },
  { jobId: "JC-2024-007", train: "TR-4527", type: "Cleaning", status: "Open", priority: "Low", assigned: "Team C" },
  { jobId: "JC-2024-008", train: "TR-4528", type: "Brake System", status: "Closed", priority: "Medium", assigned: "Team B" }
];

// Helper functions for chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "Open": return "warning";
    case "In Progress": return "info";
    case "Closed": return "success";
    default: return "default";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High": return "error";
    case "Medium": return "warning";
    case "Low": return "success";
    default: return "default";
  }
};

export default function JobCardStatus({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = jobCardData.filter(item => {
    const matchesSearch = item.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.train.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
    const matchesTeam = teamFilter === "All" || item.assigned === teamFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
  });

  // Calculate summary statistics
  const openCount = jobCardData.filter(item => item.status === "Open").length;
  const inProgressCount = jobCardData.filter(item => item.status === "In Progress").length;
  const closedCount = jobCardData.filter(item => item.status === "Closed").length;
  const highPriorityCount = jobCardData.filter(item => item.priority === "High").length;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        minHeight: "100vh",
        background: isDark
          ? `linear-gradient(180deg, #0b1416 0%, #0b1416 100%)`
          : `linear-gradient(180deg, ${HIGHLIGHT}11 0%, #ffffff 35%)`,
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <WorkIcon sx={{ mr: 2, color: HIGHLIGHT, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.jobCardStatus}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.jobCardStatusDesc}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: isDark ? '#0f1a1d' : '#ffffff',
            border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
            boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s ease'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="warning.main">
                {openCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: isDark ? '#0f1a1d' : '#ffffff',
            border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
            boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s ease'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="info.main">
                {inProgressCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: isDark ? '#0f1a1d' : '#ffffff',
            border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
            boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s ease'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {closedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: isDark ? '#0f1a1d' : '#ffffff',
            border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
            boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s ease'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="error.main">
                {highPriorityCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper sx={{
        bgcolor: isDark ? '#0f1a1d' : '#ffffff',
        p: 3,
        mb: 3,
        border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
        boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by Job ID, Train, or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Team</InputLabel>
              <Select
                value={teamFilter}
                label="Team"
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Team A">Team A</MenuItem>
                <MenuItem value="Team B">Team B</MenuItem>
                <MenuItem value="Team C">Team C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderColor: HIGHLIGHT, color: HIGHLIGHT }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: HIGHLIGHT, color: 'black', '&:hover': { bgcolor: HIGHLIGHT + 'dd' } }}
            >
              New Job
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Paper sx={{
        bgcolor: isDark ? '#0f1a1d' : '#ffffff',
        border: `1px solid ${isDark ? '#ffffff22' : '#607D8B33'}`,
        boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 10px 24px rgba(48,213,200,0.14)'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? '#ffffff08' : '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>{t.jobId}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.train}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.workType}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.priority}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.assignedTo}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    '&:hover': { bgcolor: isDark ? '#ffffff08' : '#f5f5f5' },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{row.jobId}</TableCell>
                  <TableCell>{row.train}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.priority} 
                      color={getPriorityColor(row.priority)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{row.assigned}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="secondary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
