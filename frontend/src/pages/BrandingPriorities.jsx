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
import CampaignIcon from "@mui/icons-material/Campaign";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Sample data - in real app this would come from API
const brandingData = [
  { campaign: "Metro Express", train: "TR-4521", status: "Active", expiry: "2024-06-15", revenue: "$15,000" },
  { campaign: "City Connect", train: "TR-4522", status: "Active", expiry: "2024-04-20", revenue: "$12,500" },
  { campaign: "Rapid Transit", train: "TR-4523", status: "Expired", expiry: "2023-12-31", revenue: "$8,000" },
  { campaign: "Metro Express", train: "TR-4524", status: "Active", expiry: "2024-08-10", revenue: "$18,000" },
  { campaign: "City Connect", train: "TR-4525", status: "Active", expiry: "2024-05-25", revenue: "$14,200" },
  { campaign: "Urban Link", train: "TR-4526", status: "Active", expiry: "2024-07-30", revenue: "$16,800" },
  { campaign: "Express Line", train: "TR-4527", status: "Expired", expiry: "2023-11-15", revenue: "$9,500" },
  { campaign: "Metro Express", train: "TR-4528", status: "Active", expiry: "2024-09-12", revenue: "$20,000" }
];

// Helper functions for chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "Active": return "success";
    case "Expired": return "error";
    case "Pending": return "warning";
    default: return "default";
  }
};

export default function BrandingPriorities({ t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const PRIMARY = "#30D5C8";
  const HIGHLIGHT = "#BCE34A";
  const HEADINGS = "#37474F";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [campaignFilter, setCampaignFilter] = useState("All");

  // Filter data based on search and filters
  const filteredData = brandingData.filter(item => {
    const matchesSearch = item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.train.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesCampaign = campaignFilter === "All" || item.campaign === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  // Calculate summary statistics
  const activeCount = brandingData.filter(item => item.status === "Active").length;
  const expiredCount = brandingData.filter(item => item.status === "Expired").length;
  const totalRevenue = brandingData.reduce((sum, item) => {
    return sum + parseInt(item.revenue.replace(/[$,]/g, ''));
  }, 0);
  const activeRevenue = brandingData
    .filter(item => item.status === "Active")
    .reduce((sum, item) => sum + parseInt(item.revenue.replace(/[$,]/g, '')), 0);

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
        <CampaignIcon sx={{ mr: 2, color: HEADINGS, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
            {t.brandingPriorities}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t.brandingPrioritiesDesc}
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
                {activeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Campaigns
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
                Expired Campaigns
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
                ${activeRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Revenue
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
                ${totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
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
              placeholder="Search by Campaign or Train..."
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
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Campaign</InputLabel>
              <Select
                value={campaignFilter}
                label="Campaign"
                onChange={(e) => setCampaignFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Metro Express">Metro Express</MenuItem>
                <MenuItem value="City Connect">City Connect</MenuItem>
                <MenuItem value="Rapid Transit">Rapid Transit</MenuItem>
                <MenuItem value="Urban Link">Urban Link</MenuItem>
                <MenuItem value="Express Line">Express Line</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              sx={{ borderColor: HEADINGS, color: HEADINGS }}
            >
              Analytics
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
              New Campaign
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
                <TableCell sx={{ fontWeight: 600 }}>{t.campaignName}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.train}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.status}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.expiryDate}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t.revenueGenerated}</TableCell>
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
                  <TableCell sx={{ fontWeight: 500 }}>{row.campaign}</TableCell>
                  <TableCell>{row.train}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{row.expiry}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{row.revenue}</TableCell>
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
