import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { TodoList } from "./TodoList"

export default function App() {

  const [todos, setTodos] = useState([]);
  // ALB DNS name
  const ALB_dns_name = 'http://lb-for-ec2-717236205.us-east-1.elb.amazonaws.com'
  // Fetch todos from the backend API on component mount
  useEffect(() => {
    fetch(`${ALB_dns_name}/todos`)  // Make sure the server is running
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
    fetch(`${ALB_dns_name}/todos`, {
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
   
  function toggleTodo(id, completed) {
    const completedStatus = completed ? 1 : 0;
    fetch(`${ALB_dns_name}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completedStatus })
    })
    .then(response => response.json())
    .then((data) => {
        if (data.message === "Todo updated successfully!") {
            setTodos(currentTodos => currentTodos.map(todo =>
                todo.id === id ? { ...todo, completed: completedStatus } : todo
            ));
        } else {
            console.error('Failed to update todo:', data);
        }
    })
    .catch((error) => {
        console.error('Error updating todo:', error);
    });
}


  function deleteTodo(id) {
    fetch(`${ALB_dns_name}/todos/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then((data) => {
        if (data.message === "Todo deleted successfully!") {
            setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        } else {
            console.error('Failed to delete todo:', data);
        }
    })
    .catch((error) => {
        console.error('Error deleting todo:', error);
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
