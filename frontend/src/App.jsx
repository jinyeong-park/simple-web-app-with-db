import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { TodoList } from "./TodoList"

export default function App() {

  const [todos, setTodos] = useState([]);

  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS")
  //   if (localValue == null) return []

  //   return JSON.parse(localValue)
  // })

  // useEffect(() => {
  //   localStorage.setItem("ITEMS", JSON.stringify(todos))
  // }, [todos])

    // Fetch todos from the backend API on component mount
  useEffect(() => {
    fetch('http://localhost:8081/todos')  // Make sure the server is running
      .then((response) => response.json())
      .then((data) => {
      console.log('data:', data)
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
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false },
      ]
    })
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed }
        }

        return todo
      })
    })
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  return (
    <>
      <NewTodoForm onSubmit={addTodo} />
      <h1 className="header">Todo List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </>
  )
}
