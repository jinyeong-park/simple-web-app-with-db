import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { TodoList } from "./TodoList"

export default function App() {

  const [todos, setTodos] = useState([]);

  // Fetch todos from the backend API on component mount
  useEffect(() => {
    fetch('http://localhost:8081/todos')  // Make sure the server is running
      .then((response) => response.json())
      .then((data) => {
        // console.log('data:', data);
        // Ensure the data is an array before setting it
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error('Data received is not an array:', data);
          setTodos([]); // Set empty array if the data is not an array
        }
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  function addTodo(title) {
    // Send a POST request to the server to add a new todo
    fetch('http://localhost:8081/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // After adding, fetch the updated list of todos
      setTodos(prevTodos => [...prevTodos, { id: crypto.randomUUID(), title, completed: false }]);
    })
    .catch((error) => console.error('Error adding todo:', error));
  }

  function toggleTodo(title, completed) {
    // Ensure completed is sent as a number (1 or 0)
    const completedStatus = completed ? 1 : 0;

    // Send a PUT request to the server to update the todo's completed status by title
    fetch(`http://localhost:8081/todos/${encodeURIComponent(title)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completedStatus })
    })
    .then(response => response.json())
    .then((data) => {
        if (data.message === "Todo updated successfully!") {
            // Update the todo in the state with the new completed status
            setTodos(currentTodos => currentTodos.map(todo => {
                if (todo.title === title) {
                    return { ...todo, completed: completedStatus };
                }
                return todo;
            }));
        } else {
            console.error('Failed to update todo:', data); // Handle error if update failed
        }
    })
    .catch((error) => {
        console.error('Error updating todo:', error); // Error logging
    });
  }



  function deleteTodo(title) {
    
    // Send a DELETE request to the server to delete a todo by title
    fetch(`http://localhost:8081/todos/${encodeURIComponent(title)}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then((data) => {
        // Check if the deletion was successful
        if (data.message === "Todo deleted successfully!") {
            // console.log('Todo deleted:', title);  // Debugging line to confirm deletion
            setTodos(currentTodos => currentTodos.filter(todo => todo.title !== title));
        } else {
            console.error('Failed to delete todo:', data);  // Debugging error message
        }
    })
    .catch((error) => {
        console.error('Error deleting todo:', error);  // Error logging
    });
}


  return (
    <>
      <NewTodoForm onSubmit={addTodo} />
      <h1 className="header">Todo List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </>
  )
}
