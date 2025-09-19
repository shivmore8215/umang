import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BuildIcon from "@mui/icons-material/Build";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import PlaceIcon from "@mui/icons-material/Place";

const icons = {
  chart: <ShowChartIcon color="primary" fontSize="large" />,
  build: <BuildIcon color="primary" fontSize="large" />,
  audit: <FindInPageIcon color="primary" fontSize="large" />,
  stabling: <PlaceIcon color="primary" fontSize="large" />,
};

export default function ActionCard({ label, description, icon }) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: 80,
        borderRadius: 2,
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icons[icon]}
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
