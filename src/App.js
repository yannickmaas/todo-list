import React, { useState } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
// Set up initial global state
const initialGlobalState = {
  tasks: [],
};

// Create a Context for the global state
const GlobalState = React.createContext();

// Create a Global component
class Global extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globals: initialGlobalState || {},
    };
  }

  componentDidMount() {
    GlobalState.set = this.setGlobalState;
  }

  setGlobalState = (data = {}) => {
    const { globals } = this.state;
    Object.keys(data).forEach((key) => {
      globals[key] = data[key];
    });
    this.setState({ globals });
  };

  render() {
    const { globals } = this.state;
    const { Root } = this.props;
    return (
      <GlobalState.Provider value={globals}>
        <Root />
      </GlobalState.Provider>
    );
  }
}

// Create a hook to use the GlobalState
const useGlobalState = () => React.useContext(GlobalState);

// Main ToDo Function
function TodoList() {
  //Define states
  const { tasks } = useGlobalState();
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  //Add task function
  function addTask() {
    if (newTask) {
      //Sets the new task state in the const
      GlobalState.set({
        tasks: [...tasks, newTask],
      });
      setNewTask('');
    }
  }

  function openEditDialog(index) {
    //Gets triggered and gets the data from the task in the textfield
    setEditIndex(index);
    setEditTask(tasks[index]);
  }

  function handleEditTask() {
    if (editTask) {
      //For each task, the function checks if the current index i is equal to editIndex, if so it changes the task data
      const updatedTasks = tasks.map((task, i) => (i === editIndex ? editTask : task));
      GlobalState.set({ tasks: updatedTasks });
      setEditIndex(null);
      setEditTask('');
    }
  }

  function deleteTask(index) {
    //Updates the globalstate to filter the deleted tasks
    const updatedTasks = tasks.filter((_, i) => i !== index);
    GlobalState.set({ tasks: updatedTasks });
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Todo List</Typography>
      <TextField
        label="New Task"
        variant="outlined"
        value={newTask}
        //Stores the target value in the state of the new task
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
            <ListItemText primary={task} />
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

// Create the main App component
export default function App() {
  return <Global Root={() => <TodoList />} />;
}

// Expose the GlobalState object to the window
window.GlobalState = GlobalState;
