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
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

// Sample data - in real app this would come from API
const fitnessCertificatesData = [
  { trainId: "TR-4521", status: "Valid", expiry: "2024-03-15", type: "Annual", risk: "Low" },
  { trainId: "TR-4522", status: "Due Soon", expiry: "2024-01-20", type: "Monthly", risk: "Medium" },
  { trainId: "TR-4523", status: "Expired", expiry: "2023-12-10", type: "Quarterly", risk: "High" },
  { trainId: "TR-4524", status: "Valid", expiry: "2024-06-30", type: "Annual", risk: "Low" },
  { trainId: "TR-4525", status: "Valid", expiry: "2024-02-28", type: "Monthly", risk: "Low" },
  { trainId: "TR-4526", status: "Due Soon", expiry: "2024-01-25", type: "Quarterly", risk: "Medium" },
  { trainId: "TR-4527", status: "Expired", expiry: "2023-11-15", type: "Annual", risk: "High" },
  { trainId: "TR-4528", status: "Valid", expiry: "2024-05-10", type: "Monthly", risk: "Low" }
];

// Helper functions for chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "Valid": return "success";
    case "Due Soon": return "warning";
    case "Expired": return "error";
    default: return "default";
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case "Low": return "success";
    case "Medium": return "warning";
    case "High": return "error";
    default: return "default";
  }
};

export default function FitnessCertificates({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = fitnessCertificatesData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesRisk = riskFilter === "All" || item.risk === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Calculate summary statistics
  const validCount = fitnessCertificatesData.filter(item => item.status === "Valid").length;
  const expiredCount = fitnessCertificatesData.filter(item => item.status === "Expired").length;
  const dueSoonCount = fitnessCertificatesData.filter(item => item.status === "Due Soon").length;
  const highRiskCount = fitnessCertificatesData.filter(item => item.risk === "High").length;

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
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AssignmentIcon sx={{ mr: 2, color: PRIMARY, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.fitnessCertificates}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.fitnessCertificatesDesc}
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
                {validCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valid Certificates
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
                {dueSoonCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due Soon
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
                {expiredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expired
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
                {highRiskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Risk
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
              placeholder="Search by Train ID or Type..."
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
                <MenuItem value="Valid">Valid</MenuItem>
                <MenuItem value="Due Soon">Due Soon</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskFilter}
                label="Risk Level"
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderColor: PRIMARY, color: PRIMARY }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY + 'dd' } }}
            >
              Add Certificate
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
                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.expiryDate}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.certificateType}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.riskLevel}</TableCell>
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
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{row.expiry}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.risk} 
                      color={getRiskColor(row.risk)} 
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
