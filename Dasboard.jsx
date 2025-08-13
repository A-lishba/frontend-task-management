import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSpaceDashboard } from "react-icons/md";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    completed: false,
  });
  const [editId, setEditId] = useState(null);
  const [onlyCompleted, setOnlyCompleted] = useState(false);

 
  const [nextTask, setNextTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const token = localStorage.getItem("token");
  const getConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchTasks = async () => {
    try {
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.get("http://localhost:3003/tasks", getConfig());
      const fetchedTasks = res.data.tasks;

      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      } else {
        console.error("Tasks API did not return an array:", fetchedTasks);
      }
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 
  useEffect(() => {
    if (tasks.length > 0) {
      const upcomingTasks = tasks.filter(
        (task) => !task.completed && new Date(task.dueDate) > new Date()
      );

      if (upcomingTasks.length > 0 ) {
        const closest = upcomingTasks.reduce((prev, curr) =>
          new Date(prev.dueDate) < new Date(curr.dueDate) ? prev : curr
        );
        setNextTask(closest);
      } else {
        setNextTask(null);
      }
    }
  }, [tasks]);

  
  useEffect(() => {
    if (!nextTask) {
      setTimeLeft("");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date(nextTask.dueDate);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Deadline reached!");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);


      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextTask]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3003/tasks/update/${editId}`,
          formData,
          getConfig()
        );
      } else {
        await axios.post(
          "http://localhost:3003/tasks/add",
          formData,
          getConfig()
        );
      }

      setFormData({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        completed: false,
      });
      setEditId(null);
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task) => {
    setFormData(task);
    setEditId(task._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3003/tasks/delete/${id}`,
        getConfig()
      );
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks = onlyCompleted
    ? tasks.filter((t) => t.completed)
    : tasks;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="p-6 bg-slate-900">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-neutral-300">
            <MdSpaceDashboard /> Dashboard
          </h1>
          <button
            className="bg-blue-700 font-bold text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Create Task"}
          </button>
        </div>

       
        {nextTask && (
          <div className="bg-red-200 p-4 rounded mb-4 border border-red-500">
            <h2 className="text-lg font-bold text-red-700">Upcoming Deadline</h2>
            <p className="text-red-600 font-semibold">
              {nextTask.title} — Time left: {timeLeft}
            </p>
          </div>
        )}

        <div className="mb-4 flex gap-4 items-center ">
          <label>
            <input
              type="checkbox"
              checked={onlyCompleted}
              onChange={() => setOnlyCompleted(!onlyCompleted)}
              className="text-neutral-500 bg-green-600 p-2 rounded"
            />
            Show Completed Only
          </label>
          <div className="text-neutral-200 bg-green-600 p-2 rounded">
            Total Tasks: {tasks.length}
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="p-2 border rounded text-gray-600"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="p-2 border rounded text-gray-600"
              />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="p-2 border rounded text-gray-600"
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.completed}
                  onChange={(e) =>
                    setFormData({ ...formData, completed: e.target.checked })
                  }
                />
                Completed
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="p-2 border rounded text-gray-600"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editId ? "Update Task" : "Create Task"}
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-1000 px-1">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border rounded px-2 shadow bg-gray-600 max-w-xs w-full"
            >
              <h2 className="text-xl font-bold text-center py-2">
                {task.title}
              </h2>
              <p className="text-sm text-white">
                Due: {task.dueDate?.substring(0, 10)}
              </p>
              <p
                className={`text-sm font-semibold ${
                  task.completed ? "text-green-400" : "text-red-400"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </p>
              <div className="my-6 flex gap-3">
                <button
                  className="text-blue-500 hover:underline flex items-center gap-1"
                  onClick={() => handleEdit(task)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="text-red-500 hover:underline flex items-center gap-1"
                  onClick={() => handleDelete(task._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

