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
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Sample data - in real app this would come from API
const cleaningData = [
  { trainId: "TR-4521", bay: "Bay 3", time: "2024-02-01 14:00", status: "Completed", type: "Deep Clean" },
  { trainId: "TR-4522", bay: "Bay 1", time: "2024-02-01 16:30", status: "In Progress", type: "Standard" },
  { trainId: "TR-4523", bay: "Bay 5", time: "2024-02-02 09:00", status: "Completed", type: "Deep Clean" },
  { trainId: "TR-4524", bay: "Bay 2", time: "2024-02-02 11:15", status: "Completed", type: "Standard" },
  { trainId: "TR-4525", bay: "Bay 4", time: "2024-02-02 13:45", status: "In Progress", type: "Deep Clean" },
  { trainId: "TR-4526", bay: "Bay 6", time: "2024-02-03 08:00", status: "Scheduled", type: "Standard" },
  { trainId: "TR-4527", bay: "Bay 7", time: "2024-02-03 10:30", status: "Completed", type: "Deep Clean" },
  { trainId: "TR-4528", bay: "Bay 8", time: "2024-02-03 15:00", status: "In Progress", type: "Standard" }
];

// Helper functions for chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "Completed": return "success";
    case "In Progress": return "info";
    case "Scheduled": return "warning";
    case "Cancelled": return "error";
    default: return "default";
  }
};

export default function CleaningDetailing({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = cleaningData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.bay.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate summary statistics
  const completedCount = cleaningData.filter(item => item.status === "Completed").length;
  const inProgressCount = cleaningData.filter(item => item.status === "In Progress").length;
  const scheduledCount = cleaningData.filter(item => item.status === "Scheduled").length;
  const deepCleanCount = cleaningData.filter(item => item.type === "Deep Clean").length;

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
        <CleaningServicesIcon sx={{ mr: 2, color: HIGHLIGHT, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.cleaningDetailing}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.cleaningDetailingDesc}
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
              <Typography variant="h4" fontWeight={800} color="success.main">
                {completedCount}
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
              <Typography variant="h4" fontWeight={800} color="warning.main">
                {scheduledCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled
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
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {deepCleanCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Deep Cleans
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by Train ID or Bay..."
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
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Deep Clean">Deep Clean</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
              Schedule Cleaning
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
                <TableCell sx={{ fontWeight: 600 }}>{t.trainId}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.bay}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.time}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.cleaningType}</TableCell>
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
                  <TableCell sx={{ fontWeight: 500 }}>{row.trainId}</TableCell>
                  <TableCell>{row.bay}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon fontSize="small" />
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
