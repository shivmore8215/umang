import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ScienceIcon from "@mui/icons-material/Science";
// import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CampaignIcon from "@mui/icons-material/Campaign";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import PlaceIcon from "@mui/icons-material/Place";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar({ t }) {
  const navLinks = [
  { label: t.dashboard, icon: <DashboardIcon />, route: "/" },
  { label: t.inputUpload, icon: <CloudUploadIcon />, route: "/input-upload" },
  { label: t.dataPrediction, icon: <ShowChartIcon />, route: "/data-prediction" },
  { label: t.mlAnalysis, icon: <ScienceIcon />, route: "/ml-analysis" },
  { label: t.simulation, icon: <SettingsIcon />, route: "/simulation" },
  { label: t.trainAudit, icon: <FindInPageIcon />, route: "/train-audit" }
];


  const dataModules = [
    { label: t.fitness, icon: <CheckCircleIcon /> },
    { label: t.jobCard, icon: <BuildCircleIcon /> },
    { label: t.branding, icon: <CampaignIcon /> },
    { label: t.mileage, icon: <DirectionsCarIcon /> },
    { label: t.cleaning, icon: <CleaningServicesIcon /> },
    { label: t.stabling, icon: <PlaceIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ my: 1 }}>
        <DashboardIcon color="primary" sx={{ mr: 1 }} />
        <div>
          <Typography fontWeight={700} variant="body1" lineHeight={1}>
            Railway Ops
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Management System
          </Typography>
        </div>
      </Toolbar>
      <Divider />
      <List>
        <Typography variant="subtitle2" sx={{ pl: 2, pt: 1, pb: 0 }}>
          {t.mainNav}
        </Typography>
        {navLinks.map((item) => (
          <ListItem
            button
            key={item.label}
            component={RouterLink}
            to={item.route}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Typography variant="subtitle2" sx={{ pl: 2, pt: 1, pb: 0 }}>
          {t.dataModules}
        </Typography>
        {dataModules.map((item) => (
          <ListItem button key={item.label}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
