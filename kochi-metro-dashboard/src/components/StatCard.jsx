import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const icons = {
  train: <TrainIcon color="success" />,
  build: <BuildCircleIcon color="warning" />,
  timer: <TimerIcon color="warning" />,
  check_circle: <CheckCircleIcon color="success" />,
};

export default function StatCard({ label, value, sublabel, icon }) {
  return (
    <Card
      elevation={2}
      sx={{ minHeight: 100, display: "flex", alignItems: "center" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography color="text.secondary" variant="subtitle1">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
        {sublabel && (
          <Typography color="text.secondary" variant="body2">
            {sublabel}
          </Typography>
        )}
      </CardContent>
      <Box sx={{ pr: 2, fontSize: 38 }}>
        {icons[icon]}
      </Box>
    </Card>
  );
}
