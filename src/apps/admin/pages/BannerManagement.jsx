import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  InputAdornment,
  Divider,
  Stack,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  alpha,
  useTheme,
  Fade,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Category as CategoryIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  getAllBannersApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
  updateBannerStatusApi,
  getBannerByIdApi,
} from "../../../shared/api/admin/banner.api";

const redirectTypes = [
  { value: "category", label: "Category" },
  { value: "expert", label: "Expert" },
  { value: "external", label: "External URL" },
  { value: "product", label: "Product" },
  { value: "collection", label: "Collection" },
];

const bannerPositions = [
  { value: "home_hero", label: "Home Hero", color: "#1976d2" },
  { value: "category_page", label: "Category Page", color: "#2e7d32" },
  { value: "expert_page", label: "Expert Page", color: "#ed6c02" },
  { value: "popup", label: "Popup", color: "#9c27b0" },
  { value: "sidebar", label: "Sidebar", color: "#d32f2f" },
];

const BannerManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    title: "",
    redirect_type: "external",
    redirect_value: "",
    banner_position: "home_hero",
    sort_order: 0,
    is_active: 1,
    start_date: null,
    end_date: null,
    image: null,
    mobile_image: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    mobile_image: null,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getAllBannersApi();
      setBanners(response.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch banners", "error");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (banner = null) => {
    if (banner) {
      try {
        setLoading(true);
        const response = await getBannerByIdApi(banner.id);
        const bannerData = response.data;
        setSelectedBanner(bannerData);
        setFormData({
          title: bannerData.title || "",
          redirect_type: bannerData.redirect_type || "external",
          redirect_value: bannerData.redirect_value || "",
          banner_position: bannerData.banner_position || "home_hero",
          sort_order: bannerData.sort_order || 0,
          is_active: bannerData.is_active ?? 1,
          start_date: bannerData.start_date || null,
          end_date: bannerData.end_date || null,
          image: null,
          mobile_image: null,
        });
        setImagePreviews({
          image: bannerData.image_url || null,
          mobile_image: bannerData.mobile_image_url || null,
        });
        setOpenDialog(true);
      } catch (error) {
        showSnackbar("Failed to fetch banner details", "error");
        console.error("Fetch banner error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedBanner(null);
      setFormData({
        title: "",
        redirect_type: "external",
        redirect_value: "",
        banner_position: "home_hero",
        sort_order: 0,
        is_active: 1,
        start_date: null,
        end_date: null,
        image: null,
        mobile_image: null,
      });
      setImagePreviews({ image: null, mobile_image: null });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBanner(null);
    setFormData({
      title: "",
      redirect_type: "external",
      redirect_value: "",
      banner_position: "home_hero",
      sort_order: 0,
      is_active: 1,
      start_date: null,
      end_date: null,
      image: null,
      mobile_image: null,
    });
    setImagePreviews({ image: null, mobile_image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      showSnackbar("Title is required", "error");
      return;
    }

    if (!formData.redirect_type) {
      showSnackbar("Redirect type is required", "error");
      return;
    }

    if (!formData.redirect_value?.trim()) {
      showSnackbar("Redirect value is required", "error");
      return;
    }

    if (!selectedBanner && !formData.image) {
      showSnackbar("Banner image is required", "error");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("redirect_type", formData.redirect_type);
      submitData.append("redirect_value", formData.redirect_value);
      submitData.append("banner_position", formData.banner_position);
      submitData.append("sort_order", formData.sort_order);
      submitData.append("is_active", formData.is_active);
      
      if (formData.start_date) {
        const startDate = new Date(formData.start_date);
        submitData.append("start_date", startDate.toISOString().slice(0, 19).replace('T', ' '));
      }
      if (formData.end_date) {
        const endDate = new Date(formData.end_date);
        submitData.append("end_date", endDate.toISOString().slice(0, 19).replace('T', ' '));
      }

      if (formData.image instanceof File) {
        submitData.append("image", formData.image);
      }
      if (formData.mobile_image instanceof File) {
        submitData.append("mobile_image", formData.mobile_image);
      }

      if (selectedBanner) {
        await updateBannerApi(selectedBanner.id, submitData);
        showSnackbar("Banner updated successfully", "success");
      } else {
        await createBannerApi(submitData);
        showSnackbar("Banner created successfully", "success");
      }
      handleCloseDialog();
      fetchBanners();
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Operation failed", "error");
      console.error("Submit error:", error);
    }
  };

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBannerApi(selectedBanner.id);
      showSnackbar("Banner deleted successfully", "success");
      setOpenDeleteDialog(false);
      fetchBanners();
    } catch (error) {
      showSnackbar("Failed to delete banner", "error");
      console.error("Delete error:", error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await updateBannerStatusApi(id, currentStatus ? 0 : 1);
      showSnackbar("Status updated successfully", "success");
      fetchBanners();
    } catch (error) {
      showSnackbar("Failed to update status", "error");
      console.error("Status update error:", error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getPositionColor = (position) => {
    return bannerPositions.find(p => p.value === position)?.color || "#757575";
  };

  if (loading && banners.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        bgcolor: "#f5f7fa", 
        minHeight: "100vh",
      }}>
        {/* Header Section */}
        <Fade in timeout={500}>
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white"
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom fontSize={{ xs: "1.5rem", sm: "2rem" }}>
                    Banner Management
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Manage your banners, schedules, and redirects from one place
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={fetchBanners}
                    sx={{ 
                      bgcolor: "rgba(255,255,255,0.2)", 
                      backdropFilter: "blur(10px)",
                      '&:hover': { bgcolor: "rgba(255,255,255,0.3)" },
                      display: { xs: "none", sm: "flex" }
                    }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ 
                      bgcolor: "white", 
                      color: "#667eea",
                      '&:hover': { bgcolor: "#f0f0f0" }
                    }}
                  >
                    Add Banner
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Zoom in timeout={300}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Banners
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" fontSize={{ xs: "1.8rem", sm: "2.5rem" }}>
                    {banners.length}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Zoom in timeout={400}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Banners
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main" fontSize={{ xs: "1.8rem", sm: "2.5rem" }}>
                    {banners.filter(b => b.is_active === 1).length}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Zoom in timeout={500}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Scheduled
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main" fontSize={{ xs: "1.8rem", sm: "2.5rem" }}>
                    {banners.filter(b => b.start_date || b.end_date).length}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Zoom in timeout={600}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Positions Used
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" fontSize={{ xs: "1.8rem", sm: "2.5rem" }}>
                    {new Set(banners.map(b => b.banner_position)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Banners Table - Fixed Overflow */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "auto" }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Redirect</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Schedule</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box py={5}>
                        <ImageIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
                        <Typography color="text.secondary">
                          No banners found. Click "Add Banner" to create one.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <Fade in key={banner.id} timeout={500}>
                      <TableRow hover>
                        <TableCell>#{banner.id}</TableCell>
                        <TableCell>
                          <Avatar 
                            src={banner.image_url} 
                            variant="rounded" 
                            sx={{ width: 50, height: 40, borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 120 }}>
                            {banner.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bannerPositions.find(p => p.value === banner.banner_position)?.label || banner.banner_position}
                            size="small"
                            sx={{ 
                              bgcolor: alpha(getPositionColor(banner.banner_position), 0.1),
                              color: getPositionColor(banner.banner_position),
                              fontWeight: "medium"
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={redirectTypes.find(t => t.value === banner.redirect_type)?.label || banner.redirect_type}
                              size="small"
                              variant="outlined"
                            />
                            <Tooltip title={banner.redirect_value}>
                              <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {banner.redirect_value}
                              </Typography>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {banner.start_date || banner.end_date ? (
                            <Stack spacing={0.5}>
                              {banner.start_date && (
                                <Typography variant="caption" color="text.secondary">
                                  From: {new Date(banner.start_date).toLocaleDateString()}
                                </Typography>
                              )}
                              {banner.end_date && (
                                <Typography variant="caption" color="text.secondary">
                                  To: {new Date(banner.end_date).toLocaleDateString()}
                                </Typography>
                              )}
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.secondary">Always</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={banner.sort_order} size="small" icon={<SortIcon />} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Switch
                              checked={banner.is_active === 1}
                              onChange={() => handleStatusToggle(banner.id, banner.is_active)}
                              color="success"
                              size={isMobile ? "small" : "medium"}
                            />
                            <Typography variant="caption">
                              {banner.is_active === 1 ? "Active" : "Inactive"}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(banner)}
                                sx={{ color: "#1976d2" }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(banner)}
                                sx={{ color: "#d32f2f" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create/Edit Dialog - Fixed Alignment */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          PaperProps={{
            sx: { m: { xs: 1, sm: 2 }, width: "100%" }
          }}
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            pb: 2,
            px: { xs: 2, sm: 3 }
          }}>
            <Typography variant="h6">
              {selectedBanner ? "Edit Banner" : "Create New Banner"}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 2, sm: 3 }, overflowX: "hidden" }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CategoryIcon fontSize="small" /> Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Banner Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter banner title"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Redirect Type</InputLabel>
                  <Select
                    name="redirect_type"
                    value={formData.redirect_type}
                    onChange={handleInputChange}
                    label="Redirect Type"
                  >
                    {redirectTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Redirect Value"
                  name="redirect_value"
                  value={formData.redirect_value}
                  onChange={handleInputChange}
                  placeholder={
                    formData.redirect_type === "external"
                      ? "https://example.com"
                      : "category-slug or expert-id"
                  }
                  required
                  InputProps={{
                    startAdornment: formData.redirect_type === "external" && (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    formData.redirect_type === "external"
                      ? "Enter full URL including https://"
                      : "Enter slug or ID"
                  }
                />
              </Grid>

              {/* Display Settings */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <ImageIcon fontSize="small" /> Display Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Banner Position</InputLabel>
                  <Select
                    name="banner_position"
                    value={formData.banner_position}
                    onChange={handleInputChange}
                    label="Banner Position"
                  >
                    {bannerPositions.map((position) => (
                      <MenuItem key={position.value} value={position.value}>
                        {position.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Sort Order"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  helperText="Lower numbers appear first"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <ImageIcon fontSize="small" /> Images
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Desktop Image (1920px × 1080px recommended)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Upload Desktop Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                    />
                  </Button>
                  {imagePreviews.image && (
                    <Box mt={1}>
                      <img
                        src={imagePreviews.image}
                        alt="Desktop Preview"
                        style={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0"
                        }}
                      />
                    </Box>
                  )}
                  {!selectedBanner && !formData.image && (
                    <Typography variant="caption" color="error">
                      * Desktop image is required for new banner
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Mobile Image (1080px × 1920px recommended) - Optional
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Upload Mobile Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "mobile_image")}
                    />
                  </Button>
                  {imagePreviews.mobile_image && (
                    <Box mt={1}>
                      <img
                        src={imagePreviews.mobile_image}
                        alt="Mobile Preview"
                        style={{
                          width: "100%",
                          maxHeight: 150,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0"
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Schedule */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <ScheduleIcon fontSize="small" /> Schedule (Optional)
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => handleDateChange("start_date", date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "medium"
                    } 
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => handleDateChange("end_date", date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "medium"
                    } 
                  }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <VisibilityIcon fontSize="small" /> Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography fontWeight="medium">Active Status</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.is_active === 1 ? "Banner is visible to users" : "Banner is hidden from users"}
                      </Typography>
                    </Box>
                    <Switch
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                      color="success"
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: "grey.50", gap: 1 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                '&:hover': {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)",
                }
              }}
            >
              {selectedBanner ? "Update Banner" : "Create Banner"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete banner <strong>"{selectedBanner?.title}"</strong>?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              This action cannot be undone. The banner image will also be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            variant="filled"
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default BannerManagement;