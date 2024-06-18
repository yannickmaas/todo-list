import React, { useState } from 'react';
import {
  Container, TextField, Button, List, ListItem, ListItemText, Typography,
} from '@mui/material';
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
          //Loops trough the tasks
          <ListItem key={index}>
            <ListItemText primary={task} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

// Create the main App component
export default function App() {
  return <Global Root={() => <TodoList />} />;
}

// Expose the GlobalState object to the window
window.GlobalState = GlobalState;
