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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MapIcon from "@mui/icons-material/Map";

// Sample data - in real app this would come from API
const stablingData = [
  { trainId: "TR-4521", bay: "A-12", position: "Platform Side", occupied: "18:30", depart: "05:45", status: "Occupied" },
  { trainId: "TR-4522", bay: "B-08", position: "Maintenance", occupied: "20:15", depart: "06:30", status: "Occupied" },
  { trainId: "TR-4523", bay: "C-15", position: "Platform Side", occupied: "19:45", depart: "07:00", status: "Occupied" },
  { trainId: "TR-4524", bay: "A-05", position: "Maintenance", occupied: "21:00", depart: "08:15", status: "Occupied" },
  { trainId: "TR-4525", bay: "B-12", position: "Platform Side", occupied: "17:30", depart: "05:30", status: "Occupied" },
  { trainId: "TR-4526", bay: "C-08", position: "Platform Side", occupied: "22:00", depart: "09:00", status: "Occupied" },
  { trainId: "TR-4527", bay: "A-18", position: "Maintenance", occupied: "16:45", depart: "04:30", status: "Occupied" },
  { trainId: "TR-4528", bay: "B-15", position: "Platform Side", occupied: "23:30", depart: "10:15", status: "Occupied" }
];

// Helper functions for chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "Occupied": return "primary";
    case "Available": return "success";
    case "Reserved": return "warning";
    case "Maintenance": return "error";
    default: return "default";
  }
};

export default function StablingGeometry({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = stablingData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.bay.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPosition = positionFilter === "All" || item.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  // Calculate summary statistics
  const occupiedCount = stablingData.filter(item => item.status === "Occupied").length;
  const availableCount = stablingData.filter(item => item.status === "Available").length;
  const platformSideCount = stablingData.filter(item => item.position === "Platform Side").length;
  const maintenanceCount = stablingData.filter(item => item.position === "Maintenance").length;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        minHeight: "100vh",
        background: isDark
          ? `linear-gradient(180deg, #0b1416 0%, #0b1416 100%)`
          : `linear-gradient(180deg, ${HEADINGS}11 0%, #ffffff 35%)`,
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocationOnIcon sx={{ mr: 2, color: HEADINGS, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.stablingGeometry}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.stablingGeometryDesc}
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
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {occupiedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupied Bays
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
                {availableCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Bays
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
                {platformSideCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Platform Side
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
                {maintenanceCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maintenance
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
                <MenuItem value="Occupied">Occupied</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Reserved">Reserved</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={positionFilter}
                label="Position"
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Platform Side">Platform Side</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<MapIcon />}
              sx={{ borderColor: HEADINGS, color: HEADINGS }}
            >
              View Map
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderColor: HEADINGS, color: HEADINGS }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: HEADINGS, '&:hover': { bgcolor: HEADINGS + 'dd' } }}
            >
              Assign Bay
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
                <TableCell sx={{ fontWeight: 600 }}>{t.position}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.occupiedSince}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.departureTime}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
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
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{row.occupied}</TableCell>
                  <TableCell>{row.depart}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
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
