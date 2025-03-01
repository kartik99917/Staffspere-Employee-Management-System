import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  LoginOutlined,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../services/api';
import { API_BASE_URL } from '../config';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('emailOrUsername', formData.email);
      params.append('password', formData.password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        credentials: 'include',
      });

      const data = await response.text();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data || 'Login failed');
      }
      
      if (data.includes('Admin Login Successful')) {
        navigate('/admin-dashboard');
      } else if (data.includes('Employee Login Successful')) {
        navigate('/employee-dashboard');
      } else {
        setErrors({ submit: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error details:', error);
      setErrors({ 
        submit: error.message || 'Login failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={1000}>
          <Paper className="login-paper" elevation={6}>
            <Box
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AccountCircle className="login-icon" />
              <Typography component="h1" variant="h4" className="login-title">
                StaffSphere
              </Typography>
              <Typography component="h2" variant="h6" className="login-subtitle">
                Welcome Back!
              </Typography>

              {errors.submit && (
                <Alert severity="error" className="error-alert">
                  {errors.submit}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} className="login-form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  className={`login-input ${loading ? 'loading' : ''}`}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  className={`login-input ${loading ? 'loading' : ''}`}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className="visibility-icon"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className="login-button"
                  endIcon={<LoginOutlined />}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default Login; 