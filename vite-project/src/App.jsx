import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// ------------------ Add Task Form ------------------
function AddTask({ onAdded }) {
  const [title, setTitle] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return toast.error('Please enter a task title')
    try {
      const res = await axios.post(`${API_BASE}/tasks`, { title })
      setTitle('')
      onAdded(res.data)
      toast.success('Task added ✅')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add task 😢')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded flex-1 bg-gray-700 text-white placeholder-gray-400"
        placeholder="Enter task title..."
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  )
}

// ------------------ Task Component ------------------
function Task({ task, onDelete }) {
  const handleDelete = async () => {
    try {
      await onDelete(task._id)
      toast.success('Task deleted ')
    } catch (err) {
      console.error(err)
      toast.error('Delete failed ')
    }
  }

  const formattedDate = new Date(task.createdAt).toLocaleString()

  return (
    <div className="flex items-center justify-between border border-gray-700 p-4 rounded bg-gray-800 hover:bg-gray-750 shadow-sm transition">
      <div>
        <div className="font-medium text-white">{task.title}</div>
        <div className="text-xs text-gray-400 mt-1">
          Added on: {formattedDate}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="text-red-400 hover:text-red-500 transition"
      >
        Delete
      </button>
    </div>
  )
}

// ------------------ Main App ------------------
export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchTasks() {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/tasks`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load tasks 😢')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  async function handleAdd(newTask) {
    setTasks((t) => [newTask, ...t])
  }

  async function handleDelete(id) {
    await axios.delete(`${API_BASE}/tasks/${id}`)
    setTasks((t) => t.filter((x) => x._id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <Toaster position="top-right" />

      <main className="flex-grow p-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            Task Manager
          </h1>

          <div className="mb-6">
            <AddTask onAdded={handleAdd} />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-gray-400">
                No tasks yet. Add one above 👆
              </div>
            ) : (
              tasks.map((task) => (
                <Task key={task._id} task={task} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </main>

     
      <footer className="bg-gray-800 text-center py-3 border-t border-gray-700 mt-6 text-sm text-gray-400">
        Made with <span className="text-red-500">❤️</span> by{' '}
        <b>Avinash Gupta</b>
      </footer>
    </div>
  )
}
