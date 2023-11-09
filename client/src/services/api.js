import axios from 'axios';

const API_URL = 'http://localhost:4000';

const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-tasks`);
    return response.data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const addTask = async (taskDescription) => {
  try {
    const response = await axios.post(`${API_URL}/add-task`, {
      task: taskDescription,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(`${API_URL}/update-task-status/${taskId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

const updateTaskDescription = async (taskId, taskDescription) => {
  try {
    const response = await axios.patch(`${API_URL}/update-task/${taskId}`, {
      task: taskDescription,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task description:', error);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

const deleteAllTasks = async () => {
  try {
    const response = await axios.delete(`${API_URL}/delete-all-tasks`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all tasks:', error);
    throw error;
  }
};

const getRandomGreeting = async () => {
    try {
      const response = await axios.get(`${API_URL}/greetings`);
      return response.data.greeting;
    } catch (error) {
      console.error('Error fetching random greeting:', error);
      throw error;
    }
  };

export { getTasks, addTask, updateTaskStatus, updateTaskDescription, deleteTask, deleteAllTasks, getRandomGreeting };
