import React, { useRef, useState } from "react";
import {
  Box, Typography, Grid, Paper, Button, Snackbar, Alert
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatIcon from "@mui/icons-material/Chat";
import TableChartIcon from "@mui/icons-material/TableChart";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_BASE } from "../api";

const categories = [
  {
    title: "Logbook",
    desc: "PDF format maintenance logs",
    icon: <InsertDriveFileIcon color="primary" sx={{ fontSize: 36 }} />,
    accept: ".pdf"
  },
  {
    title: "whatsapp messages",
    desc: "Text files or exported chats",
    icon: <ChatIcon color="success" sx={{ fontSize: 36 }} />,
    accept: ".txt"
  },
  {
    title: "spreadsheet data",
    desc: "Excel or CSV files",
    icon: <TableChartIcon color="warning" sx={{ fontSize: 36 }} />,
    accept: ".xlsx,.xls,.csv"
  },
  {
    title: "iot sensor data",
    desc: "Sensor readings and telemetry",
    icon: <OfflineBoltIcon color="secondary" sx={{ fontSize: 36 }} />,
    accept: ""
  }
];

export default function InputUpload() {
  const fileInputs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);
  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", success: true });

  const handleSelectFile = (idx, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...selectedFiles];
      updated[idx] = file;
      setSelectedFiles(updated);
    }
  };

  const handleSendInput = async () => {
    const csvFile = selectedFiles[2];
    if (!csvFile || !csvFile.name.toLowerCase().endsWith(".csv")) {
      setSnackbar({ open: true, msg: "Please choose a CSV in 'spreadsheet data'", success: false });
      return;
    }
    try {
      const form = new FormData();
      form.append("file", csvFile);
      const res = await fetch(`${API_BASE}/ingest/upload/`, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const json = await res.json();
      
      // Add the file with ingestion details to uploadedFiles
      setUploadedFiles([...uploadedFiles, { 
        name: csvFile.name, 
        type: "CSV Ingest",
        details: json.inserted
      }]);
      
      setSnackbar({ 
        open: true, 
        msg: `Successfully ingested data:\n${Object.entries(json.inserted)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')}`, 
        success: true 
      });
      
      // Reset the form
      setSelectedFiles([null, null, null, null]);
      fileInputs.current.forEach(ref => { if (ref.current) ref.current.value = ""; });
    } catch (e) {
      setSnackbar({ open: true, msg: e.message || "Upload failed", success: false });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Back to Dashboard */}
      <Box mb={2}>
        <Button startIcon={<ArrowBackIcon />} href="/" sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
      <Typography variant="h4" fontWeight={700} mb={1}>Input Upload</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Upload and process operational data
      </Typography>
      <Grid container spacing={3}>
        {categories.map((cat, idx) => (
          <Grid item xs={12} md={6} key={cat.title}>
            <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                {cat.icon}
                <Box>
                  <Typography fontWeight={600}>{cat.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.desc}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <input
                  ref={fileInputs.current[idx]}
                  type="file"
                  accept={cat.accept}
                  style={{ display: "none" }}
                  onChange={e => handleSelectFile(idx, e)}
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInputs.current[idx].current.click()}
                >
                  Choose File
                </Button>
                <Typography variant="caption" ml={2}>
                  {selectedFiles[idx] ? selectedFiles[idx].name : "No file chosen"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} mb={2} textAlign="center">
        <Button
          size="large"
          variant="contained"
          onClick={handleSendInput}
        >
          Send Input
        </Button>
      </Box>
      {/* Uploaded Files List */}
      <Box mt={2}>
        {uploadedFiles.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Uploaded Files
            </Typography>
            {uploadedFiles.map((f, idx) => (
              <Box key={f.name + idx} mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <InsertDriveFileIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18, color: "primary.main" }} />
                  {f.name}
                  <Typography variant="caption" color="text.secondary" ml={1}>
                    ({f.type})
                  </Typography>
                </Box>
                {f.details && (
                  <Box ml={3}>
                    <Typography variant="body2" color="text.secondary">
                      Data Ingested:
                    </Typography>
                    {Object.entries(f.details).map(([key, value]) => (
                      <Typography key={key} variant="caption" display="block" color="text.secondary" ml={1}>
                        • {key}: {value} records
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Box>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.success ? "success" : "error"}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
