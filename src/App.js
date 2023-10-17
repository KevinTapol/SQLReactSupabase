import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App(){

  const [todos, setTodos] = useState([]) // track list of todos
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState(null) // id by item default no editing
  const [editingText, setEditingText] = useState('') // track value change

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    // select * from todos order by id asc
    const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('id', {ascending:true})
    if (error) {
      console.error('Error fetching todos:', error)
    } else {
      setTodos(data)
    }
  }

  const addTodo = async () => {
    // insert into todos (task, is_completed) values (newTask, false)
    const { data, error } = await supabase
    .from('todos')
    .insert([{task: newTask, is_completed: false}])
    .select()
    if (error) {
      console.error('Error inserting todos:', error)
    } else if (Array.isArray(data)) { // check if there is data in the array
      setTodos(prevTodos => [...prevTodos, ...data]); // spread and iterate through add new todo data
      // function(prevTodos) { return [...prevTodos, ...data]}) reg fn instead of arrow fn
      setNewTask('')
    }
  }

  const updateTodo = async (id) => {
    // update todos set task = editingText where id = id
    const { error }  = await supabase
    .from('todos')
    .update({task: editingText})
    .eq('id', id); // where clause id = id
    if (error) {
      console.error('Error updating todos:', error)
    } else {
      fetchTodos()
      setEditingId(null) // resetting state variables to default values
      setEditingText('')
    }
  }

  const toggleCompletion = async (id, is_completed) => {
    // update todos set is_completed = !is_completed where id = id
    const { error }  = await supabase
    .from('todos')
    .update({is_completed: !is_completed})
    .eq('id', id) // where clause id = id
    if (error) {
      console.error('Error toggle todos:', error)
    } else {
      fetchTodos()
    }
  }

  const deleteTodo = async (id) => {
    // delete from todos where id = id
    const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    if (error) {
      console.error('Error deleting todo:', error)
    } else {
      fetchTodos();
    }
  }

  return (
    <div className="App flex flex-col items-center">
      <h1 className='text-2xl font-bold' >Supabase Todo App</h1>
      <div className='flex items-center'>
        <input className='border-4 border-black rounded-lg'
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTodo} className='ms-2 p-1 border-4 border-blue-800 rounded-xl'>
          Add
        </button>
      </div>
      <ul className='list-none p-0'>
        {todos.map((todo) => (
          <li key={todo.id} className='mb-4 text-center'>
          {editingId === todo.id ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={() => updateTodo(todo.id)}
            />
          ) : (
            <div className='flex items-center'>
              <div>
                <span
                 className={`${ todo.is_completed ? 'line-through' : 'none'} `}
                  onDoubleClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.task);
                  }}
                >
                  {todo.task}
                </span>
              </div>
              <div className='ml-4'>
                <button onClick={() => toggleCompletion(todo.id, todo.is_completed)}>Toggle</button>
                <button onClick={() => deleteTodo(todo.id)} className='ml-2'>Delete</button>
              </div>
            </div>
          )}
        </li>
      ))}
      </ul>
    </div>
  )
}

export default App