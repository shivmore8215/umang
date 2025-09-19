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
import SpeedIcon from "@mui/icons-material/Speed";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Sample data - in real app this would come from API
const mileageData = [
  { trainId: "TR-4521", mileage: "125,430", target: "130,000", variance: "+3.5%", efficiency: "High" },
  { trainId: "TR-4522", mileage: "98,750", target: "100,000", variance: "-1.2%", efficiency: "Normal" },
  { trainId: "TR-4523", mileage: "156,200", target: "150,000", variance: "+4.1%", efficiency: "High" },
  { trainId: "TR-4524", mileage: "87,500", target: "90,000", variance: "-2.8%", efficiency: "Normal" },
  { trainId: "TR-4525", mileage: "142,800", target: "140,000", variance: "+2.0%", efficiency: "High" },
  { trainId: "TR-4526", mileage: "112,300", target: "115,000", variance: "-2.3%", efficiency: "Normal" },
  { trainId: "TR-4527", mileage: "168,900", target: "160,000", variance: "+5.6%", efficiency: "High" },
  { trainId: "TR-4528", mileage: "95,600", target: "95,000", variance: "+0.6%", efficiency: "High" }
];

// Helper functions for chip colors
const getEfficiencyColor = (efficiency) => {
  switch (efficiency) {
    case "High": return "success";
    case "Normal": return "info";
    case "Low": return "warning";
    default: return "default";
  }
};

export default function MileageBalancing({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [efficiencyFilter, setEfficiencyFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = mileageData.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEfficiency = efficiencyFilter === "All" || item.efficiency === efficiencyFilter;
    return matchesSearch && matchesEfficiency;
  });

  // Calculate summary statistics
  const highEfficiencyCount = mileageData.filter(item => item.efficiency === "High").length;
  const normalEfficiencyCount = mileageData.filter(item => item.efficiency === "Normal").length;
  const lowEfficiencyCount = mileageData.filter(item => item.efficiency === "Low").length;
  const totalMileage = mileageData.reduce((sum, item) => {
    return sum + parseInt(item.mileage.replace(/,/g, ''));
  }, 0);
  const totalTarget = mileageData.reduce((sum, item) => {
    return sum + parseInt(item.target.replace(/,/g, ''));
  }, 0);
  const overallVariance = ((totalMileage - totalTarget) / totalTarget * 100).toFixed(1);

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
        <SpeedIcon sx={{ mr: 2, color: PRIMARY, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.mileageBalancing}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.mileageBalancingDesc}
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
                {highEfficiencyCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Efficiency
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
                {normalEfficiencyCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Normal Efficiency
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
                {lowEfficiencyCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Efficiency
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
              <Typography variant="h4" fontWeight={800} color={overallVariance >= 0 ? "success.main" : "error.main"}>
                {overallVariance >= 0 ? "+" : ""}{overallVariance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Variance
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
              placeholder="Search by Train ID..."
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
              <InputLabel>Efficiency</InputLabel>
              <Select
                value={efficiencyFilter}
                label="Efficiency"
                onChange={(e) => setEfficiencyFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              sx={{ borderColor: PRIMARY, color: PRIMARY }}
            >
              Analytics
            </Button>
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
              Set Target
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
                <TableCell sx={{ fontWeight: 600 }}>{t.currentMileage}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.targetMileage}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.variance}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.efficiency}</TableCell>
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
                  <TableCell>{row.mileage}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: row.variance.startsWith('+') ? 'success.main' : 'error.main' 
                  }}>
                    {row.variance}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.efficiency} 
                      color={getEfficiencyColor(row.efficiency)} 
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
