import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox, Typography,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, List as MUIList, ListItem as MUIListItem,
  ListItemIcon, ListItemText as MUIListItemText, AppBar, Toolbar, CssBaseline, Box
} from '@mui/material';
import { Delete, Edit, Home, List as ListIcon, Info, Place } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Set up initial global state
const initialGlobalState = {
  tasks: [],
};

// Create a Context for the global state
const GlobalState = createContext();

// Create a Global component
class Global extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globals: initialGlobalState || {},
    };
  }

  componentDidMount() {
    window.GlobalState.set = this.setGlobalState;
  }

  setGlobalState = (data = {}) => {
    this.setState((prevState) => ({
      globals: { ...prevState.globals, ...data },
    }));
  };

  render() {
    const { globals } = this.state;
    const { Root } = this.props;
    return (
      <GlobalState.Provider value={{ globals, setGlobalState: this.setGlobalState }}>
        <Root />
      </GlobalState.Provider>
    );
  }
}

// Create a hook to use the GlobalState
const useGlobalState = () => useContext(GlobalState);

// Create a component to render and modify the to-do list
function TodoList() {
  // Define states
  const { globals: { tasks }, setGlobalState } = useGlobalState();
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  // Add task function
  function addTask() {
    if (newTask) {
      setGlobalState({
        tasks: [...tasks, { text: newTask, completed: false }],
      });
      setNewTask('');
    }
  }

  function openEditDialog(index) {
    // Gets triggered and gets the data from the task in the textfield
    setEditIndex(index);
    setEditTask(tasks[index].text);
  }

  function handleEditTask() {
    if (editTask) {
      // For each task, the function checks if the current index i is equal to editIndex, if so it changes the task data
      const updatedTasks = tasks.map((task, i) => (i === editIndex ? { ...task, text: editTask } : task));
      setGlobalState({ tasks: updatedTasks });
      setEditIndex(null);
      setEditTask('');
    }
  }

  function deleteTask(index) {
    // Updates the globalstate to filter the deleted tasks
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setGlobalState({ tasks: updatedTasks });
  }

  function toggleTaskCompletion(index) {
    // Checks the task if found in the loop
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task));
    setGlobalState({ tasks: updatedTasks });
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Todo List</Typography>
      <TextField
        label="New Task"
        variant="outlined"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addTask} fullWidth>
        Add Task
      </Button>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => openEditDialog(index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => deleteTask(index)}>
                <Delete />
              </IconButton>
            </>
          }>
            <Checkbox
              edge="start"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <ListItemText
              primary={task.text}
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modify the task and click 'Save' to update it.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Task"
            type="text"
            fullWidth
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIndex(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Placeholders for other pages
function PlaceholderPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Lorem ipsum</Typography>
      <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
    </Container>
  );
}

// Sidebar navigation
function Sidebar() {
  return (
    <Drawer variant="permanent">
      <MUIList>
        <MUIListItem button component={Link} to="/">
          <ListItemIcon><Home /></ListItemIcon>
          <MUIListItemText primary="Home" />
        </MUIListItem>
        <MUIListItem button component={Link} to="/placeholder">
          <ListItemIcon><Info /></ListItemIcon>
          <MUIListItemText primary="Placeholder" />
        </MUIListItem>
        <MUIListItem button component={Link} to="/todo-list">
          <ListItemIcon><ListIcon /></ListItemIcon>
          <MUIListItemText primary="Todo List" />
        </MUIListItem>
      </MUIList>
    </Drawer>
  );
}

// Main page
function MainPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Toolbar />
        <Routes>
          <Route exact path="/" element={<PlaceholderPage />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/placeholder" element={<PlaceholderPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

// Create the main App component
export default function App() {
  return (
    <Router>
      <Global Root={MainPage} />
    </Router>
  );
}

// Expose the GlobalState object to the window
window.GlobalState = GlobalState;