import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Fetch ToDo items from the server when the component mounts
    fetch('http://localhost:3001/todolist')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching To-Do items:', error));
  }, []);

  const handleAddTodo = () => {
    // Send a POST request to add a new ToDo item
    fetch('http://localhost:3001/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newTodo }),
    })
      .then(() => {
        setNewTodo('');
        // Fetch updated ToDo items
        fetch('http://localhost:3001/todolist')
          .then((response) => response.json())
          .then((data) => setTodos(data))
          .catch((error) =>
            console.error('Error fetching updated To-Do items:', error)
          );
      })
      .catch((error) =>
        console.error('Error adding To-Do item:', error)
      );
  };

  const handleDeleteTodo = (id) => {
    // Send a DELETE request to delete a ToDo item by ID
    fetch(`http://localhost:3001/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Fetch updated ToDo items
        fetch('http://localhost:3001/todolist')
          .then((response) => response.json())
          .then((data) => setTodos(data))
          .catch((error) =>
            console.error('Error fetching updated To-Do items:', error)
          );
      })
      .catch((error) =>
        console.error('Error deleting To-Do item:', error)
      );
  };

  return (
    <div className="App">
      <h1>ToDo List App</h1>
      <form onSubmit={handleAddTodo} className='TodoForm' >
        <button className="todo-btn">Enter the task</button>
        <input
          type="text"
          className="todo-input"
          placeholder="Enter a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="todo-btn" >Add Task</button>
      </form>
      {todos.map((todo) => (
        <p key={todo.id}>
          {todo.text}{' '}
          <div className="float-end">
            <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteTodo(todo.id)} />
          </div>
        </p>
      ))}
      </div>
    );
}

export default App;
