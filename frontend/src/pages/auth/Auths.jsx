import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Login,
  Logout,
  PersonAdd,
  AccountCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import authService from "../../services/auth/authService"; // ⬅️ NEW SERVICE

const Auths = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (formType, field) => (event) => {
    const value = event.target.value;
    if (formType === "login") {
      setLoginForm((prev) => ({ ...prev, [field]: value }));
    } else {
      setRegisterForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (formData, isRegister = false) => {
    if (!formData.email || !formData.password) {
      return "Email and password are required";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (isRegister) {
      if (!formData.name.trim()) {
        return "Name is required";
      }
      if (formData.password.length < 6) {
        return "Password must be at least 6 characters long";
      }
    }

    return null;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const validationError = validateForm(loginForm);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(loginForm);

      if (result.token) {
        // Save token in lowercase to match your interceptor
        localStorage.setItem("token", result.token);

        // Since backend doesn't return user info, create fallback user
        const userData = {
          email: loginForm.email,
          name: loginForm.email.split("@")[0], // fallback name
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);

        setMessage({
          type: "success",
          text: result.message || "Login successful! Welcome back.",
        });

        setLoginForm({ email: "", password: "" });

        navigate("/UserManagement");
      } else {
        setMessage({ type: "error", text: result.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "error",
        text: error?.message || "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const validationError = validateForm(registerForm, true);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(registerForm);

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        setUser(result.user);
        setMessage({
          type: "success",
          text: "Registration successful! Welcome to our platform.",
        });
        setRegisterForm({ name: "", email: "", password: "", phone: "" });
        navigate("/UserManagement");
        setActiveTab(0); // Switch to login tab

      } else {
        setMessage({
          type: "error",
          text: result.message || "Registration failed",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
      setLoading(false);
      setLogoutDialog(false);
      setMessage({ type: "success", text: "Logged out successfully" });
    }
  };

  const openLogoutDialog = () => {
    setLogoutDialog(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialog(false);
  };

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
          <Typography variant="h6" component="div">
            Authentication page
          </Typography>

          {/* User / Login Info - Positioned at the right */}
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                position: "absolute",
                right: 16,
              }}
            >
              <Chip
                icon={<AccountCircle />}
                label={user.name || user.email}
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              />
              <IconButton
                color="inherit"
                onClick={openLogoutDialog}
                disabled={loading}
              >
                <Logout />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        {user ? (
          // Welcome screen for logged-in users
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <AccountCircle
              sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Welcome back!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {user.name || user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You have successfully logged into your account. We've sent you a
              login notification email.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Logout />}
              onClick={openLogoutDialog}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Logout"}
            </Button>
          </Paper>
        ) : (
          // Auth forms for non-logged-in users
          <Paper elevation={3} sx={{ width: "100%" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Login />} label="Login" iconPosition="start" />
              <Tab icon={<PersonAdd />} label="Register" iconPosition="start" />
            </Tabs>

            {/* Message Alert */}
            {message.text && (
              <Alert
                severity={message.type}
                sx={{ m: 2 }}
                onClose={() => setMessage({ type: "", text: "" })}
              >
                {message.text}
              </Alert>
            )}

            {/* Login Form */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleLogin} sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleInputChange("login", "email")}
                  margin="normal"
                  required
                  autoComplete="email"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={handleInputChange("login", "password")}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3 }}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Login />
                  }
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Box>
            )}

            {/* Register Form */}
            {activeTab === 1 && (
              <Box component="form" onSubmit={handleRegister} sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={registerForm.name}
                  onChange={handleInputChange("register", "name")}
                  margin="normal"
                  required
                  autoComplete="name"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleInputChange("register", "email")}
                  margin="normal"
                  required
                  autoComplete="email"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  type="tel"
                  value={registerForm.phone}
                  onChange={handleInputChange("register", "phone")}
                  margin="normal"
                  autoComplete="tel"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={handleInputChange("register", "password")}
                  margin="normal"
                  required
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  helperText="Password must be at least 6 characters long"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3 }}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <PersonAdd />
                  }
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Container>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={closeLogoutDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout? You'll need to sign in again to
            access your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog}>Cancel</Button>
          <Button
            onClick={handleLogout}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Logout />}
          >
            {loading ? "Logging Out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Auths;
