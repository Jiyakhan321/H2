import { useState, useEffect } from 'react';
import apiClient from '../services/api';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/tasks', taskData);
      const newTask = response.data;

      // Optimistically update the UI
      setTasks(prev => [...prev, newTask]);

      return newTask;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      const updatedTask = response.data;

      // Update the task in the UI
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));

      return updatedTask;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/tasks/${taskId}`);

      // Remove the task from the UI
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId) => {
    try {
      // Find the current task
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Optimistically update the UI
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));

      // Update the task on the backend - exclude the id from the data being sent
      const { id, ...taskDataWithoutId } = currentTask;
      await updateTask(taskId, { ...taskDataWithoutId, completed: !currentTask.completed });
    } catch (err) {
      setError(err.message || 'Failed to toggle task completion');
      console.error('Error toggling task completion:', err);
      // Revert optimistic update on error
      fetchTasks(); // Refresh from backend
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
};

export default useTasks;