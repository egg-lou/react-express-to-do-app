import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { addTask, getRandomGreeting, getTasks } from '../services/api';


export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [randomGreeting, setRandomGreeting] = useState('');


  useEffect(() => {
    async function fetchTasks(){
        try {
            const tasks = await getTasks();
            setTodos(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    async function fetchRandomGreeting() {
        try {
            const greeting = await getRandomGreeting();
            setRandomGreeting(greeting);
        } catch (error) {
            console.error('Error fetching random greeting:', error);
        }
    }
    fetchRandomGreeting();
  }, []);


  const addTodo = async (task) => {
    try {
        const response = await addTask(task);
        const newTask = {
            id: response.taskId,
            task: task,
        };

        const newTodos = [newTask, ...todos];
        setTodos(newTodos);
        console.log(todos)
    } catch (error){
        console.error('Error adding task:', error);
    }
  }

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
  };

  const removeTodo = id => {
    const removedArr = [...todos].filter(todo => todo.id !== id);

    setTodos(removedArr);
  };

  const completeTodo = id => {
    let updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>{randomGreeting}</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}