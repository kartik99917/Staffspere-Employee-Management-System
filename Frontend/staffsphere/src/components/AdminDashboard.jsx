import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
  Tooltip,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Popover,
  LinearProgress,
  AvatarGroup,
  FormControl,
  InputLabel,
  Select,
  ListItemButton,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  TrendingUp,
  TrendingDown,
  Group,
  AssignmentTurnedIn,
  Schedule,
  NotificationsActive,
  AttachMoney,
  WorkOutline,
  MoreVert,
  FilterList,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as StatusIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  NotificationsOff as NotificationsOffIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import './AdminDashboard.css';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import Logo from './Logo';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';

// Add the DrawerHeader component
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    paymentPeriod: '',
    salary: '',
    dailySalary: '',
    weeklySalary: '',
    monthlySalary: '',
    dob: '',
    aadharNo: '',
    pvNo: '',
    epfNo: '',
    esicNo: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    medicalInfo: '',
    education: ''
  });

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    attendance: 0,
    monthlyExpenses: 0
  });

  const [departments, setDepartments] = useState([
    { 
      id: 1, 
      name: 'IT Department', 
      head: 'John Doe',
      employeeCount: 12,
      description: 'Software development and IT infrastructure management'
    },
    { 
      id: 2, 
      name: 'HR Department', 
      head: 'Jane Smith',
      employeeCount: 5,
      description: 'Human resources and employee management'
    },
    { 
      id: 3, 
      name: 'Finance', 
      head: 'Mike Johnson',
      employeeCount: 8,
      description: 'Financial planning and accounting'
    }
  ]);

  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    head: '',
    description: ''
  });

  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    deadline: '',
    team: [],
    description: '',
    priority: 'Medium',
    status: 'Planning'
  });

  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [logoutDialog, setLogoutDialog] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Employees', icon: <PeopleIcon /> },
    { text: 'Projects', icon: <ProjectIcon /> },
    { text: 'Departments', icon: <Group /> },
  ];

  const employeeStats = [
    { 
      label: 'Total Employees', 
      value: '12', 
      color: '#2196f3',
      icon: <Group />,
      trend: '+2 this month'
    },
    { 
      label: 'Active Projects', 
      value: '5', 
      color: '#4caf50',
      icon: <TrendingUp />,
      trend: '3 in progress'
    },
    { 
      label: 'Completed Tasks', 
      value: '28', 
      color: '#ff9800',
      icon: <AssignmentTurnedIn />,
      trend: '85% success rate'
    },
    { 
      label: 'Leave Requests', 
      value: '3', 
      color: '#f44336',
      icon: <Schedule />,
      trend: '2 pending'
    },
  ];

  const recentEmployees = [
    { name: 'John Doe', role: 'Developer', avatar: 'J' },
    { name: 'Jane Smith', role: 'Designer', avatar: 'J' },
    { name: 'Mike Johnson', role: 'Manager', avatar: 'M' },
  ];

  const dashboardStats = {
    totalEmployees: 45,
    activeProjects: 8,
    attendance: 92,
    upcomingLeaves: 3,
    monthlyExpenses: 52000,
    projectCompletion: 78,
    recentHires: 5,
    pendingTasks: 12
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    present: [40, 42, 38, 41, 39],
    absent: [5, 3, 7, 4, 6]
  };

  const theme = useTheme();

  useEffect(() => {
    const newStats = {
      totalEmployees: employees.length,
      activeProjects: projects.filter(p => p.status === 'In Progress').length,
      attendance: employees.length > 0 
        ? Math.round((employees.filter(e => e.status === 'Present').length / employees.length) * 100)
        : 0,
      monthlyExpenses: employees.reduce((total, emp) => total + (emp.salary || 0), 0)
    };
    setStats(newStats);
  }, [employees, projects]);

  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, { ...newEmployee, id: Date.now() }]);
    addNotification('New employee added');
  };

  const handleAddProject = (newProject) => {
    setProjects(prev => [...prev, { ...newProject, id: Date.now() }]);
    addNotification('New project created');
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    addNotification('Employee removed');
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(proj => proj.id !== projectId));
    addNotification('Project deleted');
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: 'Just now',
      type: 'info'
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    setLogoutDialog(true);
  };

  const confirmLogoutAction = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.head) {
      alert('Please fill in all required fields');
      return;
    }

    const newDeptData = {
      id: departments.length + 1,
      name: newDepartment.name,
      head: newDepartment.head,
      employeeCount: 0,
      description: newDepartment.description
    };

    setDepartments([...departments, newDeptData]);
    setOpenDeptDialog(false);
    setNewDepartment({ name: '', head: '', description: '' });
  };

  const handleAddProjectDialog = () => {
    if (!newProject.name || !newProject.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const projectData = {
      id: projects.length + 1,
      ...newProject,
      progress: 0
    };

    setProjects([...projects, projectData]);
    setOpenProjectDialog(false);
    setNewProject({
      name: '',
      deadline: '',
      team: [],
      description: '',
      priority: 'Medium',
      status: 'Planning'
    });
  };

  const handleAddEmployeeSubmit = async (event) => {
    event.preventDefault();
    try {
      // Debug token storage
      const token = localStorage.getItem('adminToken');
      console.log('Token from storage:', {
        rawToken: token,
        tokenParts: token ? token.split('.') : [],
        storageKeys: Object.keys(localStorage)
      });

      if (!token) {
        throw new Error('No token found - please login again');
      }

      // Validate required fields
      if (!newEmployee.name || !newEmployee.position || !newEmployee.paymentPeriod || 
          !newEmployee.salary || !newEmployee.dob || !newEmployee.aadharNo || 
          !newEmployee.address || !newEmployee.education) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      // Format the data before sending
      const employeeData = {
        ...newEmployee,
        salary: parseFloat(newEmployee.salary),
        dailySalary: parseFloat(newEmployee.dailySalary),
        weeklySalary: parseFloat(newEmployee.weeklySalary),
        monthlySalary: parseFloat(newEmployee.monthlySalary),
      };

      console.log('Sending employee data:', employeeData); // Debug log

      const response = await axios.post('http://localhost:5000/api/employees/', employeeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Employee added successfully',
          severity: 'success'
        });

        setOpenEmployeeDialog(false);
        setNewEmployee({
          name: '',
          position: '',
          paymentPeriod: '',
          salary: '',
          dailySalary: '',
          weeklySalary: '',
          monthlySalary: '',
          dob: '',
          aadharNo: '',
          pvNo: '',
          epfNo: '',
          esicNo: '',
          address: '',
          emergencyContact: '',
          bloodGroup: '',
          medicalInfo: '',
          education: ''
        });

        // Refresh the employees list
        fetchEmployees();
      }
    } catch (error) {
      console.error('Detailed error:', {
        error: error.response?.data || error.message,
        token: localStorage.getItem('adminToken')
      });
      setSnackbar({
        open: true,
        message: 'Authentication error - please login again',
        severity: 'error'
      });
    }
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  const renderDashboard = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        <Paper className="dashboard-stat-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <Group color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              {stats.totalEmployees}
            </Typography>
            <Typography color="textSecondary">Total Employees</Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper className="dashboard-stat-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <AssignmentTurnedIn color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              {stats.attendance}%
            </Typography>
            <Typography color="textSecondary">Attendance Rate</Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper className="dashboard-stat-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <WorkOutline color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              {stats.activeProjects}
            </Typography>
            <Typography color="textSecondary">Active Projects</Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper className="dashboard-stat-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <AttachMoney color="info" sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              ${(stats.monthlyExpenses / 1000).toFixed(1)}k
            </Typography>
            <Typography color="textSecondary">Monthly Expenses</Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Recent Notifications */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Recent Activities</Typography>
          </Box>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} disablePadding>
                <ListItemButton sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <NotificationsActive color={notification.type} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Attendance Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Attendance Overview</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* Add your preferred chart library here */}
          <Box sx={{ height: 300 }}>
            {/* Chart placeholder */}
            <Typography color="textSecondary">Chart goes here</Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Button startIcon={<FilterList />} size="small">
              Filter
            </Button>
          </Box>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="body1">New employee onboarded</Typography>
                <Typography variant="body2" color="textSecondary">2 hours ago</Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Add more timeline items */}
          </Timeline>
        </Paper>
      </Grid>

      {/* Upcoming Events */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Upcoming Events</Typography>
            <Button startIcon={<Schedule />} size="small">
              View Calendar
            </Button>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="Team Meeting"
                  secondary="Today at 2:00 PM"
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="Project Review"
                  secondary="Tomorrow at 10:00 AM"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderEmployees = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Employees</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenEmployeeDialog(true)}
          >
            Add Employee
          </Button>
        </Box>
      </Grid>

      {employees.length === 0 ? (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No employees found. Add your first employee!
            </Typography>
          </Paper>
        </Grid>
      ) : (
        employees.map((employee) => (
          <Grid item xs={12} md={4} key={employee.id}>
            <Paper sx={{ p: 3 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{employee.name ? employee.name[0] : 'E'}</Avatar>
                <Box>
                  <Typography variant="h6">{employee.name || 'Employee Name'}</Typography>
                  <Typography color="textSecondary">{employee.role || 'Position'}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={employee.status === 'Present' ? 'Present' : 'Absent'}
                  color={employee.status === 'Present' ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton size="small" onClick={() => handleDeleteEmployee(employee.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderProjects = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Projects</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProjectDialog(true)}
          >
            New Project
          </Button>
        </Box>
      </Grid>

      {projects.map((project) => (
        <Grid item xs={12} md={6} key={project.id}>
          <Paper sx={{ p: 3, height: '100%' }} className="project-card">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{project.name}</Typography>
              <Box>
                <Chip 
                  label={project.status}
                  color={project.status === 'In Progress' ? 'primary' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={project.priority}
                  color={project.priority === 'High' ? 'error' : 'warning'}
                  size="small"
                />
              </Box>
            </Box>

            <Typography variant="body2" color="textSecondary" paragraph>
              {project.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={project.progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
                {project.progress}%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Deadline
                </Typography>
                <Typography variant="body1">
                  {new Date(project.deadline).toLocaleDateString()}
                </Typography>
              </Box>
              <AvatarGroup max={3}>
                {project.team.map((member, index) => (
                  <Avatar key={index} sx={{ width: 32, height: 32 }}>
                    {member.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" startIcon={<EditIcon />}>
                Edit
              </Button>
              <Button size="small" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
          </Paper>
        </Grid>
      ))}

      {/* Add Project Dialog */}
      <Dialog 
        open={openProjectDialog} 
        onClose={() => setOpenProjectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Project Name"
                fullWidth
                required
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Deadline"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={newProject.deadline}
                onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProjectDialog} variant="contained">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );

  const renderContent = () => {
    switch(selectedMenu) {
      case 'Dashboard':
        return renderDashboard();
      case 'Employees':
        return renderEmployees();
      case 'Projects':
        return renderProjects();
      case 'Departments':
        return (
          <Grid container spacing={3}>
            {/* Department Summary Cards */}
            {departments.map((dept) => (
              <Grid item xs={12} md={4} key={dept.id}>
                <Paper className="dashboard-paper department-card">
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" className="department-title">
                      {dept.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Department Head
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {dept.head}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Employees
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {dept.employeeCount}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {dept.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<PeopleIcon />}
                      >
                        View Team
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
            
            {/* Add Department Button */}
            <Grid item xs={12} md={4}>
              <Paper 
                className="dashboard-paper add-department-card"
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}
                onClick={() => setOpenDeptDialog(true)}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    Add Department
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const renderEmployeeDialog = () => (
    <Dialog 
      open={openEmployeeDialog} 
      onClose={() => setOpenEmployeeDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>Add New Employee</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: '4px',
              display: 'inline-block'
            }}>
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Employee Name"
              fullWidth
              required
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Position"
              fullWidth
              required
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={newEmployee.dob}
              onChange={(e) => setNewEmployee({...newEmployee, dob: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Salary Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Period</InputLabel>
                  <Select
                    value={newEmployee.paymentPeriod || ''}
                    onChange={(e) => setNewEmployee({
                      ...newEmployee,
                      paymentPeriod: e.target.value,
                      salary: '' // Reset salary when period changes
                    })}
                    label="Payment Period"
                  >
                    <MenuItem value="daily">Per Day</MenuItem>
                    <MenuItem value="weekly">Per Week</MenuItem>
                    <MenuItem value="monthly">Per Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`Salary/${newEmployee.paymentPeriod === 'daily' ? 'Day' : 
                         newEmployee.paymentPeriod === 'weekly' ? 'Week' : 'Month'}`}
                  type="number"
                  fullWidth
                  required
                  value={newEmployee.salary}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNewEmployee({
                      ...newEmployee,
                      salary: value,
                      dailySalary: newEmployee.paymentPeriod === 'daily' ? value :
                                  newEmployee.paymentPeriod === 'weekly' ? (value / 7).toFixed(2) :
                                  (value / 30).toFixed(2),
                      weeklySalary: newEmployee.paymentPeriod === 'daily' ? (value * 7).toFixed(2) :
                                   newEmployee.paymentPeriod === 'weekly' ? value :
                                   (value * 7 / 30).toFixed(2),
                      monthlySalary: newEmployee.paymentPeriod === 'daily' ? (value * 30).toFixed(2) :
                                    newEmployee.paymentPeriod === 'weekly' ? (value * 30 / 7).toFixed(2) :
                                    value
                    });
                  }}
                  disabled={!newEmployee.paymentPeriod}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Government IDs */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              mt: 1,
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: '4px',
              display: 'inline-block'
            }}>
              Government IDs
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Aadhar Number"
              fullWidth
              required
              value={newEmployee.aadharNo}
              onChange={(e) => setNewEmployee({...newEmployee, aadharNo: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="PV Number"
              fullWidth
              value={newEmployee.pvNo}
              onChange={(e) => setNewEmployee({...newEmployee, pvNo: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="EPF Number"
              fullWidth
              value={newEmployee.epfNo}
              onChange={(e) => setNewEmployee({...newEmployee, epfNo: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="ESIC Number"
              fullWidth
              value={newEmployee.esicNo}
              onChange={(e) => setNewEmployee({...newEmployee, esicNo: e.target.value})}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              mt: 1,
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: '4px',
              display: 'inline-block'
            }}>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={3}
              required
              value={newEmployee.address}
              onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Emergency Contact Number"
              fullWidth
              value={newEmployee.emergencyContact}
              onChange={(e) => setNewEmployee({...newEmployee, emergencyContact: e.target.value})}
            />
          </Grid>

          {/* Medical Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              mt: 1,
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: '4px',
              display: 'inline-block'
            }}>
              Medical Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Blood Group</InputLabel>
              <Select
                value={newEmployee.bloodGroup || ''}
                onChange={(e) => setNewEmployee({...newEmployee, bloodGroup: e.target.value})}
                label="Blood Group"
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Medical Information"
              fullWidth
              multiline
              rows={3}
              value={newEmployee.medicalInfo}
              onChange={(e) => setNewEmployee({...newEmployee, medicalInfo: e.target.value})}
              placeholder="Enter any medical conditions, allergies, or other health-related information"
            />
          </Grid>

          {/* Education */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              mt: 1,
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: '4px',
              display: 'inline-block'
            }}>
              Education
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Education Details"
              fullWidth
              multiline
              rows={3}
              required
              value={newEmployee.education}
              onChange={(e) => setNewEmployee({...newEmployee, education: e.target.value})}
              placeholder="Enter education qualifications and certifications"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={() => setOpenEmployeeDialog(false)}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddEmployeeSubmit} 
          variant="contained"
          sx={{ ml: 2 }}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderNotificationMenu = () => (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleCloseNotifications}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          width: 320,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          }
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Notifications</Typography>
      </Box>
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsOffIcon 
            sx={{ 
              fontSize: 40, 
              color: 'text.secondary', 
              mb: 1 
            }} 
          />
          <Typography color="text.secondary">
            No notifications for now
          </Typography>
        </Box>
      ) : (
        notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleCloseNotifications}>
            <ListItemIcon>
              <NotificationsActive color={notification.type} />
            </ListItemIcon>
            <ListItemText 
              primary={notification.message}
              secondary={notification.time}
            />
          </MenuItem>
        ))
      )}
    </Menu>
  );

  const handleDrawerEnter = () => {
    setOpen(true);
  };

  const handleDrawerLeave = () => {
    setOpen(false);
  };

  const renderDrawer = () => (
    <Drawer 
      variant="permanent"
      open={open}
      onMouseEnter={handleDrawerEnter}
      onMouseLeave={handleDrawerLeave}
      sx={{
        width: open ? 240 : 73,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          position: 'fixed',
          width: open ? 240 : 73,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: theme.zIndex.drawer + 2,
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <DrawerHeader>
        <Box sx={{ p: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo size={open ? "medium" : "small"} showText={false} />
        </Box>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                transition: theme.transitions.create(['padding', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              }}
              onClick={() => setSelectedMenu(item.text)}
              selected={selectedMenu === item.text}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  transition: theme.transitions.create('margin-right', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  transition: theme.transitions.create('opacity', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const renderAppBar = () => (
    <AppBar 
      position="fixed" 
      sx={{
        width: `calc(100% - ${open ? 240 : 73}px)`,
        ml: `${open ? 240 : 73}px`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #fff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            fontFamily: "'Poppins', sans-serif",
            '& span': {
              color: '#3b82f6',
              WebkitTextFillColor: '#3b82f6',
            }
          }}
        >
          Staff<span>Sphere</span>
        </Typography>
        <IconButton color="inherit" onClick={(e) => setNotificationAnchor(e.currentTarget)}>
          <Badge 
            badgeContent={notifications.length} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': { 
                display: notifications.length > 0 ? 'flex' : 'none' 
              } 
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton 
          color="inherit" 
          onClick={() => setLogoutDialog(true)}
          sx={{
            ml: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch employees',
        severity: 'error'
      });
    }
  };

  const renderLogoutDialog = () => (
    <Dialog
      open={logoutDialog}
      onClose={() => setLogoutDialog(false)}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">
        {"Confirm Logout"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Are you sure you want to logout? You will need to login again to access the dashboard.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setLogoutDialog(false)} 
          color="primary"
        >
          Cancel
        </Button>
        <Button 
          onClick={confirmLogoutAction} 
          color="error" 
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: 'error.dark',
            }
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      {renderAppBar()}

      {/* Notifications Popover */}
      {renderNotificationMenu()}

      {/* Logout Confirmation Dialog */}
      {renderLogoutDialog()}

      {/* Sidebar */}
      {renderDrawer()}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${73}px)`,
          ml: `${73}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
      </Box>

      {/* Add Employee Dialog */}
      {renderEmployeeDialog()}

      {/* Add Department Dialog */}
      <Dialog 
        open={openDeptDialog} 
        onClose={() => setOpenDeptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            required
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Department Head"
            fullWidth
            required
            value={newDepartment.head}
            onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newDepartment.description}
            onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeptDialog(false)}>Cancel</Button>
          <Button onClick={handleAddDepartment} variant="contained">
            Add Department
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 